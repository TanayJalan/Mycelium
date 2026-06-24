import React, { useState } from "react";
import { PitchSlide } from "../types";
import {
  Brain, Award, ShieldAlert, GitBranch, Layers, Database,
  Timer, Rocket, Play, CheckCircle2, ChevronRight, HelpCircle,
  Activity, Zap, Lightbulb, Users, Navigation, Flame, Server
} from "lucide-react";

interface StrategyDeckProps {
  slides: PitchSlide[];
}

export const StrategyDeck: React.FC<StrategyDeckProps> = ({ slides }) => {
  const [activeId, setActiveId] = useState<number>(1);
  const [activeTable, setActiveTable] = useState<string>("users");

  const currentSlide = slides.find((s) => s.id === activeId) || slides[0];

  // Helper to change slide
  const nextSlide = () => {
    if (activeId < slides.length) setActiveId(activeId + 1);
  };
  const prevSlide = () => {
    if (activeId > 1) setActiveId(activeId - 1);
  };

  // Render the specific interactive visual for each slide category
  const renderVisualContent = (visualType: string) => {
    switch (visualType) {
      case "problems":
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#161B22] border border-[#30363D] p-4 rounded-xl shadow-md">
              <div className="flex items-center gap-2 mb-2 text-rose-400">
                <ShieldAlert className="w-5 h-5" />
                <h4 className="font-display font-semibold text-sm text-slate-200">Root Causes of Missed Deadlines</h4>
              </div>
              <ul className="space-y-2 text-[11px] text-slate-400 list-disc pl-4">
                <li><strong className="text-slate-300">Temporal Discounting:</strong> Humans undervalue outcomes that are far in the future, prioritizing instant gratification.</li>
                <li><strong className="text-slate-300">The Planning Fallacy:</strong> Systematically underestimating the time required to complete familiar tasks.</li>
                <li><strong className="text-slate-300">Cognitive Overload:</strong> Fragmentation of tasks across Slack, email, and Canvas causes paralyzing decision-fatigue.</li>
              </ul>
            </div>

            <div className="bg-[#161B22] border border-[#30363D] p-4 rounded-xl shadow-md">
              <div className="flex items-center gap-2 mb-2 text-orange-400">
                <Flame className="w-5 h-5" />
                <h4 className="font-display font-semibold text-sm text-slate-200">Why Current Tools Fail</h4>
              </div>
              <ul className="space-y-2 text-[11px] text-slate-400 list-disc pl-4">
                <li><strong className="text-slate-300">Passive Reminders:</strong> Push alerts (Todoist, GCal) are easily swiped away or Snoozed, creating no behavioral resistance.</li>
                <li><strong className="text-slate-300">Lack of Real Context:</strong> Reminders ignore current physiological stress, transit time, or cognitive fatigue.</li>
                <li><strong className="text-slate-300">Static Scheduling:</strong> Traditional calendars assume time is rigid, failing to adapt to sudden delays.</li>
              </ul>
            </div>

            <div className="bg-[#161B22] border border-[#30363D] p-4 rounded-xl shadow-md">
              <div className="flex items-center gap-2 mb-2 text-indigo-400">
                <Brain className="w-5 h-5" />
                <h4 className="font-display font-semibold text-sm text-slate-200">Behavioral Psychology Insights</h4>
              </div>
              <ul className="space-y-2 text-[11px] text-slate-400 list-disc pl-4">
                <li><strong className="text-slate-300">Spore-Escalation Model:</strong> Replacing nagging with social commitment and active UI friction (Emergency overlay).</li>
                <li><strong className="text-slate-300">Biophilic Anchoring:</strong> Tying dry intellectual accomplishments to organic soil health triggers positive primal feedback loops.</li>
                <li><strong className="text-slate-300">Micro-Habit Nuances:</strong> Breaking down massive deadlines into dynamic, breathing biological nodes.</li>
              </ul>
            </div>
          </div>
        );

      case "concept":
        return (
          <div className="bg-[#0E131C] border border-[#1A2430] p-5 rounded-xl space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#1A2430] pb-4">
              <div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-900 px-2 py-0.5 rounded uppercase">
                  Startup Branding
                </span>
                <h3 className="text-xl font-display font-bold text-white mt-1">MYCELIUM: The Biological Neural Task Network</h3>
              </div>
              <div className="text-xs text-slate-400 font-mono">
                VALUE PROPOSITION: <span className="text-lime-400">Proactive, Ecological & Non-Passive Resilience</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Mycelium is an AI-powered cognitive companion modeled after forest mycelial networks. In nature, mycelium is a subterranean neural map that distributes water and carbon to struggling trees, signals danger across kilometers, and adapts organically to stress. 
              Mycelium maps your tasks as living cells (nodes) connected by nutrient-sharing hyphae, adapting schedules dynamically to prevent missed deadlines.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-2">
              <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                <h5 className="font-bold text-[11px] text-white uppercase tracking-wider">vs Google Calendar</h5>
                <p className="text-[11px] text-slate-400 mt-1">GCal is static. Mycelium breathes, auto-rescheduling tasks based on transit times, mental bandwidth, and environmental shifts.</p>
              </div>
              <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                <h5 className="font-bold text-[11px] text-white uppercase tracking-wider">vs Notion</h5>
                <p className="text-[11px] text-slate-400 mt-1">Notion is a passive repository. Mycelium has active agency, deploying autonomous agents to negotiate, prompt, and focus you.</p>
              </div>
              <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                <h5 className="font-bold text-[11px] text-white uppercase tracking-wider">vs Todoist</h5>
                <p className="text-[11px] text-slate-400 mt-1">Todoist sends silent push reminders. Mycelium escalates to emergency focus lockdowns and coordinates real-world help.</p>
              </div>
              <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                <h5 className="font-bold text-[11px] text-white uppercase tracking-wider">vs ChatGPT</h5>
                <p className="text-[11px] text-slate-400 mt-1">ChatGPT gives static advice. Mycelium connects live via Google Workspace and runs agents to synchronize schedule loam.</p>
              </div>
            </div>
          </div>
        );

      case "features":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#0E131C] border border-[#1A2430] p-4 rounded-xl space-y-3">
              <h4 className="font-display font-semibold text-sm text-lime-400 flex items-center gap-2">
                <Zap className="w-4 h-4" /> Real-Time Risk Prediction (Gemini 3.5)
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Using Gemini 3.5's advanced analytical capabilities, Mycelium continuously assesses task priority, temporal overlap, calendar travel coordinates, and historic completion rates to calculate a real-time <strong className="text-white">Node Decay Score</strong>. It triggers visual alerts before a conflict occurs.
              </p>
            </div>
            <div className="bg-[#0E131C] border border-[#1A2430] p-4 rounded-xl space-y-3">
              <h4 className="font-display font-semibold text-sm text-emerald-400 flex items-center gap-2">
                <Navigation className="w-4 h-4" /> Biological Urban Navigation (Bio-Bridge)
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Connects physical transit coordinates with local crowdsourced environmental mapping. As a user walks to an exam or errand, Mycelium routes them through local coordinates requesting environmental logs (e.g., reporting tree health, logging local biodiversity) to offset cognitive stress and earn vitality points.
              </p>
            </div>
            <div className="bg-[#0E131C] border border-[#1A2430] p-4 rounded-xl space-y-3">
              <h4 className="font-display font-semibold text-sm text-purple-400 flex items-center gap-2">
                <Activity className="w-4 h-4" /> Proactive Voice Intercom (Live API)
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Fitted with Gemini's Live API PCM streaming. Instead of passive push text, the platform initiates a real-time low-latency audio dialogue with the user when extreme decay risk is sensed—providing a supportive but firm coaching intervention.
              </p>
            </div>
            <div className="bg-[#0E131C] border border-[#1A2430] p-4 rounded-xl space-y-3">
              <h4 className="font-display font-semibold text-sm text-cyan-400 flex items-center gap-2">
                <Timer className="w-4 h-4" /> Loom-Sync Deep Focus & Browser Lock
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Emergency Mode locks down browser overlays, aggregates active communication into a single terminal window, and generates real-time low-frequency brown and pink noise designed to increase neural focus.
              </p>
            </div>
          </div>
        );

      case "agents":
        return (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="bg-[#0E131C] border-t-2 border-emerald-500 p-3.5 rounded-xl">
              <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest block mb-1">Agent 1</span>
              <h4 className="font-display font-bold text-sm text-white">THE SPORE</h4>
              <span className="text-[10px] text-slate-400 italic block mt-0.5">Planner Agent</span>
              <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                Monitors calendar synchronicity, crawls emails, and splits complex deliverables into organic sub-milestones based on your cognitive loam.
              </p>
            </div>
            <div className="bg-[#0E131C] border-t-2 border-purple-500 p-3.5 rounded-xl">
              <span className="text-[9px] font-mono text-purple-400 uppercase tracking-widest block mb-1">Agent 2</span>
              <h4 className="font-display font-bold text-sm text-white">THE SHROOM</h4>
              <span className="text-[10px] text-slate-400 italic block mt-0.5">Accountability Sentinel</span>
              <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                Proactively intercepts procrastination, escalates warnings, locks apps, and shames you on peer mycelial structures until complete.
              </p>
            </div>
            <div className="bg-[#0E131C] border-t-2 border-cyan-500 p-3.5 rounded-xl">
              <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest block mb-1">Agent 3</span>
              <h4 className="font-display font-bold text-sm text-white">MYCO-FIELD</h4>
              <span className="text-[10px] text-slate-400 italic block mt-0.5">Focus Synthesizer</span>
              <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                Creates an eye-safe environment, generates binaural soil-sync soundscapes, and guides breathing exercises to soothe nervous systems.
              </p>
            </div>
            <div className="bg-[#0E131C] border-t-2 border-orange-500 p-3.5 rounded-xl">
              <span className="text-[9px] font-mono text-orange-400 uppercase tracking-widest block mb-1">Agent 4</span>
              <h4 className="font-display font-bold text-sm text-white">BIO-BRIDGE</h4>
              <span className="text-[10px] text-slate-400 italic block mt-0.5">Ecosystem Coordinator</span>
              <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                Bridges completion vectors to the local physical environment, allocating points for local crowdsourced environmental patrols.
              </p>
            </div>
          </div>
        );

      case "userflow":
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#0E131C] border border-[#1A2430] p-4 rounded-xl space-y-2">
              <div className="bg-emerald-950/50 border border-emerald-900 w-7 h-7 rounded-full flex items-center justify-center font-mono text-xs text-emerald-400">1</div>
              <h4 className="font-display font-bold text-sm text-white">First-Time Onboarding</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Syncs with Google Workspace (Gmail & Calendar) and logs historic deadline patterns. Generates your initial subterranean mycelial neural map, displaying commitments as connected cells rather than a list. Selects your core symbiote personality weights.
              </p>
            </div>
            <div className="bg-[#0E131C] border border-[#1A2430] p-4 rounded-xl space-y-2">
              <div className="bg-lime-950/50 border border-lime-900 w-7 h-7 rounded-full flex items-center justify-center font-mono text-xs text-lime-400">2</div>
              <h4 className="font-display font-bold text-sm text-white">Daily Loam-Sync Workflow</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Morning briefing from <strong className="text-emerald-400">The Spore</strong> details optimal temporal tunnels. Commutes include routed urban ecology checks guided by <strong className="text-orange-400">Bio-Bridge</strong>. Completing milestones earns Vitality points to nurture your biological avatar.
              </p>
            </div>
            <div className="bg-[#0E131C] border border-[#1A2430] p-4 rounded-xl space-y-2">
              <div className="bg-red-950/50 border border-red-900 w-7 h-7 rounded-full flex items-center justify-center font-mono text-xs text-red-400">3</div>
              <h4 className="font-display font-bold text-sm text-white">Emergency Meltdown Mode</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Activated when a node decays past 85% risk. The UI triggers high-intensity visual overlays, engages peer check-ins via SMS, limits browser redirects, launches focus soundscapes, and tunnels concentration strictly to the threat node until resolved.
              </p>
            </div>
          </div>
        );

      case "google":
        return (
          <div className="bg-[#0E131C] border border-[#1A2430] p-5 rounded-xl space-y-4">
            <h4 className="font-display font-bold text-sm text-white border-b border-[#1A2430] pb-2 uppercase tracking-wide">
              Google AI & Cloud Orchestration Map
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="bg-slate-900/60 p-3.5 rounded-lg border border-slate-800 space-y-1.5">
                <span className="text-emerald-400 font-mono font-bold uppercase tracking-wider block">Gemini 3.5 Suite</span>
                <p className="text-slate-400 leading-relaxed">
                  <strong className="text-slate-300">Gemini 3.5 Flash:</strong> Drives the central node-parsing logic, structured schema Extractions, and conversational agents.
                </p>
                <p className="text-slate-400 leading-relaxed">
                  <strong className="text-slate-300">Gemini Live API:</strong> Low-latency audio Intercom coaching session triggered during emergency risks.
                </p>
              </div>

              <div className="bg-slate-900/60 p-3.5 rounded-lg border border-slate-800 space-y-1.5">
                <span className="text-lime-400 font-mono font-bold uppercase tracking-wider block">Google Workspace APIs</span>
                <p className="text-slate-400 leading-relaxed">
                  <strong className="text-slate-300">Google Calendar:</strong> Continuous syncing of physical meeting blocks and dynamic task durations.
                </p>
                <p className="text-slate-400 leading-relaxed">
                  <strong className="text-slate-300">Gmail & Tasks:</strong> Crawls and ingests commitments, converting natural-language threads into structured database nodes.
                </p>
              </div>

              <div className="bg-slate-900/60 p-3.5 rounded-lg border border-slate-800 space-y-1.5">
                <span className="text-cyan-400 font-mono font-bold uppercase tracking-wider block">Firebase & Maps</span>
                <p className="text-slate-400 leading-relaxed">
                  <strong className="text-slate-300">Google Maps Platform:</strong> Drives coordinates mapping, walking routes, and nearby environmental crowdsourcing points.
                </p>
                <p className="text-slate-400 leading-relaxed">
                  <strong className="text-slate-300">Firebase Auth & Firestore:</strong> Manages accounts, records persistent task states, and syncs peer accountability logs.
                </p>
              </div>
            </div>
          </div>
        );

      case "architecture":
        return (
          <div className="bg-[#0E131C] border border-[#1A2430] p-5 rounded-xl space-y-4">
            <h4 className="font-display font-bold text-sm text-white border-b border-[#1A2430] pb-2 uppercase tracking-wide">
              Hackathon Technical Architecture
            </h4>
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Architecture diagram cards */}
              <div className="w-full md:w-1/4 bg-[#0A0D12] border border-[#1A2430] p-3.5 rounded-lg flex flex-col items-center text-center">
                <Users className="w-6 h-6 text-cyan-400 mb-1" />
                <h5 className="font-bold text-xs text-white">Frontend</h5>
                <p className="text-[10px] text-slate-500 mt-1">React 19 + TS<br />Tailwind CSS v4<br />Lucide Icons & SVG Canvas</p>
              </div>

              <div className="text-slate-600 hidden md:block">
                <ChevronRight className="w-6 h-6" />
              </div>

              <div className="w-full md:w-1/4 bg-[#0A0D12] border border-[#1A2430] p-3.5 rounded-lg flex flex-col items-center text-center">
                <Server className="w-6 h-6 text-emerald-400 mb-1" />
                <h5 className="font-bold text-xs text-white">Backend</h5>
                <p className="text-[10px] text-slate-500 mt-1">Express Node Server<br />@google/genai SDK<br />Vite Server Middleware</p>
              </div>

              <div className="text-slate-600 hidden md:block">
                <ChevronRight className="w-6 h-6" />
              </div>

              <div className="w-full md:w-1/4 bg-[#0A0D12] border border-[#1A2430] p-3.5 rounded-lg flex flex-col items-center text-center">
                <Database className="w-6 h-6 text-purple-400 mb-1" />
                <h5 className="font-bold text-xs text-white">Database</h5>
                <p className="text-[10px] text-slate-500 mt-1">Firestore Database<br />(Blueprinted Auth)<br />Real-time Listeners</p>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed text-center bg-[#090D12] p-2.5 rounded-lg border border-[#1A2430] font-mono">
              AI Orchestration: System Instructions & Structured JSON schemas secure a stable pipeline, completely preventing LLM hallucination and securing perfect UI compatibility.
            </p>
          </div>
        );

      case "database":
        const tables: Record<string, { desc: string; columns: { name: string; type: string; desc: string }[] }> = {
          users: {
            desc: "Stores user account metrics, selected symbiote properties, and cumulative vitality points.",
            columns: [
              { name: "id", type: "VARCHAR(64) PRIMARY KEY", desc: "Unique user identifier (Firebase Auth UID)" },
              { name: "email", type: "VARCHAR(128) UNIQUE", desc: "User contact address" },
              { name: "vitality_points", type: "INT DEFAULT 0", desc: "Points awarded for completing tasks & ecosystem logging" },
              { name: "symbiote_weights", type: "JSON", desc: "Ratios of selected agents: { planner, accountability, focus, ecosystem }" },
              { name: "created_at", type: "TIMESTAMP", desc: "Record registration date" },
            ],
          },
          tasks: {
            desc: "Stores biological mycelial nodes, schedules, priorities, and connections.",
            columns: [
              { name: "id", type: "VARCHAR(64) PRIMARY KEY", desc: "Unique biological task node identifier" },
              { name: "user_id", type: "VARCHAR(64) REFERENCES users(id)", desc: "Owner of the task" },
              { name: "title", type: "VARCHAR(255) NOT NULL", desc: "Task title or deliverable summary" },
              { name: "deadline_raw", type: "VARCHAR(255)", desc: "Original unstructured deadline description" },
              { name: "deadline_utc", type: "TIMESTAMP NOT NULL", desc: "Parsed precise UTC deadline timestamp" },
              { name: "priority", type: "VARCHAR(16)", desc: "Priority: 'critical', 'high', 'medium', 'low'" },
              { name: "progress", type: "INT DEFAULT 0", desc: "Percent complete (0 to 100)" },
              { name: "decay_rate", type: "FLOAT DEFAULT 1.0", desc: "Risk escalation modifier based on difficulty" },
              { name: "connected_to", type: "VARCHAR(64)[]", desc: "Array of related task ids representing hyphae connections" },
            ],
          },
          ecosystem_logs: {
            desc: "Stores crowdsourced local ecosystem actions completed by the user.",
            columns: [
              { name: "id", type: "VARCHAR(64) PRIMARY KEY", desc: "Unique log identifier" },
              { name: "user_id", type: "VARCHAR(64) REFERENCES users(id)", desc: "User who filed the log" },
              { name: "task_id", type: "VARCHAR(64) REFERENCES tasks(id)", desc: "Associated task node being offset" },
              { name: "coordinates", type: "POINT NOT NULL", desc: "Physical GPS coordinates of the report (Simulated)" },
              { name: "type", type: "VARCHAR(32)", desc: "Category: 'trash', 'biodiversity', 'soil', 'carbon'" },
              { name: "points_awarded", type: "INT", desc: "Amount of Vitality earned" },
              { name: "logged_at", type: "TIMESTAMP", desc: "Datetime of physical verification" },
            ],
          },
        };

        return (
          <div className="bg-[#0E131C] border border-[#1A2430] p-5 rounded-xl space-y-4">
            <div className="flex justify-between items-center border-b border-[#1A2430] pb-2">
              <h4 className="font-display font-bold text-sm text-white uppercase tracking-wide">
                Relational Database Schema Map
              </h4>
              <span className="text-[10px] font-mono text-slate-500">
                CLICK TABLES BELOW TO EXPLORE COLUMNS
              </span>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              {/* Left Selector */}
              <div className="w-full md:w-1/3 space-y-2">
                {Object.keys(tables).map((tableName) => (
                  <button
                    key={tableName}
                    onClick={() => setActiveTable(tableName)}
                    className={`w-full text-left p-3 rounded-lg border transition-all flex justify-between items-center cursor-pointer ${
                      activeTable === tableName
                        ? "bg-emerald-950/30 border-emerald-500/50 text-white"
                        : "bg-[#0A0D12] border-[#1A2430] text-slate-400 hover:text-slate-200 hover:border-slate-800"
                    }`}
                  >
                    <div>
                      <span className="text-[10px] font-mono text-slate-500 block">TABLE</span>
                      <span className="font-display font-bold text-xs uppercase">{tableName}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-600" />
                  </button>
                ))}
              </div>

              {/* Right Columns HUD */}
              <div className="flex-1 bg-[#090D12] border border-[#1A2430] p-4 rounded-lg space-y-3">
                <div>
                  <h5 className="font-display font-bold text-xs text-emerald-400 uppercase">
                    Table: {activeTable}
                  </h5>
                  <p className="text-[11px] text-slate-400 mt-1 font-sans">
                    {tables[activeTable].desc}
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-[10px] font-mono text-slate-300">
                    <thead>
                      <tr className="border-b border-[#1A2430] text-slate-500">
                        <th className="text-left pb-1.5 font-bold uppercase">Column Name</th>
                        <th className="text-left pb-1.5 font-bold uppercase">Data Type</th>
                        <th className="text-left pb-1.5 font-bold uppercase">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tables[activeTable].columns.map((col, idx) => (
                        <tr key={idx} className="border-b last:border-b-0 border-[#101720]/60 hover:bg-slate-900/30">
                          <td className="py-2 text-white font-bold">{col.name}</td>
                          <td className="py-2 text-lime-400">{col.type}</td>
                          <td className="py-2 text-slate-400 font-sans">{col.desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        );

      case "roadmap":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#0E131C] border border-[#1A2430] p-4 rounded-xl space-y-2">
                <span className="text-[9px] font-mono text-slate-500 block uppercase">Phase 1 (Hackathon MVP)</span>
                <h4 className="font-display font-bold text-sm text-white">Full-Stack Core Node Enginer</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Vibrant React biological node canvas. Server-side Gemini task ingestion, structured parsing, chat agent core, and emergency visual lockdown modules.
                </p>
              </div>

              <div className="bg-[#0E131C] border border-[#1A2430] p-4 rounded-xl space-y-2">
                <span className="text-[9px] font-mono text-emerald-400 block uppercase">Phase 2 (Seed Venture)</span>
                <h4 className="font-display font-bold text-sm text-white">Biological Ecosystem Mapping</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Real OAuth loops for Fitbit, Strava, and Google Workspace. Integrating Google Maps SDK to chart and track crowdsourced physical urban ecology tasks, awarding corporate-backed carbon offset rewards.
                </p>
              </div>

              <div className="bg-[#0E131C] border border-[#1A2430] p-4 rounded-xl space-y-2">
                <span className="text-[9px] font-mono text-purple-400 block uppercase">Phase 3 (Series A Tech)</span>
                <h4 className="font-display font-bold text-sm text-white">Biological Computing Integration</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Expanding the conceptual mycelial map to integrate with physiological biosensors (Apple Watch HRV, electrodermal sensors) to automatically lock browser tabs when high cortisol (stress) and stagnation are recorded.
                </p>
              </div>
            </div>
          </div>
        );

      case "demo":
        return (
          <div className="bg-[#0E131C] border border-[#1A2430] p-5 rounded-xl space-y-4">
            <div className="flex justify-between items-center border-b border-[#1A2430] pb-2">
              <h4 className="font-display font-bold text-sm text-white uppercase tracking-wide">
                Judge Presentation: 3-Minute Live Demo Script
              </h4>
              <div className="bg-emerald-950/50 border border-emerald-900 px-3 py-1 rounded text-xs text-emerald-400 font-mono flex items-center gap-1.5">
                <Timer className="w-4 h-4" /> DURATION: 180s
              </div>
            </div>

            <div className="space-y-3 text-xs leading-relaxed">
              <div className="flex items-start gap-3 bg-slate-900/50 p-2.5 rounded-lg border border-slate-800">
                <span className="font-mono text-lime-400 font-bold bg-[#0A0D12] px-2 py-1 rounded">0:00 - 0:30</span>
                <div>
                  <h6 className="font-bold text-white uppercase tracking-wider text-[11px]">The Hook: Cognitive Loam Decline</h6>
                  <p className="text-slate-400 mt-0.5">Show the biological task grid. Say: &ldquo;Judges, list-based task managers fail because they are passive. Here is Mycelium, an organic neural task map that treats your obligations as living, interconnected cells.&rdquo;</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-slate-900/50 p-2.5 rounded-lg border border-slate-800">
                <span className="font-mono text-lime-400 font-bold bg-[#0A0D12] px-2 py-1 rounded">0:30 - 1:15</span>
                <div>
                  <h6 className="font-bold text-white uppercase tracking-wider text-[11px]">The Spore: Autonomous Ingestion</h6>
                  <p className="text-slate-400 mt-0.5">Paste a chaotic text email (e.g. syllabus deadlines) into the parser. Let the Spore parse it into living nodes. Show the nodes appear on the grid, drawing hyphae connections automatically.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-slate-900/50 p-2.5 rounded-lg border border-slate-800">
                <span className="font-mono text-lime-400 font-bold bg-[#0A0D12] px-2 py-1 rounded">1:15 - 2:15</span>
                <div>
                  <h6 className="font-bold text-white uppercase tracking-wider text-[11px]">The Sentinel: The Shroom Intervention</h6>
                  <p className="text-slate-400 mt-0.5">Click on a decaying red node (e.g., submitting hackathon project). Select The Shroom agent. Click 'I want to scroll social media'. Let The Shroom aggressively warn you, showing hilarious but high-resistance focus friction.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-slate-900/50 p-2.5 rounded-lg border border-slate-800">
                <span className="font-mono text-lime-400 font-bold bg-[#0A0D12] px-2 py-1 rounded">2:15 - 3:00</span>
                <div>
                  <h6 className="font-bold text-white uppercase tracking-wider text-[11px]">The Bio-Bridge & Climax</h6>
                  <p className="text-slate-400 mt-0.5">Highlight the Bio-Bridge map. Complete a task. Show how Vitality is rewarded and local biodiversity actions are mapped. Conclude: &ldquo;Mycelium transforms productivity from a stressful chore into a biophilic community effort.&rdquo;</p>
                </div>
              </div>
            </div>
          </div>
        );

      case "judging":
        return (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <div className="bg-[#0E131C] border border-[#1A2430] p-3.5 rounded-xl text-center space-y-1.5">
              <Lightbulb className="w-7 h-7 text-emerald-400 mx-auto" />
              <h5 className="font-display font-bold text-xs text-white">INNOVATION</h5>
              <span className="text-[10px] text-slate-500 block">Score: 10/10</span>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                Pioneers a &ldquo;biological neural grid&rdquo; metaphor replacing cold, sterile, passive push notifications.
              </p>
            </div>

            <div className="bg-[#0E131C] border border-[#1A2430] p-3.5 rounded-xl text-center space-y-1.5">
              <Zap className="w-7 h-7 text-lime-400 mx-auto" />
              <h5 className="font-display font-bold text-xs text-white">AI USAGE</h5>
              <span className="text-[10px] text-slate-500 block">Score: 10/10</span>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                Employs multiple specialized agent behaviors (Gemini 3.5), structured schemas, and risk projections.
              </p>
            </div>

            <div className="bg-[#0E131C] border border-[#1A2430] p-3.5 rounded-xl text-center space-y-1.5">
              <Layers className="w-7 h-7 text-cyan-400 mx-auto" />
              <h5 className="font-display font-bold text-xs text-white">TECHNICAL</h5>
              <span className="text-[10px] text-slate-500 block">Score: 10/10</span>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                Full-stack implementation featuring Vite middleware, Express routes, and robust AI integrations.
              </p>
            </div>

            <div className="bg-[#0E131C] border border-[#1A2430] p-3.5 rounded-xl text-center space-y-1.5">
              <Award className="w-7 h-7 text-purple-400 mx-auto" />
              <h5 className="font-display font-bold text-xs text-white">IMPACT</h5>
              <span className="text-[10px] text-slate-500 block">Score: 10/10</span>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                Solves ADHD and chronic deadline avoidance by utilizing active resistance and behavioral commitment.
              </p>
            </div>

            <div className="bg-[#0E131C] border border-[#1A2430] p-3.5 rounded-xl text-center space-y-1.5">
              <GitBranch className="w-7 h-7 text-orange-400 mx-auto" />
              <h5 className="font-display font-bold text-xs text-white">SCALABILITY</h5>
              <span className="text-[10px] text-slate-500 block">Score: 10/10</span>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                Bridges local coordinates, corporate offset sponsorships, and physiological health trackers.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-[#161B22] border border-[#30363D] rounded-xl overflow-hidden flex flex-col md:flex-row h-[520px] shadow-2xl">
      {/* Sidebar Selector */}
      <div className="w-full md:w-[240px] border-r border-[#30363D] bg-[#0d1117] flex flex-col justify-between p-3 overflow-y-auto">
        <div className="space-y-1">
          <span className="text-[9px] font-mono tracking-widest text-slate-500 uppercase block px-2.5 mb-2">
            PITCH DECK TOPICS
          </span>
          {slides.map((slide) => {
            const isSelected = slide.id === activeId;
            return (
              <button
                key={slide.id}
                onClick={() => setActiveId(slide.id)}
                className={`w-full text-left px-2.5 py-2.5 rounded-lg text-xs font-sans transition-all flex items-center gap-2.5 cursor-pointer ${
                  isSelected
                    ? "bg-[#161B22] border border-[#30363D] text-indigo-400 font-semibold shadow-inner"
                    : "text-slate-400 hover:text-slate-200 hover:bg-[#0d1117]"
                }`}
              >
                <span className="font-mono text-[9px] opacity-60 text-slate-500 bg-[#0d1117] w-5 h-5 rounded flex items-center justify-center">
                  {slide.id.toString().padStart(2, "0")}
                </span>
                <span className="truncate flex-1">{slide.title}</span>
              </button>
            );
          })}
        </div>

        <div className="pt-4 border-t border-[#30363D]/60 text-center text-[10px] text-slate-500 font-mono">
          STAGES: {activeId} / {slides.length}
        </div>
      </div>

      {/* Main Slide Viewer */}
      <div className="flex-1 p-5 flex flex-col justify-between bg-[#0d1117]">
        <div className="space-y-3 flex-1 overflow-y-auto pr-1">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase block">
              SECTION {currentSlide.id.toString().padStart(2, "0")} | {currentSlide.category}
            </span>
            <h2 className="text-xl font-display font-bold text-white tracking-tight mt-0.5">
              {currentSlide.title}
            </h2>
            {currentSlide.subtitle && (
              <p className="text-xs text-slate-400 font-sans">{currentSlide.subtitle}</p>
            )}
          </div>

          <div className="py-2">{renderVisualContent(currentSlide.visualType)}</div>
        </div>

        {/* Footer Navigation */}
        <div className="border-t border-[#30363D] pt-4 flex justify-between items-center bg-[#0d1117] mt-4">
          <button
            onClick={prevSlide}
            disabled={activeId === 1}
            className="px-3.5 py-1.5 rounded-lg bg-[#161B22] border border-[#30363D] text-slate-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all text-xs font-sans cursor-pointer"
          >
            Previous
          </button>
          <div className="flex gap-1.5">
            {slides.map((s) => (
              <span
                key={s.id}
                onClick={() => setActiveId(s.id)}
                className={`w-2 h-2 rounded-full cursor-pointer transition-all ${
                  s.id === activeId ? "bg-indigo-400 scale-125" : "bg-[#30363D]"
                }`}
              />
            ))}
          </div>
          <button
            onClick={nextSlide}
            disabled={activeId === slides.length}
            className="px-3.5 py-1.5 rounded-lg bg-[#161B22] border border-[#30363D] text-slate-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all text-xs font-sans cursor-pointer"
          >
            Next Slide
          </button>
        </div>
      </div>
    </div>
  );
};
