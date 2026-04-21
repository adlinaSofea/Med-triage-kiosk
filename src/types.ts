/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * types.ts
 *
 * TypeScript type definitions for Med Triage Kiosk.
 * Defines the data structures used across all components and
 * the Gemini AI integration layer.
 *
 * Three main interfaces:
 * - PatientData    → Personal info collected in Step 1 (PatientInfoForm)
 * - SymptomData    → Symptom info collected in Step 2 (SymptomsForm)
 * - TriageResponse → AI triage result returned by Gemini API in Step 3
 *
 * Project: Med Triage Kiosk
 * Hackathon: Project 2030 MyAI Future Hackathon — Track 3: Vital Signs
 */

// PATIENT DATA 
/**
 * PatientData
 * Personal information collected from the patient in Step 1.
 * Passed to Gemini AI as part of the clinical triage prompt.
 */
export interface PatientData {
  fullName: string;     // Patient's full name — for identification
  age: string;          // Patient's age — affects triage risk assessment
  gender: string;       // Patient's gender — affects clinical assessment
  phone: string;        // Contact number — for hospital records
  preExisting: string;  // Pre-existing conditions — e.g. diabetes, hypertension (optional)
  medications: string;  // Current medications — affects treatment decisions (optional)
}

// SYMPTOM DATA 
/**
 * SymptomData
 * Symptom information collected from the patient in Step 2.
 * Combined with PatientData and sent to Gemini AI for triage analysis.
 */
export interface SymptomData {
  painDuration: string;        // How long symptoms have been present — e.g. "1-6 hours"
  selectedSymptoms: string[];  // Array of selected symptoms from the checklist
  description: string;         // Free-text description of symptoms in patient's own words
  painLevel: number;           // Pain intensity on scale of 0-10 (0 = none, 10 = worst)
}

// TRIAGE RESPONSE
/**
 * TriageResponse
 * Structured response returned by Gemini AI after analysing patient data.
 * All fields are required — defined in the Gemini response schema in gemini.ts.
 * Displayed to patient in Step 3 (TriageResult component).
 */
export interface TriageResponse {
  urgency: 'Red' | 'Yellow' | 'Green'; // Triage category — Red=Critical, Yellow=Urgent, Green=Non-urgent
  urgencyLabel: string;                 // Human-readable label — e.g. "EMERGENCY - RED ZONE"
  reason: string;                       // One-sentence explanation written for patient understanding
  conditions: string[];                 // List of 2-3 possible medical conditions
  redFlags: string[];                   // Warning signs patient should watch for
  nextStep: string;                     // Most important immediate action for the patient
  detailedInstructions: string;         // Patient-friendly explanation of their care zone experience
}
