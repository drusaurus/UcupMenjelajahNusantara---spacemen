import { useEffect, useRef } from "react";
import {
    ChevronUp,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

// Map directions to key names
const KEY_MAP = {
    up: "ArrowUp",
    down: "ArrowDown",
    left: "ArrowLeft",
    right: "ArrowRight",
};

// Helper to simulate keyboard events
const simulateKey = (key, type = "keydown") => {
    const event = new KeyboardEvent(type, {
        key,
        bubbles: true,
        cancelable: true,
    });
    window.dispatchEvent(event);
};

export default function MovementControls() {
    const activeDirection = useRef(null);
    const intervalRef = useRef(null);

    const startMovement = (direction) => {
        if (intervalRef.current) return;

        const key = KEY_MAP[direction];
        if (!key) return;

        activeDirection.current = key;
        simulateKey(key, "keydown");

        intervalRef.current = setInterval(() => {
            simulateKey(key, "keydown");
        }, 100);
    };

    const stopMovement = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        if (activeDirection.current) {
            simulateKey(activeDirection.current, "keyup");
            activeDirection.current = null;
        }
    };

    const handlers = (direction) => ({
        onMouseDown: (e) => {
            e.preventDefault();
            startMovement(direction);
        },
        onMouseUp: stopMovement,
        onMouseLeave: stopMovement,
        onTouchStart: (e) => {
            e.preventDefault();
            startMovement(direction);
        },
        onTouchEnd: stopMovement,
    });

    const pixelButtonStyle = `
        w-8 h-8 md:w-12 md:h-12
        flex items-center justify-center
        border-2 border-gray-700 shadow
        rounded-sm font-mono cursor-pointer
        select-none hover:bg-gray-200
    `;

    useEffect(() => {
        return () => clearInterval(intervalRef.current);
    }, []);

    return (
        <div className="grid grid-cols-3 gap-1 items-center justify-center">
            <div></div>
            <div {...handlers("up")} className={pixelButtonStyle}>
                <ChevronUp className="w-5 h-5" style={{ imageRendering: "pixelated" }} />
            </div>
            <div></div>

            <div {...handlers("left")} className={pixelButtonStyle}>
                <ChevronLeft className="w-5 h-5" style={{ imageRendering: "pixelated" }} />
            </div>
            <div></div>
            <div {...handlers("right")} className={pixelButtonStyle}>
                <ChevronRight className="w-5 h-5" style={{ imageRendering: "pixelated" }} />
            </div>

            <div></div>
            <div {...handlers("down")} className={pixelButtonStyle}>
                <ChevronDown className="w-5 h-5" style={{ imageRendering: "pixelated" }} />
            </div>
            <div></div>
        </div>
    );
}
