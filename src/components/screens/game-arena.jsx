import { StatusBar } from "../game/StatusBar.jsx";
import GameMap from "../game/GameMap.jsx";
import MovementControls from "../game/MovementControls.jsx";
import ActivityControls from "../game/ActivityControls.jsx";
import { usePlayerStatus} from "../../hooks/usePlayerStatus.js";

export default function GameArenaScreen() {
    usePlayerStatus()
    return (
        <div className="flex flex-col h-lvh max-h-screen w-screen overflow-hidden">
            {/* Status Bar */}
            <div className="shrink-0">
                <StatusBar />
            </div>

            {/* Main game layout */}
            <div className="flex flex-row flex-grow overflow-hidden max-w-full">
                {/* Left: MovementControls (desktop only) */}
                <div className="hidden md:flex flex-1 items-center justify-center p-2">
                    <MovementControls />
                </div>

                {/* Center: GameMap */}
                <div className="flex-[2] flex flex-col md:flex-row items-center justify-start p-2 overflow-hidden min-h-0">
                    {/* Map Container */}
                    <div className="relative w-full md:h-full aspect-square flex-grow-0">
                        <GameMap />
                    </div>

                    {/* Mobile Controls Side-by-Side */}
                    <div className="flex md:hidden w-full rounded-2xl flex-grow justify-between gap-2 mt-2 min-h-0">

                        <div className="flex-1 flex justify-center items-center">
                            <MovementControls />
                        </div>
                        <div className="flex-2 flex justify-center">
                            <ActivityControls />
                        </div>
                    </div>
                </div>

                {/* Right: ActivityControls (desktop only) */}
                <div className="hidden md:flex flex-1 items-center justify-center p-2">
                    <ActivityControls />
                </div>
            </div>
        </div>
    );
}