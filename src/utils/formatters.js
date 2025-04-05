import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines class names with Tailwind's utility classes
 */
export function cn(...inputs) {
    return twMerge(clsx(inputs))
}

/**
 * Formats a number as Indonesian Rupiah
 */
export function formatMoney(amount) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount)
}

