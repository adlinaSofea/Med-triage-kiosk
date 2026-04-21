/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * utils.ts
 *
 * Utility functions for Med Triage Kiosk.
 * Contains shared helper functions used across all components.
 *
 * Currently exports:
 * - cn() → Class name merger utility for Tailwind CSS conditional styling
 *
 * Project: Med Triage Kiosk
 * Hackathon: Project 2030 MyAI Future Hackathon — Track 3: Vital Signs
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * cn (Class Names)
 *
 * Utility function that merges Tailwind CSS class names conditionally.
 * Combines clsx (conditional class logic) with tailwind-merge (conflict resolution).
 *
 * Used throughout all components to apply dynamic styling based on
 * component state — e.g. error styling, urgency colours, active states.
 *
 * @param inputs - Any number of class values (strings, objects, arrays)
 * @returns Merged and deduplicated class string safe for Tailwind CSS
 *
 * @example
 * // Basic conditional styling
 * cn("base-class", isError && "error-class")
 *
 * // Urgency-based styling in TriageResult
 * cn("rounded-3xl p-8", config.bg, config.text)
 *
 * // Form field validation styling in PatientInfoForm
 * cn(
 *   "w-full px-4 py-3 rounded-xl border",
 *   errors.fullName
 *     ? "border-urgent/30 bg-urgent/5"  // Error state — red border
 *     : "border-white/60 bg-white/60"   // Normal state — glass border
 * )
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
