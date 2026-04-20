/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, ChangeEvent, FormEvent } from "react";
import { PatientData } from "../types";
import { AlertCircle, ChevronDown } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/src/lib/utils";

interface PatientInfoFormProps {
  key?: string;
  initialData: PatientData;
  onNext: (data: PatientData) => void;
}

export default function PatientInfoForm({ initialData, onNext }: PatientInfoFormProps) {
  const [formData, setFormData] = useState<PatientData>(initialData);
  const [errors, setErrors] = useState<Partial<Record<keyof PatientData, string>>>({});

  const validate = () => {
    const newErrors: Partial<Record<keyof PatientData, string>> = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.age.trim()) newErrors.age = "Age is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onNext(formData);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof PatientData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="w-full max-w-2xl mx-auto rounded-3xl p-2"
    >
      <div className="bg-white/40 border border-white/40 rounded-3xl p-8 shadow-sm ring-1 ring-white/20">
        <div className="mb-8">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Patient Information</h2>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Please provide accurate identification</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label 
                htmlFor="fullName"
                className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between"
              >
                Full Name
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
                  errors.fullName 
                    ? "border-urgent/30 bg-urgent/5 focus:border-urgent" 
                    : "border-white/60 bg-white/60"
                )}
              />
              {errors.fullName && (
                <p id="fullName-error" className="text-[10px] text-urgent font-bold mt-1 uppercase tracking-tighter">
                  {errors.fullName}
                </p>
              )}
            </div>

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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

          <div className="space-y-2">
            <label htmlFor="preExisting" className="text-xs font-bold uppercase tracking-wider text-slate-500">Pre-existing Condition</label>
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

          <div className="space-y-2">
            <label htmlFor="medications" className="text-xs font-bold uppercase tracking-wider text-slate-500">Current Medications</label>
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

