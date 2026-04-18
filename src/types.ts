/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PatientData {
  fullName: string;
  age: string;
  gender: string;
  phone: string;
  preExisting: string;
  medications: string;
}

export interface SymptomData {
  painDuration: string;
  selectedSymptoms: string[];
  description: string;
  painLevel: number;
}

export interface TriageResponse {
  urgency: 'Red' | 'Yellow' | 'Green';
  urgencyLabel: string;
  reason: string;
  conditions: string[];
  redFlags: string[];
  nextStep: string;
}
