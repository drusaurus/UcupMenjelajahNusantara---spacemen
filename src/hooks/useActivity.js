// hooks/useActivity.js
"use client";

import {useCallback, useContext, useEffect, useRef} from "react";
import {GameContext} from "../contexts/GameContext.js";
import {useInventory} from "./useInventory.js";
import {ITEM_TYPES, ITEMS} from "../constants/items.js";
import {useGameTime} from "./useGameTime.js"
import Emotes from "../constants/emotes.js";
import { useNotification} from "../contexts/NotificationContext.jsx";

export default function useActivity() {
    const context = useContext(GameContext);
    if (!context) { throw new Error("useActivity must be used within a GameProvider"); }
    const { state, dispatch } = context;
    const { pushNotification } = useNotification();
    const inventory = useInventory();

    const { TIME_UPDATE_INTERVAL,getTimeOfDay } = useGameTime();
    const ACTIVITY_TICK_INTERVAL_MS = TIME_UPDATE_INTERVAL; // Real-time milliseconds per game logic tick (e.g., 1 second)
    const GAME_MINUTES_PER_TICK = 1;       // How many game minutes pass per tick

    const currentActivityTimerIdRef = useRef(null);
    const latestActivityRef = useRef(state.currentActivityInProgress);
    const accumulatedGameMinutesRef = useRef(0);

    useEffect(() => {
        latestActivityRef.current = state.currentActivityInProgress;
        // console.log("[useActivity] Latest activity updated:", latestActivityRef.current);
    }, [state.currentActivityInProgress]);

    // This ref will store the ID of the currently active activity's timeout

    const openActivityModal = useCallback((activityData) => dispatch({ type: "OPEN_ACTIVITY_MODAL", payload: activityData }), [dispatch]);
    const closeActivityModal = useCallback(() => dispatch({ type: "CLOSE_ACTIVITY_MODAL" }), [dispatch]);

    const _applyCompletion = useCallback(async (activityDetailsFromState) => {
        if (!activityDetailsFromState) {
            console.warn('[applyCompletion] No activity to complete.');
            return;
        }

        const { effectsToApplyOnCompletion = {}, rewards = {} } = activityDetailsFromState;

        const emoteQueue = [];

        function queueEmote(type, sprite, duration = 2000) {
            emoteQueue.push({ type, sprite, duration });
        }

        function dispatchQueuedEmotes() {
            let delay = 0;

            for (const emote of emoteQueue) {
                setTimeout(() => {
                    dispatch({ type: "SHOW_COMPLETION_EMOTE", payload: emote });
                }, delay);

                setTimeout(() => {
                    dispatch({ type: "CLEAR_COMPLETION_EMOTE" });
                }, delay + emote.duration);

                delay += emote.duration + 300; // small padding to avoid overlap
            }

            // Set busy to false after all emotes are shown
            setTimeout(() => {
                dispatch({ type: "SET_PLAYER_BUSY_STATE", payload: false });
            }, delay);
        }

        const notifyIfRareItem = (itemId, isGacha = false) => {
            const item = ITEMS[itemId];
            if (item?.rare) {
                pushNotification("item", `You ${isGacha ? 'found' : 'received'} a rare ${item.name}!`, 10);
                const newScore = (state.playerStatus?.score ?? 0) + 10;
                dispatch({ type: "UPDATE_PLAYER_STATUS", payload: { score: newScore } });

            }
        };

        // ===== ITEM REWARDS =====
        if (rewards?.items) {
            for (const item of rewards.items) {
                const itemDef = ITEMS[item.itemId];
                const sprite = itemDef?.sourcePath || Emotes.emote_happy;
                queueEmote("received reward", sprite);
                dispatch({ type: 'ADD_ITEM_TO_PLAYER_INVENTORY', payload: { item } });
                notifyIfRareItem(item.itemId)
            }
        }

        function getRandomQuantityFromTiers(quantityTiers) {
            if (!quantityTiers || quantityTiers.length === 0) return 1;

            const totalChance = quantityTiers.reduce((sum, tier) => sum + (tier.chance || 0), 0);
            if (totalChance === 0) return 1;

            const roll = Math.random() * totalChance;
            let cumulative = 0;

            for (const tier of quantityTiers) {
                cumulative += (tier.chance || 0);
                if (roll <= cumulative) {
                    const [min, max] = tier.range;
                    return Math.floor(Math.random() * (max - min + 1)) + min;
                }
            }

            // Fallback to first tier range
            const [min, max] = quantityTiers[0].range;
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        function getLootQuantity(loot) {
            if (loot.quantityTiers) return getRandomQuantityFromTiers(loot.quantityTiers);

            if (Array.isArray(loot.quantity)) {
                const [min, max] = loot.quantity;
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }

            return loot.quantity ?? 1;
        }

        if (Array.isArray(rewards.possibleLoots) && rewards.possibleLoots.length > 0) {
            // Step 1: Calculate total weight from chances
            const weightedLoots = rewards.possibleLoots.map(loot => {
                let weight = loot.chance;

                if (weight === undefined && Array.isArray(loot.quantityTiers)) {
                    weight = loot.quantityTiers.reduce((sum, tier) => sum + (tier.chance ?? 0), 0);
                }

                if (weight === undefined) {
                    console.warn(`Missing 'chance' for loot "${loot.itemId}", defaulting to 0.`);
                    weight = 0;
                }

                return { loot, weight };
            });

            const totalWeight = weightedLoots.reduce((sum, entry) => sum + entry.weight, 0);

            if (totalWeight <= 0) {
                console.warn("No valid loot chances found. Skipping reward.");
            } else {
                // Step 2: Roll based on cumulative weight
                const roll = Math.random() * totalWeight;
                let cumulative = 0;
                let selectedLoot = null;

                for (const { loot, weight } of weightedLoots) {
                    cumulative += weight;
                    if (roll <= cumulative) {
                        selectedLoot = loot;
                        break;
                    }
                }

                // Step 3: Reward the selected item
                if (selectedLoot) {
                    const quantity = getLootQuantity(selectedLoot);

                    if (quantity > 0) {
                        const sprite = ITEMS[selectedLoot.itemId]?.sourcePath || Emotes.emote_happy;
                        queueEmote("received reward", sprite);

                        if (selectedLoot.itemId === "coin") {
                            const newMoney = (state.playerStatus?.money ?? 0) + quantity;
                            dispatch({ type: "UPDATE_PLAYER_STATUS", payload: { money: newMoney } });
                        } else {
                            dispatch({
                                type: "ADD_ITEM_TO_PLAYER_INVENTORY",
                                payload: { item: { itemId: selectedLoot.itemId, quantity } }
                            });
                            notifyIfRareItem(selectedLoot.itemId, true);
                        }
                    }
                }
            }
        }


        // ===== PLAYER STATUS =====
        if (rewards?.playerStatus) {
            const additiveStatusUpdate = {};
            for (const [stat, value] of Object.entries(rewards.playerStatus)) {
                additiveStatusUpdate[stat] = (state.playerStatus?.[stat] ?? 0) + value;
            }
            dispatch({ type: 'UPDATE_PLAYER_STATUS', payload: additiveStatusUpdate });
        }

        // ===== COMPLETE ACTIVITY & FINAL EMOTE =====
        dispatch({ type: "COMPLETE_PLAYER_ACTIVITY" });

        const finishSprite = activityDetailsFromState.animation || Emotes.emote_happy;
        queueEmote("finish activity", finishSprite);

        // Run the queued emote animations one by one
        dispatchQueuedEmotes();

        console.log(`[applyCompletion] Completed activity: ${activityDetailsFromState.name} (${activityDetailsFromState.id}).`);

    }, [dispatch, pushNotification, state.playerStatus]);

    const skipCurrentActivity = useCallback(() => {
        console.log("[skipCurrentActivity] Skipping current activity...");
        const activity = state.currentActivityInProgress;
        if (!activity || activity.mode !== "gradual_ff") return;

        // 1) Stop the interval if it’s still running
        if (currentActivityTimerIdRef.current) {
            clearInterval(currentActivityTimerIdRef.current);
            currentActivityTimerIdRef.current = null;
        }

        // 2) Determine elapsed and remaining time
        const completed = activity.gameTimeProgress || 0;
        const remaining = Math.max(0, activity.totalGameDuration - completed);

        console.log("[skipCurrentActivity] Elapsed:", completed, "Remaining:", remaining);
        console.log("activity.duration:", activity.totalGameDuration)
        console.log("[skipCurrentActivity] Activity effects:", activity.effects);
        if (remaining > 0 && activity.effects) {
            const effectsTick = {};

            for (const stat in activity.effects) {
                if (Object.prototype.hasOwnProperty.call(activity.effects, stat)) {
                    const totalEffect = activity.effects[stat];
                    const effectPerMinute = totalEffect / activity.totalGameDuration;
                    effectsTick[stat] = effectPerMinute * remaining;
                }
            }

            console.log("[skipCurrentActivity] Applying remaining effects and time:", effectsTick);
            // 3) Apply remaining effects and time in one reducer dispatch
            dispatch({
                type: "UPDATE_ACTIVITY_PROGRESS_AND_EFFECTS",
                payload: {
                    gameTimeIncrement: remaining,
                    effectsTick,
                },
            });
        }

        // 4) Mark the activity as completed
        _applyCompletion(activity);

        return true;
    }, [state.currentActivityInProgress, _applyCompletion, dispatch]);


    const startPlayerActivity = useCallback((activityData) => {
        console.log("[useActivity] Attempting to start activity:", activityData?.name);
        closeActivityModal();
        inventory.closeStorageModal();
        inventory.closeInventoryModal();

        if (state.isPlayerBusy) {
            console.warn("[useActivity] Player is already busy. New activity blocked.");
            return false;
        }

        if (!activityData?.id || !activityData?.name) {
            console.error("[useActivity] Invalid activityData (missing id or name):", activityData);
            return false;
        }

        // Stop existing timer
        if (currentActivityTimerIdRef.current) {
            clearInterval(currentActivityTimerIdRef.current);
            currentActivityTimerIdRef.current = null;
        }

        if (activityData.requirements?.time) {
            const currentHour = state.gameTime.hour; // assuming 0–23 range
            const timeOfDay = getTimeOfDay(currentHour); // helper function below

            const { allowedTimesOfDay, hourRange } = activityData.requirements.time;

            if (allowedTimesOfDay && !allowedTimesOfDay.includes(timeOfDay)) {
                console.warn(`[useActivity] Activity '${activityData.name}' is not allowed during ${timeOfDay}. Allowed: ${allowedTimesOfDay.join(", ")}`);
                pushNotification("error", `Activity '${activityData.name}' is not allowed during ${timeOfDay}. Allowed: ${allowedTimesOfDay.join(", ")}`)
                return false;
            }

            if (hourRange) {
                const [startHour, endHour] = hourRange;

                const isWithinRange =
                    startHour < endHour
                        ? currentHour >= startHour && currentHour < endHour
                        : currentHour >= startHour || currentHour < endHour;

                if (!isWithinRange) {
                    console.warn(
                        `[useActivity] Activity '${activityData.name}' can only be done between ${startHour}:00 and ${endHour}:00. Current: ${currentHour}:00`
                    );
                    pushNotification("error", `Activity is available only between ${startHour}:00 and ${endHour}:00`)
                    return false;
                }
            }
        }

        const toolsUsed = [];
        if (activityData.requirements?.items) {
            for (const req of activityData.requirements.items) {
                const def = ITEMS[req.itemId];
                if (!def) return false;

                const requiredQty = req.quantity || 1;
                const hasQty = inventory.countPlayerItem(req.itemId);

                if (hasQty < requiredQty) return false;

                if (def.type === ITEM_TYPES.TOOL) {
                    // Check and update usable tool instance
                    const allTools = inventory.getPlayerItemInstance(req.itemId);
                    let foundUsableTool = false;

                    for (const tool of allTools) {
                        const currentUses = tool.uses || 0;
                        const newUses = currentUses + 1;

                        if (!def.maxUse || newUses <= def.maxUse) {
                            // Update this tool instance
                            inventory.updatePlayerItemInstance(req.itemId, { id: tool.id, uses: newUses });

                            toolsUsed.push({
                                itemId: req.itemId,
                                itemDef: def,
                                instanceSnapshot: { ...tool, uses: newUses }
                            });

                            // Remove tool if maxUse reached
                            if (def.maxUse && newUses >= def.maxUse) {
                                inventory.removeItemFromPlayer(req.itemId, 1);
                            }

                            foundUsableTool = true;
                            break; // Use only one tool instance
                        }
                    }

                    if (!foundUsableTool) return false; // No usable tool found
                }
            }
        }


        if (activityData.requirements?.stats) {
            for (const [stat, min] of Object.entries(activityData.requirements.stats)) {
                if ((state.playerStatus[stat] || 0) < min) return false;
            }
        }

        if (activityData.costs?.items) {
            for (const cost of activityData.costs.items) {
                if (inventory.countPlayerItem(cost.itemId) < cost.quantity) {
                    pushNotification("error", `You don't have enough ${ITEMS[cost.itemId].name}. You need ${cost.quantity}.`)
                    return false
                }
            }
            activityData.costs.items.forEach(cost => {
                inventory.removeItemFromPlayer(cost.itemId, cost.quantity);
            });
        }

        const totalGameDuration = activityData.duration || 1;
        const msPerGameMin = ACTIVITY_TICK_INTERVAL_MS / GAME_MINUTES_PER_TICK;
        const totalRealTimeMs = totalGameDuration * msPerGameMin;
        const startTime = Date.now();

        const activity = {
            id: activityData.id,
            name: activityData.name,
            totalGameDuration,
            totalRealTimeMs,
            effects: activityData.effects || {},
            rewards: activityData.rewards || {},
            mode: activityData.mode,
            animation: activityData.animation,
            consumedItemId: activityData.consumedItemId || null,
            startTimeMs: startTime,
            timeoutId: null,
            gameTimeProgress: 0,
            toolUsedInfoAtStart: toolsUsed,
            toolsThatWillBreakAtStart: [],
            effectsToApplyOnCompletion: activityData.effects || {},
        };

        dispatch({ type: "START_PLAYER_ACTIVITY", payload: { activityDataForState: activity } });
        latestActivityRef.current = activity;
        accumulatedGameMinutesRef.current = 0;

        if (activity.mode === "gradual_ff") {
            const effectsPerTick = {};
            for (const [key, total] of Object.entries(activity.effects)) {
                effectsPerTick[key] = total / totalGameDuration * GAME_MINUTES_PER_TICK;
            }

            let gameTime = 0;
            const intervalId = setInterval(() => {
                const active = latestActivityRef.current;
                if (!active || active.startTimeMs !== startTime) {
                    clearInterval(intervalId);
                    return;
                }

                gameTime += GAME_MINUTES_PER_TICK;
                accumulatedGameMinutesRef.current = gameTime;
                console.log("accumulatedGameMinutesRef.current:", accumulatedGameMinutesRef.current, "gameTime:", gameTime, "effectsPerTick:", effectsPerTick, "")

                dispatch({
                    type: "UPDATE_ACTIVITY_PROGRESS_AND_EFFECTS",
                    payload: {
                        gameTimeIncrement: GAME_MINUTES_PER_TICK,
                        effectsTick: effectsPerTick,
                    },
                });

                if (gameTime >= totalGameDuration) {
                    clearInterval(intervalId);
                    currentActivityTimerIdRef.current = null;
                    _applyCompletion(active);
                }
            }, ACTIVITY_TICK_INTERVAL_MS);

            currentActivityTimerIdRef.current = intervalId;
        } else {
            currentActivityTimerIdRef.current = setTimeout(() => {
                _applyCompletion(activity);
                currentActivityTimerIdRef.current = null;
            }, totalRealTimeMs);
        }

        console.log(`[useActivity] Activity started: ${activity.name}`);
        return true;
    }, [ACTIVITY_TICK_INTERVAL_MS, _applyCompletion, closeActivityModal, dispatch, getTimeOfDay, inventory, pushNotification, state.gameTime.hour, state.isPlayerBusy, state.playerStatus]);





    return {
        openActivityModal, closeActivityModal,
        isPlayerBusy: state.isPlayerBusy,
        currentCompletionEmote: state.currentCompletionEmote,
        currentBusyIndicator: state.currentBusyIndicator,
        currentActivityInProgress: state.currentActivityInProgress,
        startPlayerActivity,
        skipCurrentActivity
        // fastForwardCurrentActivity,
    };
}
