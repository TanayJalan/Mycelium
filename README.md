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

## 💻 UI Walkthrough & Architecture

### 1. The Biological Neural Grid
The core canvas where all commitments live as connected nodes.
- **Visual Risk:** Nodes visually pulse and change color based on proximity to their deadline.
- **Connections:** Completing parent tasks releases nutrients to dependent child nodes.

> 📸 **[PLACEHOLDER: Insert screenshot of the glowing 2D Mycelial Canvas with connected nodes]**
> `![Neural Grid](link-to-image)`

### 2. The Four Autonomous Symbiotes (Agents)
Toggle between unique microbial guides:
- **The Spore:** Parses chaotic syllabus dumps into structured grid coordinates.
- **The Shroom:** Aggressive accountability partner that "spore-shames" you if you procrastinate.
- **Myco-Field:** Generates subterranean calm and deep-focus breathing loops.
- **Bio-Bridge:** Maps digital completion to simulated ecological carbon offsets.

> 📸 **[PLACEHOLDER: Insert screenshot of the Agent Chat interface showing a response from The Shroom]**
> `![Agent Chat](link-to-image)`

### 3. Emergency Decay Protocol (Lockdown)
When a critical node is rotting, the system takes over.
- Bypasses procrastination by keeping the cursor locked inside a high-contrast terminal.
- Engages native Web Audio API to loop 110Hz/114.5Hz Theta waves and a 55Hz sub-harmonic drone.

> 📸 **[PLACEHOLDER: Insert screenshot of the red/high-contrast Emergency Console]**
> `![Emergency Lockdown](link-to-image)`

### 4. Zero-to-One Draft Generator & Diagnostics
Leverages Gemini to eliminate the "activation energy" of starting a massive task.
- Click a task to instantly generate a personalized 10% starter draft.
- The system runs continuous background diagnostics to predict network failure rates.

> 📸 **[PLACEHOLDER: Insert screenshot of the Zero-to-One Quickstart sidebar or Risk Diagnostic panel]**
> `![AI Diagnostics](link-to-image)`

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
