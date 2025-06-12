// InteractionControls.jsx
"use client"
import {useState} from "react";
import { useGame } from "../../hooks/useGame.js";
import { INNER_LOCATIONS_DETAILS } from "../../constants/locations.js";
import {ITEMS} from "../../constants/items.js";
import {useInventory} from "../../hooks/useInventory.js"; // Adjust path as needed

export default function InteractionControls() {
    const {
        currentLocation,
        currentArea,
        currentInnerLocation,
        playerPosition,
        isTransitioningLocation,
        WORLD_MAP_ID,
        navigateTo,
        maxInventorySlots,
        playerSpeed,
        playerEquipment,
    } = useGame();

    const { unequipItem } = useInventory();

    // Use WORLD_MAP_ID from context if available, otherwise from import
    const activeWorldMapId = WORLD_MAP_ID;

    let isNearValidExit = false;
    let exitDetails = null;

    if (currentArea !== activeWorldMapId && INNER_LOCATIONS_DETAILS[currentArea] && playerPosition) {
        const sceneData = INNER_LOCATIONS_DETAILS[currentArea];
        if (sceneData.exit && sceneData.exit.areaInScene) { // Check if exit and its area are defined
            const { xMin, xMax, yMin, yMax } = sceneData.exit.areaInScene;
            if (
                playerPosition.x >= xMin && playerPosition.x <= xMax &&
                playerPosition.y >= yMin && playerPosition.y <= yMax
            ) {
                isNearValidExit = true;
                exitDetails = sceneData.exit; // Store the exit details
            }
        }
    }

    const [openActionSlot, setOpenActionSlot] = useState(null);


    let buttonConfig = {
        text: "Explore",
        onClick: () => {},
        disabled: true,
        title: "No primary action available.",
        baseClass: "bg-neutral-600 text-neutral-400 cursor-not-allowed",
    };

    if (isTransitioningLocation) {
        buttonConfig = {
            text: "Transitioning...",
            onClick: () => {},
            disabled: true,
            title: "Please wait...",
            baseClass: "bg-neutral-500 text-neutral-300 cursor-not-allowed animate-pulse"
        };
    } else if (isNearValidExit && exitDetails) {
        // Context: Player is in an interior and at an exit point
        buttonConfig = {
            text: exitDetails.name || "Exit",
            onClick: () => navigateTo(activeWorldMapId), // navigateTo handles spawn for world map
            disabled: false,
            title: `Exit to ${exitDetails.targetSceneId || activeWorldMapId}`, // Assuming exit always goes to world if not specified
            baseClass: "bg-orange-600 hover:bg-orange-700"
        };
    } else if (currentArea === activeWorldMapId && currentLocation) {
        // Context: Player is on the world map, at a specific marker
        if (INNER_LOCATIONS_DETAILS[currentLocation]) {
            const locationDetails = INNER_LOCATIONS_DETAILS[currentLocation];
            buttonConfig = {
                text: `Enter ${locationDetails.name || currentLocation}`,
                onClick: () => navigateTo(currentLocation), // currentLocation is the target scene ID
                disabled: false,
                title: `Enter ${locationDetails.name || currentLocation}`,
                baseClass: "bg-blue-600 hover:bg-blue-700"
            };
        } else {
            // Player is on world map at a marker, but it's not defined/enterable
            buttonConfig = {
                text: `${currentLocation} (No Entry)`,
                onClick: () => console.log(`Location "${currentLocation}" has no interior details or is not enterable.`),
                disabled: true,
                title: `${currentLocation} cannot be entered at this time.`,
                baseClass: "bg-neutral-600 text-neutral-400 cursor-not-allowed"
            };
        }
    } else if (currentArea !== activeWorldMapId) {
        // In an interior but not near an exit - could allow other actions or just be disabled
        buttonConfig.title = "Move to an exit or activity zone.";
    }
    // If currentArea === activeWorldMapId but !currentLocation, the default "Explore" / disabled state remains.

    return (
        <div className="flex flex-col h-full w-full max-w-xs p-3 bg-neutral-800 text-white rounded-lg shadow-xl space-y-2">
            {/* Debug Info Section - Kept for clarity during development */}
            {/*<div>*/}
            {/*    <h4 className="text-sm font-bold text-neutral-300 tracking-wide mb-1 border-b border-neutral-700 pb-1">Debug Info:</h4>*/}
            {/*    <p>Scene (currentArea): <span className="font-semibold text-green-400">{currentArea}</span></p>*/}
            {/*    <p>World Marker (currentLocation): <span className="font-semibold text-yellow-400">{currentLocation || "N/A"}</span></p>*/}
            {/*    <p>Activity Zone (currentInnerLocation): <span className="font-semibold text-cyan-400">{currentInnerLocation || "N/A"}</span></p>*/}
            {/*    <p>Position: <span className="font-semibold text-purple-400">X: {playerPosition?.x?.toFixed(1)}, Y: {playerPosition?.y?.toFixed(1)}</span></p>*/}
            {/*    /!*<p>Facing: <span className="font-semibold text-orange-400">{facingDirection || "N/A"}</span></p>*!/*/}
            {/*    /!*<p>Moving: <span className="font-semibold text-pink-400">{movingDirection || "None"}</span></p>*!/*/}
            {/*    <p>Transitioning: <span className="font-semibold text-red-400">{isTransitioningLocation ? "Yes" : "No"}</span></p>*/}
            {/*    <p>playerSpeed: <span className="font-semibold text-indigo-400">{playerSpeed ?? "N/A"}</span></p>*/}
            {/*</div>*/}
            <div className="h-[80%]">
                <h6 className="text-sm font-bold text-neutral-300 tracking-wide mb-1 border-b border-neutral-700 pb-1">Equipment</h6>
                <div className="flex flex-col gap-3 overflow-y-auto h-full">
                    {Object.entries(playerEquipment).length > 0 ? (
                        Object.entries(playerEquipment).map(([slot, item]) => {
                            const itemDef = ITEMS[item?.itemId];
                            const isOpen = openActionSlot === slot;

                            return (
                                <div
                                    key={slot}
                                    className="relative flex items-start gap-3 bg-neutral-800 rounded p-2 justify-between cursor-pointer"
                                    onClick={() => {
                                        if (item) setOpenActionSlot(isOpen ? null : slot)
                                    }}
                                >
                                    {/* Item Image */}
                                    <div className="w-12 h-12 bg-neutral-700 flex items-center justify-center rounded text-center">
                                        {itemDef?.sourcePath ? (
                                            <img
                                                src={itemDef.sourcePath}
                                                alt={itemDef.name}
                                                className="w-10 h-10 object-contain pixelated"
                                            />
                                        ) : (
                                            <span className="text-xs text-neutral-400">?</span>
                                        )}
                                    </div>

                                    {/* Item Details */}
                                    <div className="flex flex-col text-neutral-200 text-sm flex-1">
                                        {itemDef ? (
                                            <>
                                                <div className="font-semibold capitalize">
                                                    {itemDef.name ?? item?.itemId}
                                                </div>
                                                {itemDef.modifiers && (
                                                    <div className="text-xs mt-1 text-neutral-300 list-disc list-inside">
                                                        {Object.entries(itemDef.modifiers).map(([key, value]) => (
                                                            <p key={key}>
                                                                {key === "inventorySlot"
                                                                    ? `+${value} inventory slots`
                                                                    : key === "speed"
                                                                        ? `+${value} speed`
                                                                        : `${key}: ${value}`}
                                                            </p>
                                                        ))}
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <div className="text-neutral-400 text-xs">
                                                {slot.charAt(0).toUpperCase() + slot.slice(1)}: Not equipped
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Panel */}
                                    {isOpen && (
                                        <div className="absolute top-full left-2 mt-1 z-10 bg-neutral-900 border border-neutral-700 rounded shadow-md p-2 text-xs text-white">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation(); // prevent closing the panel on click
                                                    unequipItem(slot);
                                                    setOpenActionSlot(null);
                                                }}
                                                className="block w-full text-left hover:bg-red-700 rounded px-2 py-1 bg-red-600"
                                            >
                                                Unequip
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        <p className="text-sm text-neutral-400">No items equipped</p>
                    )}

                </div>
            </div>

            <div className="mt-auto">
                <button
                    className={`w-full font-bold py-2.5 px-4 rounded text-sm ${buttonConfig.baseClass}`}
                    onClick={buttonConfig.onClick}
                    disabled={buttonConfig.disabled}
                    title={buttonConfig.title}
                >
                    {buttonConfig.text}
                </button>
            </div>
        </div>
    );
}