// import Image from "next/image"
import { Progress } from "../ui/progress"
// import { formatMoney } from "../../utils/formatters"
import { usePlayerStatus } from "../../hooks/usePlayerStatus"
import { useGameTime } from "../../hooks/useGameTime"
import {useGame} from "../../hooks/useGame.js";
import { CircleDollarSign, Clock} from "lucide-react";
import { formatMoney } from "../../utils/formatters";

export function StatusBar() {
    const { meal, sleep, hygiene, happiness, money } = usePlayerStatus()
    const { greeting } = useGameTime()
    const { playerName, selectedAvatar } = useGame()

    return (
        <div className="py-2 px-4 lg:px-8 flex flex-col md:flex-row w-full items-start md:items-center justify-between gap-2 md:gap-4">

            {/* Avatar Info Section */}
            <div className="flex items-center gap-3 shrink-0">
                <img
                    alt={selectedAvatar.name}
                    src={selectedAvatar.avatar}
                    className="h-12 w-12 lg:h-16 lg:w-16 object-cover"
                />
                <div>
                    <p className="text-[1rem] lg:text-3xl">
                        {greeting}, <span className="font-bold">{playerName}</span>!
                    </p>
                    <div className="flex items-center gap-2">
                        <CircleDollarSign className={"text-[#F3C623]"} />
                        <p className="text-[1rem] lg:text-2xl text-[#F3C623]">{formatMoney(money)}</p>
                    </div>
                </div>
            </div>

            {/* Status Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 flex-grow w-full md:w-auto">
                <Progress value={meal} label="Meal" icon="🍗" />
                <Progress value={sleep} label="Sleep" icon="😴" />
                <Progress value={hygiene} label="Hygiene" icon="🧼" />
                <Progress value={happiness} label="Happiness" icon="😄" />
            </div>
        </div>
    )
}

