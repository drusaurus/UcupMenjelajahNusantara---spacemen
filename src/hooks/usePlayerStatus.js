"use client"

import { useEffect } from "react"
import { useGame } from "./useGame"

export function usePlayerStatus() {
    const { playerStatus, updatePlayerStatus, navigateToGameOver } = useGame()

    // Status degradation over time
    useEffect(() => {
        const degradeInterval = setInterval(() => {
            const { meal, sleep, hygiene, happiness } = playerStatus

            // Calculate new values
            const newMeal = Math.max(0, meal - 2)
            const newSleep = Math.max(0, sleep - 1.5)
            const newHygiene = Math.max(0, hygiene - 1)

            // Happiness decreases if other stats are low
            const statsPenalty = (meal < 20 ? 1 : 0) + (sleep < 20 ? 1 : 0) + (hygiene < 20 ? 1 : 0)

            const newHappiness = Math.max(0, happiness - (0.5 + statsPenalty))

            // Update status
            updatePlayerStatus({
                meal: newMeal,
                sleep: newSleep,
                hygiene: newHygiene,
                happiness: newHappiness,
            })
        }, 10000) // Check every 3 seconds

        return () => clearInterval(degradeInterval)
    }, [playerStatus, updatePlayerStatus])

    // Check for game over conditions
    useEffect(() => {
        const { meal, sleep, hygiene, happiness } = playerStatus

        if (meal <= 0) {
            navigateToGameOver("You died of hunger. Remember to eat regularly!")
        } else if (sleep <= 0) {
            navigateToGameOver("You collapsed from exhaustion. Remember to get enough rest!")
        } else if (hygiene <= 0) {
            navigateToGameOver("You got sick due to poor hygiene. Remember to stay clean!")
        } else if (happiness <= 0) {
            navigateToGameOver("You became too depressed to continue your journey. Keep your spirits up!")
        }
    }, [playerStatus, navigateToGameOver])

    // Handle activity
    const performActivity = (activity) => {
        const { money } = playerStatus

        // Check if player has enough money
        if (money + activity.cost < 0) {
            return false // Not enough money
        }

        // Calculate new status values
        const updates = {
            money: money + activity.cost + (activity.moneyGain || 0),
        }

        // Apply effects
        if (activity.effects.meal) {
            updates.meal = Math.min(100, playerStatus.meal + activity.effects.meal)
        }
        if (activity.effects.sleep) {
            updates.sleep = Math.min(100, playerStatus.sleep + activity.effects.sleep)
        }
        if (activity.effects.hygiene) {
            updates.hygiene = Math.min(100, playerStatus.hygiene + activity.effects.hygiene)
        }
        if (activity.effects.happiness) {
            updates.happiness = Math.min(100, playerStatus.happiness + activity.effects.happiness)
        }

        // Update player status
        updatePlayerStatus(updates)

        return true // Activity performed successfully
    }

    return {
        ...playerStatus,
        performActivity,
    }
}

