// components/ui/Progress.jsx
"use client";

import { useState, useEffect } from "react";

export function Progress({ value, max = 100, label, icon }) {
    const [tooltipVisible, setTooltipVisible] = useState(false);
    // Ensure percentage is between 0 and 100
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));

    // Determine bar color based on percentage
    const getColor = (percent) => {
        if (percent > 80) return "bg-green-600";
        if (percent > 60) return "bg-yellow-400"; // Adjusted from bg-yellow-400 for better visibility
        if (percent > 40) return "bg-orange-500"; // Adjusted from bg-orange-400
        if (percent > 20) return "bg-red-600";    // Adjusted from bg-red-500
        return "bg-red-700";                     // Adjusted from bg-red-800
    };

    const barColor = getColor(percentage);

    // Tooltip visibility timer
    useEffect(() => {
        if (tooltipVisible) {
            const timer = setTimeout(() => setTooltipVisible(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [tooltipVisible]);

    const handleClick = (e) => {
        // Prevent click from propagating if inside another clickable element
        e.stopPropagation();
        setTooltipVisible(true);
    };

    return (
        <div className="w-full">
            <div className="w-full mb-0.5 xl:mb-1">
                <div className="flex items-center justify-between w-full hidden xl:flex">
                    <div className="flex items-center gap-1 overflow-hidden"> {/* Added overflow-hidden for long labels */}
                        {icon && <span className="text-xs lg:text-sm xl:text-base flex-shrink-0">{icon}</span>}
                        {label && <span className="text-xs lg:text-sm xl:text-base font-medium text-neutral-200 truncate">{label}</span>}
                    </div>
                    <span className="text-[10px] lg:text-xs xl:text-sm font-medium text-neutral-300 flex-shrink-0 ml-2">
                        {Math.round(percentage)}%
                    </span>
                </div>
            </div>

            {/* Progress Bar and Tooltip Container */}
            <div
                className="relative group w-full cursor-pointer flex gap-2 items-center" // Simplified container, always w-full
                onClick={handleClick}
                role="progressbar"
                aria-valuenow={percentage}
                aria-valuemin="0"
                aria-valuemax="100"
                aria-label={`${label} progress`}
            >
                <div className="flex items-center gap-1 xl:hidden">
                    {icon && <span className="text-xs lg:text-sm xl:text-base flex-shrink-0">{icon}</span>}
                </div>
                {/* Tooltip */}
                <div
                    className={`absolute left-1/2 -translate-x-1/2 -top-7 xl:-top-8 z-20 transition-opacity duration-300 pointer-events-none ${
                        tooltipVisible ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    }`}
                >
                    <div className="bg-black text-white text-[10px] xl:text-xs px-2 py-1 rounded shadow-lg relative whitespace-nowrap">
                        {/* Tooltip content already responsive in your original code */}
                        <span className="block xl:hidden">
                            {label} – {percentage.toFixed(1)}%
                        </span>
                        <span className="hidden xl:block">
                            {percentage.toFixed(1)}%
                        </span>
                        {/* Tooltip arrow */}
                        <div className="absolute left-1/2 -translate-x-1/2 top-full w-2.5 h-2.5 bg-black transform rotate-45 -mt-1.5" />
                    </div>
                </div>
                <div className="w-full h-2.5 lg:h-3 xl:h-3 lg:h-4 bg-neutral-700 rounded-sm border border-neutral-500 shadow-[1px_1px_0px_rgba(0,0,0,0.5),_inset_0_1px_1px_rgba(255,255,255,0.1)] overflow-hidden">
                    <div
                        className={`h-full transition-all duration-500 ease-out ${barColor}`}
                        style={{ width: `${percentage}%` }}
                    />
                </div>
            </div>
        </div>
    );
}
