"use client";

import {useCallback, useContext} from "react";
import {GameContext} from "../contexts/GameContext"; // Adjust path to your GameContext
import {ITEM_TYPES, ITEMS} from "../constants/items"; // To access item definitions
import Emotes from "../constants/emotes.js";
import {BASE_PLAYER_INVENTORY} from "../constants/gameState.js";
import {useGame} from "./useGame.js";

export function useInventory() {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error("useInventory must be used within a GameProvider");
    }
    const { state, dispatch } = context;
    // Destructure states needed by this hook
    const { playerInventory,
        storageInventories,
        isInventoryModalOpen,
        isStorageModalOpen,
        activeStorageId,
        maxInventorySlots,
        playerEquipment,
        playerSpeed,
        isShopModalOpen,
        activeShopId,
        playerStatus
    } = state;
    
    const { updatePlayerStatus } = useGame();

    const checkSlot = useCallback((itemToAdd) => {
        const existingItem = playerInventory.find((invItem) => invItem.itemId === itemToAdd.itemId);

        if (itemToAdd.stackable) {
            if (existingItem) {
                return true;
            } else {
                return playerInventory.length + 1 <= maxInventorySlots;
            }
        } else {
            return playerInventory.length + itemToAdd.quantity <= maxInventorySlots;
        }
    }, [maxInventorySlots, playerInventory])

    // --- Player Inventory Functions ---
    const addItemToPlayer = useCallback((itemToAdd) => {
        if (!itemToAdd || !itemToAdd.itemId || typeof itemToAdd.quantity !== 'number' || itemToAdd.quantity <= 0) {
            console.error("[InventoryHook] addItemToPlayer: Invalid item data.", itemToAdd);
            return;
        }
        // console.log("[InventoryHook] Dispatching ADD_ITEM_TO_PLAYER_INVENTORY, Item:", JSON.parse(JSON.stringify(itemToAdd)));
        dispatch({ type: "ADD_ITEM_TO_PLAYER_INVENTORY", payload: { item: { ...itemToAdd } } });
    }, [dispatch]);

    const removeItemFromPlayer = useCallback((itemId, quantityToRemove) => {
        if (!itemId || typeof quantityToRemove !== 'number' || quantityToRemove <= 0) {
            console.error("removeItemFromPlayer: Invalid parameters.", { itemId, quantityToRemove });
            return;
        }
        dispatch({ type: "REMOVE_ITEM_FROM_PLAYER_INVENTORY", payload: { itemId, quantityToRemove } });
    }, [dispatch]);

    const getPlayerItemInstance = useCallback((itemId) => {
        return playerInventory?.find(item => item.itemId === itemId);
    }, [playerInventory]);

    const countPlayerItem = useCallback((itemId) => {
        if (!playerInventory) return 0;
        let count = 0;
        for (const item of playerInventory) {
            if (item.itemId === itemId) {
                count += item.quantity;
            }
        }
        return count;
    }, [playerInventory]);

    // --- Storage Inventory Functions ---
    const addItemToStorage = useCallback((storageId, itemToAdd) => {
        // ... (add logs similarly if debugging player -> storage)
        if (!storageId || !itemToAdd || !itemToAdd.itemId || typeof itemToAdd.quantity !== 'number' || itemToAdd.quantity <= 0) {
            console.error("addItemToStorage: Invalid parameters.", { storageId, itemToAdd });
            return;
        }
        console.log("dispatch({ type: \"ADD_ITEM_TO_STORAGE\", payload: ", { storageId, item: { ...itemToAdd } }, " });")
        dispatch({ type: "ADD_ITEM_TO_STORAGE", payload: { storageId, item: { ...itemToAdd } } });
    }, []);

    const removeItemFromStorage = useCallback((storageId, itemId, quantityToRemove) => {
        if (!storageId || !itemId || typeof quantityToRemove !== 'number' || quantityToRemove <= 0) {
            console.error("[InventoryHook] removeItemFromStorage: Invalid parameters.", { storageId, itemId, quantityToRemove });
            return;
        }
        console.log("[InventoryHook] Dispatching REMOVE_ITEM_FROM_STORAGE, StorageID:", storageId, "ItemID:", itemId, "QtyToRemove:", quantityToRemove);
        dispatch({ type: "REMOVE_ITEM_FROM_STORAGE", payload: { storageId, itemId, quantityToRemove } });
    }, [dispatch]);

    const getStorageContents = useCallback((storageId) => {
        return storageInventories?.[storageId] || [];
    }, [storageInventories]);

    const getStorageItemInstance = useCallback((storageId, itemId) => {
        const storage = storageInventories?.[storageId];
        return storage?.find(item => item.itemId === itemId);
    }, [storageInventories]);

    // --- Helper to extract instance-specific data ---
    const getInstanceSpecificData = (itemInstance) => {
        if (!itemInstance) return {};
        const { itemId, quantity, ...rest } = itemInstance; // Exclude itemId and quantity
        return rest; // Returns object with properties like { currentDurability: X, uses: Y }
    };

    // --- Combined Item Transfer Functions ---
    const moveItemPlayerToStorage = useCallback((itemId, quantityToMove, storageId) => {
        console.log(`[InventoryHook] moveItemPlayerToStorage: Attempting to move ${quantityToMove} of "${itemId}" to storage "${storageId}".`);

        const itemDef = ITEMS[itemId];
        if (!itemDef) {
            console.error(`[InventoryHook] moveItemPlayerToStorage: Item definition for "${itemId}" not found.`);
            return false; // Indicate failure
        }
        console.log(`[InventoryHook] Item Definition for "${itemId}":`, itemDef);

        // Determine the actual quantity to move (1 for non-stackable, requested for stackable)
        const actualQuantityToMove = itemDef.stackable ? quantityToMove : 1;
        console.log(`[InventoryHook] Item is ${itemDef.stackable ? "stackable" : "not stackable"}. Actual quantity to move: ${actualQuantityToMove}.`);

        const currentItemCountInPlayerInv = countPlayerItem(itemId);
        console.log(`[InventoryHook] Player has ${currentItemCountInPlayerInv} of "${itemId}".`);

        if (currentItemCountInPlayerInv < actualQuantityToMove) {
            console.warn(`[InventoryHook] Player does not have enough of "${itemId}" to move. Has: ${currentItemCountInPlayerInv}, Needs: ${actualQuantityToMove}. Transfer aborted.`);
            // Optionally, dispatch a UI notification to the player here
            return false; // Indicate failure
        }

        // Get instance-specific data (e.g., durability, uses) from the player's item
        // to ensure it's preserved during the transfer.
        const playerItemInstance = getPlayerItemInstance(itemId);
        const instanceData = getInstanceSpecificData(playerItemInstance);
        console.log(`[InventoryHook] Instance data from player's item "${itemId}":`, JSON.parse(JSON.stringify(instanceData)));

        const itemDataToStore = {
            itemId,
            quantity: actualQuantityToMove,
            ...instanceData // Spread instance-specific data onto the item being added to storage
        };
        console.log(`[InventoryHook] Prepared itemData to add to storage:`, JSON.parse(JSON.stringify(itemDataToStore)));

        // Perform the actions: remove from player, then add to storage.
        // The reducers for these actions will handle the actual state updates.
        removeItemFromPlayer(itemId, actualQuantityToMove);
        addItemToStorage(storageId, itemDataToStore);

        console.log(`[InventoryHook] moveItemPlayerToStorage: Successfully initiated transfer of ${actualQuantityToMove} of "${itemId}" from player to "${storageId}".`);
        return true; // Indicate success
    }, [countPlayerItem, getPlayerItemInstance, removeItemFromPlayer, addItemToStorage]); // Added ITEMS to dependencies as itemDef relies on it


    const moveItemStorageToPlayer = useCallback((storageId, itemId, quantityToMove) => {
        console.log(`[InventoryHook] moveItemStorageToPlayer CALLED with: storageId=${storageId}, itemId=${itemId}, quantityToMove=${quantityToMove}`);

        const itemDef = ITEMS[itemId];
        if (!itemDef) {
            console.error(`[InventoryHook] moveItemStorageToPlayer: Item definition for "${itemId}" not found.`);
            return false;
        }
        console.log(`[InventoryHook] ItemDef for "${itemId}":`, itemDef);

        const storageContents = getStorageContents(storageId);
        let currentQuantityInStorage = 0;
        storageContents.forEach(item => { if (item.itemId === itemId) currentQuantityInStorage += item.quantity; });
        console.log(`[InventoryHook] Current quantity of "${itemId}" in storage "${storageId}": ${currentQuantityInStorage}`);

        const actualQuantityToMove = itemDef.stackable ? quantityToMove : 1;
        console.log(`[InventoryHook] Calculated actualQuantityToMove: ${actualQuantityToMove} (stackable: ${itemDef.stackable})`);

        if (currentQuantityInStorage < actualQuantityToMove) {
            console.warn(`[InventoryHook] Storage "${storageId}" does not have ${actualQuantityToMove} of "${itemId}". Has: ${currentQuantityInStorage}. Transfer aborted.`);
            return false;
        }

        const storageItemInstance = getStorageItemInstance(storageId, itemId);
        console.log(`[InventoryHook] Instance of "${itemId}" from storage:`, JSON.parse(JSON.stringify(storageItemInstance || {})));
        const instanceData = getInstanceSpecificData(storageItemInstance);
        const itemDataForPlayer = { itemId, quantity: actualQuantityToMove, ...instanceData };
        console.log(`[InventoryHook] Prepared itemDataForPlayer:`, JSON.parse(JSON.stringify(itemDataForPlayer)));

        console.log("removeItemFromStorage(storageId, itemId, actualQuantityToMove): storageId: ", storageId, "itemId: ", itemId, "actualQuantityToMove:", actualQuantityToMove);
        removeItemFromStorage(storageId, itemId, actualQuantityToMove); // This will log its dispatch

        console.log("addItemToPlayer(itemDataForPlayer): itemDataForPlayer:", JSON.parse(JSON.stringify(itemDataForPlayer)));
        addItemToPlayer(itemDataForPlayer); // This will log its dispatch


        console.log(`[InventoryHook] moveItemStorageToPlayer: Successfully initiated transfer of ${actualQuantityToMove} of "${itemId}" from "${storageId}" to player.`);
        return true;

    }, [addItemToPlayer, getStorageContents, getStorageItemInstance, removeItemFromStorage]);

    // --- Modal Control Functions (from your original hook) ---
    const openInventoryModal = useCallback(() => {
        dispatch({type: "OPEN_INVENTORY_MODAL"})
    }, [dispatch]);

    const closeInventoryModal = useCallback(() => {
        dispatch({type: "CLOSE_INVENTORY_MODAL"})
    }, [dispatch]);

    const openStorageModal = useCallback((storageId) => {
        dispatch({ type: "OPEN_STORAGE_MODAL", payload: storageId });
    }, [dispatch]);

    const closeStorageModal = useCallback(() => {
        // console.log("useInventory: closeStorageModal function called, dispatching CLOSE_STORAGE_MODAL"); // Kept your log for consistency
        dispatch({ type: "CLOSE_STORAGE_MODAL" });
    }, [dispatch]);

    const openShopModal = useCallback((shopId) => {
        dispatch({ type: "OPEN_SHOP_MODAL", payload: shopId });
    }, [dispatch]);

    const closeShopModal = useCallback(() => {
        dispatch({ type: "CLOSE_SHOP_MODAL" });
    }, [dispatch]);

    const consumeItem = useCallback((itemInstance) => {
        if (!itemInstance || !itemInstance.itemId || state.isPlayerBusy) { return; }
        const itemDef = ITEMS[itemInstance.itemId];
        if (!itemDef || itemDef.type !== ITEM_TYPES.FOOD) { return; }

        closeInventoryModal(); // Close inventory first

        const gameTimeDuration = itemDef.consumeDuration || 0.1;
        const realTimeAnimationMs = gameTimeDuration * 1000;

        setTimeout(() => {
            removeItemFromPlayer(itemInstance.itemId, 1);
            if (itemDef.effects) dispatch({ type: "APPLY_ITEM_EFFECTS", payload: { effects: itemDef.effects } });
            dispatch({ type: "SHOW_COMPLETION_EMOTE", payload: { type: 'item_consumed', sprite: Emotes.emote_satisfied, duration: 2000 } });
            setTimeout(() => {
                dispatch({ type: "CLEAR_COMPLETION_EMOTE" });
                dispatch({ type: "SET_PLAYER_BUSY_STATE", payload: false });
            }, 2000);
        }, realTimeAnimationMs);
    }, [closeInventoryModal, dispatch, removeItemFromPlayer, state.isPlayerBusy]);

    const updatePlayerItemInstance = useCallback((itemId, updates) => {
        if (!itemId || typeof updates !== 'object' || Object.keys(updates).length === 0) {
            console.error("[InventoryHook] updatePlayerItemInstance: Invalid parameters.", { itemId, updates });
            return;
        }

        console.log("[InventoryHook] Dispatching UPDATE_PLAYER_ITEM_INSTANCE, ItemID:", itemId, "Updates:", updates);
        dispatch({ type: "UPDATE_PLAYER_INVENTORY_ITEM", payload: { itemId, updates } });

    }, [dispatch])

    const equipItem = useCallback((itemInstance, source="inventory") => {
        if (!itemInstance || !itemInstance.itemId) {
            console.error("[InventoryHook] equipItem: Invalid itemInstance", itemInstance);
            return;
        }

        const itemDef = ITEMS[itemInstance.itemId];
        if (!itemDef || itemDef.type !== ITEM_TYPES.EQUIPMENT || !itemDef.equipmentSlot) {
            console.warn("[InventoryHook] equipItem: Not an equippable item", itemInstance.itemId);
            return;
        }

        const slot = itemDef.equipmentSlot;
        const currentEquipped = playerEquipment[slot];
        const newModifier = itemDef.modifiers || {};
        const currentModifiers = currentEquipped?.modifiers || {};

        const itemToEquip = { ...itemInstance };

        const unequipAndStore = (equippedItem) => {
            addItemToPlayer({
                itemId: equippedItem.itemId,
                quantity: 1,
                ...getInstanceSpecificData(equippedItem)
            })

            if(ITEMS[equippedItem.itemId]?.modifiers) {
                dispatch({
                    type: "UPDATE_PLAYER_STATUS_MODIFIERS",
                    payload: {
                        modifiers: currentModifiers, operation: "subtract"
                    }
                })
            }

            dispatch({ type: "UNEQUIP_ITEM", payload: { slot } });
        }

    // Case 1: Slot is used
        if (currentEquipped) {
            const isBagSlot = slot === "bag";

        // Case 2: if the slot is the bag slot
            if (isBagSlot) {
                const currentBag = ITEMS[currentEquipped.itemId];
                const newSlots = BASE_PLAYER_INVENTORY + (itemDef?.modifiers?.inventorySlot ?? 0);

                const currentInventoryCount = playerInventory.length;
                const projectedInventoryCount = source === "storage" ? currentInventoryCount + 1 : currentInventoryCount;

                if(newSlots < projectedInventoryCount) {
                    console.warn("[InventoryHook] equipItem: Not enough inventory space to switch to smaller bag");
                    return;
                }

                unequipAndStore(currentEquipped)

                dispatch({
                    type: "UPDATE_PLAYER_STATUS_MODIFIERS",
                    payload: {
                        modifiers: newModifier,
                        operation: "add"
                    }
                });
            }
            // case 3: non-bag slot, directly swap
            else {
                unequipAndStore(currentEquipped);

                dispatch({
                    type: "UPDATE_PLAYER_STATUS_MODIFIERS",
                    payload: {
                        modifiers: newModifier,
                        operation: "add"
                    }
                });
            }
        } else {
            dispatch({
                type: "UPDATE_PLAYER_STATUS_MODIFIERS",
                payload: {
                    modifiers: newModifier,
                    operation: "add"
                }
            });
        }

        dispatch({
            type: "EQUIP_ITEM",
            payload:{
                slot, item: itemToEquip
            }
        })

        // Remove item from its source
        if (source === "inventory") {
            removeItemFromPlayer(itemInstance.itemId, 1 );
        } else if (source === "storage") {
            if (!state.activeStorageId) {
                console.error("[InventoryHook] equipItem: No activeStorageId while equipping from storage");
                return;
            }

            removeItemFromStorage(state.activeStorageId,
                itemInstance.itemId,
                1)
            // dispatch({
            //     type: "REMOVE_ITEM_FROM_STORAGE",
            //     payload: {
            //         storageId: state.activeStorageId,
            //         itemId: itemInstance.itemId,
            //         quantity: 1
            //     }
            // });
        }

    }, [addItemToPlayer, dispatch, playerEquipment, playerInventory.length, removeItemFromPlayer, removeItemFromStorage, state.activeStorageId]);

    const unequipItem = useCallback((slot) => {
        const currentlyEquippedItem = playerEquipment?.[slot];
        if (!currentlyEquippedItem) {
            console.warn("[InventoryHook] unequipItem: No item equipped in this slot.", slot);
            return;
        }

        const itemDef = ITEMS[currentlyEquippedItem.itemId];
        const modifiers = itemDef?.modifiers;

        // 1. Remove from equipped items
        dispatch({ type: "UNEQUIP_ITEM", payload: { slot } });

        // 2. Subtract any modifiers
        if (modifiers) {
            dispatch({
                type: "UPDATE_PLAYER_STATUS_MODIFIERS",
                payload: {
                    modifiers,
                    operation: "subtract",
                },
            });
        }

        // 3. Add the item back to player inventory
        addItemToPlayer({ itemId: currentlyEquippedItem.itemId, quantity: 1 });
    }, [playerEquipment, addItemToPlayer, dispatch]);

    const buyItem = useCallback((itemDef) => {
        if(!checkSlot(itemDef)) {
            console.warn("[InventoryHook] buyItem: Inventory capacity not enough.");
            return;
        }

    //     check the price if purchasable
        if(itemDef.price * itemDef.quantity > playerStatus.money) {
            console.warn("[InventoryHook] buyItem: Not enough money to buy this item", itemDef.price, playerStatus.money);
            return;
        }

        const newItems = [...state.playerInventory];
        const itemIndex = newItems.findIndex(item => item.itemId === itemDef.itemId);
        
        console.log("item Bought: ", itemDef);
        console.log("itemIndex: ", itemIndex);
        console.log("newItems: ", newItems);

        updatePlayerStatus({money: playerStatus.money - (itemDef.price * itemDef.quantity)});
        dispatch({ type: "ADD_ITEM_TO_PLAYER_INVENTORY", payload: { item:{ itemId: itemDef.itemId, quantity: itemDef.quantity} } });
    }, [checkSlot, dispatch, playerStatus.money, state.playerInventory])

    const sellItem = useCallback((itemId, quantity, price) => {
        if (!itemId || typeof quantity !== 'number' || quantity <= 0 || typeof price !== 'number' || price <= 0) {
            console.error("[InventoryHook] sellItem: Invalid parameters.", { itemId, quantity, price });
        }
        removeItemFromPlayer(itemId, quantity);

        dispatch({type: "UPDATE_PLAYER_STATUS", payload: {money: playerStatus.money + (price)}});

    }, [dispatch, playerStatus.money, removeItemFromPlayer])

    return {
        // Inventory State
        playerInventory,
        storageInventories,
        maxInventorySlots,
        playerEquipment: state.playerEquipment,

        // Player Inventory Actions
        addItemToPlayer,    // Renamed from your addItemToInventory for consistency
        removeItemFromPlayer, // Renamed from your removeItemFromInventory
        countPlayerItem,    // Replaces/enhances hasPlayerItem
        getPlayerItemInstance,

        // Storage Inventory Actions
        getStorageContents,
        addItemToStorage,
        removeItemFromStorage,
        getStorageItemInstance,
        updatePlayerItemInstance,

        // Combined Transfer Actions
        moveItemPlayerToStorage,
        moveItemStorageToPlayer,

        // Modal State & Control (from your original hook)
        isInventoryModalOpen,
        isStorageModalOpen,
        isShopModalOpen,
        activeStorageId,
        activeShopId,
        openInventoryModal,
        closeInventoryModal,
        openStorageModal,
        closeStorageModal,
        openShopModal,
        closeShopModal,

        consumeItem,

        equipItem,
        unequipItem,
        buyItem,
        sellItem
    };
}
