/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
 
/**
 * StepIndicator.tsx
 *
 * Progress indicator component for Med Triage Kiosk.
 * Shows the patient their current position in the 3-step triage journey:
 *   Step 1 → Your Info (PatientInfoForm)
 *   Step 2 → Symptoms (SymptomsForm)
 *   Step 3 → Result (TriageResult)
 *
 * Visual states:
 * - Current step: highlighted in primary blue with glow effect
 * - Completed step: shown in muted primary blue
 * - Upcoming step: shown in grey
 *
 * Fully accessible — uses aria-current="step" and screen reader labels.
 *
 * Project: Med Triage Kiosk
 * Hackathon: Project 2030 MyAI Future Hackathon — Track 3: Vital Signs
 */
 
import { ChevronRight } from "lucide-react";
import { cn } from "@/src/lib/utils";
 
//COMPONENT PROPS 
interface StepIndicatorProps {
  currentStep: number; // Active step number (1, 2, or 3)
}
 
// STEP DEFINITIONS
// Defines the 3 steps in the Med Triage Kiosk patient journey
const steps = [
  { id: 1, label: "Your Info" },  // Step 1 — PatientInfoForm
  { id: 2, label: "Symptoms" },   // Step 2 — SymptomsForm
  { id: 3, label: "Result" },     // Step 3 — TriageResult (Gemini AI output)
];
 
//COMPONENT 
export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    // Navigation landmark — accessible progress indicator
    <nav aria-label="Triage progress" className="flex items-center justify-center gap-6 my-8">
      {steps.map((step, index) => {
        // Determine step state for styling
        const isCurrent = currentStep === step.id;    // Currently active step
        const isCompleted = currentStep > step.id;    // Already completed step
        
        return (
          <div key={step.id} className="flex items-center gap-4">
            
            {/* Step indicator — dot + label */}
            <div
              aria-current={isCurrent ? "step" : undefined} // Accessibility — marks current step
              className={cn(
                "flex items-center gap-2 text-sm font-semibold transition-all duration-300",
                // Colour based on step state
                isCurrent
                  ? "text-primary"        // Active — bright blue
                  : isCompleted
                  ? "text-primary/70"     // Completed — muted blue
                  : "text-slate-400"      // Upcoming — grey
              )}
            >
              {/* Step dot indicator — with glow effect on active step */}
              <div
                aria-hidden="true"
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  isCurrent
                    ? "bg-primary shadow-[0_0_0_4px_rgba(14,165,233,0.2)]" // Active — blue with glow ring
                    : isCompleted
                    ? "bg-primary"    // Completed — solid blue
                    : "bg-slate-300"  // Upcoming — grey
                )}
              />
              
              {/* Screen reader only — announces step number */}
              <span className="sr-only">Step {step.id}: </span>
              
              {/* Step label — visible text */}
              {step.label}
              
              {/* Screen reader only — announces completion status */}
              {isCompleted && <span className="sr-only">(Completed)</span>}
            </div>
            
            {/* Separator line between steps — hidden after last step */}
            {index < steps.length - 1 && (
              <div aria-hidden="true" className="w-8 h-[1px] bg-slate-200" />
            )}
          </div>
        );
      })}
    </nav>
  );
}
