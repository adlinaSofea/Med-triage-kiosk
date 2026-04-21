/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * App.tsx
 *
 * Root component of Med Triage Kiosk application.
 * Manages the 3-step patient triage journey and global application state.
 *
 * Application flow:
 *   Step 1 → PatientInfoForm  — Collect patient personal information
 *   Step 2 → SymptomsForm     — Collect symptom data and pain level
 *   Step 3 → TriageResult     — Display Gemini AI triage assessment
 *
 * State management:
 * - step: tracks current step (1, 2, or 3)
 * - patientData: stores patient personal info from Step 1
 * - symptomData: stores symptom data from Step 2
 *
 * Built with: React + TypeScript + Vite
 * AI: Google Gemini API via Google AI Studio
 * Deployed on: Google Cloud Run
 *
 * Project: Med Triage Kiosk
 * Hackathon: Project 2030 MyAI Future Hackathon — Track 3: Vital Signs
 * Organised by: GDG On Campus UTM
 */

import { useState } from "react";
import Background from "./components/Background";
import StepIndicator from "./components/StepIndicator";
import PatientInfoForm from "./components/PatientInfoForm";
import SymptomsForm from "./components/SymptomsForm";
import TriageResult from "./components/TriageResult";
import { PatientData, SymptomData } from "./types";
import { AnimatePresence } from "motion/react";

//ROOT COMPONENT 
export default function App() {

  // APPLICATION STATE 

  // Current step in the triage journey (1 = Info, 2 = Symptoms, 3 = Result)
  const [step, setStep] = useState(1);

  // Patient personal data — collected in Step 1 (PatientInfoForm)
  // Passed to Gemini AI in Step 3 for triage analysis
  const [patientData, setPatientData] = useState<PatientData>({
    fullName: "",
    age: "",
    gender: "",
    phone: "",
    preExisting: "",   // Optional — pre-existing medical conditions
    medications: "",   // Optional — current medications
  });

  // Symptom data — collected in Step 2 (SymptomsForm)
  // Passed to Gemini AI in Step 3 for triage analysis
  const [symptomData, setSymptomData] = useState<SymptomData>({
    painDuration: "",        // How long patient has had symptoms
    selectedSymptoms: [],    // Array of selected symptoms from checklist
    description: "",         // Free-text symptom description
    painLevel: 0,            // Pain scale 0-10
  });

  // STEP HANDLERS

  /**
   * handleInfoSubmit
   * Called when patient completes Step 1 (PatientInfoForm)
   * Saves patient data and advances to Step 2 (Symptoms)
   */
  const handleInfoSubmit = (data: PatientData) => {
    setPatientData(data);       // Save patient info to state
    setStep(2);                 // Advance to symptoms step
    window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to top for new step
  };

  /**
   * handleSymptomsSubmit
   * Called when patient completes Step 2 (SymptomsForm)
   * Saves symptom data and advances to Step 3 (Gemini AI triage result)
   */
  const handleSymptomsSubmit = (data: SymptomData) => {
    setSymptomData(data);       // Save symptom data to state
    setStep(3);                 // Advance to result step — triggers Gemini API call
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /**
   * handleBack
   * Called when patient presses Back in Step 2 (SymptomsForm)
   * Returns to Step 1 (PatientInfoForm) — preserves entered data
   */
  const handleBack = () => {
    setStep(1);                 // Go back to patient info step
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /**
   * handleReset
   * Called when patient starts a new assessment from Step 3 (TriageResult)
   * Clears all state and returns to Step 1 — ready for next patient
   */
  const handleReset = () => {
    setStep(1); // Return to first step

    // Clear all patient data — ready for next patient
    setPatientData({
      fullName: "",
      age: "",
      gender: "",
      phone: "",
      preExisting: "",
      medications: "",
    });

    // Clear all symptom data
    setSymptomData({
      painDuration: "",
      selectedSymptoms: [],
      description: "",
      painLevel: 0,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // RENDER 
  return (
    // Full screen wrapper with glassmorphism ocean theme
    <div className="min-h-screen relative font-sans selection:bg-primary/20 selection:text-primary pt-8 pb-12 px-4">

      {/* Animated background — decorative blurred circles */}
      <Background />

      {/* Main application card — glassmorphism container */}
      <div className="w-full max-w-[1024px] mx-auto bg-glass backdrop-blur-3xl border border-glass-border rounded-[2rem] shadow-2xl overflow-hidden flex flex-col min-h-[700px]">

        {/* APPLICATION HEADER */}
        <header className="px-8 pt-8 pb-4 flex flex-col md:flex-row items-center justify-between gap-6">

          {/* App logo and name */}
          <div className="flex items-center gap-3">
            {/* Medical cross logo */}
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-blue-950 font-black text-xl shadow-lg shadow-primary/30">
              +
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              MedTriage <span className="text-blue-900/60 font-medium">Kiosk</span>
            </h1>
          </div>

          {/* Step progress indicator — shows current position in 3-step flow */}
          <StepIndicator currentStep={step} />
        </header>

        {/* MAIN CONTENT AREA  */}
        {/* AnimatePresence enables smooth transitions between steps */}
        <div className="flex-1 px-8 pb-12 overflow-y-auto">
          <AnimatePresence mode="wait">

            {/* Step 1 — Patient Information Form */}
            {step === 1 && (
              <PatientInfoForm 
                key="step1"              // Unique key for AnimatePresence transitions
                initialData={patientData}  // Pre-fill with any previously entered data
                onNext={handleInfoSubmit}  // Advance to Step 2 on submit
              />
            )}

            {/* Step 2 — Symptoms Form */}
            {step === 2 && (
              <SymptomsForm 
                key="step2"
                initialData={symptomData}       // Pre-fill with any previously entered data
                onNext={handleSymptomsSubmit}   // Advance to Step 3 on submit
                onBack={handleBack}             // Return to Step 1 on back
              />
            )}

            {/* Step 3 — Gemini AI Triage Result */}
            {step === 3 && (
              <TriageResult 
                key="step3"
                patient={patientData}    // Pass patient data to Gemini AI
                symptoms={symptomData}   // Pass symptom data to Gemini AI
                onReset={handleReset}    // Reset all state for new patient
              />
            )}

          </AnimatePresence>
        </div>

        {/*  APPLICATION FOOTER  */}
        {/* Medical disclaimer — required for AI-assisted healthcare tools */}
        <footer className="px-8 py-6 border-t border-glass-border flex flex-col md:flex-row items-center justify-between gap-6 bg-white/30 backdrop-blur-md">
          
          {/* Disclaimer text — AI guidance only, not final diagnosis */}
          <p className="text-[11px] text-slate-500 max-w-2xl leading-relaxed">
            This AI-assisted triage is for guidance only and does not constitute a final medical diagnosis. 
            If your condition changes rapidly, please call for immediate human assistance or press the emergency button.
          </p>

          {/* System status indicator */}
          <div className="flex items-center gap-2 text-[10px] text-slate-400 uppercase tracking-widest font-bold whitespace-nowrap">
            <div className="w-1.5 h-1.5 rounded-full bg-primary" /> {/* Green dot — system active */}
            V1.0 System Ready
          </div>
        </footer>
      </div>
    </div>
  );
}
