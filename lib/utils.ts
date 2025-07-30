import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Capitalizes the first letter of a string.
 */
export function capitalize(str: string) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Truncates a string to a given length and adds ellipsis if needed.
 */
export function truncate(str: string, maxLength: number) {
  if (!str || str.length <= maxLength) return str;
  return str.slice(0, maxLength) + "...";
}
