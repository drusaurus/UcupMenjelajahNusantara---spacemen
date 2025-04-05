export enum GameScreen {
    START = "start",
    AVATAR_SELECTION = "avatar_selection",
    GAME_ARENA = "game_arena",
    GAME_OVER = "game_over",
    CREATORS = "creators",
}

export interface Avatar {
    id: string
    src: string
    alt: string
}

export interface Location {
    id: string
    name: string
    image: string
}

export interface Activity {
    id: string
    name: string
    cost: number
    effects: {
        meal?: number
        sleep?: number
        hygiene?: number
        happiness?: number
    }
    moneyGain?: number
}

export interface PlayerStatus {
    meal: number
    sleep: number
    hygiene: number
    happiness: number
    money: number
}

export interface GameTime {
    day: number
    hour: number
    minute: number
}

export interface PlayerPosition {
    x: number
    y: number
}

export interface Creator {
    name: string
    nim: string
    role: string
    image?: string
}

