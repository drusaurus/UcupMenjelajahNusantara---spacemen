import { useEffect, useRef, useState } from 'react';

const FRAME_WIDTH = 16;
const FRAME_HEIGHT = 16;
const CHARACTER_SCALE = 2;
const DISPLAY_SCALE = 4;
const SPRITE_RENDER_SIZE = FRAME_WIDTH * CHARACTER_SCALE * DISPLAY_SCALE;

const DIRECTIONS = ['right', 'down', 'left', 'up'];
const DIRECTION_OFFSETS = {
    right: { dx: 1, dy: 0, col: 3 },
    down: { dx: 0, dy: 1, col: 0 },
    left: { dx: -1, dy: 0, col: 2 },
    up: { dx: 0, dy: -1, col: 1 },
};

export default function WalkingAnimationPreview({ walkSrc }) {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const spriteSheet = useRef(new Image());
    const [canvasSize, setCanvasSize] = useState(256); // default size

    useEffect(() => {
        const resizeCanvas = () => {
            if (containerRef.current) {
                const size = Math.min(
                    containerRef.current.offsetWidth,
                    containerRef.current.offsetHeight
                );
                setCanvasSize(size);
            }
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        return () => window.removeEventListener('resize', resizeCanvas);
    }, []);

    useEffect(() => {
        spriteSheet.current.src = walkSrc;
        spriteSheet.current.onload = () => {
            startAnimation();
        };

        const centerX = canvasSize / 2 - SPRITE_RENDER_SIZE / 2;
        const centerY = canvasSize / 2 - SPRITE_RENDER_SIZE / 2;

        let frame = 0;
        let directionIndex = 0;

        let posX = centerX;
        let posY = centerY;

        let tick = 0;
        let stepCount = 0;
        const maxSteps = 50;

        const startAnimation = () => {
            const ctx = canvasRef.current.getContext('2d');
            ctx.imageSmoothingEnabled = false;

            const loop = () => {
                tick++;

                if (tick % 8 === 0) {
                    frame = (frame + 1) % 4;
                }

                const direction = DIRECTIONS[directionIndex];
                const { dx, dy, col } = DIRECTION_OFFSETS[direction];

                if (tick % 4 === 0) {
                    posX += dx * 1.5;
                    posY += dy * 1.5;
                    stepCount++;
                }

                if (stepCount >= maxSteps) {
                    stepCount = 0;
                    directionIndex = (directionIndex + 1) % 4;

                    // Reset back to center after each direction change
                    posX = centerX;
                    posY = centerY;
                }

                ctx.clearRect(0, 0, canvasSize, canvasSize);
                ctx.drawImage(
                    spriteSheet.current,
                    col * FRAME_WIDTH, frame * FRAME_HEIGHT,
                    FRAME_WIDTH, FRAME_HEIGHT,
                    posX, posY,
                    SPRITE_RENDER_SIZE,
                    SPRITE_RENDER_SIZE
                );

                requestAnimationFrame(loop);
            };

            loop();
        };
    }, [walkSrc, canvasSize]);

    return (
        <div
            ref={containerRef}
            className="w-full h-full border border-gray-300 rounded-xl overflow-hidden flex justify-center items-center bg-white"
        >
            <canvas
                ref={canvasRef}
                width={canvasSize}
                height={canvasSize}
                style={{ width: '100%', height: '100%' }}
            />
        </div>
    );
}
