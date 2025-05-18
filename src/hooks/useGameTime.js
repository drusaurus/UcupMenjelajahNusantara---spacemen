"use client"

import { useEffect, useRef } from "react"
import { useGame } from "./useGame"
import { TimeOfDay, TIME_RANGES } from "../constants/timeConfig.js"

export function useGameTime() {
    const { gameTime, updateGameTime } = useGame()
    const { day, hour, minute = 0 } = gameTime
    
    // References for animation frame and time tracking
    const requestRef = useRef(null);
    const lastUpdateTimeRef = useRef(performance.now());
    const gameTimeRef = useRef({ day, hour, minute });
    
    // Minimum time between updates in milliseconds (1000ms = 1 second = 1 game minute)
    const TIME_UPDATE_INTERVAL = 1000;

    // Update the ref when gameTime changes
    useEffect(() => {
        gameTimeRef.current = { day, hour, minute };
    }, [day, hour, minute]);

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

    // Game time animation function
    const animateTime = (timestamp) => {
        const elapsed = timestamp - lastUpdateTimeRef.current;
        
        // Update game time every TIME_UPDATE_INTERVAL milliseconds
        if (elapsed >= TIME_UPDATE_INTERVAL) {
            // Use the ref value for calculations to avoid dependency issues
            let { day: currentDay, hour: currentHour, minute: currentMinute } = gameTimeRef.current;
            
            let newMinute = currentMinute + 1;
            let newHour = currentHour;
            let newDay = currentDay;

            if (newMinute >= 60) {
                newMinute = 0;
                newHour += 1;

                if (newHour >= 24) {
                    newHour = 0;
                    newDay += 1;
                }
            }

            // Update the game time state
            updateGameTime({
                day: newDay,
                hour: newHour,
                minute: newMinute,
            });
            
            // Reset the timer
            lastUpdateTimeRef.current = timestamp;
        }
        
        // Continue the animation loop
        requestRef.current = requestAnimationFrame(animateTime);
    };

    // Set up and clean up the animation frame
    useEffect(() => {
        // Initialize time tracking
        lastUpdateTimeRef.current = performance.now();
        
        // Start the animation loop
        requestRef.current = requestAnimationFrame(animateTime);
        
        // Clean up on unmount
        return () => {
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
            }
        };
    }, []);  // Empty dependency array ensures this only runs once

    return {
        day,
        hour,
        minute,
        greeting: getGreeting(),
        timeOfDay: getTimeOfDay(hour),
        formattedTime: `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`,
    }
}
