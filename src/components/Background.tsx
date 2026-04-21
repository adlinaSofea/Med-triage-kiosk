/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Background.tsx
 *
 * Animated decorative background component for Med Triage Kiosk.
 * Creates a calming, medical-themed visual atmosphere using:
 * - 4 animated blurred circles in soft blue and indigo tones
 * - Smooth infinite animations — gentle movement and pulsing
 * - Fixed positioning so it stays behind all content
 * - Glassmorphism-compatible design — works with frosted glass UI cards
 *
 * Design intent: The soft blue ocean palette and gentle animations
 * create a calm, reassuring environment for patients who may be
 * anxious or unwell — reducing stress at the ED entrance.
 *
 * Uses: Framer Motion (motion/react) for smooth CSS animations
 *
 * Project: Med Triage Kiosk
 * Hackathon: Project 2030 MyAI Future Hackathon — Track 3: Vital Signs
 */

import { motion } from "motion/react";

//  COMPONENT 
export default function Background() {
  return (
    // Fixed container — stays in place while content scrolls above it
    // -z-10 ensures background stays behind all UI elements
    <div className="fixed inset-0 -z-10 overflow-hidden bg-slate-50">

      {/*  CIRCLE 1: Top Left — Sky Blue  */}
      {/* Drifts slowly to the right and up, then returns — creates gentle flow */}
      <motion.div
        animate={{
          x: [0, 100, 0],   // Move 100px right then return
          y: [0, -50, 0],   // Move 50px up then return
        }}
        transition={{
          duration: 20,      // Full cycle takes 20 seconds
          repeat: Infinity,  // Loop forever
          ease: "linear",    // Constant speed — no acceleration
        }}
        className="absolute -top-20 -left-20 h-96 w-96 rounded-full bg-sky-100/50 blur-3xl"
      />

      {/*  CIRCLE 2: Right Side — Blue  */}
      {/* Drifts to the left and down — creates diagonal counter-movement */}
      <motion.div
        animate={{
          x: [0, -80, 0],   // Move 80px left then return
          y: [0, 120, 0],   // Move 120px down then return
        }}
        transition={{
          duration: 25,      // Slower cycle — 25 seconds for variety
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-1/2 -right-20 h-96 w-96 rounded-full bg-blue-100/50 blur-3xl"
      />

      {/* CIRCLE 3: Bottom Left — Indigo */}
      {/* Smaller circle — drifts right and up for depth variation */}
      <motion.div
        animate={{
          x: [0, 40, 0],    // Move 40px right then return
          y: [0, -100, 0],  // Move 100px up then return
        }}
        transition={{
          duration: 18,      // Fastest cycle — 18 seconds
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute bottom-[-10%] left-1/4 h-64 w-64 rounded-full bg-indigo-100/50 blur-3xl"
      />

      {/* CIRCLE 4: Top Right — Soft Blue */}
      {/* Pulses in and out — adds subtle breathing effect to background */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1], // Expand to 120% then shrink back to 100%
        }}
        transition={{
          duration: 15,        // Slow pulse — 15 seconds per cycle
          repeat: Infinity,
          ease: "easeInOut",   // Smooth acceleration and deceleration
        }}
        className="absolute top-10 right-1/4 h-48 w-48 rounded-full bg-blue-50/80 blur-2xl"
      />
    </div>
  );
}

