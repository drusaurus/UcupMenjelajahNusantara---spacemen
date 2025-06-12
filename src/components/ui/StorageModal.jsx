// components/ui/StorageModal.jsx
"use client";

import React, {useEffect, useRef, useState} from 'react';
import { useGame } from '../../hooks/useGame';
import { ITEMS, ITEM_TYPES } from '../../constants/items';
import { useInventory } from "../../hooks/useInventory.js";
import { INNER_LOCATIONS_DETAILS } from '../../constants/locations';

// Helper function to get a display name for the storage
function getStorageDisplayName(currentAreaId, storageIdentifier) {
    const location = INNER_LOCATIONS_DETAILS[currentAreaId];
    if (currentAreaId && location && location.activityZones) {
        for (const zone of location.activityZones) {
            const activity = zone.activities.find(act => act.storageId === storageIdentifier);
            if (activity) {
                return activity.modalHeader || activity.name || storageIdentifier.replace(/_/g, ' ');
            }
        }
    }
    return storageIdentifier ? storageIdentifier.replace(/_/g, ' ') : "Storage";
}

export default function StorageModal({ isOpen, onClose, storageId }) {
    const { currentArea, dispatch } = useGame();
    const {
        playerInventory,
        storageInventories,
        moveItemPlayerToStorage,
        moveItemStorageToPlayer,
        removeItemFromPlayer,
        removeItemFromStorage,
        equipItem,
        activeStorageId
    } = useInventory();

    const [actionTarget, setActionTarget] = useState(null); // Will store { itemInstance, itemDef, sourceType, itemRect }
    const actionPanelRef = useRef(null);
    const [actionPanelStyle, setActionPanelStyle] = useState({});

    useEffect(() => {
        if (!isOpen || !storageId || (currentArea && !INNER_LOCATIONS_DETAILS[currentArea])) {
            setActionTarget(null);
        }
    }, [isOpen, storageId, currentArea]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (actionPanelRef.current && !actionPanelRef.current.contains(event.target)) {
                const clickedOnItem = event.target.closest('li[data-item-id]');
                if (!clickedOnItem) {
                    setActionTarget(null);
                }
            }
        }
        if (actionTarget && isOpen && storageId) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [actionTarget, isOpen, storageId]);

    useEffect(() => {
        if (actionTarget && actionTarget.itemRect && actionPanelRef.current) {
            const panel = actionPanelRef.current;
            const itemRect = actionTarget.itemRect; // Bounding rect of the clicked <li>
            const panelWidth = panel.offsetWidth;
            const panelHeight = panel.offsetHeight;

            // Attempt to position the panel to the right of the item, vertically centered
            let newTop = itemRect.top + (itemRect.height / 2) - (panelHeight / 2);
            let newLeft = itemRect.right + 10; // 10px to the right of the item

            // Adjust if it goes off the right edge of the viewport
            if (newLeft + panelWidth > window.innerWidth - 10) { // 10px buffer
                newLeft = itemRect.left - panelWidth - 10; // Position to the left
            }
            // Adjust if it goes off the left edge
            if (newLeft < 10) {
                newLeft = 10;
            }

            // Adjust if it goes off the top/bottom edge of the viewport
            if (newTop < 10) {
                newTop = 10; // Min 10px from top
            } else if (newTop + panelHeight > window.innerHeight - 10) {
                // Try to position above if not enough space below
                const spaceAbove = itemRect.top - panelHeight - 10;
                if (spaceAbove > 10) { // Check if there's enough space above
                    newTop = spaceAbove;
                } else { // Otherwise, cap at bottom
                    newTop = window.innerHeight - panelHeight - 10;
                }
            }

            setActionPanelStyle({
                position: 'fixed',
                top: `${newTop}px`,
                left: `${newLeft}px`,
                zIndex: 50, // Ensure it's above the modal overlay (z-40) and modal panel
            });
        } else {
            setActionPanelStyle({}); // Reset style if no target
        }
    }, [actionTarget]);

    if (!isOpen || !storageId) {
        return null;
    }

    const displayName = getStorageDisplayName(currentArea, storageId);
    const currentStorageItems = storageInventories?.[storageId] || [];

    const handleItemClick = (itemInstance, itemDef, sourceType, event) => {
        event.stopPropagation();
        const itemElementRect = event.currentTarget.getBoundingClientRect();
        // Always set actionTarget when an item is clicked to show the panel
        setActionTarget({
            itemInstance,
            itemDef,
            sourceType,
            itemRect: itemElementRect // Store the item's DOMRect
        });
    };

    const handleCloseAttemptAndClearActionTarget = () => {
        setActionTarget(null);
        onClose();
    };

    const handleConsumeAction = () => {
        if (!actionTarget) return;
        const { itemInstance, itemDef, sourceType } = actionTarget;

        if (sourceType === 'player') {
            removeItemFromPlayer(itemInstance.itemId, 1);
        } else {
            removeItemFromStorage(storageId, itemInstance.itemId, 1);
        }

        if (itemDef.effects) {
            dispatch({ type: "APPLY_ITEM_EFFECTS", payload: { effects: itemDef.effects } });
        }
        if (itemDef.consumeDuration) {
            dispatch({ type: "ADVANCE_GAME_TIME_BY_DURATION", payload: { duration: itemDef.consumeDuration } });
        }

        setActionTarget(null);
        // Keeping modal open after consuming, user can close manually if preferred
        // onClose(); // Uncomment if you want the modal to close after consuming
    };

    const handleTransferAction = (quantityToTransfer) => {
        if (!actionTarget) return;
        const { itemInstance, sourceType } = actionTarget;
        const amount = quantityToTransfer || 1; // Default to 1 if no quantity specified

        if (sourceType === 'player') {
            moveItemPlayerToStorage(itemInstance.itemId, amount, storageId);
        } else {
            moveItemStorageToPlayer(storageId, itemInstance.itemId, amount);
        }
        setActionTarget(null);
    };

    const handleTransferAllAction = () => {
        if (!actionTarget) return;
        handleTransferAction(actionTarget.itemInstance.quantity);
    };

    const handlePanelClick = (e) => {
        e.stopPropagation();
    };

    const handleEquipItem = () => {
        if (!actionTarget) return;
        setActionTarget(null)
        equipItem(actionTarget.itemInstance, "storage");
    }

    const renderInventoryList = (items, type) => {
        if (!items || items.length === 0) {
            return <p className="text-neutral-500 text-sm italic py-4 text-center">Empty</p>;
        }
        return (
            <ul className="space-y-2 max-h-[250px] md:max-h-[300px] lg:max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                {items.map((itemInst, idx) => {
                    const itemDef = ITEMS[itemInst.itemId];
                    if (!itemDef) {
                        return (
                            <li key={`${type}-${itemInst.itemId}-${idx}-unknown`}
                                data-item-id={itemInst.itemId}
                                className="flex items-center p-2 bg-neutral-700 rounded text-red-400">
                                Unknown Item ({itemInst.itemId})
                            </li>
                        );
                    }
                    const title = `Actions for ${itemDef.name}`; // Title will always be for actions now
                    return (
                        <li
                            key={`${type}-${itemInst.itemId}-${idx}`}
                            data-item-id={itemInst.itemId}
                            className="flex items-center p-2 bg-neutral-700/80 hover:bg-neutral-600/90 rounded-md cursor-pointer transition-colors duration-150 ease-in-out"
                            title={title}
                            onClick={(e) => handleItemClick(itemInst, itemDef, type, e)}
                        >
                            <img src={itemDef.sourcePath} alt={itemDef.name} className="w-10 h-10 object-contain pixelated mr-3 flex-shrink-0 border border-neutral-600 rounded-sm bg-neutral-800" onError={(e) => { e.currentTarget.style.display = 'none'; const placeholder = e.currentTarget.nextSibling; if (placeholder && placeholder.style) placeholder.style.display = 'flex'; }}/>
                            <div className="hidden w-10 h-10 bg-neutral-600 items-center justify-center text-neutral-500 mr-3 flex-shrink-0 rounded-sm">?</div>
                            <div className="flex-grow overflow-hidden">
                                <p className="text-sm font-medium text-neutral-100 truncate">{itemDef.name}</p>
                                {itemDef.description && <p className="text-xs text-neutral-400 flex-wrap">{itemDef.description}</p>}
                            </div>
                            {itemInst.quantity > 0 && (<span className="ml-2 text-xs font-semibold text-yellow-200 px-2 py-0.5 rounded-full">x{itemInst.quantity}</span>)}
                        </li>
                    );
                })}
            </ul>
        );
    };

    return (
        <>
            {/* Main Modal Structure (as per your provided code) */}
            {isOpen && storageId && (
                <div
                    className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-4 transition-opacity duration-300 ease-in-out"
                    onClick={handleCloseAttemptAndClearActionTarget}
                    aria-hidden={!isOpen}
                >
                    <div
                        className="bg-neutral-800 text-white p-5 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] min-h-[60vh] flex flex-col border border-neutral-700 overflow-y-auto custom-scrollbar relative"
                        onClick={handlePanelClick}
                    >
                        {/* Header (from your code) */}
                        <div className="flex justify-between items-center mb-4 flex-shrink-0">
                            <h3 className="text-xl font-bold capitalize">{displayName}</h3>
                            <button onClick={handleCloseAttemptAndClearActionTarget} className="text-neutral-400 hover:text-white text-2xl leading-none p-1 rounded-full hover:bg-neutral-700 transition-colors" aria-label="Close modal">&times;</button>
                        </div>
                        {/* Body (from your code) */}
                        <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4 min-h-0">
                            <div className="border border-neutral-700 p-3 rounded-md flex flex-col min-h-0">
                                {/*<h4 className="text-lg font-semibold mb-3 text-green-400 capitalize flex-shrink-0">{displayName}</h4>*/}
                                <div className="flex-grow overflow-y-scroll relative">{renderInventoryList(currentStorageItems, 'storage')}</div>
                            </div>
                            <div className="border border-neutral-700 p-3 rounded-md flex flex-col min-h-0">
                                <h4 className="text-lg font-semibold mb-3 text-amber-200 flex-shrink-0">Backpack</h4>
                                <div className="flex-grow overflow-y-scroll relative">{renderInventoryList(playerInventory, 'player')}</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Action Panel - Uses fixed positioning based on itemRect and your provided classes */}
            {actionTarget && (
                <div
                    ref={actionPanelRef}
                    className="p-3 bg-transparent border-none rounded-lg flex flex-col md:flex-row items-center justify-center space-y-1 md:space-y-0 md:space-x-1" // Your requested classes
                    style={{
                        ...actionPanelStyle, // Contains position:fixed, top, left, zIndex
                        // Added some visible styling as bg-transparent/border-none would be invisible
                        backdropFilter: 'blur(4px)',
                        border: '1px solid rgba(120, 120, 150, 0.6)',
                        borderRadius: '8px', // Overrides rounded-lg from className if you want specific px
                        padding: '10px',    // Overrides p-3 from className if you want specific px
                        boxShadow: '0 5px 15px rgba(0,0,0,0.4)',
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/*{actionTarget.itemDef.type === ITEM_TYPES.FOOD &&(*/}
                    {/*    <button onClick={handleConsumeAction} className="px-4 py-1.5 text-xs font-medium text-white bg-green-600 hover:bg-green-700 rounded-md focus:outline-none focus:ring-2 cursor-pointer focus:ring-green-500 w-full md:w-auto">Consume</button>*/}
                    {/*)}*/}
                    <button onClick={() => handleTransferAction(1)} className="px-4 py-1.5 text-xs font-medium text-white bg-sky-600 hover:bg-sky-700 rounded-md focus:outline-none focus:ring-2 cursor-pointer focus:ring-sky-500 w-full md:w-auto">Transfer</button>
                    {actionTarget.itemInstance.quantity > 1 && actionTarget.itemDef.stackable &&
                        <button onClick={handleTransferAllAction} className="px-4 py-1.5 text-xs font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-md focus:outline-none focus:ring-2 cursor-pointer focus:ring-sky-500 w-full md:w-auto">Transfer All</button>
                    }
                    {actionTarget.itemDef.type === ITEM_TYPES.EQUIPMENT && (
                        <button onClick={handleEquipItem} className="px-4 py-1.5 text-xs font-medium text-white bg-sky-600 hover:bg-sky-700 rounded-md focus:outline-none focus:ring-2 cursor-pointer focus:ring-sky-500 w-full md:w-auto">Equip</button>
                    )}
                </div>
            )}
        </>
    );
}
