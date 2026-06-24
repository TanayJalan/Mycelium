# 🍄 Mycelium — Biological Neural Task Network

> **An AI-powered biophilic productivity platform modeled after fungal networks. Mycelium dynamically maps commitments as living connected nodes, models real-time risk of deadline rot, and features proactive accountability agents alongside active full-screen focus lockdown interfaces.**

---

## 🧠 The Concept: Biophilic Productivity
Traditional productivity apps treat tasks as cold, isolated, sterile checkmarks on flat lists. They rely on passive alerts that are easily swiped away, offering zero resistance to procrastination. 

**Mycelium is different.** It is an active, biophilic ecosystem that models your life commitments as a subterranean fungal network. Your tasks are living **spores**, connected through glowing **hyphae filaments**. 

As time ticks, neglected nodes undergo **biological decay (deadline rot)**, turning from vibrant indigo/emerald to decaying amber and warning rose. This raises the risk profile of your entire network. When critical nodes are on the verge of collapsing, Mycelium deploys aggressive intervention protocols to rescue you from last-minute failures.

---

## 🌿 Core Features

### 1. Biological Neural Grid (Mycelial Canvas)
- **Living Network Topology:** Every commitment is visualized as an active node placed on an interactive 2D physics-based biology grid.
- **Filamentous Hyphae Connections:** Link tasks together structurally. Completing parent tasks releases nutrients to dependent child nodes.
- **Dynamic Spore Decay:** Tasks visually rot over time if ignored. Hovering over a decaying node reveals live biometric logs, deadline risks, and visual decay multipliers.

### 2. AI Chief of Staff HUD (Heuristic Utility Display)
The command center for high-level time orchestration and biological synchronization:
- **Chronological Density Map:** A gorgeous, interactive 24-hour horizontal visual bar charting your day's density—shifting from morning high-concentration sprints to bio-rest intervals and peak focus zones.
- **Energy-Aware Grid Align:** A cognitive alignment engine. Instead of scheduling tasks in rigid, unrealistic slots, this engine maps your tasks against a simulated **Diurnal Circadian Energy Curve**. Clicking **Grid Align** initiates a dynamic calibration that physically reposition task nodes on your canvas to lower-risk, energy-optimal spatial coordinates.
- **Google Calendar Sync:** Reserve synchronized 60-minute Focus Blocks directly in your schedule. Activating sync automatically adds defensive focus blocks during your verified peak cognitive windows.
- **Autonomous Study Plan Injector:** Click to have the autonomous system generate a multi-step checklist parsed and injected directly into the selected node’s metadata.

### 3. Four Symbiotic Autonomous AI Agents
Toggle between unique microbial guides to accompany your session:
*   **The Spore (Syllabus & Ingestion Agent):** Translates chaotic, unstructured inputs (such as messy emails, syllabus sheets, and chat logs) into perfectly structured, connected mycelial coordinates.
*   **The Shroom (Aggressive Accountability Partner):** A hyper-verbal, high-resistance motivator. If you try to scroll TikTok or check social media, *The Shroom* intercepts your actions with hilarious, highly stubborn warnings.
*   **Myco-Field (Deep Focus Companion):** Generates subterranean calm, guiding your breathing via a rhythmic expansional visualizer and feeding a "Binaural Loam Wave" background synthesizer.
*   **Bio-Bridge (Ecosystem Mapping Agent):** Connects digital completion to global restoration. Completing focus cycles offsets simulated carbon, cleans up local grid hazards, and awards regional Vitality Points.

### 4. Emergency Decay Protocol (Lockdown Focus)
*   **Intrusive Intervention:** When a critical node is in imminent danger of rot, trigger a full-screen, high-fidelity lockdown terminal.
*   **Interactive Safeguards:** Bypasses procrastination by keeping your cursor locked inside the workspace, displaying a ticking high-contrast focus clock, and supplying live AI encouragement.
*   **Loam Wave Synthesizer:** Direct, immersive synth loops block out ambient distractions during the count.

### 5. AI Ingest, Risk Prediction & Rescue Drafts
*   **Gemini Risk Diagnostics:** Leverages the official `@google/genai` SDK to evaluate your overall mycelial layout, predicting failure thresholds and suggesting personalized bio-rest remedies.
*   **Starter Activation & Rescue Drafts:**
    - Generate quick outline drafts to overcome the initial friction of starting a complex task.
    - If a deadline is missed, the agent generates empathetic, professional, and customizable extension request drafts automatically to keep you protected.

---

## 🛠 Tech Stack & Architecture

- **Frontend Framework:** React 19, TypeScript, Vite
- **Styling & Theme:** Tailwind CSS v4 (with custom `@theme` variables for an organic dark terminal palette)
- **Animations:** Motion (Framer Motion) imported natively from `motion/react`
- **Charts & Statistics:** Recharts (visualization of daily focus trends and circadian rhythm variations)
- **Backend Server:** Express.js proxying API interactions to keep secrets hidden
- **AI Core Integration:** Google Gemini 3.5 Flash via official `@google/genai` TypeScript SDK
- **Data Persistence:** Cloud Firestore (Firebase) ensuring that your mycelial layout, custom logs, and active tasks persist across sessions.

---

## 🏃 Run the Application Locally

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Setup Instructions

1. **Clone the project & navigate to the workspace:**
   ```bash
   cd mycelium
   ```

2. **Install all dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file (or copy `.env.example`) and supply your Google Gemini API key:
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

🏆 **Mycelium** — Built as a biophilic, active guardian to defeat the activation energy of starting and save users from the decay of procrastination. Inspired by natural subterranean networks.
