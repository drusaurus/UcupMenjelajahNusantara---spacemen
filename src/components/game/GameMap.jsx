"use client";

import { useEffect, useRef, useState } from "react";
import { useGameTime } from "../../hooks/useGameTime";
import { LOCATIONS } from "../../constants/locations.js";
import { MAP_BACKGROUNDS} from "../../constants/timeConfig.js";
import { useGame } from "../../hooks/useGame";
import { usePlayerMovement } from "../../hooks/usePlayerMovement";
import AvatarCanvas from "./AvatarCanvas";
import { useAvatarAnimation } from "../../hooks/useAvatarAnimation";

export default function GameMap() {
    const { day, formattedTime, timeOfDay } = useGameTime();
    const background = MAP_BACKGROUNDS[timeOfDay];
    const { selectedAvatar } = useGame();
    const { position, facingDirection, movingDirection } = usePlayerMovement();
    const isMoving = !!movingDirection;
    const frame = useAvatarAnimation(isMoving);
    const mapRef = useRef(null);
    const containerRef = useRef(null);

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
            mapWidth = containerWidth;
            mapHeight = containerWidth;
            mapTop = (containerHeight - mapWidth) / 2;
            mapLeft = 0;
        } else {
            mapHeight = containerHeight;
            mapWidth = containerHeight;
            mapTop = 0;
            mapLeft = (containerWidth - mapHeight) / 2;
        }

        setMapStyle({
            width: `${mapWidth}px`,
            height: `${mapHeight}px`,
            top: `${mapTop}px`,
            left: `${mapLeft}px`,
        });
    };

    // Handle window resizing
    useEffect(() => {
        updateMapLayout();
        const handleResize = () => updateMapLayout();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div
            ref={containerRef}
            className="relative w-full h-full flex justify-center items-center overflow-hidden bg-red-400"
        >
            {/* Map container with exact dimensions */}
            <div
                ref={mapRef}
                className="absolute flex justify-center items-center bg-emerald-800"
                style={{
                    width: mapStyle.width,
                    height: mapStyle.height,
                    top: mapStyle.top,
                    left: mapStyle.left,
                }}
            >
                {/* Map image */}
                {/*<img*/}
                {/*    src={background}*/}
                {/*    alt={`Map - ${timeOfDay}`}*/}
                {/*    className="absolute w-full h-full object-cover"*/}
                {/*/>*/}

                {/* Locations */}
                {LOCATIONS.map((loc) => (
                    <div
                        key={loc.id}
                        className="absolute z-10 pointer-events-none flex items-center justify-center text-center text-white font-bold text-[10px]"
                        style={{
                            top: `${loc.area.yMin}%`,
                            left: `${loc.area.xMin}%`,
                            width: `${loc.area.xMax - loc.area.xMin}%`,
                            height: `${loc.area.yMax - loc.area.yMin}%`,
                            borderRadius: "50%",
                            border: "1px dashed gray",
                        }}
                    >
                        {loc.name}
                    </div>
                ))}

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
                        size={
                            mapRef.current?.offsetWidth
                                ? mapRef.current.offsetWidth / 16
                                : 64
                        }
                    />
                </div>
            </div>

            {/* Day + Time Display */}
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-black bg-opacity-60 text-white text-sm font-semibold rounded shadow-md z-10">
                Day {day} | {formattedTime}
            </div>
        </div>
    );
}
