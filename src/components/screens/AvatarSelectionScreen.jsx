import { useGame } from "../../hooks/useGame.js";
import { useState } from "react";
import { ArrowBigLeft } from 'lucide-react';
import { AVATARS } from "../../constants/avatars.js";
import WalkingAnimationPreview from "../ui/WalkAnimationPreview.jsx";

export default function AvatarSelectionScreen() {
    const { navigateToStart, startGame } = useGame();
    const [selectedAvatar, setSelectedAvatar] = useState(null);
    const [playerName, setPlayerName] = useState("");
    const [page, setPage] = useState(0); // Moved page state here
    const [error, setError] = useState("");

    const AVATARS_PER_PAGE = 12;
    const totalPages = Math.ceil(AVATARS.length / AVATARS_PER_PAGE);

    const startIndex = page * AVATARS_PER_PAGE;
    const currentAvatars = AVATARS.slice(startIndex, startIndex + AVATARS_PER_PAGE);

    const paddedAvatars = [
        ...currentAvatars,
        ...Array(AVATARS_PER_PAGE - currentAvatars.length).fill(null),
    ];

    const goToNextPage = () => {
        if (page < totalPages - 1) setPage(page + 1);
    };

    const goToPrevPage = () => {
        if (page > 0) setPage(page - 1);
    };

    const handleStartGame = () => {
        if (!playerName.trim()) {
            setError("Please enter your name")
            return
        }

        if(!selectedAvatar) return setError(
            "Please select an avatar"
        )

        console.log(selectedAvatar)

        startGame(playerName, selectedAvatar)
    }

    function AvatarSelector() {
        return (
            <div className="flex flex-col items-center space-y-4 w-fit mx-auto">
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                    {paddedAvatars.map((avatar, index) => (
                        <div
                            key={avatar?.id || `placeholder-${index}`}
                            className={`w-[6rem] h-[6rem] p-2 rounded flex items-center justify-center ${
                                !avatar ? "invisible" : ""
                            }`}
                        >
                            {avatar && (
                                <div
                                    onClick={() => setSelectedAvatar(avatar)}
                                    className={`cursor-pointer rounded-lg p-1 transition border-4 ${
                                        selectedAvatar?.id === avatar.id
                                            ? "border-gray-500"
                                            : "border-transparent"
                                    } hover:border-gray-500 bg-neutral-900`}
                                >
                                    <img
                                        src={avatar.avatar}
                                        alt={avatar.alt}
                                        className="w-20 h-20 object-contain"
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="flex justify-center items-center space-x-4 mt-2">
                    <button
                        onClick={goToPrevPage}
                        disabled={page === 0}
                        className="px-3 py-1 rounded disabled:opacity-50"
                    >
                        Prev
                    </button>
                    <span className="font-mono">{`Page ${page + 1} of ${totalPages}`}</span>
                    <button
                        onClick={goToNextPage}
                        disabled={page === totalPages - 1}
                        className="px-3 py-1 rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        );
    }


    function AvatarPreview() {
        if (!selectedAvatar) return null;

        return (
            <div className="mt-6 max-w-fit mx-auto text-center space-y-2">
                <div className="flex flex-wrap justify-center gap-6">
                    {/*<div>*/}
                    {/*    <p className="mb-1">Idle</p>*/}
                    {/*    <img*/}
                    {/*        src={selectedAvatar.animation.idle}*/}
                    {/*        alt="Idle animation"*/}
                    {/*        className="w-24 h-24 object-contain border border-gray-400 rounded-md"*/}
                    {/*    />*/}
                    {/*</div>*/}
                    <div>
                        <WalkingAnimationPreview walkSrc={selectedAvatar.animation.walk} />
                    </div>
                </div>
            </div>
        );
    }


    return (
        <div className="flex flex-col min-h-svh w-svw">
            <header className="relative w-full flex items-center px-4 sm:px-8 md:px-12 lg:px-16 py-2 lg:py-4">
                <button
                    onClick={navigateToStart}
                    className="min-w-[40px] hover:bg-gray-600 px-3 py-1 rounded z-10 flex items-center gap-1 text-base"
                >
                    <ArrowBigLeft className="w-6 h-6" />
                    <span className="hidden sm:inline">Back</span>
                </button>

                <div className="absolute inset-0 flex justify-center items-center pointer-events-none select-none">
                    <div className="flex items-center gap-2">
                        <h1 className="text-lg sm:text-2xl font-bold">UMN</h1>
                    </div>
                </div>
            </header>

            <main className="flex-1 px-4 sm:px-6 py-2">
                <div className="w-full sm:max-w-[60%] mx-auto mb-4">
                    <div className="mb-2">
                        <label htmlFor="playerName" className="block text-lg font-medium mb-2">
                            Enter Your Name:
                        </label>
                        <input
                            id="playerName"
                            type="text"
                            value={playerName}
                            onChange={(e) => setPlayerName(e.target.value)}
                            placeholder="Your explorer name"
                            className="w-full pixel-input text-lg dark:bg-neutral-900 bg-neutral-100 dark:text-gray-100 text-gray-950 rounded-xl px-4 py-2"
                        />
                    </div>
                </div>

                <div className="flex flex-col-reverse md:flex-row md:items-start gap-6 mb-4">
                    {/* Avatar Selector - Bottom on mobile, left on desktop */}
                    <div className="w-full md:w-2/3">
                        <h3 className="text-lg font-medium mb-3 text-center max-w-fit">Choose Your Avatar:</h3>
                        <AvatarSelector />
                    </div>
                    {/* Avatar Preview - Top on mobile, right on desktop */}
                    <div className="w-full md:w-1/3">
                        <h3 className="text-lg font-medium mb-3 text-center max-w-fit">Preview Avatar</h3>
                        <AvatarPreview />
                    </div>
                </div>


                <div className="text-center">
                    {error && <p className="text-red-600 mb-4 text-center">{error}</p>}
                    <button className="w-100% max-w-xs px-4 py-2 rounded-xl font-semibold"
                    onClick={handleStartGame}>
                        Start Exploring
                    </button>
                </div>
            </main>
        </div>
    );
}
