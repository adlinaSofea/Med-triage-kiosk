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
        systemInstruction: "You are a highly experienced Emergency Department Triage Nurse AI. Output only JSON that matches the required schema.",
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
              description: "Single sentence rationale for this classification."
            },
            conditions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of 2-3 possible conditions."
            },
            redFlags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of red flags detected or to watch out for."
            },
            nextStep: {
              type: Type.STRING,
              description: "Immediate next step for the patient."
            }
          },
          required: ["urgency", "urgencyLabel", "reason", "conditions", "redFlags", "nextStep"]
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
      nextStep: 'Proceed to the designated yellow waiting area and wait for your name to be called.'
    };
  }
}
