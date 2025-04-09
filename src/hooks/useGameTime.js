"use client"

import { useEffect } from "react"
import { useGame } from "./useGame"
import { TimeOfDay, TIME_RANGES } from "../constants/gameData"

export function useGameTime() {
    const { gameTime, updateGameTime } = useGame()
    const { day, hour, minute = 0 } = gameTime

    // Determine greeting based on time
    const getGreeting = () => {
        if (hour >= 5 && hour < 12) {
            return "Good Morning"
        } else if (hour >= 12 && hour < 17) {
            return "Good Afternoon"
        } else if (hour >= 17 && hour < 21) {
            return "Good Evening"
        } else {
            return "Good Night"
        }
    }

    // Determine time of day
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

    // Game time simulation: 1 second = 1 in-game minute
    useEffect(() => {
        const timeInterval = setInterval(() => {
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
        }, 1000)

        return () => clearInterval(timeInterval)
    }, [minute, hour, day, updateGameTime])

    return {
        day,
        hour,
        minute,
        greeting: getGreeting(),
        timeOfDay: getTimeOfDay(hour),
        formattedTime: `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`,
    }
}
