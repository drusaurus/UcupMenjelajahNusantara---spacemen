export const AVATARS = [
    { id: "avatar1", src: "/placeholder.svg?height=200&width=200", alt: "Male Avatar 1" },
    { id: "avatar2", src: "/placeholder.svg?height=200&width=200", alt: "Female Avatar 1" },
    { id: "avatar3", src: "/placeholder.svg?height=200&width=200", alt: "Male Avatar 2" },
    { id: "avatar4", src: "/placeholder.svg?height=200&width=200", alt: "Female Avatar 2" },
]

export const LOCATIONS = [
    { id: "home", name: "Home", image: "/placeholder.svg?height=200&width=200" },
    { id: "beach", name: "Beach", image: "/placeholder.svg?height=200&width=200" },
    { id: "lake", name: "Lake", image: "/placeholder.svg?height=200&width=200" },
    { id: "temple", name: "Temple", image: "/placeholder.svg?height=200&width=200" },
    { id: "mountain", name: "Mountain", image: "/placeholder.svg?height=200&width=200" },
]

export const LOCATION_ACTIVITIES = {
    home: [
        { id: "meal", name: "Get some meal", cost: 0, effects: { meal: 30 } },
        { id: "bath", name: "Take a bath", cost: 0, effects: { hygiene: 40 } },
        { id: "sleep", name: "Sleep", cost: 0, effects: { sleep: 50 } },
        { id: "chores", name: "Do chores", cost: -50, effects: { hygiene: -10 }, moneyGain: 50 },
    ],
    beach: [
        { id: "explore", name: "Explore the beach", cost: 20, effects: { happiness: 15, sleep: -10, hygiene: -15 } },
        { id: "souvenirs", name: "Buy souvenirs", cost: 30, effects: { happiness: 10 } },
        { id: "eat", name: "Eat seafood", cost: 25, effects: { meal: 25, happiness: 5 } },
    ],
    lake: [
        { id: "explore", name: "Explore the lake", cost: 15, effects: { happiness: 15, sleep: -10, hygiene: -10 } },
        { id: "boat", name: "Rent a boat", cost: 40, effects: { happiness: 20, sleep: -5 } },
        { id: "eat", name: "Eat at lakeside restaurant", cost: 20, effects: { meal: 20, happiness: 5 } },
    ],
    temple: [
        { id: "explore", name: "Explore the temple", cost: 10, effects: { happiness: 20, sleep: -15 } },
        { id: "souvenirs", name: "Buy religious items", cost: 15, effects: { happiness: 10 } },
        { id: "meditate", name: "Meditate", cost: 0, effects: { happiness: 15, sleep: 10 } },
    ],
    mountain: [
        { id: "hike", name: "Go hiking", cost: 25, effects: { happiness: 25, sleep: -25, meal: -15, hygiene: -20 } },
        { id: "photo", name: "Take photos", cost: 0, effects: { happiness: 15, sleep: -5 } },
        { id: "eat", name: "Eat local cuisine", cost: 30, effects: { meal: 30, happiness: 10 } },
    ],
}

export const CREATORS = [
    { name: "Creator 1", nim: "00000012345", role: "Game Designer", image: "/placeholder.svg?height=100&width=100" },
    { name: "Creator 2", nim: "00000012346", role: "Frontend Developer", image: "/placeholder.svg?height=100&width=100" },
    { name: "Creator 3", nim: "00000012347", role: "UI/UX Designer", image: "/placeholder.svg?height=100&width=100" },
    { name: "Creator 4", nim: "00000012348", role: "Project Manager", image: "/placeholder.svg?height=100&width=100" },
]

export const INITIAL_PLAYER_STATUS = {
    meal: 50,
    sleep: 50,
    hygiene: 50,
    happiness: 50,
    money: 500,
}

export const INITIAL_GAME_TIME = {
    day: 1,
    hour: 8,
}

export const INITIAL_PLAYER_POSITION = {
    x: 50,
    y: 50,
}

// Convert enum to object with constants
export const GameScreen = {
    START: "start",
    AVATAR_SELECTION: "avatar_selection",
    GAME_ARENA: "game_arena",
    GAME_OVER: "game_over",
    CREATORS: "creators",
}

