/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * gemini.ts
 *
 * Core AI integration module for Med Triage Kiosk.
 * Handles all communication with Google Gemini API to perform
 * AI-powered clinical triage assessment for Emergency Department patients.
 *
 * Built with: Google AI Studio + Gemini API (gemini-3-flash-preview)
 * Deployed on: Google Cloud Run
 *
 * Project: Med Triage Kiosk
 * Hackathon: Project 2030 MyAI Future Hackathon — Track 3: Vital Signs
 * Organised by: GDG On Campus UTM
 */

import { GoogleGenAI, Type } from "@google/genai";
import { PatientData, SymptomData, TriageResponse } from "../types";

//  GEMINI AI CLIENT INITIALISATION 
// Initialize Google Generative AI client with API key
// API key managed via Google AI Studio Secrets for secure deployment
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

// TRIAGE CATEGORIES 
// Red    = Immediate/Critical  — Life-threatening, needs instant attention
// Yellow = Urgent              — Serious but not immediately life-threatening
// Green  = Non-urgent          — Minor issues, can wait in general queue

/**
 * getTriageResult
 *
 * Main function that sends patient data to Gemini AI and returns
 * a structured triage assessment. This is the core AI integration
 * that powers the Med Triage Kiosk system.
 *
 * @param patient  - Patient personal info (name, age, gender, medical history)
 * @param symptoms - Patient symptom data (pain level, duration, selected symptoms)
 * @returns TriageResponse — Structured AI triage result with urgency, conditions, next steps
 */
export async function getTriageResult(
  patient: PatientData,
  symptoms: SymptomData
): Promise<TriageResponse> {

  //  BUILD CLINICAL PROMPT 
  // Structured prompt designed and tested in Google AI Studio
  // Contains all patient data needed for accurate triage assessment
  const prompt = `
    Analyze the following patient data and symptoms for emergency department triage:
    
    PATIENT INFO:
    Name: ${patient.fullName}
    Age: ${patient.age}
    Gender: ${patient.gender}
    Pre-existing conditions: ${patient.preExisting || 'None'}
    Medications: ${patient.medications || 'None'}
    
    SYMPTOMS:
    Duration: ${symptoms.painDuration}
    Pain Level: ${symptoms.painLevel}/10
    Symptoms selected: ${symptoms.selectedSymptoms.join(', ') || 'None'}
    Description: ${symptoms.description}
    
    Determine the triage category based on the provided information.
    Categories:
    - Red (Immediate): Life-threatening conditions (e.g., severe chest pain, unable to breathe).
    - Yellow (Urgent): Serious but not immediately life-threatening (e.g., moderate pain, high fever).
    - Green (Non-urgent): Minor issues (e.g., skin rash, minor cough).
  `;

  try {
    // GEMINI API CALL 
    // Send patient data to Gemini AI for clinical reasoning and triage assessment
    // Model: gemini-3-flash-preview — optimised for fast structured responses
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        // System instruction sets Gemini's role as a triage nurse AI
        // Ensures patient-friendly language in all responses
        systemInstruction: "You are a professional Emergency Department Triage Nurse AI. Your goal is to provide a clear, calm, and accurate assessment. When providing 'nextStep' and 'redFlags', use patient-friendly language that reduces confusion. The 'detailedInstructions' should explain the triage process (e.g., why they are in a specific zone) and what the patient should expect next (wait times, registration, etc.). Output only JSON.",

        // Force JSON response format for consistent parsing
        responseMimeType: "application/json",

        // Structured schema ensures Gemini returns all required fields
        // Designed and validated in Google AI Studio
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            // Triage category — Red, Yellow, or Green
            urgency: {
              type: Type.STRING,
              enum: ["Red", "Yellow", "Green"],
              description: "The triage category."
            },
            // Human-readable label for the urgency level
            urgencyLabel: {
              type: Type.STRING,
              description: "Label for the urgency level (e.g. 'EMERGENCY - RED ZONE')."
            },
            // One-sentence explanation written for patient understanding
            reason: {
              type: Type.STRING,
              description: "Single sentence rationale for this classification written clearly for a patient."
            },
            // List of possible medical conditions based on symptoms
            conditions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of 2-3 possible conditions."
            },
            // Warning signs patient should watch for
            redFlags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Clear list of warning signs that would require immediate attention if they occur."
            },
            // Most important immediate action for patient
            nextStep: {
              type: Type.STRING,
              description: "The absolute most important immediate action the patient needs to take."
            },
            // Detailed patient-friendly explanation of their care zone
            detailedInstructions: {
              type: Type.STRING,
              description: "A patient-friendly explanation of why they were triaged this way and what their experience in the care zone will be like (e.g. 'You will be seen by a doctor who will first...')."
            }
          },
          // All fields required — ensures complete triage response every time
          required: ["urgency", "urgencyLabel", "reason", "conditions", "redFlags", "nextStep", "detailedInstructions"]
        }
      }
    });

    // PARSE GEMINI RESPONSE 
    // Parse the JSON response from Gemini and return as TriageResponse
    const result = JSON.parse(response.text || "{}");
    return result as TriageResponse;

  } catch (error) {
    //  FALLBACK SYSTEM 
    // If Gemini API is unavailable (network issues, quota exceeded, etc.)
    // return a safe default Yellow (Urgent) result
    // Patient safety maintained by defaulting to Urgent — never dismissing symptoms
    console.error("Gemini Triage Error:", error);

    return {
      urgency: 'Yellow',
      urgencyLabel: 'URGENT - YELLOW ZONE',
      reason: 'AI analysis unavailable. Pre-clinical assessment suggests urgent review.',
      conditions: ['Undetermined condition'],
      redFlags: ['Please alert a nurse immediately if condition worsens'],
      nextStep: 'Proceed to the designated yellow waiting area.',
      detailedInstructions: 'Since your assessment couldn\'t be completed automatically, we have placed you in the Yellow Zone to ensure you are seen quickly. Please wait in the waiting area, a nurse will call you shortly for a manual assessment.'
    };
  }
}

