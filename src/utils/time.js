import { TimeOfDay, TIME_RANGES} from "../constants/gameData.js";

export function getTimeOfDay() {
    if (hour >= TIME_RANGES[TimeOfDay.MORNING].start && hour <= TIME_RANGES[TimeOfDay.MORNING].end)
        return TimeOfDay.MORNING
    if (hour >= TIME_RANGES[TimeOfDay.AFTERNOON].start && hour <= TIME_RANGES[TimeOfDay.AFTERNOON].end)
        return TimeOfDay.AFTERNOON
    if (hour >= TIME_RANGES[TimeOfDay.EVENING].start && hour <= TIME_RANGES[TimeOfDay.EVENING].end)
        return TimeOfDay.EVENING

    // NIGHT spans 9PM to 4AM — needs special handling since it's across two days
    return TimeOfDay.NIGHT
}