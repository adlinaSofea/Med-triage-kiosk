/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from "@google/genai";
import { PatientData, SymptomData, TriageResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function getTriageResult(
  patient: PatientData,
  symptoms: SymptomData
): Promise<TriageResponse> {
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
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: "You are a professional Emergency Department Triage Nurse AI. Your goal is to provide a clear, calm, and accurate assessment. When providing 'nextStep' and 'redFlags', use patient-friendly language that reduces confusion. The 'detailedInstructions' should explain the triage process (e.g., why they are in a specific zone) and what the patient should expect next (wait times, registration, etc.). Output only JSON.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            urgency: {
              type: Type.STRING,
              enum: ["Red", "Yellow", "Green"],
              description: "The triage category."
            },
            urgencyLabel: {
              type: Type.STRING,
              description: "Label for the urgency level (e.g. 'EMERGENCY - RED ZONE')."
            },
            reason: {
              type: Type.STRING,
              description: "Single sentence rationale for this classification written clearly for a patient."
            },
            conditions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of 2-3 possible conditions."
            },
            redFlags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Clear list of warning signs that would require immediate attention if they occur."
            },
            nextStep: {
              type: Type.STRING,
              description: "The absolute most important immediate action the patient needs to take."
            },
            detailedInstructions: {
              type: Type.STRING,
              description: "A patient-friendly explanation of why they were triaged this way and what their experience in the care zone will be like (e.g. 'You will be seen by a doctor who will first...')."
            }
          },
          required: ["urgency", "urgencyLabel", "reason", "conditions", "redFlags", "nextStep", "detailedInstructions"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    return result as TriageResponse;
  } catch (error) {
    console.error("Gemini Triage Error:", error);
    // Fallback logic if AI fails
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

