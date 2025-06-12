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
  w-8 h-8                           
  sm:w-8 sm:h-8
  md:w-8 md:h-8
  lg:w-12 lg:h-12
  xl:w-20 xl:h-20
  
  flex items-center justify-center
  border-4 border-neutral-700
  rounded-full font-mono cursor-pointer
  select-none touch-none active:select-none focus:outline-none focus:ring-0
  bg-gradient-to-b from-neutral-500 to-neutral-700
  shadow-[inset_0_2px_4px_rgba(255,255,255,0.1),0_4px_6px_rgba(0,0,0,0.4)]
  hover:brightness-110
  active:translate-y-[2px] active:shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)]
  transition-all duration-150 ease-in-out
  z-0
`;

// Update icon sizes to match
    const iconSizeStyle = "w-6 h-6 sm:w-6 sm:h-6 md:w-6 md:h-6 lg:w-10 lg:h-10 xl:w-12 xl:h-12 select-none touch-none active:select-none focus:outline-none focus:ring-0";
    return (
        <div
            className="movement-controls
                grid grid-cols-3 gap-1 items-center justify-center
                bg-neutral-800 p-4
                shadow-[0_8px_24px_rgba(0,0,0,0.4)] rounded-full
                max-w-xs mx-auto md:max-w-sm lg:max-w-md
              "
        >
            <div></div>
            <div {...handlers("up")} className={pixelButtonStyle}>
                <ChevronUp
                    className={iconSizeStyle}
                    style={{ imageRendering: "pixelated" }}
                />
            </div>
            <div></div>

            <div {...handlers("left")} className={pixelButtonStyle}>
                <ChevronLeft
                    className={iconSizeStyle}
                    style={{ imageRendering: "pixelated" }}
                />
            </div>
            <div></div>
            <div {...handlers("right")} className={pixelButtonStyle}>
                <ChevronRight
                    className={iconSizeStyle}
                    style={{ imageRendering: "pixelated" }}
                />
            </div>

            <div></div>
            <div {...handlers("down")} className={pixelButtonStyle}>
                <ChevronDown
                    className={iconSizeStyle}
                    style={{ imageRendering: "pixelated" }}
                />
            </div>
            <div></div>
        </div>
    );
}