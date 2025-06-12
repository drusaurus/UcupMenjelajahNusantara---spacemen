// components/game/PlayerBusyIndicator.jsx
"use client";

import React, { useEffect, useState, useRef } from 'react';

export default function PlayerBusyIndicator({ playerPixelPosition, mapAvatarSize, onSkip }) {
    const [currentFrame, setCurrentFrame] = useState(0);
    const canvasRef = useRef(null);
    const imageRef = useRef(null);
    const animationRef = useRef(null);

    // Configuration for your DialogInfo.png spritesheet
    const FRAME_WIDTH = 20;
    const FRAME_HEIGHT = 16;
    const TOTAL_FRAMES = 4;
    const FRAME_DURATION = 300; // in milliseconds
    const SPRITE_PATH = '/DialogInfo.png';

    // Load image once
    useEffect(() => {
        const img = new Image();
        img.src = SPRITE_PATH;
        imageRef.current = img;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        canvas.width = FRAME_WIDTH;
        canvas.height = FRAME_HEIGHT;

        let frame = 0;
        let lastTime = performance.now();

        function draw(time) {
            if (time - lastTime >= FRAME_DURATION) {
                frame = (frame + 1) % TOTAL_FRAMES;
                setCurrentFrame(frame); // keep React state in sync
                lastTime = time;
            }

            if (img.complete) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(
                    img,
                    frame * FRAME_WIDTH, 0,
                    FRAME_WIDTH, FRAME_HEIGHT,
                    0, 0,
                    FRAME_WIDTH, FRAME_HEIGHT
                );
            }

            animationRef.current = requestAnimationFrame(draw);
        }

        animationRef.current = requestAnimationFrame(draw);

        return () => cancelAnimationFrame(animationRef.current);
    }, []);


    const emoteSize = mapAvatarSize * 0.6;
    const wrapperStyle = {
        position: 'absolute',
        left: `${playerPixelPosition?.x ?? 0}px`,
        top: `${playerPixelPosition.y - emoteSize * 1.8}px`,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 38,
        pointerEvents: 'auto',
        gap: 2
    };

    const canvasStyle = {
        width: `${FRAME_WIDTH}px`,
        height: `${FRAME_HEIGHT}px`,
        imageRendering: 'pixelated',
        pointerEvents: 'none',
    };


    return (
        <div style={wrapperStyle}>
            <canvas ref={canvasRef} style={canvasStyle} width={FRAME_WIDTH} height={FRAME_HEIGHT} />
                <button
                    className="w-full text-center px-2 py-1 bg-neutral-700 hover:bg-neutral-600 rounded text-xs"
                    onClick={() => {
                        console.log("[PlayerCompletionEmote] Skip button clicked");
                        onSkip();
                    }}
                >
                    Skip
                </button>
        </div>
    );
}
