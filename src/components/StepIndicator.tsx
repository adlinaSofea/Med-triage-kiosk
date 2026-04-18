/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChevronRight } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface StepIndicatorProps {
  currentStep: number;
}

const steps = [
  { id: 1, label: "Your Info" },
  { id: 2, label: "Symptoms" },
  { id: 3, label: "Result" },
];

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <nav aria-label="Triage progress" className="flex items-center justify-center gap-6 my-8">
      {steps.map((step, index) => {
        const isCurrent = currentStep === step.id;
        const isCompleted = currentStep > step.id;
        
        return (
          <div key={step.id} className="flex items-center gap-4">
            <div
              aria-current={isCurrent ? "step" : undefined}
              className={cn(
                "flex items-center gap-2 text-sm font-semibold transition-all duration-300",
                isCurrent
                  ? "text-primary"
                  : isCompleted
                  ? "text-primary/70"
                  : "text-slate-400"
              )}
            >
              <div
                aria-hidden="true"
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  isCurrent
                    ? "bg-primary shadow-[0_0_0_4px_rgba(6,161,110,0.2)]"
                    : isCompleted
                    ? "bg-primary"
                    : "bg-slate-300"
                )}
              />
              <span className="sr-only">Step {step.id}: </span>
              {step.label}
              {isCompleted && <span className="sr-only">(Completed)</span>}
            </div>
            {index < steps.length - 1 && (
              <div aria-hidden="true" className="w-8 h-[1px] bg-slate-200" />
            )}
          </div>
        );
      })}
    </nav>
  );
}
