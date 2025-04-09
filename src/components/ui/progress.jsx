import { useState, useEffect } from "react";

export function Progress({ value, max = 100, label, icon }) {
    const [tooltipVisible, setTooltipVisible] = useState(false);
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));

    const getColor = (percent) => {
        if (percent > 80) return "bg-green-600";
        if (percent > 60) return "bg-yellow-400";
        if (percent > 40) return "bg-orange-400";
        if (percent > 20) return "bg-red-500";
        return "bg-red-800";
    };

    const barColor = getColor(percentage);

    useEffect(() => {
        if (tooltipVisible) {
            const timer = setTimeout(() => setTooltipVisible(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [tooltipVisible]);

    const handleClick = () => {
        setTooltipVisible(true);
    };

    return (
        <div className="w-full">
            {/* Label Row for md+ */}
            <div className="hidden md:flex flex-col items-center justify-center mb-1">
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-1">
                        <span className="text-sm">{icon}</span>
                        <span className="text-sm">{label}</span>
                    </div>
                    <span className="text-sm font-medium">{Math.round(percentage)}%</span>
                </div>
            </div>

            <div
                className="relative group w-full flex items-center gap-2 md:block"
                onClick={handleClick}
            >
                {/* Icon for sm view only */}
                <span className="md:hidden text-sm">{icon}</span>

                {/* Tooltip */}
                <div
                    className={`absolute left-1/2 -translate-x-1/2 -top-8 z-10 transition-opacity duration-300 pointer-events-none ${
                        tooltipVisible ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    }`}
                >
                    <div className="bg-black text-white text-[10px] md:text-xs px-2 py-1 rounded relative whitespace-nowrap">
                        <span className="block md:hidden">
                            {label} – {percentage.toFixed(1)}%
                        </span>
                        <span className="hidden md:block">
                            {percentage.toFixed(1)}%
                        </span>
                        <div className="absolute left-1/2 -translate-x-1/2 top-full w-2 h-2 bg-black rotate-45" />
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-3 lg:h-5 bg-gray-900 rounded-sm border border-white shadow-[2px_2px_0px_#000] overflow-hidden">
                    <div
                        className={`h-full transition-all duration-500 ease-in-out ${barColor}`}
                        style={{ width: `${percentage}%` }}
                    />
                </div>
            </div>
        </div>
    );
}
