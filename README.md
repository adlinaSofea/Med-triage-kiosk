# Med Triage Kiosk
> **Project 2030: MyAI Future Hackathon**
> Track 3: Vital Signs (Healthcare & Wellbeing)
> Organised by GDG On Campus UTM · Build with AI 2026

---

## Project Overview
This project presents an AI-powered Emergency Department (ED) triage system designed to improve patient prioritisation and reduce overcrowding in Malaysian hospitals. The system allows patients to input their personal details and symptoms through a user-friendly web interface, after which the Gemini API is used to analyse the input and classify cases into **Critical, Urgent, or Non-Urgent categories**.

By leveraging the **Gemini** large language model, the system generates structured clinical insights, including urgency level, possible conditions, red flags, and recommended next steps in a consistent JSON format. This enables fast and reliable triage support for both patients and healthcare staff. This system demonstrates how AI-assisted triage can enhance decision-making, optimise patient flow, and reduce the burden on emergency department staff, contributing to more efficient and responsive healthcare services.

**Live Demo:** https://med-triage-kiosk-785843788420.us-west1.run.app/

---

## Problem Statement
Emergency Departments (EDs) in Malaysia are increasingly overwhelmed due to rising patient demand and limited healthcare resources. A significant proportion of ED visits consist of non-urgent cases, which contributes to congestion, long waiting times, and delays in treating critically ill patients.

Current triage processes in many hospitals are still manual and dependent on healthcare staff, leading to variability in assessment, increased workload for nurses, and potential delays during peak hours. These challenges are further compounded by staffing shortages, bed limitations, and inefficient patient flow within hospitals.

As a result, ED overcrowding can lead to:

- Delayed medical attention for critical patients
- Increased risk of clinical errors
- Reduced quality of patient care
- Higher stress and burnout among healthcare workers

This project addresses these challenges by introducing an AI-assisted triage system that enables early patient screening, improves prioritisation, and supports more efficient emergency care delivery.

---

## Solution
A self-service AI triage kiosk at the ED entrance:
 
1. Patient walks in and fills in personal info + symptoms
2. Selects symptoms from checklist + rates pain level (0–10)
3. **Gemini AI** analyses using structured clinical reasoning
4. Patient receives instant colour-coded result:
   - 🔴 **CRITICAL** — Seek help immediately
   - 🟡 **URGENT** — Seen within 30 minutes
   - 🟢 **NON-URGENT** — General queue
> **Scope:** Walk-in patients only. Accident and trauma cases go directly to medical staff as per standard hospital protocol.

---

# Tech Stack
| Layer | Technology |
|-------|-----------|
| AI Prompt Design & Testing | **Google AI Studio** |
| AI Model | **Gemini API (gemini-3-flash)** |
| Deployment | **Google Cloud Run** |
| Frontend | React + TypeScript + Vite |
| Styling | CSS |
| Version Control | GitHub |
 
---

## Google AI Ecosystem — Build With AI Requirement
 
### Google AI Studio 
- Designed and tested our structured clinical triage prompt
- Validated Gemini responses across all urgency scenarios
- Published and deployed application directly to Google Cloud Run
- Monitored API usage and response quality
  
### Gemini API — gemini-3-flash (Intelligence)
Core AI reasoning engine. Receives structured patient data and returns:
 
```json
{
  "urgency": "CRITICAL | URGENT | NON-URGENT",
  "urgency_reason": "One sentence clinical reasoning",
  "possible_conditions": ["condition1", "condition2", "condition3"],
  "red_flags": ["flag1", "flag2"],
  "next_step": "One clear instruction for the patient"
}
```
 
### Google Cloud Run (Deployment)
- Serverless deployment — publicly accessible URL
- Auto-scales with demand
- Zero cost when idle
- Deployed via Google AI Studio publish feature

---

System Architecture
 
```
Patient (Browser / Tablet Kiosk)
          ↓
React Frontend (TypeScript + Vite)
          ↓
Gemini API — gemini-3-flash
  ├── Structured clinical prompt
  ├── Multi-step reasoning
  └── Returns JSON response
          ↓
Triage Result Display
  ├── Colour-coded urgency level
  ├── Possible conditions
  ├── Red flags detected
  └── Next step instruction
          ↓
Google Cloud Run (Live Deployment)
```

--- 

Project Structure
 
```
Med-triage-kiosk/
├── src/
│   ├── components/
│   │   ├── PatientInfoForm.tsx    # Step 1 — Patient info form
│   │   ├── SymptomsForm.tsx       # Step 2 — Symptoms + pain level
│   │   ├── TriageResult.tsx       # Step 3 — AI triage result
│   │   ├── StepIndicator.tsx      # Progress stepper component
│   │   └── Background.tsx         # Background UI component
│   ├── lib/
│   │   ├── gemini.ts              # Gemini API integration
│   │   └── utils.ts               # Utility functions
│   ├── App.tsx                    # Main application component
│   ├── main.tsx                   # Application entry point
│   ├── types.ts                   # TypeScript type definitions
│   └── index.css                  # Global styles
├── .env.example                   # Environment variables template
├── index.html                     # HTML entry point
├── package.json                   # Dependencies
├── tsconfig.json                  # TypeScript config
├── vite.config.ts                 # Vite config
└── README.md                      # This file
```

---

## Features
 
- **3-step patient journey** — Info → Symptoms → Result
- **AI-powered triage** — Gemini analyses symptoms in real time
- **Colour-coded urgency** — Critical (red), Urgent (amber), Non-urgent (green)
- **Clinical reasoning** — AI explains WHY it assigned each urgency level
- **Red flag detection** — Identifies dangerous symptom combinations
- **Smart fallback** — App works even if AI is temporarily unavailable
- **Responsive design** — Works on tablet kiosk, mobile, and desktop


---

AI Tools Disclosure
 
As required by hackathon rules, we disclose all AI tools used:
 
| Tool | Usage |
|------|-------|
| Google AI Studio | Prompt design, testing, deployment |
| Gemini API | Core triage reasoning engine |
| AI coding assistance | Development assistance — all code reviewed and understood by team |


---

## Responsible AI
 
- System clearly states it provides **AI guidance only** — not medical diagnosis
- Always directs patients to consult qualified medical staff
- Patient data handled in session — **not stored permanently**
- Walk-in patients only — **trauma/accident cases excluded**
- Smart fallback when AI unavailable
- Complies with **Google's AI Principles**
- No bias, privacy violations, or potential for harm

---

## National Agenda Alignment
 
| Framework | How We Align |
|-----------|-------------|
| **Malaysia Madani** | Improves public healthcare quality for all Malaysians |
| **MyDIGITAL Blueprint** | Digitises manual triage — paper to AI-assisted workflow |
| **NIMP 2030** | Indigenous AI solution by Malaysian student developers |
| **MOH KPI** | Reduces ED wait times and nurse workload nationwide |

---

## Team 
 
| Name | Role | Institution |
|------|------|-------------|
| NUR ADLINA SOFEA BINTI MAHDZIR | AI Integration (Gemini API) + Deployment (Cloud Run) | UniKL MIIT |
| MUHAMMAD AKMAL ZAEEM BIN ABD JAMIL | Frontend (React + UI/UX) | UniKL MIIT |
| NOR NAJLAH HANINI BINTI HAIRUL NIZAM | Documentation + Slides | UniKL MIIT |
| MUHAMMAD IZZAT A'KIF BIN MOHD SANUSI| Frontend (UI) | UniKL MIIT |
 
**Category:** Student Category

--- 

 
## 🔗 Submission Links
 
| Item | Link |
|------|------|
| GitHub Repository | https://github.com/adlinaSofea/Med-triage-kiosk |
| Live App (Cloud Run) | https://med-triage-kiosk-785843788420.us-west1.run.app/ |
| Video Demo | [YouTube / Google Drive link] |
| Presentation Slides | https://docs.google.com/presentation/d/1Bsn9HfrO9rAJGOFaoTR1l1uiuONPKgE_6-RFpEbC8yU/edit?usp=sharing |
 
