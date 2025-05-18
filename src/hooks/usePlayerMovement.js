"use client"

import { useState, useEffect } from "react"
import { useGame } from "./useGame"
import { LOCATIONS } from "../constants/locations.js"

export function usePlayerMovement() {
    const { playerPosition, currentLocation, updatePlayerPosition, setCurrentLocation } = useGame()

    const [movingDirection, setMovingDirection] = useState(null)
    const [facingDirection, setFacingDirection] = useState("down")

    // Handle keyboard movement
    useEffect(() => {
        const handleKeyDown = (e) => {
            switch (e.key.toLowerCase()) {
                case "arrowup":
                case "w":
                    setMovingDirection("up")
                    setFacingDirection("up") // Update facing direction
                    break
                case "arrowdown":
                case "s":
                    setMovingDirection("down")
                    setFacingDirection("down") // Update facing direction
                    break
                case "arrowleft":
                case "a":
                    setMovingDirection("left")
                    setFacingDirection("left") // Update facing direction
                    break
                case "arrowright":
                case "d":
                    setMovingDirection("right")
                    setFacingDirection("right") // Update facing direction
                    break
            }
        }

        const handleKeyUp = () => {
            setMovingDirection(null)
            // We keep the facing direction when keys are released
        }

        window.addEventListener("keydown", handleKeyDown)
        window.addEventListener("keyup", handleKeyUp)

        return () => {
            window.removeEventListener("keydown", handleKeyDown)
            window.removeEventListener("keyup", handleKeyUp)
        }
    }, [])

    // Handle continuous movement
    useEffect(() => {
        if (!movingDirection) return

        const moveInterval = setInterval(() => {
            const { x, y } = playerPosition
            let newX = x
            let newY = y
            let speed = 1

            switch (movingDirection) {
                case "up":
                    newY = Math.max(0, y - speed)
                    break
                case "down":
                    newY = Math.min(100, y + speed)
                    break
                case "left":
                    newX = Math.max(0, x - speed)
                    break
                case "right":
                    newX = Math.min(100, x + speed)
                    break
            }

            // Update position
            updatePlayerPosition({ x: newX, y: newY })

            // Determine location based on position
            const newLocation = determineLocation(newX, newY)
            if (newLocation !== currentLocation) {
                console.log(`Entered ${newLocation ?? "Unknown area"}`);
                setCurrentLocation(newLocation);
            }
        }, 100)

        return () => clearInterval(moveInterval)
    }, [movingDirection, playerPosition, currentLocation, updatePlayerPosition, setCurrentLocation])

    const determineLocation = (x, y) => {
        for (const loc of LOCATIONS) {
            const { xMin, xMax, yMin, yMax } = loc.area;
            if (x >= xMin && x <= xMax && y >= yMin && y <= yMax) {
                return loc.id;
            }
        }
        return null; // not in any area
    };

    // Update the movePlayer function to also set facing direction
    const movePlayer = (direction) => {
        console.log("[movePlayer] called with:", direction);
        setMovingDirection(direction);
        setFacingDirection(direction);
    };

    return {
        position: playerPosition,
        currentLocation,
        locationData: LOCATIONS.find((loc) => loc.id === currentLocation),
        movePlayer,
        facingDirection,
        movingDirection
    }
}
