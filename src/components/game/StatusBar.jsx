// import Image from "next/image"
import { Progress } from "../ui/progress"
// import { formatMoney } from "../../utils/formatters"
import { usePlayerStatus } from "../../hooks/usePlayerStatus"
import { useGameTime } from "../../hooks/useGameTime"
import {useGame} from "../../hooks/useGame.js";
import { CircleDollarSign, Clock, Trophy} from "lucide-react";
import { formatMoney } from "../../utils/formatters";
import {useInventory} from "../../hooks/useInventory.js";

export function StatusBar() {
    const { money, score } = usePlayerStatus()
    const { greeting } = useGameTime()
    const { playerName, selectedAvatar } = useGame()
    const { openInventoryModal, isInventoryModalOpen } = useInventory()

    const handleInventoryModal = () => {
        if (openInventoryModal) {
            openInventoryModal();
        } else {
            console.warn("openInventoryModal function is not available from useGame hook.");
        }
    }

    return (
        <div className="py-2 px-4 lg:px-8 flex w-full items-start md:items-center justify-between gap-2 md:gap-4">

            {/* Avatar Info Section */}
            <div className="flex items-center gap-3 shrink-0 max-w-9/12">
                <img
                    alt={selectedAvatar.name}
                    src={selectedAvatar.avatar}
                    className="h-16 w-16 lg:h-16 lg:w-16 object-cover"
                />
                <div>
                    <p className="text-[1rem] lg:text-3xl">
                        {greeting}, <span className="font-bold">{playerName}</span>!
                    </p>
                    <div className="flex items-center gap-4">
                        {/* Score */}
                        <div className="flex items-center gap-1">
                            <Trophy className="text-[#F3C623] h-5 w-5" />
                            <p className="text-[0.95rem] lg:text-2xl text-[#F3C623]">{score}</p>
                        </div>

                        {/* Money */}
                        <div className="flex items-center gap-1">
                            <CircleDollarSign className="text-[#F3C623] h-5 w-5" />
                            <p className="text-[0.75rem] lg:text-xl text-[#F3C623]">{formatMoney(money)}</p>
                        </div>
                    </div>

                </div>
            </div>

            {/* Inventory Button */}
            <div className="ml-auto">
                <button onClick={handleInventoryModal}
                        disabled={isInventoryModalOpen}
                    className="bg-neutral-700 hover:bg-neutral-700 text-white text-sm lg:text-base px-3 py-1.5 rounded-md border border-neutral-600 shadow transition">
                    🎒 <span className={"hidden md:inline"}>Inventory</span>
                </button>
            </div>
        </div>
    )
}

