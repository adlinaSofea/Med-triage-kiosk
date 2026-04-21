/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * PatientInfoForm.tsx
 *
 * Step 1 of the Med Triage Kiosk patient journey.
 * Collects personal information from the patient including:
 * - Full name, age, gender, phone number (required fields)
 * - Pre-existing medical conditions (optional)
 * - Current medications (optional)
 *
 * Includes form validation with real-time error feedback.
 * On successful submission, passes data to parent via onNext callback.
 *
 * Project: Med Triage Kiosk
 * Hackathon: Project 2030 MyAI Future Hackathon — Track 3: Vital Signs
 */

import { useState, ChangeEvent, FormEvent } from "react";
import { PatientData } from "../types";
import { AlertCircle, ChevronDown } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/src/lib/utils";

// COMPONENT PROPS 
interface PatientInfoFormProps {
  key?: string;
  initialData: PatientData;       // Pre-filled patient data (empty on first load)
  onNext: (data: PatientData) => void; // Callback to proceed to Step 2 (Symptoms)
}

// COMPONENT 
export default function PatientInfoForm({ initialData, onNext }: PatientInfoFormProps) {
  
  // Form state — tracks all patient input fields
  const [formData, setFormData] = useState<PatientData>(initialData);
  
  // Error state — tracks validation errors per field
  const [errors, setErrors] = useState<Partial<Record<keyof PatientData, string>>>({});

  // FORM VALIDATION 
  // Validates required fields before allowing form submission
  // Returns true if all required fields are filled, false otherwise
  const validate = () => {
    const newErrors: Partial<Record<keyof PatientData, string>> = {};
    
    // Required field validation
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.age.trim()) newErrors.age = "Age is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    
    setErrors(newErrors);
    
    // Return true only if no errors found
    return Object.keys(newErrors).length === 0;
  };

  // FORM SUBMISSION 
  // Handles form submit — validates first, then passes data to parent component
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onNext(formData); // Proceed to Step 2 with validated patient data
    }
  };

  //INPUT CHANGE HANDLER
  // Updates form state on any input change
  // Also clears field-specific error when user starts typing
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Update the changed field in form data
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user starts correcting it
    if (errors[name as keyof PatientData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
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
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Patient Information</h2>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Please provide accurate identification</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Row 1: Full Name + Age */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Full Name Field */}
            <div className="space-y-2">
              <label 
                htmlFor="fullName"
                className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between"
              >
                Full Name
                {/* Show error icon if validation fails */}
                {errors.fullName && <AlertCircle className="w-3.5 h-3.5 text-urgent" aria-hidden="true" />}
              </label>
              <input
                id="fullName"
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="e.g. Ali bin Ahmad"
                aria-invalid={!!errors.fullName}
                aria-describedby={errors.fullName ? "fullName-error" : undefined}
                className={cn(
                  "w-full px-4 py-3 rounded-xl border transition-all duration-300 outline-none hover:border-white focus:bg-white focus:border-primary shadow-sm",
                  // Red border styling when validation error exists
                  errors.fullName 
                    ? "border-urgent/30 bg-urgent/5 focus:border-urgent" 
                    : "border-white/60 bg-white/60"
                )}
              />
              {/* Inline error message */}
              {errors.fullName && (
                <p id="fullName-error" className="text-[10px] text-urgent font-bold mt-1 uppercase tracking-tighter">
                  {errors.fullName}
                </p>
              )}
            </div>

            {/* Age Field */}
            <div className="space-y-2">
              <label 
                htmlFor="age"
                className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between"
              >
                Age
                {errors.age && <AlertCircle className="w-3.5 h-3.5 text-urgent" aria-hidden="true" />}
              </label>
              <input
                id="age"
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="e.g. 25"
                aria-invalid={!!errors.age}
                aria-describedby={errors.age ? "age-error" : undefined}
                className={cn(
                  "w-full px-4 py-3 rounded-xl border transition-all duration-300 outline-none hover:border-white focus:bg-white focus:border-primary shadow-sm",
                  errors.age 
                    ? "border-urgent/30 bg-urgent/5 focus:border-urgent" 
                    : "border-white/60 bg-white/60"
                )}
              />
              {errors.age && (
                <p id="age-error" className="text-[10px] text-urgent font-bold mt-1 uppercase tracking-tighter">
                  {errors.age}
                </p>
              )}
            </div>
          </div>

          {/* Row 2: Gender + Phone Number */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Gender Dropdown */}
            <div className="space-y-2">
              <label 
                htmlFor="gender"
                className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between"
              >
                Gender
                {errors.gender && <AlertCircle className="w-3.5 h-3.5 text-urgent" aria-hidden="true" />}
              </label>
              <div className="relative group">
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  aria-invalid={!!errors.gender}
                  aria-describedby={errors.gender ? "gender-error" : undefined}
                  className={cn(
                    "w-full px-4 py-3 rounded-xl border appearance-none transition-all duration-300 outline-none hover:border-white focus:bg-white focus:border-primary shadow-sm pr-10",
                    errors.gender 
                      ? "border-urgent/30 bg-urgent/5 focus:border-urgent" 
                      : "border-white/60 bg-white/60"
                  )}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                {/* Custom dropdown arrow icon */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-primary transition-colors">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
              {errors.gender && (
                <p id="gender-error" className="text-[10px] text-urgent font-bold mt-1 uppercase tracking-tighter">
                  {errors.gender}
                </p>
              )}
            </div>

            {/* Phone Number Field */}
            <div className="space-y-2">
              <label 
                htmlFor="phone"
                className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between"
              >
                Phone Number
                {errors.phone && <AlertCircle className="w-3.5 h-3.5 text-urgent" aria-hidden="true" />}
              </label>
              <input
                id="phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="e.g. 0123456789"
                aria-invalid={!!errors.phone}
                aria-describedby={errors.phone ? "phone-error" : undefined}
                className={cn(
                  "w-full px-4 py-3 rounded-xl border transition-all duration-300 outline-none hover:border-white focus:bg-white focus:border-primary shadow-sm",
                  errors.phone 
                    ? "border-urgent/30 bg-urgent/5 focus:border-urgent" 
                    : "border-white/60 bg-white/60"
                )}
              />
              {errors.phone && (
                <p id="phone-error" className="text-[10px] text-urgent font-bold mt-1 uppercase tracking-tighter">
                  {errors.phone}
                </p>
              )}
            </div>
          </div>

          {/* Pre-existing Conditions — Optional */}
          <div className="space-y-2">
            <label htmlFor="preExisting" className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Pre-existing Condition
            </label>
            <textarea
              id="preExisting"
              name="preExisting"
              value={formData.preExisting}
              onChange={handleChange}
              placeholder="e.g. diabetes, hypertension (leave blank if none)"
              rows={2}
              className="w-full px-4 py-3 rounded-xl border border-white/60 bg-white/60 transition-all duration-300 outline-none hover:border-white focus:bg-white focus:border-primary shadow-sm resize-none"
            />
          </div>

          {/* Current Medications — Optional */}
          <div className="space-y-2">
            <label htmlFor="medications" className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Current Medications
            </label>
            <textarea
              id="medications"
              name="medications"
              value={formData.medications}
              onChange={handleChange}
              placeholder="e.g. metformin, amlodipine (leave blank if none)"
              rows={2}
              className="w-full px-4 py-3 rounded-xl border border-white/60 bg-white/60 transition-all duration-300 outline-none hover:border-white focus:bg-white focus:border-primary shadow-sm resize-none"
            />
          </div>

          {/* Submit Button — Proceeds to Step 2 */}
          <button
            type="submit"
            className="w-full py-5 px-6 bg-primary hover:bg-sky-600 text-white font-black uppercase tracking-widest text-sm rounded-2xl transition-all duration-300 shadow-xl shadow-primary/20 active:scale-[0.98] mt-4 hover:shadow-2xl hover:-translate-y-0.5"
          >
            Continue Assessment
          </button>
        </form>
      </div>
    </motion.div>
  );
}
