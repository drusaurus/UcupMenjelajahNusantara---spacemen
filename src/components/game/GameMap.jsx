"use client";

import {useEffect, useRef, useState} from "react";
import {useGameTime} from "../../hooks/useGameTime";
import {LOCATIONS_ON_WORLD_MAP, INNER_LOCATIONS_DETAILS } from "../../constants/locations.js";
import {MAP_BACKGROUNDS} from "../../constants/timeConfig.js";
import {useGame} from "../../hooks/useGame";
import {usePlayerMovement} from "../../hooks/usePlayerMovement";
import AvatarCanvas from "./AvatarCanvas";
import {useAvatarAnimation} from "../../hooks/useAvatarAnimation";
import ScreenTransition from "./ScreenTransition.jsx";
import ActivityDetailModal from "../ui/ActivityDetailModal.jsx";
import useActivity from "../../hooks/useActivity.js";
import {useInventory} from "../../hooks/useInventory.js";
import StorageModal from "../ui/StorageModal.jsx";
import InventoryModal from "../ui/InventoryModal.jsx";
import PlayerCompletionEmote from "./PlayerCompletionEmote.jsx";
import PlayerBusyIndicator from "../ui/PlayerBusyIndicator.jsx";
import ShopModal from "../ui/ShopModal.jsx";

// ActivityDisplay Component (within GameMap.jsx or as a separate file)
function ActivityDisplay({ activities, playerPosition, onActivitySelect, mapDimensions }) {
    // Guard clause: If no activities, playerPosition, or map isn't ready, don't render
    if (!activities || activities.length === 0 || !playerPosition || !mapDimensions.width) {
        return null;
    }

    const avatarX = playerPosition.x; // Player's X position (0-100%)
    const avatarY = playerPosition.y; // Player's Y position (0-100%)

    // Map center is assumed to be 50%, 50%
    const mapCenterX = 50;
    const mapCenterY = 50;

    // Offset in percentage from the avatar's center.
    const offsetX = 3; // e.g., 3% to the side
    const offsetY = 3; // e.g., 3% above/below

    let topPosition, leftPosition;
    let transformValue = '';

    // Determine where to position the panel relative to the avatar
    if (avatarY < mapCenterY) { // Avatar is in top half of map, open panel downwards
        topPosition = `${avatarY + offsetY}%`;
    } else { // Avatar is in bottom half of map, open panel upwards
        topPosition = `${avatarY - offsetY}%`;
        transformValue += 'translateY(-100%)';
    }

    if (avatarX < mapCenterX) { // Avatar is in left half of map, open panel to the right
        leftPosition = `${avatarX + offsetX}%`;
    } else { // Avatar is in right half of map, open panel to the left
        leftPosition = `${avatarX - offsetX}%`;
        transformValue = transformValue ? `${transformValue} translateX(-100%)` : 'translateX(-100%)';
    }

    if (!transformValue) {
        transformValue = 'translate(0,0)';
    }

    const style = {
        position: 'absolute',
        top: topPosition,
        left: leftPosition,
        transform: transformValue,
        zIndex: 35,
        padding: '8px',
        borderRadius: '6px',
        color: 'white',
        fontSize: '10px',
        width: '150px', // CHANGED: from maxWidth to width for a fixed width
    };

    return (
        <div style={style}>
            <ul className="space-y-1">
                {activities.map(activity => (
                    <li key={activity.id}>
                        <button
                            onClick={() => onActivitySelect(activity)} // Pass the full activity object
                            className="w-full text-left px-2 py-1 bg-neutral-700 hover:bg-neutral-600 rounded text-xs"
                            title={activity.description || activity.name}
                        >
                            {activity.name}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}


export default function GameMap() {
    const {day, formattedTime, timeOfDay} = useGameTime();

    const { selectedAvatar,
        currentArea,
        isTransitioningLocation,
        dispatch,
        currentInnerLocation: currentActiveInnerLocationInState,
        WORLD_MAP_ID,
        isActivityModalOpen,
        selectedActivityForModal,
        visitedLocations
    } = useGame();

    const {
        activeStorageId,
        isStorageModalOpen,
        openStorageModal,
        closeStorageModal,
        openShopModal,
        closeShopModal,
        activeShopId,
        isShopModalOpen
    } = useInventory();
    // console.log("GameMap rendering StorageModal. isStorageModalOpen from useGame:", isStorageModalOpen);

    const { openActivityModal,
        closeActivityModal,
        currentCompletionEmote,
        isPlayerBusy,
        skipCurrentActivity,
    } = useActivity();

    const {position,
        facingDirection,
        movingDirection } = usePlayerMovement();

    let background = currentArea === WORLD_MAP_ID ? MAP_BACKGROUNDS[timeOfDay] : INNER_LOCATIONS_DETAILS[currentArea].background;
    let currentAvatarScale = INNER_LOCATIONS_DETAILS[currentArea]?.avatarScaleDivider ?? 16;

    const handleTransitionComplete = () => {
        dispatch({ type: "FINISH_LOCATION_TRANSITION" });
    };

    const isMoving = !!movingDirection;
    const frame = useAvatarAnimation(isMoving);

    const mapRef = useRef(null);
    const containerRef = useRef(null);
    const [mapDimensions, setMapDimensions] = useState({ width: 0, height: 0}); // For positioning UI elements
    const [mapStyle, setMapStyle] = useState({
        width: "100%",
        height: "100%",
        top: 0,
        left: 0,
    });

    // Calculate and update the dimensions and position of map and locations
    const updateMapLayout = () => {
        if (!containerRef.current) return;

        const containerWidth = containerRef.current.offsetWidth;
        const containerHeight = containerRef.current.offsetHeight;

        let mapWidth, mapHeight, mapTop, mapLeft;

        if (containerWidth <= containerHeight) {
            mapWidth = mapHeight = containerWidth;
            mapTop = (containerHeight - mapHeight) / 2;
            mapLeft = 0;
        } else {
            mapWidth = mapHeight = containerHeight;
            mapTop = 0;
            mapLeft = (containerWidth - mapWidth) / 2;
        }

        setMapStyle({
            width: `${mapWidth}px`,
            height: `${mapHeight}px`,
            top: `${mapTop}px`,
            left: `${mapLeft}px`,
        });
        setMapDimensions({ width: mapWidth, height: mapHeight }); // Store pixel dimensions

    };

    // Handle window resizing
    useEffect(() => {
        updateMapLayout();
        const handleResize = () => updateMapLayout();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        if (currentArea === WORLD_MAP_ID || !INNER_LOCATIONS_DETAILS[currentArea] || isTransitioningLocation) {
            if (currentActiveInnerLocationInState !== null) { // Only dispatch if it needs resetting
                dispatch({ type: "SET_CURRENT_INNER_LOCATION", payload: null });
            }
            return;
        }

        const sceneData = INNER_LOCATIONS_DETAILS[currentArea];
        let playerInZoneId = null; // This will be the ID like "home_zone_bedroom"

        if (sceneData.activityZones) {
            for (const zone of sceneData.activityZones) {
                if (
                    position.x >= zone.areaInScene.xMin && position.x <= zone.areaInScene.xMax &&
                    position.y >= zone.areaInScene.yMin && position.y <= zone.areaInScene.yMax
                ) {
                    playerInZoneId = zone.id; // zone.id is "home_zone_bedroom", "home_zone_kitchen"
                    break;
                }
            }
        }

        if (playerInZoneId !== currentActiveInnerLocationInState) { // Only dispatch if changed
            dispatch({ type: "SET_CURRENT_INNER_LOCATION", payload: playerInZoneId });
        }

    }, [position, currentArea, dispatch, isTransitioningLocation, WORLD_MAP_ID, currentActiveInnerLocationInState]); // Added useGame to get currentInnerLocation for comparison

    // Determine current active zone's data and activities
    let activeZoneData = null;
    let activitiesToShow = [];
    let activeZoneAreaForUI = null;

    if (currentArea !== WORLD_MAP_ID && INNER_LOCATIONS_DETAILS[currentArea] && currentActiveInnerLocationInState) {
        const sceneData = INNER_LOCATIONS_DETAILS[currentArea];
        activeZoneData = sceneData.activityZones?.find(zone => zone.id === currentActiveInnerLocationInState);
        if (activeZoneData && activeZoneData.activities) {
            activitiesToShow = activeZoneData.activities;
            activeZoneAreaForUI = activeZoneData.areaInScene; // For positioning the UI
        }
    }

    const handleActivitySelection = (activityData) => { // Pass the whole activity object
        if (!activityData) return;

        if (activityData.mode === "ui_interaction" && activityData.interactionType === "OPEN_STORAGE") {
            // console.log("GameMap: Opening storage:", activityData.storageId);
            if (activityData.storageId) {
                openStorageModal(activityData.storageId); // Call function from useGame
            } else {
                console.error("Activity is OPEN_STORAGE but missing storageId:", activityData);
            }
        } else if (activityData.mode === "ui_interaction" && activityData.interactionType === "OPEN_SHOP") {
            if(activityData.shopId) {
                openShopModal(activityData.shopId);
                console.log("GameMap: Opening shop:", activityData.shopId);
            } else {
                console.error("Activity is OPEN_SHOP but missing shopId:", activityData);
            }
        }
        else {
            // console.log("GameMap: Opening activity detail modal for:", activityData.name);
            openActivityModal(activityData); // Call function from useGame
        }
    };

    // Calculate player's pixel position and avatar size for the emote/indicator
    let playerPixelPos = null;
    let avatarPixelSize = 32; // Default/fallback
    if (mapRef.current && position && mapDimensions.width > 0) {
        const mapWidth = mapDimensions.width;
        const mapHeight = mapDimensions.height;
        playerPixelPos = {
            x: (position.x / 100) * mapWidth,
            y: (position.y / 100) * mapHeight,
        };
        avatarPixelSize = mapWidth / currentAvatarScale;
    }

    const renderContent = () => {
        if (currentArea === "world") {
            return (
                <>
                {/* Locations */}
                    {LOCATIONS_ON_WORLD_MAP.map((loc) => {
                        const isVisited = visitedLocations.includes(loc.id);
                        return (
                            <div
                                key={loc.id}
                                className="absolute z-10 pointer-events-none flex items-center justify-center text-center text-white font-bold text-[10px]"
                                style={{
                                    top: `${loc.area.yMin}%`,
                                    left: `${loc.area.xMin}%`,
                                    width: `${loc.area.xMax - loc.area.xMin}%`,
                                    height: `${loc.area.yMax - loc.area.yMin}%`,
                                    borderRadius: "50%",
                                    border: `2px dashed ${isVisited ? "gray" : "#00FFAA" }`,
                                    boxShadow: isVisited ?  "none" :"0 0 6px #00FFAA",
                                }}
                            >
                                {loc.name}
                            </div>
                        )
                    })}
                </>
            )
        } else if (INNER_LOCATIONS_DETAILS[currentArea]) {
            const sceneData = INNER_LOCATIONS_DETAILS[currentArea];
            return (
                <>
                    {sceneData.activityZones.map((zone) => (
                        <div key={zone.id}

                             className="absolute pointer-events-none" // Just a visual debugger, or style as needed
                             style={{
                                 top: `${zone.areaInScene.yMin}%`, left: `${zone.areaInScene.xMin}%`,
                                 width: `${zone.areaInScene.xMax - zone.areaInScene.xMin}%`,
                                 height: `${zone.areaInScene.yMax - zone.areaInScene.yMin}%`,
                                 border: "1px dashed rgba(255, 255, 0, 0.3)", // Faint yellow border for zones
                                 // backgroundColor: "rgba(255, 255, 0, 0.05)"
                             }}>
                             <span className="text-yellow-400 text-opacity-50 text-[8px] p-0.5">{zone.name}</span>
                        </div>
                    ))}

                    {sceneData.exit && (
                        <div
                            key={sceneData.exit.id || "main_exit"} // Add a key; if no id in data, use a static one
                            className="absolute z-20 flex items-center justify-center text-center text-white font-semibold text-xs p-1 bg-opacity-60 rounded hover:bg-opacity-80 cursor-pointer border-gray-600 border-2"
                            style={{
                                top: `${sceneData.exit.areaInScene.yMin}%`,
                                left: `${sceneData.exit.areaInScene.xMin}%`,
                                width: `${sceneData.exit.areaInScene.xMax - sceneData.exit.areaInScene.xMin}%`,
                                height: `${sceneData.exit.areaInScene.yMax - sceneData.exit.areaInScene.yMin}%`,
                            }}
                            // onClick={() => {
                            //     // Determine targetSceneId for the world map
                            //     const targetWorldMapId = WORLD_MAP_ID; // Assuming WORLD_MAP_ID is "world" or similar
                            //
                            //     if (sceneData.exit.targetPlayerSpawn) {
                            //         dispatch({ type: "UPDATE_PLAYER_POSITION", payload: sceneData.exit.targetPlayerSpawn });
                            //     }
                            //     // Assuming 'navigateTo' is the correct function from useGame to change scene
                            //     navigateTo(targetWorldMapId);
                            // }}
                        >
                            {sceneData.exit.name}
                        </div>
                    )}
                </>
            );
        }
        return <div className="text-white">Loading Scene...</div>; // Fallback

    }

    return (
        <div
            ref={containerRef}
            className="relative w-full h-full flex justify-center items-center overflow-hidden"
        >
            {/* Map container with exact dimensions */}
            <div
                ref={mapRef}
                className="absolute flex justify-center items-center"
                style={{
                    width: mapStyle.width,
                    height: mapStyle.height,
                    top: mapStyle.top,
                    left: mapStyle.left,
                }}
            >
                 {/*Map image*/}
                <img
                    src={background}
                    alt={`Map - ${timeOfDay}`}
                    className="absolute w-full h-full object-contain"
                />
                {renderContent()}
                {/* Avatar */}
                <div
                    className="absolute z-30"
                    style={{
                        top: `${position.y}%`,
                        left: `${position.x}%`,
                        transform: "translate(-50%, -50%)",
                    }}
                >
                    <AvatarCanvas
                        avatar={selectedAvatar}
                        direction={facingDirection}
                        frame={frame}
                        size={ avatarPixelSize }
                    />
                </div>
                {/* Player Busy Indicator - Renders based on currentBusyIndicator from useGame */}
                {isPlayerBusy && playerPixelPos && (
                    <PlayerBusyIndicator
                        playerPixelPosition={playerPixelPos}
                        mapAvatarSize={avatarPixelSize}
                        onSkip={skipCurrentActivity}
                    />
                )}

                {/* Player Completion Emote - Renders based on currentCompletionEmote from useGame */}
                {currentCompletionEmote && playerPixelPos && (
                    <PlayerCompletionEmote
                        playerPixelPosition={playerPixelPos}
                        mapAvatarSize={avatarPixelSize}
                    />
                )}


                {activitiesToShow.length > 0 &&
                    !isPlayerBusy &&
                    activeZoneAreaForUI && // Still useful to know there IS an active zone
                    position &&       // Make sure playerPosition is available
                    mapDimensions.width > 0 && (
                        <ActivityDisplay
                            activities={activitiesToShow}
                            // zoneArea={activeZoneAreaForUI} // Kept if needed for other logic, but not primary for new positioning
                            playerPosition={position} // Pass the player's current position
                            onActivitySelect={handleActivitySelection}
                            mapDimensions={mapDimensions}
                        />
                    )}
                <ScreenTransition trigger={isTransitioningLocation} onComplete={handleTransitionComplete} />
            </div>

            {/* Day + Time Display */}
            <div
                className="absolute top-2 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-black/20 text-white text-sm font-semibold rounded shadow-md z-10">
                Day {day} | {formattedTime}
            </div>

            {/*Modals */}
            <ActivityDetailModal
                isOpen={isActivityModalOpen}
                activity={selectedActivityForModal}
                onClose={closeActivityModal}
            />
            <StorageModal
                isOpen={isStorageModalOpen}
                onClose={closeStorageModal}
                storageId={activeStorageId} // Pass the activeStorageId
                // playerInventory={playerInventory} // StorageModal can get these from useGame itself
                // storageContents={storageInventories[activeStorageId] || []} // Or get from useGame
            />

            <InventoryModal />

            <ShopModal
                isOpen={isShopModalOpen}
                onClose={closeShopModal}
                shopId={activeShopId}
            />
        </div>
    );
}

