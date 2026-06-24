<div align="center">
  <h1>🍄 Mycelium</h1>
  <p><strong>Biological Neural Task Network & AI Productivity HUD</strong></p>
  <p><em>An active, biophilic ecosystem to cure procrastination and deadline rot.</em></p>
  
  <a href="https://mycelium-ygel.onrender.com"><strong>Live Demo</strong></a> · 
  <a href="#installation"><strong>Installation Guide</strong></a>
</div>

<br />

> **The Problem:** Traditional productivity apps treat tasks as cold, isolated checkmarks on flat lists. They rely on passive alerts that offer zero resistance to procrastination.
>
> **The Solution:** Mycelium is a living ecosystem that models your commitments as a subterranean fungal network. Tasks are living **spores**. As time ticks, neglected nodes undergo **biological decay**, turning from vibrant indigo to decaying amber and warning rose. 

---

## 🏆 Hackathon Evaluation Highlights
*How Mycelium meets and exceeds the judging criteria:*

- **🧠 Problem Solving (20%):** Replaces passive alerts with an active **Emergency Lockdown Protocol**, synthesizing Web Audio binaural beats to physically pull users into a flow state when a deadline is critically near.
- **🤖 Agentic Depth (20%):** Features a 4-agent orchestrated system (The Spore, The Shroom, Myco-Field, Bio-Bridge) that actively parses unstructured text into tasks, diagnoses schedule risk, and intervenes with aggressive accountability.
- **🎨 Innovation & Creativity (20%):** Completely discards the "list" UI in favor of an interactive, 2D physics-based biological grid using glowing SVG hyphae connections.
- **☁️ Google Tech (15%):** Deep integration of **Google Gemini 3.5 Flash** (using strict JSON Structured Outputs via `@google/genai`) and **Firebase Firestore** for real-time websocket synchronization across devices.

---

---

## 📸 Evaluation Matrix Showcase

*Please review the following screenshots which demonstrate how Mycelium satisfies each of the 7 Hackathon judging criteria:*

### 1. Problem Solving & Impact (20%)
**Showcasing:** `EMERGENCY DECAY PROTOCOL`. When a user procrastinates, Mycelium locks the screen and uses Web Audio binaural beats to force focus and cure task paralysis.
> 📸 **[PLACEHOLDER: Insert screenshot of the red/high-contrast Emergency Console]**
> `![Problem Solving - Emergency Mode](link-to-image)`

### 2. Agentic Depth (20%)
**Showcasing:** `4. ACTIVE SYMBIOTE AI INTERCOM`. The multi-agent ecosystem features four distinct personas (The Spore, The Shroom, Myco-Field, Bio-Bridge) that provide dynamic, autonomous accountability.
> 📸 **[PLACEHOLDER: Insert screenshot of the 4. ACTIVE SYMBIOTE AI INTERCOM interface]**
> `![Agentic Depth - Chat](link-to-image)`

### 3. Innovation & Creativity (20%)
**Showcasing:** `1. BIOLOGICAL NEURAL GRID`. Instead of a flat list, tasks are living spores connected by glowing hyphae that pulse based on deadline risk (Decaying, Unstable, Nutritional).
> 📸 **[PLACEHOLDER: Insert screenshot of the 1. BIOLOGICAL NEURAL GRID with glowing nodes]**
> `![Innovation - Neural Grid](link-to-image)`

### 4. Usage of Google Technologies (15%)
**Showcasing:** `2. INGEST CHAOTIC SYLLABUS OR MESSY EMAILS`. Uses Google Gemini 3.5 Flash structured JSON outputs to autonomously parse messy text blocks directly into grid coordinates.
> 📸 **[PLACEHOLDER: Insert screenshot of the 2. INGEST CHAOTIC SYLLABUS OR MESSY EMAILS panel]**
> `![Google Tech - AI Extraction](link-to-image)`

### 5. Product Experience & Design (10%)
**Showcasing:** `5. ACTIVE TASK HUD CONTROLLER`. A seamless, dark-mode, biological-terminal aesthetic built with Tailwind v4 that tracks "Accumulated Assimilation" and "Vitality Points".
> 📸 **[PLACEHOLDER: Insert screenshot of the 5. ACTIVE TASK HUD CONTROLLER]**
> `![Product Design - HUD Controller](link-to-image)`

### 6. Technical Implementation (10%)
**Showcasing:** `3. COMMUTE NAVIGATION & CROWDSOURCED ECOSYSTEM LOGGING`. Demonstrates complex state management linking physical/ecological actions to digital vitality scores, securely backed by Firestore.
> 📸 **[PLACEHOLDER: Insert screenshot of the 3. COMMUTE NAVIGATION & CROWDSOURCED ECOSYSTEM LOGGING panel]**
> `![Technical Implementation - Ecosystem](link-to-image)`

### 7. Completeness & Usability (5%)
**Showcasing:** The overarching `MYCELIUM CHIEF OF STAFF HUD`. The app is a fully functional Progressive Web App (PWA) that syncs instantly across mobile and desktop environments.
> 📸 **[PLACEHOLDER: Insert screenshot of the full Chief of Staff HUD running cleanly on a device]**
> `![Completeness - Full HUD/PWA](link-to-image)`

---

## 🛠 Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, Framer Motion
- **Backend Proxy:** Node.js, Express, `express-rate-limit`, `cors` (Protects the Gemini API Key from client-side scraping)
- **AI Core:** Google Gemini 3.5 Flash (`@google/genai` SDK)
- **Database:** Firebase Firestore (Real-time NoSQL with strict 14-field security rules)
- **Native APIs:** Web Audio API (Binaural Beats), Service Workers (PWA capabilities)

---

## 🚀 Installation & Running Locally

### Prerequisites
- Node.js (v18 or higher)
- A Firebase Account (Spark Plan is fine)
- A Google Gemini API Key

### Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/TanayJalan/Mycelium.git
   cd Mycelium
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory (you can copy `.env.example`):
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Boot the Development Server:**
   ```bash
   npm run dev
   ```
   *Note: This starts the Express backend with integrated Vite middleware on port 3000.*

5. **Open the Web Application:**
   Go to [http://localhost:3000](http://localhost:3000) in your web browser.

---
*Built with ❤️ for the Google AI Hackathon.*
