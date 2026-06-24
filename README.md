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

## 📸 Evaluation Matrix Showcase

*Please review the following screenshots which demonstrate how Mycelium satisfies each of the 7 Hackathon judging criteria:*

### 1. Problem Solving & Impact (20%)
**Showcasing:** The Emergency Lockdown Protocol. When a user procrastinates, Mycelium locks the screen and uses Web Audio binaural beats to force focus.
> 📸 **[PLACEHOLDER: Insert screenshot of the red/high-contrast Emergency Console]**
> `![Problem Solving - Emergency Mode](link-to-image)`

### 2. Agentic Depth (20%)
**Showcasing:** The multi-agent ecosystem. Here, "The Spore" parses unstructured text into tasks, while "The Shroom" provides aggressive accountability.
> 📸 **[PLACEHOLDER: Insert screenshot of the Agent Chat interface showing the AI personas]**
> `![Agentic Depth - Chat](link-to-image)`

### 3. Innovation & Creativity (20%)
**Showcasing:** The Biological Neural Grid. Instead of a flat list, tasks are living spores connected by glowing hyphae that pulse based on deadline risk.
> 📸 **[PLACEHOLDER: Insert screenshot of the 2D Mycelial Canvas with connected glowing nodes]**
> `![Innovation - Neural Grid](link-to-image)`

### 4. Usage of Google Technologies (15%)
**Showcasing:** Gemini 3.5 Flash Integration. The AI diagnostic panel uses structured JSON outputs from Gemini to predict deadline failure rates.
> 📸 **[PLACEHOLDER: Insert screenshot of the Risk Diagnostic panel or Zero-to-One Quickstart]**
> `![Google Tech - Gemini Diagnostics](link-to-image)`

### 5. Product Experience & Design (10%)
**Showcasing:** The Chief of Staff HUD. A seamless, dark-mode, biological-terminal aesthetic built with Tailwind v4 and Framer Motion.
> 📸 **[PLACEHOLDER: Insert screenshot of the main HUD dashboard and top navigation]**
> `![Product Design - HUD](link-to-image)`

### 6. Technical Implementation (10%)
**Showcasing:** Real-time synchronization. The Firestore NoSQL database powers the backend, syncing node coordinates instantly across devices.
> 📸 **[PLACEHOLDER: Insert screenshot of the Firebase/Firestore database console showing the tasks, or the app running on two screens]**
> `![Technical Implementation - Sync](link-to-image)`

### 7. Completeness & Usability (5%)
**Showcasing:** The Progressive Web App (PWA) and Mobile Responsiveness. The app is fully deployable and usable on any device.
> 📸 **[PLACEHOLDER: Insert screenshot of the app running cleanly on a mobile device or as an installed desktop PWA]**
> `![Completeness - Mobile/PWA](link-to-image)`

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
