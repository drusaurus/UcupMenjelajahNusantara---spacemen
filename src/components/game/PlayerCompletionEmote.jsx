// components/game/PlayerCompletionEmote.jsx (Previously PlayerCompletionEmote.jsx)
"use client";

import React, { useEffect, useState } from 'react';
import { useGame } from '../../hooks/useGame'; // Adjust path as necessary
// ITEMS might not be needed if sprite path is directly in currentCompletionEmote.payload.sprite
// import { ITEMS } from '../../constants/items';
import Emotes from "../../constants/emotes.js";
// EMOTE_SPRITES might still be useful for generic emotes
// const EMOTE_SPRITES = {
//     "emote_happy": "/ui_icons/emotes/happy_emote.png",
//     // ... other generic emotes
// };

export default function PlayerCompletionEmote({ playerPixelPosition, mapAvatarSize }) {
    const { currentCompletionEmote } = useGame(); // Listen to the new state
    const [isVisible, setIsVisible] = useState(false);
    const [emoteSrc, setEmoteSrc] = useState(null);


    useEffect(() => {
        if (currentCompletionEmote && currentCompletionEmote.sprite) {
            setEmoteSrc(currentCompletionEmote.sprite); // Directly use the sprite from payload
            setIsVisible(true);

            const timer = setTimeout(() => {
                setIsVisible(false);
                // The CLEAR_COMPLETION_EMOTE dispatch in useGame will handle clearing the state
            }, currentCompletionEmote.duration || 1500);

            return () => clearTimeout(timer);
        } else {
            setIsVisible(false);
        }
    }, [currentCompletionEmote]);

    if (!isVisible || !emoteSrc || !playerPixelPosition) {
        return null;
    }

    const emoteSize = mapAvatarSize * 0.6;
    const style = {
        position: 'absolute',
        left: `${playerPixelPosition.x}px`,
        top: `${playerPixelPosition.y - emoteSize * 1.2}px`,
        transform: 'translateX(-50%)',
        width: `${emoteSize}px`,
        height: `${emoteSize}px`,
        zIndex: 38,
    };

    return (
        <div style={style} className="animate-popInAndOut pointer-events-none"> {/* Ensure you have this CSS animation */}
            <img
                src={emoteSrc}
                alt="completion emote"
                className="w-full h-full object-contain pixelated"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
        </div>
    );
}

// Ensure .animate-popInAndOut CSS is defined globally
