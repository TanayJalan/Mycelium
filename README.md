# 🍄 Mycelium

**Biological Neural Task Network & AI Productivity HUD**  
*An active, biophilic ecosystem to cure procrastination and deadline rot.*

---

## Problem
Traditional productivity apps treat tasks as cold, isolated checkmarks on flat lists. They rely on passive alerts (like push notifications) that offer zero resistance to procrastination. When users face complex tasks, they often experience "task paralysis" and ignore the alerts entirely.

## Solution
Mycelium is a living ecosystem that models your commitments as a subterranean fungal network. 
- Tasks are living **spores**. As time ticks, neglected nodes undergo **biological decay**, turning from vibrant indigo to decaying amber and warning rose. 
- Instead of passive alerts, Mycelium uses an active **Emergency Lockdown Protocol**, synthesizing Web Audio binaural beats to physically pull users into a flow state when a deadline is critically near.
- It features a 4-agent orchestrated system (The Spore, The Shroom, Myco-Field, Bio-Bridge) that actively parses unstructured text into tasks, diagnoses schedule risk, and intervenes with aggressive accountability.

## Architecture
- **Biological Neural Grid**: A 2D physics-based engine using SVG connections where nodes visually pulse based on deadline risk.
- **Backend Proxy**: An Express.js layer that securely handles all AI logic, completely hiding the Gemini API Key from the client.
- **Real-Time State**: Firestore provides websocket synchronization across devices.
- **AI Core**: Powered by **Google Gemini 3.5 Flash** using strict JSON Structured Outputs to convert chaotic syllabus dumps into structured grid coordinates.

## Tech Stack
- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, Framer Motion
- **Backend:** Node.js, Express, `express-rate-limit`, `cors`
- **AI:** Google Gemini 3.5 Flash (`@google/genai` SDK)
- **Database:** Firebase Firestore (Real-time NoSQL)
- **Native APIs:** Web Audio API (Binaural Beats), Service Workers (PWA)

## Screenshots

**1. BIOLOGICAL NEURAL GRID**
<img width="700" height="435" alt="Screenshot 2026-06-24 at 5 08 26 PM" src="https://github.com/user-attachments/assets/7b0ad0f4-1baa-4879-86cb-ae217244b80c" />

**2. INGEST CHAOTIC SYLLABUS OR MESSY EMAILS**
<img width="708" height="199" alt="Screenshot 2026-06-24 at 5 08 35 PM" src="https://github.com/user-attachments/assets/7c984052-c5f8-4912-86af-77522c49a85c" />

**3. COMMUTE NAVIGATION & CROWDSOURCED ECOSYSTEM LOGGING**
<img width="694" height="440" alt="Screenshot 2026-06-24 at 5 08 44 PM" src="https://github.com/user-attachments/assets/4b477ade-88e7-4ed0-a2fa-f47f4e5fabc3" />

**4. ACTIVE SYMBIOTE AI INTERCOM**
<img width="489" height="565" alt="Screenshot 2026-06-24 at 5 08 52 PM" src="https://github.com/user-attachments/assets/912b1dca-dea2-4975-aa89-b61f1c926318" />

**5. ACTIVE TASK HUD CONTROLLER**
<img width="492" height="326" alt="Screenshot 2026-06-24 at 5 09 06 PM" src="https://github.com/user-attachments/assets/34c9f28f-20fd-4c5a-8271-af917a3ee3b4" />

**EMERGENCY DECAY PROTOCOL**
<img width="997" height="810" alt="Screenshot 2026-06-24 at 5 16 08 PM" src="https://github.com/user-attachments/assets/d15d9c3b-adcf-4fdd-a99b-829b1d1bfee8" />

**MYCELIUM CHIEF OF STAFF HUD (PWA View)**
<img width="496" height="545" alt="Screenshot 2026-06-24 at 5 09 14 PM" src="https://github.com/user-attachments/assets/6e5dce39-aa50-48e5-bf86-bd685a4e7180" />

## Demo Link
**[Play the Live Application on Render here!](https://mycelium-ygel.onrender.com)**

## Installation

### Prerequisites
- Node.js (v18 or higher)
- A Firebase Account
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
   Create a `.env` file in the root directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Boot the Development Server:**
   ```bash
   npm run dev
   ```

5. **Open the Web Application:**
   Go to [http://localhost:3000](http://localhost:3000) in your web browser.

## Results
- Successfully replaced flat-list task management with a physics-based spatial node grid.
- Achieved real-time task syncing and UI updates across multiple devices using Firebase.
- Implemented robust, reliable JSON extraction using Gemini 3.5 Flash for autonomous task scheduling.
- Fully operational Progressive Web App (PWA) with built-in acoustic focus states (Web Audio API).

## Future Improvements
- **Google Calendar Sync**: Bi-directional syncing to automatically map calendar events into the Mycelium grid.
- **Multiplayer Grids**: Allowing teams to share a subterranean network where one person's completion provides resources to another's tasks.
- **Wearable Integration**: Using Apple Watch or Fitbit heart-rate data to automatically adjust the intensity of the Emergency Lockdown binaural beats.

## Licence
This project is licensed under the MIT License.
