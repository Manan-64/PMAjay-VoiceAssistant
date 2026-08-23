# Pmajay-VoiceAssistant 
Here is the complete, professional `README.md` file formatted specifically for a Smart India Hackathon submission.

Copy the code block below and paste it directly into the `README.md` file in your GitHub repository.

```markdown
# 🎙️ PM-AJAY Sahayata: AI Livelihood & NSQF Voice Assistant

> **Smart India Hackathon Submission** 
> An AI-driven, voice-first multilingual platform designed to map Scheduled Caste (SC) rural beneficiaries to NSQF-aligned skilling and PM-AJAY Grants-in-Aid (GIA).

---

## 📖 The Problem
Traditional government skilling portals are text-heavy, relying on complex digital forms in standard languages. Beneficiaries with low digital literacy often end up in irrelevant training programs that ignore local market demands, family constraints, or financial viability. Furthermore, District Officers lack grassroots data to create accurate Annual Action Plans (AAPs) for central funding.

## 🚀 Our Solution
**PM-AJAY Sahayata** is an empathetic, voice-interactive web kiosk that conducts conversational interviews in everyday spoken language. It maps beneficiary profiles to accredited NSQF trades, calculates PM-AJAY GIA subsidies for self-employment, and automatically generates data-driven Annual Action Plans for district administrators.

---

## ✨ Key Features

### 1. Multilingual Voice Kiosk (Accessibility Core)
* **Zero-Form Interface:** Replaces text inputs with a large, animated microphone button using the browser's native Web Speech API.
* **Empathetic Interview:** Gathers data on traditional skills, education, mobility constraints, and wage vs. enterprise preferences through a natural 4-step voice flow.
* **Text-to-Speech (TTS):** Reads all recommendations aloud in Hindi/regional languages for visually impaired or low-literacy users.

### 2. Intelligent NSQF & Adarsh Gram Synergy Engine
* **Colloquial to Taxonomy Translation:** Parses unstructured rural speech (e.g., *"bijli ka kaam"*) into formal NSQF Level 1-4 codes (e.g., *Solar PV Installer - Level 4*).
* **Adarsh Gram Targeting:** Cross-references user trades with local village infrastructure gaps (Water, Sanitation, Electricity) to recommend impactful local skilling.

### 3. PM-AJAY GIA ₹10,000 Subsidy Calculator
* Provides a dynamic micro-business funding breakdown for beneficiaries choosing self-employment.
* Visually splits total setup costs (e.g., ₹20,000) into the **50% PM-AJAY Direct Govt Subsidy (up to ₹10,000)** and required bank loan/self-contribution.

### 4. Low-Bandwidth WhatsApp Simulation Mode
* A toggleable mobile UI that mirrors a WhatsApp voice-note chat interface, simulating how beneficiaries in 2G/3G network areas can access the service without loading heavy web pages.

### 5. District Officer Dashboard & AAP Auto-Generator
* **Demand Analytics:** Interactive Recharts visualizing top-demanded skills per block and wage vs. enterprise ratios.
* **1-Click AAP Export:** Automatically aggregates grassroots interview data to generate downloadable Annual Action Plan (AAP) PDF reports for Ministry budget requests.

---

## 🛠️ Tech Stack & Architecture

* **Frontend Framework:** React.js / Vite
* **Styling:** Tailwind CSS, Lucide React (Icons)
* **Voice Engine:** Web Speech API (`webkitSpeechRecognition` for STT & `SpeechSynthesis` for TTS)
* **Data Visualization:** Recharts
* **State Management & Logic:** React Hooks with local JSON mock databases for instant, offline-capable hackathon execution.

---

## ⚙️ Local Installation & Setup

To run this project locally on your machine:

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/your-username/pmajay-sahayata-voice-assistant.git](https://github.com/your-username/pmajay-sahayata-voice-assistant.git)

```

2. **Navigate to the project directory:**
```bash
cd pmajay-sahayata-voice-assistant

```


3. **Install dependencies:**
```bash
npm install

```


4. **Start the development server:**
```bash
npm run dev

```


5. **Open in Browser:** Navigate to `http://localhost:5173`.
*(Note: Please ensure you access the site via localhost or HTTPS to allow browser microphone permissions).*

---

## 📜 Alignment with Government Policy

This project is strictly designed around the **Ministry of Social Justice and Empowerment's** official guidelines for 2024-2026:

* Targets SC beneficiaries and verifies **BPL / Antyodaya** eligibility.
* Integrates **NSQF (National Skills Qualifications Framework)** Level 1-4 standardizations.
* Uses the exact **₹10,000 / 50% asset cost cap** for the PM-AJAY Grant-in-Aid (GIA) individual subsidy.
* Prioritizes infrastructural development in **Adarsh Gram** (SC-majority) villages.

---

## 👥 Team

* **[Your Name]** - System Architecture & UI Development
* **[Teammate Name]** - Prompt Engineering, Data Architecture & Policy Research

Made for the **Smart India Hackathon**.

```

<ElicitationsGroup message="What is the next deliverable you need help with?">
  <Elicitation label="Draft the 3-minute live pitch & demo script" query="Write the complete 3-minute spoken pitch script and step-by-step demo flow for presenting this prototype to the SIH judges."/>
  <Elicitation label="How to deploy this for free on Vercel" query="Give me step-by-step instructions on how to take this GitHub repository and deploy it for free on Vercel so we have a live link."/>
</ElicitationsGroup>

```
