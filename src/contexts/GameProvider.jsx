"use client";

import { GameScreen } from "../constants/gameScreens.js";
import {
  INITIAL_GAME_TIME, BASE_PLAYER_INVENTORY,
  INITIAL_PLAYER_POSITION, BASE_PLAYER_SPEED,
  INITIAL_PLAYER_STATUS,
} from "../constants/gameState.js";
import { useReducer } from "react";
import { GameContext } from "./GameContext.js";
import { ITEM_TYPES, ITEMS } from "../constants/items.js";
import {NotificationProvider} from "./NotificationContext.jsx";

const MAX_PLAYER_INVENTORY_SLOTS = 20; // Example: Player can hold 20 unique stacks/items
const MAX_STORAGE_SLOTS = 30; // Example: A specific storage might hold 30 unique stacks/items

const initialState = {
  currentScreen: GameScreen.START,
  playerName: "player name",
  selectedAvatar: {
    name: "Boy",
    avatar: "/Ninja Adventure - Asset Pack/Actor/Characters/Boy/Faceset.png",
    animation: {
      walk: "/Ninja Adventure - Asset Pack/Actor/Characters/Boy/SeparateAnim/Walk.png",
      idle: "/Ninja Adventure - Asset Pack/Actor/Characters/Boy/SeparateAnim/Idle.png",
    },
    dead: "/Ninja Adventure - Asset Pack/Actor/Characters/Boy/SeparateAnim/Dead.png",
  },
  gameOverReason: "",
  playerStatus: INITIAL_PLAYER_STATUS,
  gameTime: INITIAL_GAME_TIME,
  playerPosition: INITIAL_PLAYER_POSITION,
  currentLocation: "home",
  currentInnerLocation: null,
  currentArea: "world",
  maxInventorySlots: BASE_PLAYER_INVENTORY, // Initial player inventory slot capacity
  playerSpeed: BASE_PLAYER_SPEED, // Initial player movement speed multiplier/value

  playerInventory: [{ itemId: "fishing_rod", quantity: 1, uses: 0 }],
  playerEquipment: {
    bag: null,
    shoes: null
  },
  visitedLocations: [],

  storageInventories: {
    player_home_fridge: [
      { itemId: "indomie", quantity: 6 },
      { itemId: "milk", quantity: 2 },
      { itemId: "raw_chicken", quantity: 2 },
    ],
    player_home_closet: [
      {itemId: "bag", quantity: 1},
      {itemId: "shoes", quantity: 1}
    ]
  },

  shops: {
    lake_fishing_shop: {
      modalHeader: "Fishing Shop",
      items: [
          {itemId: "fishing_rod"},
          {itemId: "fish_bait", quantity: 5},
      ]
    },
    lake_restaurant: {
      modalHeader: "B'Lake Restaurant",
      items: [
          {itemId: "cooked_indomie"},
      ]
    }
  },

  isTransitioningLocation: false,
  isActivityModalOpen: false,
  selectedActivityForModal: null,
  isStorageModalOpen: false,
  activeStorageId: null,
  isInventoryModalOpen: false,
  isShopModalOpen: false,
  activeShopId: null,

  isPlayerBusy: false,
  currentCompletionEmote: null,
  currentActivityInProgress: null,
  // currentActivityInProgress will store:
  // {
  //   id: string, name: string,
  //   totalGameDuration: number, totalRealTimeMs: number,
  //   effects: object, // Total effects
  //   rewards: object,
  //   mode: string, animation?: string, consumedItemId?: string | null,
  //   startTimeMs: number, // Real-world timestamp activity started
  //   intervalId: number | null, // ID from setInterval for gradual effects/time
  //   gameTimeProgress: number, // Game minutes processed so far for this activity
  //   // Effects applied so far could also be tracked if needed for precise remaining effects calculation
  //   effectsAppliedSoFar: object, // Optional: to track precisely what portion of effects applied
  //   toolBrokeOnThisUseDuringStart?: boolean,
  //   toolUsedInfoAtStart?: object,
  // }
};

function gameReducer(state, action) {
    switch (action.type) {
    case "SET_SCREEN":
      // console.log("Reducer Action:", action.type, "Payload:", action.payload);
      return { ...state, currentScreen: action.payload };
    case "SET_PLAYER_NAME":
      // console.log("Reducer Action:", action.type, "Payload:", action.payload);
      return { ...state, playerName: action.payload };
    case "SET_SELECTED_AVATAR":
      // console.log("Reducer Action:", action.type, "Payload:", action.payload);
      return { ...state, selectedAvatar: action.payload };
    case "SET_GAME_OVER_REASON":
      // console.log("Reducer Action:", action.type, "Payload:", action.payload);
      return { ...state, gameOverReason: action.payload };
    case "UPDATE_PLAYER_STATUS":
      // console.log("Reducer Action:", action.type, "Payload:", action.payload);
      return {
        ...state,
        playerStatus: { ...state.playerStatus, ...action.payload },
      };
    case "UPDATE_GAME_TIME":
      // console.log("Reducer Action:", action.type, "Payload:", action.payload);
      return {
        ...state,
        gameTime: { ...state.gameTime, ...action.payload },
      };
    case "UPDATE_PLAYER_POSITION":
      // console.log("Reducer Action:", action.type, "Payload:", action.payload);
      return {
        ...state,
        playerPosition: { ...state.playerPosition, ...action.payload },
      };
    case "SET_CURRENT_LOCATION":
      // console.log("Reducer Action:", action.type, "Payload:", action.payload);
      return { ...state, currentLocation: action.payload };
    case "SET_CURRENT_INNER_LOCATION":
      // console.log("Reducer Action:", action.type, "Payload:", action.payload);
      return { ...state, currentInnerLocation: action.payload };
    case "SET_CURRENT_AREA":
      // console.log("Reducer Action:", action.type, "Payload:", action.payload);
      return { ...state, currentArea: action.payload };
    case "START_LOCATION_TRANSITION":
      // console.log("Reducer Action:", action.type, "Payload:", action.payload);
      return { ...state, isTransitioningLocation: true };
    case "FINISH_LOCATION_TRANSITION":
      // console.log("Reducer Action:", action.type, "Payload:", action.payload);
      return { ...state, isTransitioningLocation: false };
    case "RESET_GAME":
      // console.log("Reducer Action:", action.type, "Payload:", action.payload);
      return {
        ...initialState,
        currentScreen: GameScreen.START,
      };
    case "ADD_VISITED_LOCATION":
        return {
          ...state,
          visitedLocations: [...state.visitedLocations, action.payload],
        };

    case "OPEN_ACTIVITY_MODAL":
      // console.log("Reducer Action:", action.type, "Payload:", action.payload);
      return {
        ...state,
        isActivityModalOpen: true,
        selectedActivityForModal: action.payload,
      };
    case "CLOSE_ACTIVITY_MODAL":
      // console.log("Reducer Action:", action.type, "Payload:", action.payload);
      return {
        ...state,
        isActivityModalOpen: false,
        selectedActivityForModal: null,
      };
    case "OPEN_STORAGE_MODAL":
      return {
        ...state,
        isStorageModalOpen: true,
        activeStorageId: action.payload,
      };
    case "CLOSE_STORAGE_MODAL":
      // console.log("Reducer Action:", action.type, "Payload:", action.payload);
      return { ...state, isStorageModalOpen: false, activeStorageId: null };
    case "OPEN_INVENTORY_MODAL":
      // console.log("Reducer Action:", action.type, "Payload:", action.payload);
      return { ...state, isInventoryModalOpen: true };
    case "CLOSE_INVENTORY_MODAL":
      // console.log("Reducer Action:", action.type, "Payload:", action.payload);
      return { ...state, isInventoryModalOpen: false };

    case "OPEN_SHOP_MODAL":
      return {...state, isShopModalOpen: true, activeShopId: action.payload};
      case "CLOSE_SHOP_MODAL":
        return {...state, isShopModalOpen: false, activeShopId: null};

    case "ADD_ITEM_TO_PLAYER_INVENTORY": {
      const { item: itemToAdd } = action.payload;
      const itemDefinition = ITEMS[itemToAdd.itemId];
      console.log(
        "[Reducer] ADD_ITEM_TO_PLAYER_INVENTORY - Item to add:",
        itemToAdd,
        "Def:",
        itemDefinition
      );
      if (!itemDefinition) {
        console.warn(
          `ADD_ITEM_TO_PLAYER_INVENTORY: Item definition not found for ${itemToAdd.itemId}`
        );
        return state;
      }
      const newInventory = [...state.playerInventory];
      let quantityRemaining = itemToAdd.quantity;
      let itemWasStacked = false;

      const createNewItem = () => {
        let baseItem = { ...itemToAdd };
        if (itemDefinition.type === ITEM_TYPES.TOOL) {
          baseItem.uses = 0;
        }
        return baseItem;
      };

      if (itemDefinition.stackable) {
        for (let i = 0; i < newInventory.length; i++) {
          if (newInventory[i].itemId === itemToAdd.itemId) {
            newInventory[i] = {
              ...newInventory[i], // Copy existing properties (itemId, any instance data)
              quantity: newInventory[i].quantity + quantityRemaining, // Update quantity
            };
            quantityRemaining = 0; // All items are now stacked
            itemWasStacked = true;
            break;
          }
        }
      }

      // If items still remain (either non-stackable, or stackable but no existing stacks had space / it's a new item)
      if (quantityRemaining > 0) {
        if (itemDefinition.stackable) {
          // It's a new stackable item. Add one new stack with the full remaining quantity.
          // Check inventory slot capacity before adding a new stack.
          if (newInventory.length < MAX_PLAYER_INVENTORY_SLOTS) {
            newInventory.push({
              ...createNewItem(), // Spreads itemId and any instance data from payload
              quantity: quantityRemaining, // Full remaining quantity in this new stack
            });
            quantityRemaining = 0;
          } else {
            console.warn(
              `Player inventory full (max slots: ${MAX_PLAYER_INVENTORY_SLOTS}). Cannot add new stack for ${itemToAdd.itemId}.`
            );
            // quantityRemaining remains > 0, indicating not all items were added.
          }
        } else {
          // Item is non-stackable. Add each unit as a new entry, up to inventory slot capacity.
          let itemsActuallyAdded = 0;
          for (let i = 0; i < quantityRemaining; i++) {
            // quantityRemaining is the number of individual non-stackable items to add
            if (newInventory.length < MAX_PLAYER_INVENTORY_SLOTS) {
              newInventory.push({
                ...createNewItem(), // Spreads itemId and instance data from payload
                quantity: 1, // Non-stackable items always have quantity 1 per entry
              });
              itemsActuallyAdded++;
            } else {
              console.warn(
                `Player inventory full (max slots: ${MAX_PLAYER_INVENTORY_SLOTS}). Could only add ${itemsActuallyAdded} of ${quantityRemaining} non-stackable ${itemToAdd.itemId}.`
              );
              break; // Stop trying to add if inventory is full
            }
          }
          quantityRemaining -= itemsActuallyAdded; // Update based on what was actually added
        }
      }

      if (quantityRemaining > 0 && itemToAdd.quantity > 0) {
        // Check itemToAdd.quantity to avoid warning if initial quantity was 0
        console.warn(
          `ADD_ITEM_TO_PLAYER_INVENTORY: Not all ${itemToAdd.itemId} were added. Remaining: ${quantityRemaining}. Inventory might be full.`
        );
      }

      console.log(
        "[Reducer] ADD_ITEM_TO_PLAYER_INVENTORY - New player inventory:",
        newInventory
      );
      return { ...state, playerInventory: newInventory };
    }
    case "REMOVE_ITEM_FROM_PLAYER_INVENTORY": {
      const { itemId, quantityToRemove } = action.payload;
      // console.log("[Reducer] REMOVE_ITEM_FROM_PLAYER_INVENTORY - Item ID:", itemId, "Qty:", quantityToRemove);
      let newInventory = [...state.playerInventory];
      let remainingToRemove = quantityToRemove;
      for (let i = newInventory.length - 1; i >= 0; i--) {
        if (newInventory[i].itemId === itemId) {
          if (newInventory[i].quantity > remainingToRemove) {
            newInventory[i] = {
              ...newInventory[i],
              quantity: newInventory[i].quantity - remainingToRemove,
            }; // Immutable update
            remainingToRemove = 0;
            break;
          } else {
            remainingToRemove -= newInventory[i].quantity;
            newInventory.splice(i, 1);
            if (remainingToRemove <= 0) break;
          }
        }
      }
      if (remainingToRemove > 0)
        console.warn(
          `Could not remove all ${itemId} from player. Short by ${remainingToRemove}`
        );
      // console.log("[Reducer] REMOVE_ITEM_FROM_PLAYER_INVENTORY - New player inventory:", newInventory);
      return { ...state, playerInventory: newInventory };
    }
    case "UPDATE_PLAYER_INVENTORY_ITEM": {
      const { itemId, updates } = action.payload;
      const newInventory = state.playerInventory.map((item) => {
        if (item.itemId === itemId) {
          return { ...item, ...updates };
        }
        return item;
      });

      console.log(
        `[Reducer] UPDATE_PLAYER_INVENTORY_ITEM for ${itemId} with`,
        updates,
        "New Inventory:",
        newInventory
      );
      return { ...state, playerInventory: newInventory };
    }
    case "ADD_ITEM_TO_STORAGE": {
      const { storageId, item: itemToAdd } = action.payload;
      const itemDefinition = ITEMS[itemToAdd.itemId];
      console.log(
        "[Reducer] ADD_ITEM_TO_STORAGE - StorageID:",
        storageId,
        "Item:",
        itemToAdd,
        "Def:",
        itemDefinition
      );

      if (
        !itemDefinition ||
        !state.storageInventories ||
        !state.storageInventories[storageId]
      ) {
        console.warn(
          `ADD_ITEM_TO_STORAGE: Invalid item definition or storage for ${itemToAdd.itemId} in ${storageId}`
        );
        return state;
      }

      // Create a new array for the specific storage's items
      const currentStorageArray = state.storageInventories[storageId]
        ? [...state.storageInventories[storageId]]
        : [];
      let quantityRemaining = itemToAdd.quantity;
      let itemWasStacked = false;

      if (itemDefinition.stackable) {
        for (let i = 0; i < currentStorageArray.length; i++) {
          if (currentStorageArray[i].itemId === itemToAdd.itemId) {
            // Found an existing stack.
            const spaceInStack =
              (itemDefinition.maxStack || Infinity) -
              currentStorageArray[i].quantity;
            const amountToStack = Math.min(quantityRemaining, spaceInStack);

            if (amountToStack > 0) {
              // ** CORRECTED IMMUTABLE UPDATE FOR EXISTING STACK **
              currentStorageArray[i] = {
                ...currentStorageArray[i], // Spread existing item properties
                quantity: currentStorageArray[i].quantity + amountToStack,
              };
              quantityRemaining -= amountToStack;
              itemWasStacked = true;
            }
            if (quantityRemaining <= 0) break; // All items stacked
          }
        }
      }

      // If items still remain (new stackable item, or non-stackable, or existing stacks were full)
      if (quantityRemaining > 0) {
        // For storage, we're not using MAX_STORAGE_SLOTS from the top level here.
        // Capacity for storage should be handled by individual storage configs if needed.
        // This logic assumes storage has enough slots for new item types or non-stackables.
        const itemsToAddAsNewEntries = itemDefinition.stackable
          ? 1
          : quantityRemaining;
        for (let i = 0; i < itemsToAddAsNewEntries; i++) {
          const quantityForThisEntry = itemDefinition.stackable
            ? quantityRemaining
            : 1;
          currentStorageArray.push({
            ...itemToAdd,
            quantity: quantityForThisEntry,
          });
          quantityRemaining -= quantityForThisEntry;
          if (quantityRemaining <= 0 && itemDefinition.stackable) break;
        }
      }

      if (quantityRemaining > 0 && itemToAdd.quantity > 0) {
        console.warn(
          `ADD_ITEM_TO_STORAGE: Not all ${itemToAdd.itemId} were added to ${storageId}. Remaining: ${quantityRemaining}.`
        );
      }

      const newStorageInventories = {
        ...state.storageInventories,
        [storageId]: currentStorageArray, // Assign the modified array
      };
      console.log(
        "[Reducer] ADD_ITEM_TO_STORAGE - New storage inventories:",
        newStorageInventories
      );
      return { ...state, storageInventories: newStorageInventories };
    }
    case "REMOVE_ITEM_FROM_STORAGE": {
      const { storageId, itemId, quantityToRemove } = action.payload;
      // console.log("[Reducer] REMOVE_ITEM_FROM_STORAGE - StorageID:", storageId, "ItemID:", itemId, "Qty to Remove:", quantityToRemove);

      if (!state.storageInventories || !state.storageInventories[storageId]) {
        console.warn(
          `REMOVE_ITEM_FROM_STORAGE: Storage ${storageId} not found.`
        );
        return state; // Return original state if storage doesn't exist
      }

      // Work on a mutable copy for processing, then create the final immutable state
      let newStorageContentForThisId = [...state.storageInventories[storageId]];
      let remainingToRemove = quantityToRemove;
      let itemActuallyFoundAndModified = false;

      // Loop as long as there are items to remove and we are finding them
      // We iterate from the end to safely use splice if needed
      for (let i = newStorageContentForThisId.length - 1; i >= 0; i--) {
        if (remainingToRemove <= 0) {
          break; // All requested items have been removed
        }

        if (newStorageContentForThisId[i].itemId === itemId) {
          itemActuallyFoundAndModified = true; // Mark that we found and are processing the item
          const currentStack = newStorageContentForThisId[i];

          if (currentStack.quantity > remainingToRemove) {
            // This stack has more than we need to remove. Reduce its quantity.
            // Create a new item object for immutability
            newStorageContentForThisId[i] = {
              ...currentStack,
              quantity: currentStack.quantity - remainingToRemove,
            };
            remainingToRemove = 0; // All done
            break; // Exit loop as we've removed all needed
          } else {
            // This stack has less than or equal to what we need. Remove this entire stack.
            remainingToRemove -= currentStack.quantity;
            newStorageContentForThisId.splice(i, 1); // Remove the item stack
            // Continue loop in case item is in other stacks and more needs to be removed
          }
        }
      }

      if (!itemActuallyFoundAndModified && quantityToRemove > 0) {
        console.warn(
          `REMOVE_ITEM_FROM_STORAGE: Item ${itemId} not found in storage ${storageId}.`
        );
        // No changes made, return original state or current state if other actions happened
        return state;
      }

      if (remainingToRemove > 0) {
        console.warn(
          `REMOVE_ITEM_FROM_STORAGE: Could not remove all ${itemId} from ${storageId}. Short by ${remainingToRemove}.`
        );
      }

      // Create the new overall storageInventories object
      const newStorageInventories = {
        ...state.storageInventories,
        [storageId]: newStorageContentForThisId, // Assign the modified array
      };

      console.log(
        "[Reducer] REMOVE_ITEM_FROM_STORAGE - Final updated storageInventories:",
        newStorageInventories
      );
      return { ...state, storageInventories: newStorageInventories };
    }

      case "UPDATE_PLAYER_STATUS_MODIFIERS": {
        const { modifiers, operation } = action.payload;

        const inventorySlotsMod = modifiers?.inventorySlot ?? 0;
        const speedMod = modifiers?.speed ?? 0;

        const updatedInventorySlots = state.maxInventorySlots + (operation === "add" ? inventorySlotsMod : -inventorySlotsMod);
        const updatedSpeed = state.playerSpeed + (operation === "add" ? speedMod : -speedMod);

        console.log("[Reducer] UPDATE_PLAYER_STATUS_MODIFIERS called");
        console.log("Operation:", operation);
        console.log("Modifiers:", modifiers);
        console.log("Old State:", {
          maxInventorySlots: state.maxInventorySlots,
          playerSpeed: state.playerSpeed,
        });
        console.debug("New State:", {
          maxInventorySlots: updatedInventorySlots,
          playerSpeed: updatedSpeed,
        });

        return {
          ...state,
          maxInventorySlots: updatedInventorySlots,
          playerSpeed: updatedSpeed,
        };
      }

      case "UNEQUIP_ITEM": {
        const { slot } = action.payload;
        return {
          ...state,
          playerEquipment: {
            ...state.playerEquipment,
            [slot]: null, // Keep the slot key but mark as unequipped
          },
        };
      }

      case "EQUIP_ITEM": {
      const {slot, item} = action.payload;
      return {...state,
        playerEquipment: {...state.playerEquipment,
            [slot]: item
        }
      }
    }
    case "ADVANCE_GAME_TIME_BY_DURATION": {
      const { duration } = action.payload; // duration in game minutes
      console.log(
        "[Reducer] ADVANCE_GAME_TIME_BY_DURATION - Advancing by:",
        duration,
        "minutes"
      );
      // This requires more complex time logic if you have days, hours, minutes separately
      // For simplicity, if gameTime is just total minutes:
      // const newGameTime = { ...state.gameTime, totalMinutes: (state.gameTime.totalMinutes || 0) + duration };
      // Or if it's { day, hour, minute }
      let newMinutes = (state.gameTime.minute || 0) + duration;
      let newHour = state.gameTime.hour || 0;
      let newDay = state.gameTime.day || 1;
      newHour += Math.floor(newMinutes / 60);
      newMinutes %= 60;
      newDay += Math.floor(newHour / 24);
      newHour %= 24;
      const newGameTime = {
        ...state.gameTime,
        day: newDay,
        hour: newHour,
        minute: newMinutes,
      };

      return { ...state, gameTime: newGameTime };
    }

    case "APPLY_ITEM_EFFECTS": {
      const { effects } = action.payload;
      const newPlayerStatus = { ...state.playerStatus };
      let effectsApplied = false;
      for (const [stat, value] of Object.entries(effects)) {
        if (Object.prototype.hasOwnProperty.call(newPlayerStatus, stat)) {
          // Assuming higher is better for happiness, energy, sleep, hygiene
          // And lower is better for hunger (e.g. hunger: -50 reduces hunger by 50)
          newPlayerStatus[stat] = Math.max(
            0,
            Math.min(100, (newPlayerStatus[stat] || 0) + value)
          ); // Clamp between 0-100
          effectsApplied = true;
        } else {
          console.warn(`[Reducer] APPLY_ITEM_EFFECTS: Unknown stat '${stat}'`);
        }
      }
      if (effectsApplied)
        console.log(
          "[Reducer] APPLY_ITEM_EFFECTS - New Player Status:",
          newPlayerStatus
        );
      return effectsApplied
        ? { ...state, playerStatus: newPlayerStatus }
        : state;
    }

    case "SET_PLAYER_BUSY_STATE": // General busy state
      return { ...state, isPlayerBusy: action.payload };

    case "SHOW_BUSY_INDICATOR":
      // payload: { type: 'thinking', sprite: 'DialogInfo.png' (or key), totalDuration: gameMins, realTimeMs: for_css_anim }
      return {
        ...state,
        isPlayerBusy: true,
        currentBusyIndicator: action.payload,
      };
    case "CLEAR_BUSY_INDICATOR":
      return { ...state, currentBusyIndicator: null }; // isPlayerBusy will be cleared by a separate action or activity completion logic

    case "SHOW_COMPLETION_EMOTE":
      // payload: { type: 'emote'/'item_reward', sprite: 'emote_happy.png'/'item_icon.png', duration: realTimeMs }
      return { ...state, currentCompletionEmote: action.payload };
    case "CLEAR_COMPLETION_EMOTE":
      return { ...state, currentCompletionEmote: null };
    case "START_PLAYER_ACTIVITY": {
      const { activityDataForState } = action.payload; // This object is prepared by useActivity
      console.log(
        "[Reducer] START_PLAYER_ACTIVITY, data for state:",
        activityDataForState
      );
      return {
        ...state,
        isPlayerBusy: true,
        currentActivityInProgress: activityDataForState, // Includes initial timeoutId (likely null)
        // currentBusyIndicator is no longer set here; PlayerBusyIndicator reacts to isPlayerBusy
        currentCompletionEmote: null,
        isInventoryModalOpen: false,
        isActivityModalOpen: false,
        isStorageModalOpen: false,
      };
    }
    case "UPDATE_ACTIVITY_TIMER_ID": {
      // payload: { startTimeMs, timeoutId }
      // Only update if the current activity in progress matches the one this timerId is for
      if (
        state.currentActivityInProgress &&
        state.currentActivityInProgress.startTimeMs ===
          action.payload.startTimeMs
      ) {
        console.log(
          `[Reducer] UPDATE_ACTIVITY_TIMER_ID for activity ${state.currentActivityInProgress.id} with timeoutId: ${action.payload.timeoutId}`
        );
        return {
          ...state,
          currentActivityInProgress: {
            ...state.currentActivityInProgress,
            timeoutId: action.payload.timeoutId,
          },
        };
      }
      console.warn(
        "[Reducer] UPDATE_ACTIVITY_TIMER_ID: No matching activity in progress or startTimeMs mismatch. Current:",
        state.currentActivityInProgress,
        "Payload:",
        action.payload
      );
      return state;
    }
    case "UPDATE_ACTIVITY_PROGRESS_AND_EFFECTS": {
      const { gameTimeIncrement, effectsTick } = action.payload;
      if (!state.currentActivityInProgress) return state;

      let newPlayerStatus = { ...state.playerStatus };
      if (effectsTick) {
        for (const [stat, value] of Object.entries(effectsTick)) {
          if (Object.prototype.hasOwnProperty.call(newPlayerStatus, stat)) {
            newPlayerStatus[stat] = Math.max(
              0,
              Math.min(100, (newPlayerStatus[stat] || 0) + value)
            );
          }
        }
      }
      let newGameTime = { ...state.gameTime };
      if (typeof gameTimeIncrement === "number" && gameTimeIncrement > 0) {
        let newMinutes = (state.gameTime.minute || 0) + gameTimeIncrement;
        let newHour = state.gameTime.hour || 0;
        let newDay = state.gameTime.day || 1;
        newHour += Math.floor(newMinutes / 60);
        newMinutes %= 60;
        newDay += Math.floor(newHour / 24);
        newHour %= 24;
        newGameTime = {
          ...state.gameTime,
          day: newDay,
          hour: newHour,
          minute: newMinutes,
        };
      }
      return {
        ...state,
        playerStatus: newPlayerStatus,
        gameTime: newGameTime,
        currentActivityInProgress: {
          ...state.currentActivityInProgress,
          gameTimeProgress:
            (state.currentActivityInProgress.gameTimeProgress || 0) +
            (gameTimeIncrement || 0),
        },
      };
    }
    case "SKIP_CURRENT_ACTIVITY": {
      const activity = state.currentActivityInProgress;
      if (!activity) return state;

      const totalDuration = activity.duration; // in minutes
      const elapsed = activity.gameTimeProgress || 0;
      const remaining = Math.max(0, totalDuration - elapsed);

      // Compute effects per minute
      const effects = activity.effects || {};
      const effectsPerMinute = {};
      for (const stat in effects) {
          if (Object.prototype.hasOwnProperty.call(effects, stat)) {
              effectsPerMinute[stat] = effects[stat] / totalDuration;
          }
      }

      // Compute remaining effects
      const remainingEffects = {};
      for (const stat in effectsPerMinute) {
          if (Object.prototype.hasOwnProperty.call(effectsPerMinute, stat)) {
              remainingEffects[stat] = effectsPerMinute[stat] * remaining;
          }
      }

      // Apply effects to player status
      const newPlayerStatus = { ...state.playerStatus };
      for (const stat in remainingEffects) {
          if (Object.prototype.hasOwnProperty.call(newPlayerStatus, stat)) {
              newPlayerStatus[stat] = Math.max(
                  0,
                  Math.min(100, (newPlayerStatus[stat] || 0) + remainingEffects[stat])
              );
          }
      }

      // Advance game time
      let newGameTime = { ...state.gameTime };
      let newMinutes = (newGameTime.minute || 0) + remaining;
      let newHour = newGameTime.hour || 0;
      let newDay = newGameTime.day || 1;

      newHour += Math.floor(newMinutes / 60);
      newMinutes %= 60;
      newDay += Math.floor(newHour / 24);
      newHour %= 24;

      newGameTime = {
          ...newGameTime,
          day: newDay,
          hour: newHour,
          minute: newMinutes,
      };

      return {
          ...state,
          playerStatus: newPlayerStatus,
          gameTime: newGameTime,
          currentActivityInProgress: null,
      };
  }
    case "COMPLETE_PLAYER_ACTIVITY": {
      console.log(
        "[Reducer] COMPLETE_PLAYER_ACTIVITY. Setting isPlayerBusy to false."
      );
      return {
        ...state,
        isPlayerBusy: false,
        currentActivityInProgress: null,
      };
    }
    default:
      return state;
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      <NotificationProvider>
        {children}
      </NotificationProvider>
    </GameContext.Provider>
  );
}
