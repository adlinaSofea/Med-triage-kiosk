/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * SymptomsForm.tsx
 *
 * Step 2 of the Med Triage Kiosk patient journey.
 * Collects symptom information from the patient including:
 * - Pain duration (required — dropdown selection)
 * - Symptoms checklist (required — at least one must be selected)
 * - Free-text symptom description (optional)
 * - Pain level slider (0-10 scale)
 *
 * All collected data is passed to Gemini AI for triage analysis in Step 3.
 *
 * Project: Med Triage Kiosk
 * Hackathon: Project 2030 MyAI Future Hackathon — Track 3: Vital Signs
 */

import { useState, FormEvent } from "react";
import { SymptomData } from "../types";
import { AlertCircle, HelpCircle, ChevronDown } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/src/lib/utils";

// COMPONENT PROPS 
interface SymptomsFormProps {
  key?: string;
  initialData: SymptomData;            // Pre-filled symptom data
  onNext: (data: SymptomData) => void; // Callback to proceed to Step 3 (Result)
  onBack: () => void;                  // Callback to go back to Step 1 (Patient Info)
}

// SYMPTOM OPTIONS 
// Predefined list of common ED symptoms for patient selection
// Designed based on common Malaysian ED presenting complaints
const symptomOptions = [
  "Chest pain",
  "Shortness of breath",
  "Severe headache",
  "High fever",
  "Nausea / vomiting",
  "Dizziness / fainting",
  "Abdominal pain",
  "Weakness / numbness",
  "Bleeding",
  "Rash / swelling",
  "Confusion",
  "Palpitations",
  "Back pain",
  "Difficulty swallowing",
];

// COMPONENT
export default function SymptomsForm({ initialData, onNext, onBack }: SymptomsFormProps) {
  
  // Form state — tracks all symptom input fields
  const [formData, setFormData] = useState<SymptomData>(initialData);
  
  // Error state — tracks validation errors per field
  const [errors, setErrors] = useState<Partial<Record<keyof SymptomData, string>>>({});

  // FORM VALIDATION
  // Validates required fields before allowing form submission
  // Pain duration and at least one symptom are required
  const validate = () => {
    const newErrors: Partial<Record<keyof SymptomData, string>> = {};
    
    // Pain duration is required for accurate AI triage assessment
    if (!formData.painDuration) newErrors.painDuration = "Please select pain duration";
    
    // At least one symptom must be selected for Gemini to analyse
    if (formData.selectedSymptoms.length === 0) newErrors.selectedSymptoms = "Select at least one symptom";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // FORM SUBMISSION 
  // Validates form and passes symptom data to parent for Gemini API call
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onNext(formData); // Trigger Gemini AI triage analysis in Step 3
    }
  };

  //SYMPTOM TOGGLE 
  // Adds or removes a symptom from the selected symptoms array
  // Acts as a toggle — clicking selected symptom deselects it
  const toggleSymptom = (symptom: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedSymptoms: prev.selectedSymptoms.includes(symptom)
        ? prev.selectedSymptoms.filter((s) => s !== symptom) // Remove if already selected
        : [...prev.selectedSymptoms, symptom],               // Add if not selected
    }));
  };

  //RENDER
  return (
    // Animated wrapper — fade in and scale up on mount
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="w-full max-w-2xl mx-auto rounded-3xl p-2"
    >
      {/* Form card with glassmorphism styling */}
      <div className="bg-white/40 border border-white/40 rounded-3xl p-8 shadow-sm ring-1 ring-white/20">
        
        {/* Form header */}
        <div className="mb-8">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Condition Details</h2>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Describe your current state</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Pain Duration Dropdown — Required */}
          <div className="space-y-2">
            <label 
              htmlFor="painDuration"
              className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between"
            >
              How long have you had this pain?
              {errors.painDuration && <AlertCircle className="w-3.5 h-3.5 text-urgent" aria-hidden="true" />}
            </label>
            <div className="relative group">
              <select
                id="painDuration"
                name="painDuration"
                value={formData.painDuration}
                onChange={(e) => setFormData({ ...formData, painDuration: e.target.value })}
                aria-invalid={!!errors.painDuration}
                aria-describedby={errors.painDuration ? "painDuration-error" : undefined}
                className={cn(
                  "w-full px-4 py-3 rounded-xl border transition-all duration-300 outline-none hover:border-white focus:bg-white focus:border-primary shadow-sm appearance-none pr-10",
                  errors.painDuration 
                    ? "border-urgent/30 bg-urgent/5 focus:border-urgent" 
                    : "border-white/60 bg-white/60"
                )}
              >
                <option value="">Select duration</option>
                <option value="Less than 1 hour">Less than 1 hour</option>
                <option value="1-6 hours">1-6 hours</option>
                <option value="6-24 hours">6-24 hours</option>
                <option value="1-3 days">1-3 days</option>
                <option value="More than 3 days">More than 3 days</option>
              </select>
              {/* Custom dropdown arrow */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-primary transition-colors">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
            {errors.painDuration && (
              <p id="painDuration-error" className="text-[10px] text-urgent font-bold mt-1 uppercase tracking-tighter">
                {errors.painDuration}
              </p>
            )}
          </div>

          {/* Symptoms Checklist — Required (at least 1) */}
          <div className="space-y-3">
            <span 
              id="symptoms-label"
              className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between"
            >
              Symptoms - Select all that apply
              {errors.selectedSymptoms && <AlertCircle className="w-3.5 h-3.5 text-urgent" aria-hidden="true" />}
            </span>
            
            {/* Symptom toggle buttons — each acts as a checkbox */}
            <div 
              role="group" 
              aria-labelledby="symptoms-label"
              className="flex flex-wrap gap-2"
            >
              {symptomOptions.map((symptom) => {
                const isActive = formData.selectedSymptoms.includes(symptom);
                return (
                  <button
                    key={symptom}
                    type="button"
                    onClick={() => toggleSymptom(symptom)}
                    aria-pressed={isActive} // Accessibility — indicates selected state
                    className={cn(
                      "px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 border shadow-sm",
                      // Active styling — highlighted when selected
                      isActive
                        ? "bg-primary border-primary text-white shadow-lg shadow-primary/20 scale-105"
                        : "bg-white/40 border-white/60 text-slate-600 hover:border-white hover:bg-white/60"
                    )}
                  >
                    {symptom}
                  </button>
                );
              })}
            </div>
            {errors.selectedSymptoms && (
              <p className="text-[10px] text-urgent font-bold mt-1 uppercase tracking-tighter">
                {errors.selectedSymptoms}
              </p>
            )}
            
            {/* Free-text description — Optional but helps Gemini AI accuracy */}
            <label htmlFor="description" className="sr-only">Detailed symptom description</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your symptoms in your own words"
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-white/60 bg-white/60 transition-all duration-300 outline-none hover:border-white focus:bg-white focus:border-primary shadow-sm resize-none mt-4"
            />
          </div>

          {/* Pain Level Slider — Scale 0-10 */}
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <label 
                htmlFor="painLevel"
                className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2"
              >
                Pain Level
                {/* Tooltip — pain scale guide for patient reference */}
                <div className="group relative">
                  <button 
                    type="button"
                    aria-label="Pain scale guide"
                    className="p-1 -m-1 focus:outline-none"
                  >
                    <HelpCircle className="w-4 h-4 text-slate-400 cursor-help" />
                  </button>
                  {/* Hover tooltip with pain scale reference */}
                  <div 
                    role="tooltip"
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-56 p-4 bg-slate-900 text-white text-[11px] rounded-2xl shadow-2xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-20 leading-relaxed font-bold border border-white/10 translate-y-2 group-hover:translate-y-0"
                  >
                    <p className="mb-2 border-b border-white/10 pb-1 uppercase tracking-tighter font-black">Pain Scale Guide</p>
                    <ul className="space-y-1">
                      <li>0–2: No pain / mild</li>
                      <li>3–4: Discomfort</li>
                      <li>5–6: Moderate pain</li>
                      <li>7–8: Severe pain</li>
                      <li>9–10: Worst possible</li>
                    </ul>
                  </div>
                </div>
              </label>
              
              {/* Pain level visual indicator — colour changes based on severity */}
              <div className="flex flex-col items-end" aria-live="polite">
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Pain Intensity</div>
                <div className="flex items-center gap-3">
                  {/* Circular score display — red for severe, yellow for moderate, blue for mild */}
                  <div 
                    className={cn(
                      "w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all duration-500 shadow-lg",
                      formData.painLevel >= 7 
                        ? "bg-urgent/10 border-urgent/40 shadow-urgent/20"    // Severe
                        : formData.painLevel >= 4 
                        ? "bg-warning/10 border-warning/40 shadow-warning/20" // Moderate
                        : "bg-primary/10 border-primary/40 shadow-primary/20" // Mild
                    )}
                  >
                    <span className={cn(
                      "text-3xl font-black lining-nums",
                      formData.painLevel >= 7 ? "text-urgent" : 
                      formData.painLevel >= 4 ? "text-warning" : "text-primary"
                    )}>
                      {formData.painLevel}
                    </span>
                  </div>
                  <div className="text-left">
                    <div className={cn(
                      "text-sm font-black uppercase tracking-tighter leading-tight",
                      formData.painLevel >= 7 ? "text-urgent" : 
                      formData.painLevel >= 4 ? "text-warning" : "text-primary"
                    )}>
                      {/* Dynamic severity label based on pain score */}
                      {formData.painLevel >= 7 ? "Severe" : 
                       formData.painLevel >= 4 ? "Moderate" : "Mild"}
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Scale / 10</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Range slider — 0 to 10, updates pain level in real time */}
            <div className="relative h-12 flex items-center px-1">
              <input
                id="painLevel"
                type="range"
                min="0"
                max="10"
                step="1"
                value={formData.painLevel}
                onChange={(e) => setFormData({ ...formData, painLevel: parseInt(e.target.value) })}
                aria-valuemin={0}
                aria-valuemax={10}
                aria-valuenow={formData.painLevel}
                aria-valuetext={`${formData.painLevel} out of 10`}
                className="w-full h-2 bg-slate-200/50 rounded-lg appearance-none cursor-pointer accent-primary focus-visible:ring-offset-transparent"
                style={{
                  // Dynamic gradient fill — shows progress along slider
                  background: `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${(formData.painLevel / 10) * 100}%, rgba(0,0,0,0.05) ${(formData.painLevel / 10) * 100}%, rgba(0,0,0,0.05) 100%)`
                }}
              />
              {/* Slider labels — Minimal on left, Extreme on right */}
              <div className="absolute top-1/2 translate-y-3 left-1 right-1 flex justify-between pointer-events-none" aria-hidden="true">
                 <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Minimal</span>
                 <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Extreme</span>
              </div>
            </div>
          </div>

          {/* Navigation Buttons — Back and Submit */}
          <div className="flex gap-4 pt-4">
            {/* Back button — returns to Step 1 (Patient Info) */}
            <button
              type="button"
              onClick={onBack}
              className="flex-1 py-5 px-6 bg-white/40 hover:bg-white/60 text-slate-600 font-black uppercase tracking-widest text-sm rounded-2xl transition-all duration-300 border border-white/60 active:scale-95"
            >
              Back
            </button>
            {/* Submit button — triggers Gemini AI triage analysis */}
            <button
              type="submit"
              className="flex-[2] py-5 px-6 bg-primary hover:bg-sky-600 text-white font-black uppercase tracking-widest text-sm rounded-2xl transition-all duration-300 shadow-xl shadow-primary/20 active:scale-[0.98] hover:shadow-2xl hover:-translate-y-0.5"
            >
              Get Triage Result
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
