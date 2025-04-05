"use client"

import { useContext } from "react"
import { GameContext } from "../context/GameContext"
import { GameScreen } from "../constants/gameData.js"

export function useGame() {
    const context = useContext(GameContext)

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

    const navigateToGameOver = (reason) => {
        dispatch({ type: "SET_GAME_OVER_REASON", payload: reason })
        dispatch({ type: "SET_SCREEN", payload: GameScreen.GAME_OVER })
    }

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
    const updatePlayerStatus = (updates) => {
        dispatch({ type: "UPDATE_PLAYER_STATUS", payload: updates })
    }

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

    return {
        ...state,
        dispatch,
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
    }
}

