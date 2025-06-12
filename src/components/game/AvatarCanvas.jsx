"use client";

import { useRef, useEffect } from "react";

const FRAME_WIDTH = 16;
const FRAME_HEIGHT = 16;
const DIRECTION_COLUMNS = {
    down: 0,
    up: 1,
    left: 2,
    right: 3,
};

export default function AvatarCanvas({ avatar, direction, frame, size }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (!avatar || !canvasRef.current) return;

        const ctx = canvasRef.current.getContext("2d");
        if (!ctx) return;

        const isMoving = frame !== 0;
        const imageSrc = isMoving && avatar.animation.walk ? avatar.animation.walk : avatar.animation.idle;

        const image = new Image();
        image.src = imageSrc;

        const draw = () => {
            const column = DIRECTION_COLUMNS[direction] ?? 0;
            ctx.clearRect(0, 0, size, size);
            ctx.imageSmoothingEnabled = false;
            ctx.drawImage(
                image,
                column * FRAME_WIDTH,
                frame * FRAME_HEIGHT,
                FRAME_WIDTH,
                FRAME_HEIGHT,
                0,
                0,
                size,
                size
            );
        };

        if (image.complete) {
            draw();
        } else {
            image.onload = draw;
        }
    }, [avatar, direction, frame, size]);

    return <canvas ref={canvasRef} width={size} height={size} className="pixelated" />;
}
