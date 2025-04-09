import {useGame} from "../../hooks/useGame.js";

export default function StartScreen() {
    const { navigateToAvatarSelection, navigateToCreators } = useGame()

    return (
        <div
            className={"flex flex-col h-svh w-svw p-4"}
            style={{
                backgroundImage: `url(/StartScreenBackground.jpeg)`, // Directly reference from the public folder
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}
        >            <content className={"flex flex-grow justify-center items-center"}>
                <div className="w-full max-w-xl flex flex-col items-center gap-8">
                    {/* Heading */}
                    <div className="w-full text-center">
                        <h1 style={{ fontSize: "text-6xl sm:text-7xl md:text-8xl lg:text-9xl" }} className="">UMN</h1>
                        <h3 className="text-2xl">Ucup Menjelajah Nusantara</h3>
                    </div>

                    {/* Buttons */}
                    <div className="w-full flex justify-between gap-4">
                        <button onClick={navigateToAvatarSelection} className="flex-1 px-4 py-2 rounded-xl font-semibold">
                            Start Game
                        </button>
                        <button onClick={navigateToCreators} className="flex-1 px-4 py-2 rounded-xl font-semibold">
                            Meet the Creators
                        </button>
                    </div>
                </div>
            </content>
            <footer className="mt-8 text-sm text-center">
                <p>© 2025 UMN Spacemen</p>
                <p>A project for IF231L Introduction to Internet Technology</p>
            </footer>
        </div>
    )
}