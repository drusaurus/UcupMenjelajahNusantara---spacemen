import { useEffect, useRef, useState } from "react";

export function useAvatarAnimation(isMoving) {
    const frameRef = useRef(0);
    const [frame, setFrame] = useState(0);
    const requestRef = useRef(null);
    const lastUpdateTimeRef = useRef(performance.now());
    const FRAME_DURATION = 160;

    const animate = (time) => {
        const delta = time - lastUpdateTimeRef.current;

        if (isMoving) {
            if (delta >= FRAME_DURATION) {
                frameRef.current = (frameRef.current + 1) % 4;
                setFrame(frameRef.current);
                lastUpdateTimeRef.current = time;
            }
            requestRef.current = requestAnimationFrame(animate);
        }
    };

    useEffect(() => {
        if (isMoving) {
            // Reset frame and timing when movement starts
            frameRef.current = 0;
            setFrame(0);
            lastUpdateTimeRef.current = performance.now();
            requestRef.current = requestAnimationFrame(animate);
        } else {
            // Stop animation loop when idle
            cancelAnimationFrame(requestRef.current);
            frameRef.current = 0;
            setFrame(0);
        }

        return () => cancelAnimationFrame(requestRef.current);
    }, [isMoving]);

    return frame;
}
