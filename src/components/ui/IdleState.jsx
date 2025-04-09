import React from "react";
import Image from "next/image";
import IdleSprite from "/public/Idle.png"; // assuming you moved it to public root

const directionMap = {
    down: 0,
    left: 1,
    right: 2,
    up: 3,
};

export default function IdleState({ direction = "down", size = 48 }) {
    const frameIndex = directionMap[direction] ?? 0;
    const frameWidth = 16;
    const frameHeight = 16;

    return (
        <div
            style={{
                width: size,
                height: size,
                overflow: "hidden",
                imageRendering: "pixelated",
            }}
        >
            <div
                style={{
                    width: frameWidth * 4, // full sprite sheet width
                    height: frameHeight,
                    transform: `translateX(-${frameIndex * frameWidth}px)`,
                }}
            >
                <Image
                    src={IdleSprite}
                    alt={`Idle facing ${direction}`}
                    width={frameWidth * 4}
                    height={frameHeight}
                />
            </div>
        </div>
    );
}
