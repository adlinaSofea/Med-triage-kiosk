/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import Background from "./components/Background";
import StepIndicator from "./components/StepIndicator";
import PatientInfoForm from "./components/PatientInfoForm";
import SymptomsForm from "./components/SymptomsForm";
import TriageResult from "./components/TriageResult";
import { PatientData, SymptomData } from "./types";
import { AnimatePresence } from "motion/react";

export default function App() {
  const [step, setStep] = useState(1);
  const [patientData, setPatientData] = useState<PatientData>({
    fullName: "",
    age: "",
    gender: "",
    phone: "",
    preExisting: "",
    medications: "",
  });
  const [symptomData, setSymptomData] = useState<SymptomData>({
    painDuration: "",
    selectedSymptoms: [],
    description: "",
    painLevel: 0,
  });

  const handleInfoSubmit = (data: PatientData) => {
    setPatientData(data);
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSymptomsSubmit = (data: SymptomData) => {
    setSymptomData(data);
    setStep(3);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleReset = () => {
    setStep(1);
    setPatientData({
      fullName: "",
      age: "",
      gender: "",
      phone: "",
      preExisting: "",
      medications: "",
    });
    setSymptomData({
      painDuration: "",
      selectedSymptoms: [],
      description: "",
      painLevel: 0,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen relative font-sans selection:bg-primary/20 selection:text-primary pt-8 pb-12 px-4">
      <div className="w-full max-w-[1024px] mx-auto bg-glass backdrop-blur-3xl border border-glass-border rounded-[2rem] shadow-2xl overflow-hidden flex flex-col min-h-[700px]">
        <header className="px-8 pt-8 pb-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/20">
              +
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-800">
              MedTriage <span className="text-primary">Kiosk</span>
            </h1>
          </div>
          
          <StepIndicator currentStep={step} />
        </header>

        <div className="flex-1 px-8 pb-12 overflow-y-auto">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <PatientInfoForm 
                key="step1" 
                initialData={patientData} 
                onNext={handleInfoSubmit} 
              />
            )}

            {step === 2 && (
              <SymptomsForm 
                key="step2" 
                initialData={symptomData} 
                onNext={handleSymptomsSubmit} 
                onBack={handleBack} 
              />
            )}

            {step === 3 && (
              <TriageResult 
                key="step3" 
                patient={patientData} 
                symptoms={symptomData} 
                onReset={handleReset} 
              />
            )}
          </AnimatePresence>
        </div>

        <footer className="px-8 py-6 border-t border-glass-border flex flex-col md:flex-row items-center justify-between gap-6 bg-white/30 backdrop-blur-md">
          <p className="text-[11px] text-slate-500 max-w-2xl leading-relaxed">
            This AI-assisted triage is for guidance only and does not constitute a final medical diagnosis. 
            If your condition changes rapidly, please call for immediate human assistance or press the emergency button.
          </p>
          <div className="flex items-center gap-2 text-[10px] text-slate-400 uppercase tracking-widest font-bold whitespace-nowrap">
            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            V1.0 System Ready
          </div>
        </footer>
      </div>
    </div>
  );
}
