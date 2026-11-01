import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Consistent price formatter that avoids SSR hydration mismatches
 * between server-side Node and client-side browser locales.
 */
export function formatPrice(amount: number): string {
  if (typeof amount !== 'number' || isNaN(amount)) return '0';
  return Math.round(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
