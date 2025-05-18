"use client"

import { createContext, useReducer } from "react"
import { GameScreen} from "../constants/gameScreens.js";
import { INITIAL_PLAYER_POSITION, INITIAL_GAME_TIME, INITIAL_PLAYER_STATUS} from "../constants/gameState.js";

export const GameContext = createContext(undefined)

const initialState = {
    currentScreen: GameScreen.START,
    playerName: "player name",
    selectedAvatar: {
        "name": "Boy",
        "avatar": "/Ninja Adventure - Asset Pack/Actor/Characters/Boy/Faceset.png",
        "animation": {
            "walk": "/Ninja Adventure - Asset Pack/Actor/Characters/Boy/SeparateAnim/Walk.png",
            "idle": "/Ninja Adventure - Asset Pack/Actor/Characters/Boy/SeparateAnim/Idle.png"
        },
        "dead": "/Ninja Adventure - Asset Pack/Actor/Characters/Boy/SeparateAnim/Dead.png"
    },
    gameOverReason: "",
    playerStatus: INITIAL_PLAYER_STATUS,
    gameTime: INITIAL_GAME_TIME,
    playerPosition: INITIAL_PLAYER_POSITION,
    currentLocation: "home",

    inventory: [],

}

function gameReducer(state, action) {
    switch (action.type) {
        case "SET_SCREEN":
            return { ...state, currentScreen: action.payload }
        case "SET_PLAYER_NAME":
            return { ...state, playerName: action.payload }
        case "SET_SELECTED_AVATAR":
            return { ...state, selectedAvatar: action.payload }
        case "SET_GAME_OVER_REASON":
            return { ...state, gameOverReason: action.payload }
        case "UPDATE_PLAYER_STATUS":
            return {
                ...state,
                playerStatus: { ...state.playerStatus, ...action.payload },
            }
        case "UPDATE_GAME_TIME":
            return {
                ...state,
                gameTime: { ...state.gameTime, ...action.payload },
            }
        case "UPDATE_PLAYER_POSITION":
            return {
                ...state,
                playerPosition: { ...state.playerPosition, ...action.payload },
            }
        case "SET_CURRENT_LOCATION":
            return { ...state, currentLocation: action.payload }
        case "RESET_GAME":
            return {
                ...initialState,
                currentScreen: GameScreen.START,
            }
        default:
            return state
    }
}

export function GameProvider({ children }) {
    const [state, dispatch] = useReducer(gameReducer, initialState)

    return <GameContext.Provider value={{ state, dispatch }}>{children}</GameContext.Provider>
}

