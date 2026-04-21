/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * TriageResult.tsx
 *
 * Step 3 of the Med Triage Kiosk patient journey.
 * Displays the AI-generated triage assessment from Gemini API including:
 * - Urgency level (Red/Yellow/Green) with colour-coded banner
 * - Randomly assigned queue number for ED management
 * - Triage zone assignment
 * - Immediate next step instruction
 * - Detailed instructions about what to expect
 * - Red flag warning signs to watch for
 *
 * Handles three states:
 * 1. Loading — while Gemini API is processing
 * 2. Error — if Gemini API call fails
 * 3. Result — displays full triage assessment
 *
 * Project: Med Triage Kiosk
 * Hackathon: Project 2030 MyAI Future Hackathon — Track 3: Vital Signs
 */

import { useEffect, useState } from "react";
import { PatientData, SymptomData, TriageResponse } from "../types";
import { getTriageResult } from "../lib/gemini";
import { AlertTriangle, CheckCircle2, ClipboardList, Loader2, RefreshCw, Stethoscope, Zap } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/src/lib/utils";

// COMPONENT PROPS 
interface TriageResultProps {
  key?: string;
  patient: PatientData;    // Patient personal info from Step 1
  symptoms: SymptomData;   // Symptom data from Step 2
  onReset: () => void;     // Callback to restart assessment from Step 1
}

// COMPONENT
export default function TriageResult({ patient, symptoms, onReset }: TriageResultProps) {
  
  // Result state — stores Gemini AI triage response
  const [result, setResult] = useState<TriageResponse | null>(null);
  
  // Loading state — true while waiting for Gemini API response
  const [loading, setLoading] = useState(true);
  
  // Error state — stores error message if Gemini API call fails
  const [error, setError] = useState<string | null>(null);
  
  // Queue number — randomly generated 3-digit number for ED queue management
  // Assigned once on component mount and stays fixed for this assessment
  const [queueNumber] = useState(() => Math.floor(Math.random() * 900) + 100);

  // FETCH TRIAGE RESULT 
  // Calls Gemini AI on component mount with patient and symptom data
  // Updates result state when Gemini responds
  useEffect(() => {
    async function fetchResult() {
      try {
        // Send patient data to Gemini API for clinical triage analysis
        const data = await getTriageResult(patient, symptoms);
        setResult(data);
      } catch (err) {
        // Handle API failure gracefully — show error message
        setError("Failed to generate triage result. Please see a nurse immediately.");
      } finally {
        // Always stop loading regardless of success or failure
        setLoading(false);
      }
    }
    fetchResult();
  }, [patient, symptoms]); // Re-fetch if patient or symptom data changes

  // LOADING STATE 
  // Shown while Gemini API is processing the triage request
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

  // ERROR STATE
  // Shown if Gemini API call fails — directs patient to nurse immediately
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

  // URGENCY CONFIGURATION 
  // Colour and styling config for each urgency level returned by Gemini AI
  // Red = Critical/Immediate, Yellow = Urgent, Green = Non-urgent
  const urgencyConfig = {
    Red: {
      bg: "bg-urgent",               // Red background — critical
      text: "text-white",
      dot: "bg-white animate-pulse",
      label: "Urgent care required"
    },
    Yellow: {
      bg: "bg-warning",              // Yellow background — urgent
      text: "text-white",
      dot: "bg-white animate-pulse",
      label: "Moderate care required"
    },
    Green: {
      bg: "bg-primary",              // Green/blue background — non-urgent
      text: "text-white",
      dot: "bg-white animate-pulse",
      label: "Standard care"
    }
  };

  // Get config for the urgency level returned by Gemini
  const config = urgencyConfig[result.urgency];

  //RESULT STATE 
  // Main triage result display — two column layout
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-1 md:grid-cols-[1fr,1.5fr] gap-8"
      role="main"
      aria-label="Triage Assessment Result"
    >
      {/*  LEFT COLUMN: Patient Summary */}
      {/* Shows a summary of what the patient entered for reference */}
      <aside 
        aria-label="Patient details and reported symptoms"
        className="bg-white/40 border border-white/60 rounded-3xl p-6 h-fit space-y-6"
      >
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Patient Summary</h3>
        
        <div className="space-y-4">
          {/* Patient name */}
          <section aria-label="Personal Information">
            <div className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">Full Name</div>
            <div className="text-base font-bold text-slate-800">{patient.fullName}</div>
          </section>
          
          {/* Age and gender */}
          <section aria-label="Demographics">
            <div className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">Age & Gender</div>
            <div className="text-base font-bold text-slate-800">{patient.age} yrs • {patient.gender}</div>
          </section>

          {/* Selected symptoms and description */}
          <section aria-label="Symptoms detail">
            <div className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">Reported Symptoms</div>
            <div className="text-sm font-medium text-slate-700 leading-relaxed">
              {symptoms.selectedSymptoms.join(", ")}
              {symptoms.description && <span className="block mt-1 text-xs italic">{symptoms.description}</span>}
            </div>
          </section>

          {/* Pain level with colour-coded severity badge */}
          <section aria-label="Pain assessment">
            <div className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">Pain Level</div>
            <div className="inline-block px-3 py-1 bg-urgent/10 text-urgent rounded-lg text-xs font-bold mt-1">
              <span className="sr-only">Pain level is </span>
              {symptoms.painLevel} / 10 - {symptoms.painLevel >= 7 ? "Severe" : symptoms.painLevel >= 4 ? "Moderate" : "Mild"}
            </div>
          </section>

          {/* Medical history — only shown if patient entered data */}
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

      {/* RIGHT COLUMN: AI Triage Result */}
      <div className="space-y-6 flex flex-col">
        
        {/* Urgency Banner — colour-coded based on Gemini AI assessment */}
        <section 
          aria-label={`Triage urgency: ${result.urgencyLabel}`}
          className={cn("rounded-3xl p-8 flex items-center gap-6 shadow-xl", config.bg, config.text)}
        >
          {/* Urgency icon */}
          <div 
            aria-hidden="true"
            className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-3xl font-black"
          >
            !
          </div>
          <div>
            {/* Urgency label — e.g. "EMERGENCY - RED ZONE" */}
            <h2 className="text-2xl font-black tracking-tight">{result.urgencyLabel}</h2>
            {/* One-sentence reason from Gemini — written for patient understanding */}
            <p className="text-sm opacity-90 font-medium leading-relaxed">{result.reason}</p>
          </div>
        </section>

        {/* Queue Number + Triage Zone Cards */}
        <div className="grid grid-cols-2 gap-4">
          {/* Queue Number — randomly assigned for ED queue management */}
          <section className="bg-white border border-white/60 rounded-3xl p-6 text-center shadow-sm">
            <div className="text-4xl font-black text-primary mb-1">{queueNumber.toString().padStart(3, '0')}</div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Queue Number</div>
          </section>

          {/* Triage Zone — Red, Yellow, or Green based on Gemini assessment */}
          <section className={cn(
            "border rounded-3xl p-6 text-center shadow-md transition-all duration-500 flex flex-col justify-center items-center",
            config.bg,
            config.text,
            "border-transparent"
          )}>
            <div className="text-4xl font-black mb-1 tracking-tighter">{result.urgency}</div>
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">Triage Zone</div>
          </section>
        </div>

        {/* Detailed Instructions Card */}
        <section className="bg-white/60 backdrop-blur-md border border-white/80 rounded-3xl p-8 flex-1 space-y-8">
          
          {/* Next Step — most important immediate action */}
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-primary" />
              Immediate Priority
            </h3>
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5 text-primary" />
              </div>
              {/* Next step from Gemini — clear patient-friendly instruction */}
              <p className="text-sm font-bold text-slate-800 leading-relaxed">
                {result.nextStep}
              </p>
            </div>
          </div>

          {/* Detailed Instructions — what patient should expect in their care zone */}
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 flex items-center gap-2">
              <ClipboardList className="w-3.5 h-3.5 text-slate-400" />
              What to Expect
            </h3>
            {/* Detailed explanation from Gemini written in patient-friendly language */}
            <p className="text-sm font-medium text-slate-600 leading-relaxed bg-white/40 p-5 rounded-2xl border border-white/60">
              {result.detailedInstructions}
            </p>
          </div>

          {/* Red Flags — warning signs that require immediate nurse attention */}
          {result.redFlags.length > 0 && (
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 flex items-center gap-2 text-urgent">
                <AlertTriangle className="w-3.5 h-3.5" />
                Warning Signs - Alert Staff If
              </h3>
              {/* List of red flags identified by Gemini for this patient */}
              <ul className="grid grid-cols-1 gap-2">
                {result.redFlags.map((flag, idx) => (
                  <li key={idx} className="flex gap-3 text-sm font-semibold text-slate-700 bg-urgent/5 border border-urgent/10 p-4 rounded-xl items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-urgent shrink-0" aria-hidden="true" />
                    {flag}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* Reset Button — allows patient to start a new assessment */}
        <nav className="flex justify-center pt-2">
          <button
            onClick={onReset}
            className="w-full py-4 bg-primary text-white font-bold rounded-2xl shadow-xl shadow-primary/20 hover:bg-sky-600 transition-all active:scale-[0.98]"
          >
            Start New Assessment
          </button>
        </nav>
      </div>
    </motion.div>
  );
}

