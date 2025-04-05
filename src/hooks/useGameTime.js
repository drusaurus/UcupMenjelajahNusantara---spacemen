"use client"

import { useEffect } from "react"
import { useGame } from "./useGame"

export function useGameTime() {
    const { gameTime, updateGameTime } = useGame()
    const { day, hour } = gameTime

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

    // Game time simulation
    useEffect(() => {
        const timeInterval = setInterval(() => {
            const newHour = hour + 1

            if (newHour >= 24) {
                updateGameTime({ hour: 0, day: day + 1 })
            } else {
                updateGameTime({ hour: newHour })
            }
        }, 1000) // 1 second in real life = 1 hour in game

        return () => clearInterval(timeInterval)
    }, [hour, day, updateGameTime])

    return {
        day,
        hour,
        greeting: getGreeting(),
        formattedHour: hour.toString().padStart(2, "0"),
    }
}

