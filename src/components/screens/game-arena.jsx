import { StatusBar } from "../game/StatusBar.jsx";
import GameMap from "../game/GameMap.jsx";
import MovementControls from "../game/MovementControls.jsx";
import ActivityControls from "../game/ActivityControls.jsx";
import { usePlayerStatus} from "../../hooks/usePlayerStatus.js";
import InteractionControls from "../game/InteractionControls.jsx";
import {Progress} from "../ui/progress.jsx";
import ScreenTransition from "../game/ScreenTransition.jsx";
import {useGame} from "../../hooks/useGame.js";
import {usePlayerMovement} from "../../hooks/usePlayerMovement.js";

export default function GameArenaScreen() {
    usePlayerStatus()
    usePlayerMovement()
    const { meal, sleep, hygiene, happiness } = usePlayerStatus()

    return (
        <div className="flex flex-col h-lvh max-h-screen w-screen overflow-y-scroll">
            {/* Status Bar */}
            <div className="shrink-0">
                <StatusBar />
            </div>

            {/* Main game layout */}
            <div className="flex flex-row flex-grow overflow-hidden max-w-full">
                {/* Left: MovementControls (desktop only) */}
                <div className="hidden md:flex flex-col flex-1 items-center justify-around p-2 bg-neutral-800 rounded-2xl shadow-[inset_0_4px_8px_rgba(255,255,255,0.05),_0_10px_30px_rgba(0,0,0,0.5)] border border-neutral-600 ml-2 my-2">
                    <div className="w-full p-2">
                        {/* Status Grid */}
                        <div className="grid gap-2 flex-grow w-full md:w-auto">
                            <Progress value={meal} label="Meal" icon="🍗" />
                            <Progress value={sleep} label="Sleep" icon="💤" />
                            <Progress value={hygiene} label="Hygiene" icon="🧼" />
                            <Progress value={happiness} label="Happiness" icon="😄" />
                        </div>
                    </div>
                    <MovementControls />
                </div>

                {/* Center: GameMap */}
                <div className="flex-[2] flex flex-col md:flex-row items-center justify-start p-2 overflow-hidden min-h-0">
                    {/* Map Container */}
                    <div className="relative w-full md:h-full aspect-square flex-grow-0">
                        <GameMap />
                    </div>

                    {/* Mobile Controls Side-by-Side */}
                    <div className="flex md:hidden w-full rounded-2xl flex-grow  bg-neutral-800 justify-between gap-2 mt-2 min-h-0">

                        <div className="flex-1 flex flex-col justify-around items-center overflow-y-scroll">
                            <div className="w-full p-2">
                                {/* Status Grid */}
                                <div className="grid gap-2 flex-grow w-full md:w-auto">
                                    <Progress value={meal} label="Meal" icon="🍗" />
                                    <Progress value={sleep} label="Sleep" icon="💤" />
                                    <Progress value={hygiene} label="Hygiene" icon="🧼" />
                                    <Progress value={happiness} label="Happiness" icon="😄" />
                                </div>
                            </div>
                            <MovementControls />
                        </div>
                        <div className="flex-1 flex justify-center">
                            <InteractionControls />
                        </div>
                    </div>
                </div>

                {/* Right: InteractionControls (desktop only) */}
                <div className="hidden md:flex flex-1 items-center justify-center p-2 bg-neutral-800 rounded-2xl shadow-[inset_0_4px_8px_rgba(255,255,255,0.05),_0_10px_30px_rgba(0,0,0,0.5)] border border-neutral-600 mr-2 my-2">
                    <InteractionControls />
                </div>
            </div>
        </div>
    );
}