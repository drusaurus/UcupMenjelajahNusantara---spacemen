"use client"

import { useGame } from "../../hooks/useGame.js"
import AvatarCanvas from "../../components/game/AvatarCanvas.jsx" // Adjust path as needed

export default function GameOverScreen() {
    const { gameOverReason, selectedAvatar, restartGame } = useGame()

    return (
        <main className="flex flex-col items-center justify-around h-svh w-svw">
            <div>
                <h1 className={"text-9xl text-center"}>Game Over</h1>
                <h5 className={"w-svw text-wrap text-center"}>{gameOverReason}</h5>
            </div>
            <div>
                {selectedAvatar && (
                    <AvatarCanvas
                        avatar={{
                            animation: {
                                idle: selectedAvatar.dead,
                                walk: null,
                            }
                        }}
                        direction="down"
                        frame={0}
                        size={256} // Change this to your preferred sprite size
                    />
                )}
            </div>
            <div>
                <button onClick={restartGame} className="px-4 py-2 rounded-xl font-semibold">
                    Play Again
                </button>
            </div>
        </main>
    )
}
