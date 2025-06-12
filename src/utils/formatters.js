import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines class names with Tailwind's utility classes
 */
export function cn(...inputs) {
    return twMerge(clsx(inputs))
}

export function formatMoney(amount) {
    return new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount)
}
