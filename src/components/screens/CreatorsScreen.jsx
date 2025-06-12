import {useGame} from "../../hooks/useGame.js";
import { ChevronLeft } from "lucide-react";
import { CREATORS } from "../../constants/creators.js"

export default function CreatorsScreen() {
    const { navigateToStart } = useGame();

    return (
        <div className={"h-svh w-svw"}>
            <header className="relative w-svw flex items-center px-2 py-4 mb-2">
                {/* Back Button */}
                <button
                    onClick={navigateToStart}
                    className="p-0 flex items-center text-sm sm:text-base bg-gray-700 hover:bg-gray-600 rounded z-10"
                >
                    <ChevronLeft className={"w-4 h-4"} /> <span className={"hidden lg:inline"}>Back</span>
                </button>

                {/* Centered Logo + Title */}
                <div className="absolute inset-0 flex justify-center items-center pointer-events-none select-none">
                    <div className="flex items-center gap-2">
                        <h1 className="hidden md:inline font-bold">The Creators</h1>
                        <h5 className="inline md:hidden font-bold text-center">The Creators</h5>
                    </div>
                </div>
            </header>
            <main className={"w-svw md:px-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[3svw]"}>
                {CREATORS.map((member, index) => (
                    <div
                        key={index}
                        className="bg-[#1a1a1a] overflow-hidden transform transition-transform hover:translate-y-[-0.5svh] hover:shadow-[0_0.8svw_1.5svw_rgba(0,0,0,0.2)]"
                    >
                        <div className="relative">
                            <img
                                src={member.image || "/placeholder.svg"}
                                alt={member.name}
                                width={300}
                                height={300}
                                className="w-full aspect-square object-cover pixelated"
                            />
                            <div className="absolute bottom-0 left-0 w-full h-[30%] bg-gradient-to-t from-[#1a1a1a] to-transparent"></div>
                        </div>

                        <div className="p-[2svw] flex flex-col">
                            <h4 className="text-[3svw] md:text-[2.2svw] lg:text-[1.6svw] text-white mb-[1svh] pixel-text">
                                {member.name}
                            </h4>

                            <p className="text-[#acacac] text-[2.8svw] md:text-[1.6svw] lg:text-[1.1svw]">
                                {member.nim}
                            </p>
                        </div>
                    </div>
                ))}
            </main>
            <footer className="mt-8 text-sm text-center">
                <p>© 2025 UMN Spacemen</p>
                <p>A project for IF231L Introduction to Internet Technology</p>
            </footer>
        </div>
    )
}