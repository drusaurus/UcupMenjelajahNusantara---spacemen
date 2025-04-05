"use client"

import { useState, useEffect } from "react"
import { useGame } from "./useGame"
import { LOCATIONS } from "../constants/gameData"

export function usePlayerMovement() {
    const { playerPosition, currentLocation, updatePlayerPosition, setCurrentLocation } = useGame()

    const [movingDirection, setMovingDirection] = useState(null)

    // Handle keyboard movement
    useEffect(() => {
        const handleKeyDown = (e) => {
            switch (e.key) {
                case "ArrowUp":
                    setMovingDirection("up")
                    break
                case "ArrowDown":
                    setMovingDirection("down")
                    break
                case "ArrowLeft":
                    setMovingDirection("left")
                    break
                case "ArrowRight":
                    setMovingDirection("right")
                    break
            }
        }

        const handleKeyUp = () => {
            setMovingDirection(null)
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

            switch (movingDirection) {
                case "up":
                    newY = Math.max(0, y - 5)
                    break
                case "down":
                    newY = Math.min(100, y + 5)
                    break
                case "left":
                    newX = Math.max(0, x - 5)
                    break
                case "right":
                    newX = Math.min(100, x + 5)
                    break
            }

            // Update position
            updatePlayerPosition({ x: newX, y: newY })

            // Determine location based on position
            const newLocation = determineLocation(newX, newY)
            if (newLocation !== currentLocation) {
                setCurrentLocation(newLocation)
            }
        }, 100)

        return () => clearInterval(moveInterval)
    }, [movingDirection, playerPosition, currentLocation, updatePlayerPosition, setCurrentLocation])

    // Determine location based on player position
    const determineLocation = (x, y) => {
        // This is a simplified example - you would define actual boundaries for each location
        if (x < 20 && y < 20) return "home"
        if (x < 20 && y > 80) return "beach"
        if (x > 80 && y < 20) return "mountain"
        if (x > 80 && y > 80) return "temple"
        if (x > 40 && x < 60 && y > 40 && y < 60) return "lake"
        return currentLocation
    }

    // Move player with on-screen buttons
    const movePlayer = (direction) => {
        setMovingDirection(direction)
        setTimeout(() => setMovingDirection(null), 100)
    }

    return {
        position: playerPosition,
        currentLocation,
        locationData: LOCATIONS.find((loc) => loc.id === currentLocation),
        movePlayer,
    }
}

