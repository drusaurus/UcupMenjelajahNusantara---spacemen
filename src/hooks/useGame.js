"use client"

import {useCallback, useContext} from "react"
import { GameContext } from "../contexts/GameContext.js"
import { GameScreen } from "../constants/gameScreens.js"
import {INNER_LOCATIONS_DETAILS, LOCATIONS_ON_WORLD_MAP} from "../constants/locations.js";
import { useNotification } from "../contexts/NotificationContext.jsx";

export function useGame() {
    const context = useContext(GameContext)
    const WORLD_MAP_ID = "world";
    const { pushNotification } = useNotification();

    if (!context) {
        throw new Error("useGame must be used within a GameProvider")
    }

    const { state, dispatch } = context

    // Navigation handlers
    const navigateToStart = () => {
        dispatch({ type: "SET_SCREEN", payload: GameScreen.START })
    }

    const navigateToAvatarSelection = () => {
        dispatch({ type: "SET_SCREEN", payload: GameScreen.AVATAR_SELECTION })
    }

    const navigateToGameArena = () => {
        dispatch({ type: "SET_SCREEN", payload: GameScreen.GAME_ARENA })
    }

    const navigateToGameOver = useCallback((reason) => {
        dispatch({ type: "SET_GAME_OVER_REASON", payload: reason })
        dispatch({ type: "SET_SCREEN", payload: GameScreen.GAME_OVER })
    }, [dispatch])

    const navigateToCreators = () => {
        dispatch({ type: "SET_SCREEN", payload: GameScreen.CREATORS })
    }

    // Game state handlers
    const startGame = (name, avatar) => {
        dispatch({ type: "SET_PLAYER_NAME", payload: name })
        dispatch({ type: "SET_SELECTED_AVATAR", payload: avatar })
        navigateToGameArena()
    }

    const restartGame = () => {
        dispatch({ type: "RESET_GAME" })
    }

    // Update player status
    const updatePlayerStatus = useCallback((updates) => {
        dispatch({ type: "UPDATE_PLAYER_STATUS", payload: updates })
    }, [dispatch])

    // Update game time
    const updateGameTime = (updates) => {
        dispatch({ type: "UPDATE_GAME_TIME", payload: updates })
    }

    // Update player position
    const updatePlayerPosition = (updates) => {
        dispatch({ type: "UPDATE_PLAYER_POSITION", payload: updates })
    }

    // Set current location
    const setCurrentLocation = (location) => {
        dispatch({ type: "SET_CURRENT_LOCATION", payload: location })
    }

    const setCurrentArea = (locationId) => {
        // alert(`Entering ${location}...`); // Alert before transition starts
        const FADE_PLUS_CONTENT_CHANGE_DELAY = 2000; // User's specified duration

        dispatch({type: "START_LOCATION_TRANSITION"})
        setTimeout(()=> {
            const sceneDetails = INNER_LOCATIONS_DETAILS[locationId];

            if (sceneDetails && sceneDetails.defaultPlayerSpawn && context.state.currentArea === "world") {
                dispatch({ type: "UPDATE_PLAYER_POSITION", payload: sceneDetails.defaultPlayerSpawn });
            }
            dispatch({type: "SET_CURRENT_AREA", payload: locationId})
            dispatch({type: "FINISH_LOCATION_TRANSITION"})
            // alert(`Entered ${location}`); // Alert after transition finishes
        }, FADE_PLUS_CONTENT_CHANGE_DELAY)
    }

    const navigateTo = useCallback((targetLocationId) => {
        const FADE_IN_TIME = 2000;
        let spawnPoint = null;
        const previousLocationId = state.currentArea;

        dispatch({type: "START_LOCATION_TRANSITION"});

        setTimeout(() => {
            if(targetLocationId === WORLD_MAP_ID) {
                const previousLocationData = INNER_LOCATIONS_DETAILS[previousLocationId];
                if (previousLocationData && previousLocationData.exit && typeof previousLocationData.exit.targetPlayerSpawn === 'object') {
                    spawnPoint = previousLocationData.exit.targetPlayerSpawn;
                } else {
                    console.warn(`No specific targetPlayerSpawn found for exit from "${previousLocationId}" to world map. Using world map default.`);
                    spawnPoint = { x: 50, y: 50 };
                }
            } else {
                const targetLocationData = INNER_LOCATIONS_DETAILS[targetLocationId];
                spawnPoint = targetLocationData.defaultPlayerSpawn;
            }

            // ✅ Handle location visit and score
            const isWorldLocation = LOCATIONS_ON_WORLD_MAP.some((loc) => loc.id === targetLocationId);
            const alreadyVisited = state.visitedLocations.includes(targetLocationId);

            if (isWorldLocation && !alreadyVisited) {
                const locationData = LOCATIONS_ON_WORLD_MAP.find((loc) => loc.id === targetLocationId);
                if (locationData) {
                    // Add to visited locations
                    dispatch({ type: "ADD_VISITED_LOCATION", payload: targetLocationId });

                    // Increment score while keeping other playerStatus values
                    dispatch({
                        type: "UPDATE_PLAYER_STATUS",
                        payload: {
                            ...state.playerStatus,
                            score: state.playerStatus.score + locationData.scoreValue,
                        },
                    });

                    pushNotification("score", "You have discovered a new location!\n + " + locationData.scoreValue + " points", locationData.scoreValue)
                }
            }

            if (spawnPoint) {
                dispatch({ type: "UPDATE_PLAYER_POSITION", payload: spawnPoint });
            }

            dispatch({type: "SET_CURRENT_AREA", payload: targetLocationId})
            dispatch({ type: "SET_CURRENT_INNER_LOCATION", payload: null });
        }, FADE_IN_TIME);
    }, [state.currentArea, state.visitedLocations, state.playerStatus, dispatch]);

    return {
        ...state,
        dispatch,
        WORLD_MAP_ID,
        navigateToStart,
        navigateToAvatarSelection,
        navigateToGameArena,
        navigateToGameOver,
        navigateToCreators,
        startGame,
        restartGame,
        updatePlayerStatus,
        updateGameTime,
        updatePlayerPosition,
        setCurrentLocation,
        setCurrentArea,
        navigateTo,
    }
}

