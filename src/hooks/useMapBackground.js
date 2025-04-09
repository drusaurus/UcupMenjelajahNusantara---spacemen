// hooks/useMapBackground.js
import { MAP_BACKGROUNDS } from "../constants/gameData"
import { getTimeOfDay } from "../utils/time"

export function useMapBackground(currentHour) {
    const timeOfDay = getTimeOfDay(currentHour)
    return MAP_BACKGROUNDS[timeOfDay] || MAP_BACKGROUNDS["afternoon"]
}
