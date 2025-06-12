"use client";

import { usePlayerMovement } from "../../hooks/usePlayerMovement";
// import { LOCATION_ACTIVITIES } from "../../constants/locations.js";
import { Info } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { usePlayerStatus} from "../../hooks/usePlayerStatus.js";

export default function ActivityControls() {
    const { currentLocation } = usePlayerMovement();
    const { money, performActivity } = usePlayerStatus();
    // const activities = currentLocation ? LOCATION_ACTIVITIES[currentLocation] || [] : [];

    const [toastMessage, setToastMessage] = useState("");
    const [showToast, setShowToast] = useState(false);
    const triggerToast = (message) => {
        setToastMessage(message);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const [visibleTooltip, setVisibleTooltip] = useState(null);
    const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
    const [tooltipContent, setTooltipContent] = useState("");
    const [isTouching, setIsTouching] = useState(false);
    const timeoutRef = useRef(null);
    const containerRef = useRef(null);

    const handleTooltipTouch = (id, tooltip) => {
        setVisibleTooltip(id);
        setTooltipContent(tooltip || "No additional info.");
        setIsTouching(true);

        // Calculate position on touch
        updateTooltipPosition(id);
    };

    const handleTooltipHover = (id, tooltip) => {
        setVisibleTooltip(id);
        setTooltipContent(tooltip || "No additional info.");
        updateTooltipPosition(id);
    };


    const updateTooltipPosition = (id) => {
        // Find the info icon element for this activity
        const iconElement = document.querySelector(`#info-icon-${id}`);

        if (iconElement && containerRef.current) {
            const iconRect = iconElement.getBoundingClientRect();
            const containerRect = containerRef.current.getBoundingClientRect();

            // Position tooltip above the icon
            setTooltipPosition({
                top: iconRect.top - containerRect.top - 40, // Position above with some margin
                left: iconRect.left - containerRect.left + (iconRect.width / 2)
            });
        }
    };

    const handleTooltipRelease = () => {
        setIsTouching(false);

        // Clear any existing timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // Set new timeout for 2s after release
        timeoutRef.current = setTimeout(() => {
            setVisibleTooltip(null);
        }, 2000);
    };

    // Update tooltip position on scroll
    useEffect(() => {
        if (visibleTooltip !== null) {
            const scrollContainer = document.querySelector('.overflow-y-auto');
            if (scrollContainer) {
                const handleScroll = () => updateTooltipPosition(visibleTooltip);
                scrollContainer.addEventListener('scroll', handleScroll);
                return () => scrollContainer.removeEventListener('scroll', handleScroll);
            }
        }
    }, [visibleTooltip]);

    // Clean up timeout on unmount
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return (
        <div className="flex flex-col justify-center h-full w-full max-w-md p-4 rounded shadow-md min-h-0 relative bg-neutral-700" ref={containerRef}>
            {/* Header */}
            <div className="shrink-0">
                <h4 className="text-lg font-semibold text-center mb-2">Activities</h4>
                <p className="text-sm text-center mb-4">
                    Current location: <strong>{currentLocation || "Unknown"}</strong>
                </p>
            </div>

            {/* Tooltip rendered outside scroll area */}
            {visibleTooltip !== null && (
                <div
                    className="absolute bg-black text-white text-xs px-3 py-2 rounded z-50 pointer-events-none max-w-[200px] break-words shadow-lg"
                    style={{
                        top: `${tooltipPosition.top}px`,
                        left: `${tooltipPosition.left}px`,
                        transform: 'translateX(-50%)'
                    }}
                >
                    {tooltipContent}
                </div>
            )}


            {/* Scrollable Activity List */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 rounded min-h-0">
                {/*{activities.length > 0 ? (*/}
                {/*    activities.map((activity) => {*/}
                {/*        const isAffordable = Math.abs(activity.cost || 0) <= money;*/}

                {/*        return (*/}
                {/*            <button*/}
                {/*                key={activity.id}*/}
                {/*                className={`w-full relative py-3 px-4 rounded transition flex items-start ${*/}
                {/*                    !isAffordable ? "opacity-50 cursor-not-allowed" : "hover:bg-emerald-700"*/}
                {/*                }`}*/}
                {/*                title={*/}
                {/*                    !("ontouchstart" in window) && isAffordable*/}
                {/*                        ? activity.tooltip || "No additional info."*/}
                {/*                        : ""*/}
                {/*                }*/}
                {/*                disabled={!isAffordable}*/}
                {/*                onTouchStart={() =>*/}
                {/*                    isAffordable && handleTooltipTouch(activity.id, activity.tooltip)*/}
                {/*                }*/}
                {/*                onTouchEnd={() => isAffordable && handleTooltipRelease()}*/}
                {/*                onTouchCancel={() => isAffordable && handleTooltipRelease()}*/}
                {/*                onClick={() => {*/}
                {/*                    if (isAffordable) {*/}
                {/*                        const success = performActivity(activity);*/}
                {/*                        if (success) {*/}
                {/*                            triggerToast(`✅ You performed ${activity.name}!`);*/}
                {/*                        } else {*/}
                {/*                            triggerToast(`❌ Not enough money for ${activity.name}.`);*/}
                {/*                        }*/}
                {/*                    }*/}
                {/*                }}*/}

                {/*            >*/}
                {/*                /!* Left: Info icon *!/*/}
                {/*                <div*/}
                {/*                    className="relative mr-2 mt-1 flex-shrink-0"*/}
                {/*                    onMouseEnter={() => handleTooltipHover(activity.id, activity.tooltip)}*/}
                {/*                    onMouseLeave={handleTooltipRelease}*/}
                {/*                >*/}
                {/*                    <Info*/}
                {/*                        className="w-6 h-6 sm:h-4 sm:w-4"*/}
                {/*                        id={`info-icon-${activity.id}`}*/}
                {/*                    />*/}
                {/*                </div>*/}

                {/*                /!* Center: Activity details *!/*/}
                {/*                <div className="flex-1 text-center">*/}
                {/*                    <div className="font-semibold">{activity.name}</div>*/}
                {/*                    <ul className="text-xs text-left ml-1 list-disc list-inside mt-1">*/}
                {/*                        {Object.entries(activity.effects).map(([key, val]) => (*/}
                {/*                            <li key={key}>*/}
                {/*                                {key}:{" "}*/}
                {/*                                <span*/}
                {/*                                    className={val >= 0 ? "text-green-500" : "text-red-500"}*/}
                {/*                                >*/}
                {/*                    {val > 0 ? "+" : ""}*/}
                {/*                                    {val}*/}
                {/*                </span>*/}
                {/*                            </li>*/}
                {/*                        ))}*/}
                {/*                        {activity.moneyGain && (*/}
                {/*                            <li>*/}
                {/*                                💰 Money gained:{" "}*/}
                {/*                                <span className="text-green-500">*/}
                {/*                    +{activity.moneyGain}*/}
                {/*                </span>*/}
                {/*                            </li>*/}
                {/*                        )}*/}
                {/*                    </ul>*/}
                {/*                </div>*/}

                {/*                /!* Right: Cost *!/*/}
                {/*                {activity.cost !== undefined && (*/}
                {/*                    <div className="absolute top-2 right-3 text-xs text-red-500 font-semibold">*/}
                {/*                        💸 {Math.abs(activity.cost)}*/}
                {/*                    </div>*/}
                {/*                )}*/}
                {/*            </button>*/}
                {/*        );*/}
                {/*    })*/}
                {/*) : (*/}
                {/*    <p className="text-gray-500">No activities available here.</p>*/}
                {/*)}*/}

            </div>
            {showToast && (
                <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-2 rounded shadow-lg text-sm z-50">
                    {toastMessage}
                </div>
            )}
        </div>
    );
}