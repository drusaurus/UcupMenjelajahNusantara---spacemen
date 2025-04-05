import Image from "next/image"
import { Progress } from "../ui/progress"
import { formatMoney } from "../../utils/formatters"
import { usePlayerStatus } from "../../hooks/usePlayerStatus"
import { useGameTime } from "../../hooks/useGameTime"

export function StatusBar({ playerName, avatarSrc }) {
    const { meal, sleep, hygiene, happiness, money } = usePlayerStatus()
    const { day, formattedHour, greeting } = useGameTime()

    return (
        <div className="pixel-card p-4 mb-4">
            <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                <div className="flex items-center mb-2 md:mb-0">
                    <div className="w-12 h-12 overflow-hidden mr-3 border-2 border-amber-900 bg-amber-100">
                        <Image
                            src={avatarSrc || "/placeholder.svg"}
                            alt="Player Avatar"
                            width={48}
                            height={48}
                            className="pixelated"
                        />
                    </div>
                    <div>
                        <h2 className="text-xl text-amber-900">{playerName}</h2>
                        <p className="text-amber-700">{greeting}, Explorer!</p>
                    </div>
                </div>

                <div className="flex items-center">
                    <div className="mr-4 border-2 border-amber-900 p-2 bg-amber-100">
                        <p className="text-sm text-amber-700">Day {day}</p>
                        <p className="text-lg font-semibold text-amber-900">{formattedHour}:00</p>
                    </div>
                    <div className="border-2 border-amber-900 p-2 bg-amber-100">
                        <p className="text-sm text-amber-700">Money</p>
                        <p className="text-lg font-semibold text-amber-900">{formatMoney(money)}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Progress value={meal} max={100} color="#c2410c" label="Meal" />
                <Progress value={sleep} max={100} color="#1e40af" label="Sleep" />
                <Progress value={hygiene} max={100} color="#047857" label="Hygiene" />
                <Progress value={happiness} max={100} color="#b45309" label="Happiness" />
            </div>
        </div>
    )
}

