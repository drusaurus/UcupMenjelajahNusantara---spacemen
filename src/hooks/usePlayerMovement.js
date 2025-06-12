"use client"

import { useState, useEffect } from "react"
import { useGame } from "./useGame"
import {INNER_LOCATIONS_DETAILS, LOCATIONS_ON_WORLD_MAP} from "../constants/locations.js"

export function usePlayerMovement() {
    const { playerPosition,
        playerSpeed,
        currentLocation,
        currentArea,
        currentInnerLocation,
        isTransitioningLocation,
        updatePlayerPosition,
        setCurrentLocation,
        WORLD_MAP_ID,
        dispatch
    } = useGame()

    const [movingDirection, setMovingDirection] = useState(null)
    const [facingDirection, setFacingDirection] = useState("down")

    // Handle keyboard movement
    useEffect(() => {
        if (isTransitioningLocation) return; // Ignore movement during scene transitions

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
    }, [isTransitioningLocation, movingDirection])


    const determineWorldLocation = (x, y) => {
        for (const loc of LOCATIONS_ON_WORLD_MAP) {
            const { xMin, xMax, yMin, yMax } = loc.area;
            if (x >= xMin && x <= xMax && y >= yMin && y <= yMax) {
                return loc.id;
            }
        }
        return null; // not in any area
    };

    // Handle movement in the world and location detection
    useEffect(() => {
        if (!movingDirection || isTransitioningLocation) return;

        const moveInterval = setInterval(() => {
            const { x, y } = playerPosition
            let newX = x
            let newY = y
            const locationData = INNER_LOCATIONS_DETAILS[currentLocation] || {};
            let speedModifier = 1;
            if (currentArea !== WORLD_MAP_ID) {
                speedModifier = locationData.speedModifier;
            }
            const speed = (playerSpeed ?? 1) * speedModifier;
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

            if(newX !== x || newY !== y) {
                // Update position
                updatePlayerPosition({ x: newX, y: newY })

                if(currentArea === WORLD_MAP_ID) {
                    const newWorldLocationId = determineWorldLocation(newX, newY);
                    if (newWorldLocationId !== currentLocation) {
                        // console.log(`WorldMap: Entered ${newWorldLocationId ?? "Unknown area"}`);
                        setCurrentLocation(newWorldLocationId); // Updates which world marker player is at
                    }
                }
            }
            // Determine location based on position
            // const newLocation = determineLocation(newX, newY)
            // if (newLocation !== currentLocation) {
            //     console.log(`Entered ${newLocation ?? "Unknown area"}`);
            //     setCurrentLocation(newLocation);
            // }
        }, 80)

        return () => clearInterval(moveInterval)
    }, [movingDirection, playerPosition, currentArea, currentLocation, updatePlayerPosition, setCurrentLocation, isTransitioningLocation, WORLD_MAP_ID]);

    useEffect(() => {
        // If on world map, not in a known interior, or transitioning, clear/ensure no active inner location
        if (currentArea === WORLD_MAP_ID || !INNER_LOCATIONS_DETAILS[currentArea] || isTransitioningLocation) {
            if (currentInnerLocation !== null) { // Only dispatch if it needs to be cleared
                dispatch({ type: "SET_CURRENT_INNER_LOCATION", payload: null });
            }
            return;
        }

        // We are in an interior scene
        const sceneData = INNER_LOCATIONS_DETAILS[currentArea];
        let playerInZoneId = null;

        if (sceneData.activityZones) {
            for (const zone of sceneData.activityZones) {
                if (
                    playerPosition.x >= zone.areaInScene.xMin && playerPosition.x <= zone.areaInScene.xMax &&
                    playerPosition.y >= zone.areaInScene.yMin && playerPosition.y <= zone.areaInScene.yMax
                ) {
                    playerInZoneId = zone.id;
                    break;
                }
            }
        }

        // Only dispatch if the active inner location (zone) has actually changed
        if (playerInZoneId !== currentInnerLocation) {
            dispatch({ type: "SET_CURRENT_INNER_LOCATION", payload: playerInZoneId });
        }
    }, [playerPosition, currentArea, currentInnerLocation, dispatch, isTransitioningLocation, WORLD_MAP_ID]);

    // Update the movePlayer function to also set facing direction
    const movePlayer = (direction) => {
        // console.log("[movePlayer] called with:", direction);
        setMovingDirection(direction);
        setFacingDirection(direction);
    };

    return {
        position: playerPosition,
        currentLocation,
        currentArea,
        locationData: LOCATIONS_ON_WORLD_MAP.find((loc) => loc.id === currentLocation),
        movePlayer,
        facingDirection,
        movingDirection
    }
}
