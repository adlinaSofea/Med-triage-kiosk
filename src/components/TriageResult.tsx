/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from "react";
import { PatientData, SymptomData, TriageResponse } from "../types";
import { getTriageResult } from "../lib/gemini";
import { AlertTriangle, CheckCircle2, ClipboardList, Loader2, RefreshCw, Stethoscope, Zap } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/src/lib/utils";

interface TriageResultProps {
  key?: string;
  patient: PatientData;
  symptoms: SymptomData;
  onReset: () => void;
}

export default function TriageResult({ patient, symptoms, onReset }: TriageResultProps) {
  const [result, setResult] = useState<TriageResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [queueNumber] = useState(() => Math.floor(Math.random() * 900) + 100);

  useEffect(() => {
    async function fetchResult() {
      try {
        const data = await getTriageResult(patient, symptoms);
        setResult(data);
      } catch (err) {
        setError("Failed to generate triage result. Please see a nurse immediately.");
      } finally {
        setLoading(false);
      }
    }
    fetchResult();
  }, [patient, symptoms]);

  if (loading) {
    return (
      <div 
        role="status"
        aria-live="polite"
        className="w-full max-w-2xl mx-auto rounded-3xl p-12 text-center"
      >
        <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" aria-hidden="true" />
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">Analyzing Symptoms...</h2>
        <p className="text-slate-500 mt-2 text-sm italic">
          "Providing accurate info helps us prioritize your care."
        </p>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div 
        role="alert"
        className="w-full max-w-2xl mx-auto bg-white/40 border border-urgent/20 rounded-3xl p-8 text-center"
      >
        <AlertTriangle className="w-12 h-12 text-urgent mx-auto mb-4" aria-hidden="true" />
        <h2 className="text-xl font-bold text-urgent tracking-tight">System Error</h2>
        <p className="text-slate-700 mt-2">{error}</p>
        <button
          onClick={onReset}
          className="mt-6 px-8 py-3 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-900 transition-all active:scale-95"
        >
          Try Again
        </button>
      </div>
    );
  }

  const urgencyConfig = {
    Red: {
      bg: "bg-urgent",
      text: "text-white",
      dot: "bg-white animate-pulse",
      label: "Urgent care required"
    },
    Yellow: {
      bg: "bg-warning",
      text: "text-white",
      dot: "bg-white animate-pulse",
      label: "Moderate care required"
    },
    Green: {
      bg: "bg-primary",
      text: "text-white",
      dot: "bg-white animate-pulse",
      label: "Standard care"
    }
  };

  const config = urgencyConfig[result.urgency];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-1 md:grid-cols-[1fr,1.5fr] gap-8"
      role="main"
      aria-label="Triage Assessment Result"
    >
      {/* Patient Summary Column */}
      <aside 
        aria-label="Patient details and reported symptoms"
        className="bg-white/40 border border-white/60 rounded-3xl p-6 h-fit space-y-6"
      >
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Patient Summary</h3>
        
        <div className="space-y-4">
          <section aria-label="Personal Information">
            <div className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">Full Name</div>
            <div className="text-base font-bold text-slate-800">{patient.fullName}</div>
          </section>
          
          <section aria-label="Demographics">
            <div className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">Age & Gender</div>
            <div className="text-base font-bold text-slate-800">{patient.age} yrs • {patient.gender}</div>
          </section>

          <section aria-label="Symptoms detail">
            <div className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">Reported Symptoms</div>
            <div className="text-sm font-medium text-slate-700 leading-relaxed">
              {symptoms.selectedSymptoms.join(", ")}
              {symptoms.description && <span className="block mt-1 text-xs italic">{symptoms.description}</span>}
            </div>
          </section>

          <section aria-label="Pain assessment">
            <div className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">Pain Level</div>
            <div className="inline-block px-3 py-1 bg-urgent/10 text-urgent rounded-lg text-xs font-bold mt-1">
              <span className="sr-only">Pain level is </span>
              {symptoms.painLevel} / 10 - {symptoms.painLevel >= 7 ? "Severe" : symptoms.painLevel >= 4 ? "Moderate" : "Mild"}
            </div>
          </section>

          {(patient.preExisting || patient.medications) && (
            <section aria-label="Medical background">
              <div className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">Medical Context</div>
              <div className="text-xs font-medium text-slate-600 leading-relaxed">
                {patient.preExisting && `History: ${patient.preExisting}`}
                {patient.medications && `Medications: ${patient.medications}`}
              </div>
            </section>
          )}
        </div>
      </aside>

      {/* Result Panel Column */}
      <div className="space-y-6 flex flex-col">
        {/* Urgency Card */}
        <section 
          aria-label={`Triage urgency: ${result.urgencyLabel}`}
          className={cn("rounded-3xl p-8 flex items-center gap-6 shadow-xl", config.bg, config.text)}
        >
          <div 
            aria-hidden="true"
            className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-3xl font-black"
          >
            !
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight">{result.urgencyLabel}</h2>
            <p className="text-sm opacity-90 font-medium leading-relaxed">{result.reason}</p>
          </div>
        </section>

        <div className="grid grid-cols-2 gap-4">
          {/* Queue Card */}
          <section className="bg-white border border-white/60 rounded-3xl p-6 text-center shadow-sm">
            <div className="text-4xl font-black text-primary mb-1">{queueNumber.toString().padStart(3, '0')}</div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Queue Number</div>
          </section>

          {/* Triage Zone Card */}
          <section className="bg-white border border-white/60 rounded-3xl p-6 text-center shadow-sm">
            <div className="text-4xl font-black text-primary mb-1">{result.urgency}</div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Triage Zone</div>
          </section>
        </div>

        {/* Instructions Card */}
        <section className="bg-white/60 backdrop-blur-md border border-white/80 rounded-3xl p-8 flex-1">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            Next Steps
          </h3>
          <ul className="space-y-3">
            <li className="flex gap-3 text-sm font-medium text-slate-700">
              <span className="text-primary font-bold" aria-hidden="true">→</span>
              {result.nextStep}
            </li>
            {result.redFlags.map((flag, idx) => (
              <li key={idx} className="flex gap-3 text-sm font-medium text-slate-700">
                <span className="text-primary font-bold" aria-hidden="true">→</span>
                {flag}
              </li>
            ))}
          </ul>
        </section>

        <nav className="flex justify-center pt-2">
          <button
            onClick={onReset}
            className="w-full py-4 bg-primary text-white font-bold rounded-2xl shadow-xl shadow-primary/20 hover:bg-emerald-700 transition-all active:scale-[0.98]"
          >
            Start New Assessment
          </button>
        </nav>
      </div>
    </motion.div>
  );
}
