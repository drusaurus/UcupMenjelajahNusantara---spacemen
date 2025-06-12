"use client"

import { useEffect, useRef } from "react"
import { useGame } from "./useGame"
import { TimeOfDay, TIME_RANGES } from "../constants/timeConfig.js"

export function useGameTime() {
    const { gameTime, updateGameTime } = useGame()
    const { day, hour, minute = 0 } = gameTime

    const intervalRef = useRef(null)

    // Update game time every 1 second = 1 in-game minute
    const TIME_UPDATE_INTERVAL = 1000

    // Time update logic
    const advanceTime = () => {
        let newMinute = minute + 1
        let newHour = hour
        let newDay = day

        if (newMinute >= 60) {
            newMinute = 0
            newHour += 1

            if (newHour >= 24) {
                newHour = 0
                newDay += 1
            }
        }

        updateGameTime({
            day: newDay,
            hour: newHour,
            minute: newMinute,
        })
    }

    useEffect(() => {
        intervalRef.current = setInterval(advanceTime, TIME_UPDATE_INTERVAL)
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current)
        }
    }, [day, hour, minute])

    const getGreeting = () => {
        const greetingMap = {
            [TimeOfDay.MORNING]: "Good Morning",
            [TimeOfDay.AFTERNOON]: "Good Afternoon",
            [TimeOfDay.EVENING]: "Good Evening",
            [TimeOfDay.NIGHT]: "Good Night",
        };

        for (const [timeOfDay, { start, end }] of Object.entries(TIME_RANGES)) {
            if (start <= end) {
                // Normal case: e.g., 5 to 10
                if (hour >= start && hour <= end) {
                    return greetingMap[timeOfDay];
                }
            } else {
                // Wrap-around case: e.g., 20 to 4
                if (hour >= start || hour <= end) {
                    return greetingMap[timeOfDay];
                }
            }
        }
        // Fallback
        return "Hello";
    };

    const getTimeOfDay = (hour) => {
        const inRange = (start, end, value) =>
            start <= end ? value >= start && value <= end : value >= start || value <= end

        if (inRange(TIME_RANGES[TimeOfDay.MORNING].start, TIME_RANGES[TimeOfDay.MORNING].end, hour))
            return TimeOfDay.MORNING
        if (inRange(TIME_RANGES[TimeOfDay.AFTERNOON].start, TIME_RANGES[TimeOfDay.AFTERNOON].end, hour))
            return TimeOfDay.AFTERNOON
        if (inRange(TIME_RANGES[TimeOfDay.EVENING].start, TIME_RANGES[TimeOfDay.EVENING].end, hour))
            return TimeOfDay.EVENING
        return TimeOfDay.NIGHT
    }

    return {
        TIME_UPDATE_INTERVAL,
        getTimeOfDay,
        day,
        hour,
        minute,
        greeting: getGreeting(),
        timeOfDay: getTimeOfDay(hour),
        formattedTime: `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`,
    }
}
