// components/ui/PlayerInventoryModal.jsx
"use client";

import React, { useState, useEffect } from 'react';
import { useGame } from '../../hooks/useGame'; // Assuming useGame provides these, adjust if needed
import { ITEMS, ITEM_TYPES } from '../../constants/items';
import { useInventory } from "../../hooks/useInventory.js";

export default function InventoryModal() {
    const {
        isInventoryModalOpen,
        closeInventoryModal,
        playerInventory = [],
        maxInventorySlots, // This should come from useGame if it's a global player stat
        consumeItem,
        equipItem,
        sellItem
    } = useInventory(); // User is getting these from useInventory

    // If maxInventorySlots is a global player stat, get it from useGame
    // const { maxInventorySlots: globalMaxSlots } = useGame();
    // const actualMaxSlots = maxInventorySlots || globalMaxSlots || 'N/A';


    const [selectedItemInstance, setSelectedItemInstance] = useState(null);
    const [selectedItemDef, setSelectedItemDef] = useState(null);
    const [confirmAction, setConfirmAction] = useState(null);
    const [confirmMessage, setConfirmMessage] = useState('');
    const [confirmTitle, setConfirmTitle] = useState('');

    useEffect(() => {
        if (!isInventoryModalOpen) {
            setSelectedItemInstance(null);
            setSelectedItemDef(null);
        }
    }, [isInventoryModalOpen]);

    useEffect(() => {
        if (selectedItemInstance) {
            setSelectedItemDef(ITEMS[selectedItemInstance.itemId]);
        } else {
            setSelectedItemDef(null);
        }
    }, [selectedItemInstance]);


    if (!isInventoryModalOpen) {
        return null;
    }

    const handlePanelClick = (e) => {
        e.stopPropagation();
    };

    const handleItemClick = (itemInstance) => {
        setSelectedItemInstance(itemInstance);
        // setSelectedItemDef(itemDef); // This is now handled by the useEffect above
    };

    const handleItemConsume = () => {
        if (selectedItemInstance && consumeItem) {
            consumeItem(selectedItemInstance);
        }
    }

    const handleItemEquip = () => {
        if(selectedItemInstance && equipItem) {
            equipItem(selectedItemInstance);
        }
    }

    const closeConfirmModal = () => {
        setConfirmAction(null);
        setConfirmMessage('');
        setConfirmTitle('');
    };

    const handleItemSell = (quantity = 1, price) => {
        sellItem(selectedItemInstance.itemId, quantity, price);
        setSelectedItemInstance(null);
        setSelectedItemDef(null);

        closeConfirmModal();
    }

    const triggerConfirmSell = (isSellAll = false) => {
        const sellPrice = Math.ceil(
            selectedItemDef.price *
            (isSellAll ? selectedItemInstance.quantity : 1) *
            (selectedItemDef.type === ITEM_TYPES.COLLECTABLE ? 1 : 0.75)
        );

        setConfirmTitle(isSellAll ? 'Confirm Sell All' : 'Confirm Sell');
        setConfirmMessage(`Are you sure you want to sell ${isSellAll ? 'all' : 'one'} "${selectedItemDef.name}" for ${sellPrice} coins?`);
        setConfirmAction(() => () => {
            handleItemSell(isSellAll ? selectedItemInstance.quantity : 1, sellPrice);
        });
    }


    const filledSlots = playerInventory.length;
        const capacityText = `${filledSlots} / ${maxInventorySlots || 'N/A'}`;

    const renderItemDetails = () => {
        if (!selectedItemInstance || !selectedItemDef) {
            return (
                <div className="flex-grow flex items-center justify-center text-neutral-500 italic p-4 h-full">
                    Select an item to view details.
                </div>
            );
        }

        const DetailSubSection = ({ title, children, className = "" }) => (
            <div className={`py-1.5 ${className}`}>
                {title && <h6 className="font-semibold text-neutral-300 mb-1 text-xs tracking-wide uppercase">{title}</h6>}
                <div className="space-y-0.5 text-xs">
                    {children}
                </div>
            </div>
        );

        return (
            // This is the main container for the details panel content.
            // It will manage its own scrolling.
            <div className="p-1 sm:p-2 text-sm flex flex-col flex-grow min-h-0 h-full overflow-y-auto custom-scrollbar">
                {/* Flex container for the two detail sections */}
                {/* Mobile (default): flex-row (side-by-side). Tablet/Desktop (sm+): flex-col (stacked). */}
                <div className="flex flex-row sm:flex-col flex-grow min-h-0 gap-x-3 sm:gap-x-0 gap-y-2 sm:gap-y-2">
                    <div className="w-2/5 sm:w-full flex flex-col items-center sm:items-center flex-shrink-0 sm:pb-2 md:pb-3 border-neutral-700"> {/* sm:items-center for tablet/desktop stacked view */}
                        <div className="flex flex-col items-center w-full mb-2 flex-shrink-0">
                            {selectedItemDef.sourcePath ? (
                                <img
                                    src={selectedItemDef.sourcePath}
                                    alt={selectedItemDef.name}
                                    className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-contain pixelated mb-2 border border-neutral-600 rounded p-1 bg-neutral-700/30"
                                />
                            ) : (
                                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-neutral-700 flex items-center justify-center text-neutral-500 text-3xl mb-2 rounded border border-neutral-600 p-1">?</div>
                            )}
                            <h4 className="text-sm sm:text-base md:text-lg font-bold text-amber-300 text-center break-words">{selectedItemDef.name}</h4>
                        </div>
                        {/* Description - scrollable if long */}
                        <div className="w-full text-xs text-neutral-400 leading-relaxed overflow-y-auto custom-scrollbar max-h-24 sm:max-h-20 md:max-h-28 flex-shrink-0 p-1 bg-neutral-800/30 rounded mt-1">
                            {selectedItemDef.description || "No description available."}
                        </div>
                    </div>


                    <div className="w-3/5 sm:w-full flex flex-col flex-grow min-h-content space-y-2  pl-2 sm:pl-0 border-l sm:border-l-0 border-neutral-700 pt-0 sm:pt-2">
                        <div className="flex-grow overflow-y-auto custom-scrollbar pr-1 space-y-2">
                            <DetailSubSection title="Details">
                                <p><span className="font-medium text-neutral-400">Type:</span> <span className="capitalize text-neutral-200">{selectedItemDef.type?.replace(/_/g, ' ')}</span></p>
                                <p><span className="font-medium text-neutral-400">Quantity:</span> <span className="text-neutral-200">{selectedItemInstance.quantity}</span></p>
                                {selectedItemDef.price !== undefined && (
                                    <p><span className="font-medium text-neutral-400">Value:</span> <span className="text-neutral-200">{selectedItemDef.price} coins</span></p>
                                )}
                                {selectedItemDef.stackable !== undefined && (
                                    <p><span className="font-medium text-neutral-400">Stackable:</span> <span className="text-neutral-200">{selectedItemDef.stackable ? `Yes (Max: ${selectedItemDef.maxStack || 'N/A'})` : 'No'}</span></p>
                                )}
                                {selectedItemInstance.uses !== undefined && selectedItemDef.maxUse !== undefined && (
                                    <p><span className="font-medium text-neutral-400">Uses Left:</span> <span className="text-neutral-200">{selectedItemDef.maxUse - selectedItemInstance.uses} / {selectedItemDef.maxUse}</span></p>
                                )}
                            </DetailSubSection>

                            {selectedItemDef.type === ITEM_TYPES.FOOD && selectedItemDef.effects && (
                                <DetailSubSection title="Effects (on consume)">
                                    <ul className="list-disc list-inside pl-2 space-y-0.5">
                                        {Object.entries(selectedItemDef.effects).map(([key, value]) => (
                                            <li key={key} className="text-neutral-200"><span className="capitalize text-neutral-400">{key.replace(/_/g, ' ')}:</span> {value > 0 ? `+${value}` : value}</li>
                                        ))}
                                    </ul>
                                </DetailSubSection>
                            )}

                            {selectedItemDef.type === ITEM_TYPES.EQUIPMENT && selectedItemDef.equipmentSlot && (
                                <DetailSubSection title="Equipment Info">
                                    <p className="text-neutral-200">
                                        <span className="font-medium text-neutral-400">Slot:</span>
                                        <span className="capitalize">{selectedItemDef.equipmentSlot.replace(/_/g, ' ')}</span></p>
                                    {selectedItemDef.modifiers && (
                                        <>
                                            <p className="font-medium text-neutral-300 mt-1.5">Bonuses:</p>
                                            <ul className="list-disc list-inside pl-2 space-y-0.5">
                                                {Object.entries(selectedItemDef.modifiers).map(([key, value]) => (
                                                    <li key={key} className="text-neutral-200"><span className="capitalize text-neutral-400">{key.replace(/_/g, ' ')}:</span> {value > 0 ? `+${value}` : value}</li>
                                                ))}
                                            </ul>
                                        </>
                                    )}
                                </DetailSubSection>
                            )}
                        </div>

                        {/* Action Buttons - Pushed to bottom of this right section */}
                        <div className="mt-auto pt-2 space-y-2 flex-shrink-0 border-t border-neutral-700">
                            {selectedItemDef.type === ITEM_TYPES.FOOD && (
                                <button className="w-full bg-green-600 hover:bg-green-700 text-white py-1.5 rounded text-xs" onClick={handleItemConsume}>Consume</button>
                            )}
                            {selectedItemDef.type === ITEM_TYPES.EQUIPMENT && (
                                <button className="w-full bg-sky-600 hover:bg-sky-700 text-white py-1.5 rounded text-xs" onClick={handleItemEquip}>Equip</button>
                            )}
                            {/*{selectedItemDef.type === ITEM_TYPES.TOOL && (*/}
                            {/*    <button className="w-full bg-sky-600 hover:bg-sky-700 text-white py-1.5 rounded text-xs" onClick={() => console.log("Use tool:", selectedItemDef.id)}>Use Tool</button>*/}
                            {/*)}*/}
                            <button className="w-full bg-red-600 hover:bg-red-700 text-white py-1.5 rounded text-xs" onClick={() => triggerConfirmSell(false)}>Sell {Math.ceil(selectedItemDef.price * (selectedItemDef.type === ITEM_TYPES.COLLECTABLE ? 1 : 75/100) )}$</button>
                            <button className="w-full bg-red-600 hover:bg-red-700 text-white py-1.5 rounded text-xs" onClick={() => triggerConfirmSell(true)}>Sell All for {Math.ceil(selectedItemDef.price *selectedItemInstance.quantity * (selectedItemDef.type === ITEM_TYPES.COLLECTABLE ? 1 : 75/100) )}$</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const ConfirmationModal = ({title, message, onConfirm, onCancel}) => {
        return (
            <div className="fixed inset-0 z-60 bg-black/60 flex items-center justify-center p-4">
                <div className="bg-neutral-800 text-white p-4 rounded-lg shadow-xl border border-neutral-700 max-w-sm w-full space-y-4">
                    <h4 className="text-lg font-bold text-red-400">{title}</h4>
                    <p className="text-sm text-neutral-300">{message}</p>
                    <div className="flex justify-end space-x-2 pt-2">
                        <button
                            onClick={onCancel}
                            className="px-3 py-1.5 rounded bg-neutral-600 hover:bg-neutral-700 text-sm"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className="px-3 py-1.5 rounded bg-red-600 hover:bg-red-700 text-sm"
                            style={{
                                backgroundColor: '#ff4d4f',
                                color: '#fff'
                            }}
                        >
                            Sell
                        </button>
                    </div>
                </div>
            </div>
        )
    }


    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2 sm:p-4 transition-opacity duration-300 ease-in-out"
            onClick={closeInventoryModal}
            aria-hidden={!isInventoryModalOpen}
        >
            <div
                className="bg-neutral-800 text-white p-3 sm:p-5 rounded-lg shadow-2xl max-w-4xl w-full h-[90vh] max-h-[700px] md:max-h-[600px] flex flex-col border border-neutral-700"
                onClick={handlePanelClick}
            >
                {/* Modal Header */}
                <div className="flex justify-between items-center mb-2 pb-2 md:pb-3 border-b border-neutral-700 flex-shrink-0">
                    <h3 className="text-lg md:text-xl font-bold text-amber-400">Your Backpack</h3>
                    <button
                        onClick={closeInventoryModal}
                        className="text-neutral-400 hover:text-white text-xl md:text-2xl leading-none p-1 rounded-full hover:bg-neutral-700 transition-colors"
                        aria-label="Close modal"
                    >
                        &times;
                    </button>
                </div>

                {/* Inventory Capacity Display */}
                <div className="mb-2 md:mb-3 text-right flex-shrink-0">
                    <span className="text-xs font-medium text-neutral-400">
                        Slots: <span className="font-semibold text-neutral-200">{capacityText}</span>
                    </span>
                </div>

                {/* Main Content Area: Responsive layout for Grid and Details */}
                {/* Default (mobile): Details on top (col-reverse). md+: Grid left, Details right (row). */}
                <div className="flex flex-col-reverse md:flex-row flex-grow min-h-0 gap-2 md:gap-3">
                    {/* Item Grid Section (Order 2 on mobile [bottom], Order 1 on desktop [left]) */}
                    <div className="w-full md:w-3/5 lg:w-2/3 md:pr-3 md:border-r border-neutral-700 flex flex-col h-3/5 xs:h-2/3 sm:h-1/2 md:h-full overflow-hidden">
                        {playerInventory.length > 0 ? (
                            <ul className="grid grid-cols-4 xs:grid-cols-5 sm:grid-cols-6 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-1.5 sm:gap-2 overflow-y-auto flex-grow p-1 custom-scrollbar">
                                {playerInventory.map((itemInstance, index) => {
                                    const itemDef = ITEMS[itemInstance.itemId];
                                    if (!itemDef) {
                                        return ( <li key={`${itemInstance.itemId}-${index}-unknown`} className="aspect-square bg-neutral-700 rounded flex items-center justify-center text-red-500 text-xs p-1" title={`Unknown: ${itemInstance.itemId}`}>?</li> );
                                    }
                                    const itemTitle = `${itemDef.name}${itemInstance.currentDurability ? ` (Dur: ${itemInstance.currentDurability}%)` : itemInstance.uses !== undefined ? ` (Uses: ${itemDef.maxUse - itemInstance.uses}/${itemDef.maxUse || 'N/A'})` : ''}\n${itemDef.description || ''}`;
                                    const isSelected = selectedItemInstance && selectedItemInstance.itemId === itemInstance.itemId && selectedItemInstance === itemInstance;

                                    return (
                                        <li
                                            key={`${itemInstance.itemId}-${index}-${itemInstance.quantity}`}
                                            className={`relative aspect-square border rounded-md p-1 sm:p-1.5 flex flex-col items-center justify-center cursor-pointer group transition-all duration-150
                                                        ${isSelected ? 'bg-sky-700 border-sky-400 shadow-md scale-105' : 'bg-neutral-700/50 hover:bg-neutral-600/70 border-neutral-600'}`}
                                            title={itemTitle}
                                            onClick={() => handleItemClick(itemInstance)}
                                        >
                                            {itemDef.sourcePath ? (
                                                <img src={itemDef.sourcePath} alt={itemDef.name} className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 object-contain pixelated" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextSibling.style.display = 'flex'; }} />
                                            ) : null}
                                            <div className={`w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 bg-neutral-600 items-center justify-center text-neutral-500 ${itemDef.sourcePath ? 'hidden' : 'flex'}`}>?</div>
                                            {itemInstance.quantity > 1 && itemDef.stackable && (
                                                <span className="absolute bottom-0 right-0 bg-sky-600 text-white text-[10px] font-bold px-1 leading-tight rounded-tl-md rounded-br-md">
                                                    {itemInstance.quantity}
                                                </span>
                                            )}
                                            <div className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-0.5 px-1.5 py-0.5 bg-black text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none ${isSelected && 'opacity-100'}`}>
                                                {itemDef.name}
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        ) : (
                            <p className="text-center text-neutral-400 py-10 flex-grow flex items-center justify-center">Your backpack is empty.</p>
                        )}
                    </div>

                    {/* Item Details Section (Order 1 on mobile [top], Order 2 on desktop [right]) */}
                    <div className="w-full md:w-2/5 lg:w-1/3 md:pl-3 flex flex-col h-2/5 xs:h-1/3 sm:h-1/2 md:h-full overflow-hidden">
                        {renderItemDetails()}
                    </div>
                </div>
            </div>

            {confirmAction && (
                <ConfirmationModal
                    title={confirmTitle}
                    message={confirmMessage}
                    onConfirm={confirmAction}
                    onCancel={closeConfirmModal}
                />
            )}
        </div>
    );
}
