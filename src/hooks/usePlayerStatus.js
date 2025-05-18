"use client"

import { useEffect, useRef } from "react"
import { useGame } from "./useGame"

export function usePlayerStatus() {
    const { playerStatus, updatePlayerStatus, navigateToGameOver } = useGame()
    const statusRef = useRef(playerStatus)

    // Keep the ref updated
    useEffect(() => {
        statusRef.current = playerStatus
    }, [playerStatus])

    // Degrade status periodically
    // useEffect(() => {
    //     console.log("⏳ Starting degradation interval")
    //
    //     const interval = setInterval(() => {
    //         const { meal, sleep, hygiene, happiness } = statusRef.current
    //
    //         const newMeal = Math.max(0, meal - 2)
    //         const newSleep = Math.max(0, sleep - 1.5)
    //         const newHygiene = Math.max(0, hygiene - 1)
    //
    //         const penalty = (meal < 20 ? 1 : 0) + (sleep < 20 ? 1 : 0) + (hygiene < 20 ? 1 : 0)
    //         const newHappiness = Math.max(0, happiness - (0.5 + penalty))
    //
    //         console.log("📉 Degrading status...")
    //
    //         updatePlayerStatus({
    //             meal: newMeal,
    //             sleep: newSleep,
    //             hygiene: newHygiene,
    //             happiness: newHappiness,
    //         })
    //     }, 10000) // every 10 seconds
    //
    //     return () => clearInterval(interval)
    // }, [updatePlayerStatus]) // only updatePlayerStatus in deps

    // Game over check — reactive to live playerStatus
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

    const performActivity = (activity) => {
        const { money } = playerStatus

        if (money - activity.cost < 0) return false

        const updates = {
            money: money - activity.cost + (activity.moneyGain || 0),
        }

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

        updatePlayerStatus(updates)
        return true
    }

    return {
        ...playerStatus,
        performActivity,
    }
}
