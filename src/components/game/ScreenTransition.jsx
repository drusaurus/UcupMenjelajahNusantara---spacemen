import { motion, AnimatePresence } from "motion/react";

export default function ScreenTransition({ trigger, onComplete, duration = 2.0 }) { // Added default duration
    return (
        <AnimatePresence>
            {trigger && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: duration }}
                    className="absolute inset-0 z-50 bg-black" // Changed to absolute
                    onAnimationComplete={onComplete}
                />
            )}
        </AnimatePresence>
    );
}
