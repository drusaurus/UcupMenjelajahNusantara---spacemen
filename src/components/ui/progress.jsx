export function Progress({ value, max, color, label }) {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100))

    return (
        <div className="w-full">
            {label && (
                <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-amber-900">{label}</span>
                    <span className="text-sm font-medium text-amber-900">{Math.round(percentage)}%</span>
                </div>
            )}
            <div className="pixel-progress">
                <div
                    className="pixel-progress-value"
                    style={{
                        width: `${percentage}%`,
                        backgroundColor: color,
                    }}
                />
            </div>
        </div>
    )
}

