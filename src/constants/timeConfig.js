// Time of day constants
export const TimeOfDay = {
    MORNING: "morning",
    AFTERNOON: "afternoon",
    EVENING: "evening",
    NIGHT: "night",
}

// Map background images for different times of day
export const MAP_BACKGROUNDS = {
    [TimeOfDay.MORNING]: "/morning_map.png",
    [TimeOfDay.AFTERNOON]: "/afternoon_map.png",
    [TimeOfDay.EVENING]: "/evening_map.png",
    [TimeOfDay.NIGHT]: "/night_map.png",
}

// Time ranges for different times of day
export const TIME_RANGES = {
    [TimeOfDay.MORNING]: { start: 5, end: 10 },
    [TimeOfDay.AFTERNOON]: { start: 11, end: 14 },
    [TimeOfDay.EVENING]: { start: 15, end: 19 },
    [TimeOfDay.NIGHT]: { start: 20, end: 4 },
}