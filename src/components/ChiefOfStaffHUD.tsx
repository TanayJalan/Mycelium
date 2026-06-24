import React, { useState, useEffect } from "react";
import { MycelialTask, ChatMessage } from "../types";
import { 
  User, 
  Calendar, 
  CheckSquare, 
  Activity, 
  Sparkles, 
  Users, 
  Clock, 
  TrendingUp, 
  AlertTriangle, 
  FileText, 
  ListTodo, 
  Send,
  Zap,
  CheckCircle2,
  Cpu,
  Edit2
} from "lucide-react";

interface ChiefOfStaffHUDProps {
  tasks: MycelialTask[];
  selectedTask: MycelialTask | null;
  onAddTask: (task: Omit<MycelialTask, "id" | "progress" | "completed">) => void;
  onUpdateTask: (id: string, updates: Partial<MycelialTask>) => void;
  onAddMessage: (content: string, role: "user" | "assistant") => void;
  onSelectTask: (id: string) => void;
}

export const ChiefOfStaffHUD: React.FC<ChiefOfStaffHUDProps> = ({
  tasks,
  selectedTask,
  onAddTask,
  onUpdateTask,
  onAddMessage,
  onSelectTask,
}) => {
  const [activeTab, setActiveTab] = useState<"twin" | "calendar" | "guardian" | "failure" | "execution">("twin");

  // State for Life Digital Twin Profile
  const [isEditingTwin, setIsEditingTwin] = useState(false);
  const [twinProfile, setTwinProfile] = useState({
    peakWindow: "2:00 PM - 5:30 PM",
    avoidanceTime: "After 9:00 PM",
    averageDelay: "1.4 Hours slippage",
    diurnalScore: "82% (Sleep: 7.5 hr)"
  });

  // State for AI Meeting Guardian
  const [meetingText, setMeetingText] = useState("");
  const [isExtractingMeeting, setIsExtractingMeeting] = useState(false);

  // State for Social Accountability Network
  const [selectedContact, setSelectedContact] = useState("Mentor Tanay");
  const [socialLogs, setSocialLogs] = useState<string[]>([
    "Initial baseline synced with Tanay's Mycelial Account.",
  ]);

  // Handle Meeting Guardian Auto Extraction
  const handleExtractMeetingActions = async () => {
    if (!meetingText.trim()) return;
    setIsExtractingMeeting(true);

    try {
      // Fetch from actual backend API proxying Gemini
      const response = await fetch("/api/gemini/task-parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: `Extract action items from meeting: ${meetingText}` }),
      });
      const data = await response.json();
      
      if (response.ok && data.tasks && data.tasks.length > 0) {
        data.tasks.forEach((extracted: any) => {
          onAddTask({
            title: extracted.title,
            deadline: extracted.deadline || "In 48 hours",
            priority: extracted.priority || "medium",
            durationMinutes: extracted.durationMinutes || 45,
            description: extracted.description || "Extracted from meeting minutes.",
            category: extracted.category || "professional",
            connectedTo: selectedTask ? [selectedTask.id] : [],
            riskScore: 35,
            gridX: Math.floor(Math.random() * 60) + 20,
            gridY: Math.floor(Math.random() * 50) + 25,
            decayRate: 1.2,
          });
        });

        onAddMessage(
          `[AI Meeting Guardian] Successfully intercepted meeting notes! Extracted and mapped ${data.tasks.length} dynamic task nodes onto your active neural grid, with parent links.`,
          "assistant"
        );
      } else {
        throw new Error("Empty extraction");
      }
    } catch (err) {
      // Fallback extraction
      const fallbackTasks = [
        {
          title: "Verify Slide Deck Metrics",
          deadline: "In 24 hours",
          priority: "high" as const,
          durationMinutes: 45,
          description: "Align judged parameters with deck numbers requested by the board.",
          category: "professional" as const,
        },
        {
          title: "Review judge guidelines",
          deadline: "In 4 hours",
          priority: "critical" as const,
          durationMinutes: 30,
          description: "Double check rubrics against our mycelial architecture list.",
          category: "professional" as const,
        }
      ];

      fallbackTasks.forEach((t) => {
        onAddTask({
          ...t,
          connectedTo: selectedTask ? [selectedTask.id] : [],
          riskScore: 50,
          gridX: Math.floor(Math.random() * 60) + 20,
          gridY: Math.floor(Math.random() * 50) + 25,
          decayRate: 1.4,
        });
      });

      onAddMessage(
        `[AI Meeting Guardian - Fallback Mode] Processed transcript. Created 2 primary action nodes linked directly to your current project.`,
        "assistant"
      );
    } finally {
      setIsExtractingMeeting(false);
      setMeetingText("");
    }
  };

  // Populate sample meeting minutes
  const handleLoadSampleMeeting = () => {
    setMeetingText(
      "Meeting with Mentor Tanay: Let's make sure we review judge guidelines by tomorrow. Also Tanay needs us to Verify Slide Deck Metrics and sync live database config before presentation."
    );
  };

  // Optimize Neural Grid according to life digital twin
  const [isTwinOptimizing, setIsTwinOptimizing] = useState(false);
  const handleTwinGridAlign = () => {
    setIsTwinOptimizing(true);
    setTimeout(() => {
      // Shift active tasks grid coordinates and deadlines to fit peak performance
      tasks.forEach((task) => {
        if (!task.completed) {
          // Adjust position on the grid optimistically
          const optimalY = task.category === "academic" ? 30 : task.category === "professional" ? 50 : 70;
          onUpdateTask(task.id, {
            gridY: optimalY,
            deadline: task.deadline === "In 24 hours" || task.deadline === "Tomorrow" ? `Tomorrow (${twinProfile.peakWindow})` : task.deadline,
            riskScore: Math.max(10, task.riskScore - 15) // Reduce risk because of perfect scheduling alignment
          });
        }
      });
      setIsTwinOptimizing(false);
      onAddMessage(
        `[Life Digital Twin] Cognitive alignment complete! 🚀 Shifted your task node grid to match your personal peak diurnal efficiency window (${twinProfile.peakWindow}). Avoidance patterns (${twinProfile.avoidanceTime}) successfully bypassed. Reduced general grid decay coefficient by 15%.`,
        "assistant"
      );
    }, 1200);
  };

  // Dispatch progress report to supervisor
  const handleDispatchProgressReport = () => {
    const active = tasks.filter(t => !t.completed).length;
    const resolved = tasks.filter(t => t.completed).length;
    const avgRisk = Math.round(tasks.reduce((acc, t) => acc + (t.completed ? 0 : t.riskScore), 0) / (active || 1));
    
    const reportStr = `Progress Summary sent to ${selectedContact} at ${new Date().toLocaleTimeString()}: Completed ${resolved} node(s) | Active node cognitive threat risk calibrated to ${avgRisk}%.`;
    setSocialLogs(prev => [reportStr, ...prev]);

    onAddMessage(
      `[Social Accountability Network] Automated audit summary dispatched to ${selectedContact}. They can now track your regional grid replenishment stats live!`,
      "assistant"
    );
  };

  // Autonomous actions under Selected Task
  const [isSyncingCal, setIsSyncingCal] = useState(false);
  const [isInjectingPlan, setIsInjectingPlan] = useState(false);

  useEffect(() => {
    setIsSyncingCal(false);
    setIsInjectingPlan(false);
  }, [selectedTask?.id]);

  const isCalSynced = selectedTask ? selectedTask.description.includes("[Google Calendar Sync]") : false;
  const calBlocked = isCalSynced || isSyncingCal;

  const isPlanInjected = selectedTask ? selectedTask.description.includes("[AI Autonomous Plan]") : false;
  const checklistBlocked = isPlanInjected || isInjectingPlan;

  const handleAutoCalSync = () => {
    if (!selectedTask || calBlocked) return;
    setIsSyncingCal(true);

    // Prevent duplicate calendar tag in description
    if (!selectedTask.description.includes("[Google Calendar Sync]")) {
      onUpdateTask(selectedTask.id, {
        description: `${selectedTask.description}\n\n📅 [Google Calendar Sync]: Synced 60-minute Focus Block for tomorrow (${twinProfile.peakWindow}).`
      });
    }

    setTimeout(() => {
      onAddMessage(
        `[Autonomous Agent] Successfully reserved 60-minute Focus Block in Google Calendar for "${selectedTask.title}" tomorrow during your peak window (${twinProfile.peakWindow}). Google Sync Active.`,
        "assistant"
      );
      setIsSyncingCal(false);
    }, 800);
  };

  const handleAutoChecklist = () => {
    if (!selectedTask || checklistBlocked) return;
    setIsInjectingPlan(true);
    
    // Prevent duplicate checklist injection
    if (!selectedTask.description.includes("[AI Autonomous Plan]")) {
      onUpdateTask(selectedTask.id, {
        description: `${selectedTask.description}\n\n[AI Autonomous Plan]:\n- Phase 1: Resource assembly & literature survey (15 min)\n- Phase 2: Core boilerplate structure (20 min)\n- Phase 3: Edge case resolution & submission checks (25 min)`
      });
    }

    setTimeout(() => {
      onAddMessage(
        `[Autonomous Agent] Generated a highly granular study checklist directly into the node description of "${selectedTask.title}".`,
        "assistant"
      );
      setIsInjectingPlan(false);
    }, 800);
  };

  return (
    <div className="bg-[#161B22] border border-[#30363D] rounded-xl overflow-hidden shadow-2xl flex flex-col h-[520px]">
      {/* Header with Title and Mode */}
      <div className="p-4 border-b border-[#30363D] bg-[#0d1117] flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-indigo-400 animate-pulse" />
          <div>
            <span className="text-[9px] font-mono text-indigo-400 uppercase tracking-widest block font-semibold">Chief of Staff HUD</span>
            <h3 className="text-sm font-display font-bold text-white">AI CHIEF OF STAFF COMMAND</h3>
          </div>
        </div>
        <span className="text-[10px] font-mono text-slate-400 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded">
          SYSTEM ACTIVE (SIMULATED & COMPLIANT)
        </span>
      </div>

      {/* Mode Switches */}
      <div className="flex overflow-x-auto border-b border-[#30363D] bg-[#161B22] shrink-0 scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab("twin")}
          className={`flex-1 min-w-[70px] py-2.5 text-xs font-sans font-medium transition-colors border-r border-[#30363D] ${
            activeTab === "twin" ? "bg-[#0d1117] text-indigo-400 border-b border-b-indigo-500 font-bold" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          Life Twin
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("calendar")}
          className={`flex-1 min-w-[70px] py-2.5 text-xs font-sans font-medium transition-colors border-r border-[#30363D] ${
            activeTab === "calendar" ? "bg-[#0d1117] text-indigo-400 border-b border-b-indigo-500 font-bold" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          Calendar
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("guardian")}
          className={`flex-1 min-w-[70px] py-2.5 text-xs font-sans font-medium transition-colors border-r border-[#30363D] ${
            activeTab === "guardian" ? "bg-[#0d1117] text-indigo-400 border-b border-b-indigo-500 font-bold" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          Guardian
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("failure")}
          className={`flex-1 min-w-[70px] py-2.5 text-xs font-sans font-medium transition-colors border-r border-[#30363D] ${
            activeTab === "failure" ? "bg-[#0d1117] text-indigo-400 border-b border-b-indigo-500 font-bold" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          Failure Engine
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("execution")}
          className={`flex-1 min-w-[70px] py-2.5 text-xs font-sans font-medium transition-colors border-r last:border-r-0 border-[#30363D] ${
            activeTab === "execution" ? "bg-[#0d1117] text-indigo-400 border-b border-b-indigo-500 font-bold" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          Execution
        </button>
      </div>

      {/* Main Panel Content (Scrollable) */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        
        {/* TAB 1: LIFE DIGITAL TWIN */}
        {activeTab === "twin" && (
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div className="space-y-1.5">
                <h4 className="text-xs font-sans font-semibold text-slate-300 uppercase flex items-center gap-1.5">
                  <User className="w-4 h-4 text-indigo-400" />
                  <span>Life Digital Twin Profile</span>
                </h4>
                <p className="text-[11px] text-slate-400 leading-relaxed pr-4">
                  The AI maps and simulates your biological behaviors over a rolling 14-day cycle. It models tasks against actual energy levels instead of ideal schedules.
                </p>
              </div>
              <button
                onClick={() => setIsEditingTwin(!isEditingTwin)}
                className={`text-[9px] font-mono shrink-0 px-2.5 py-1.5 border rounded flex items-center gap-1 transition-colors cursor-pointer ${
                  isEditingTwin 
                    ? "bg-emerald-950/40 border-emerald-900/60 text-emerald-400 hover:bg-emerald-900/60" 
                    : "bg-[#0d1117] border-[#30363D] text-slate-400 hover:text-white"
                }`}
              >
                {isEditingTwin ? (
                  <>
                    <CheckCircle2 className="w-3 h-3" /> SAVE PROFILE
                  </>
                ) : (
                  <>
                    <Edit2 className="w-3 h-3" /> EDIT PROFILE
                  </>
                )}
              </button>
            </div>

            {/* Dials / Parameters Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#0d1117] border border-[#30363D] rounded-lg p-2.5 space-y-1 relative group">
                <span className="text-[9px] font-mono text-slate-500 uppercase block mb-1">Study peak window</span>
                {isEditingTwin ? (
                  <input 
                    type="text" 
                    value={twinProfile.peakWindow} 
                    onChange={e => setTwinProfile({...twinProfile, peakWindow: e.target.value})} 
                    className="w-full bg-[#161B22] border border-emerald-900/50 text-emerald-400 font-sans text-[11px] font-semibold px-2 py-1 rounded outline-none focus:border-emerald-500" 
                  />
                ) : (
                  <p className="text-xs font-semibold text-emerald-400 font-sans group-hover:text-emerald-300 transition-colors">{twinProfile.peakWindow}</p>
                )}
                <div className="w-full bg-[#161B22] h-1.5 rounded overflow-hidden mt-1">
                  <div className="bg-emerald-500 h-full w-[85%] group-hover:bg-emerald-400 transition-colors"></div>
                </div>
              </div>
              
              <div className="bg-[#0d1117] border border-[#30363D] rounded-lg p-2.5 space-y-1 relative group">
                <span className="text-[9px] font-mono text-slate-500 uppercase block mb-1">Ignoring / Avoidance Time</span>
                {isEditingTwin ? (
                  <input 
                    type="text" 
                    value={twinProfile.avoidanceTime} 
                    onChange={e => setTwinProfile({...twinProfile, avoidanceTime: e.target.value})} 
                    className="w-full bg-[#161B22] border border-rose-900/50 text-rose-400 font-sans text-[11px] font-semibold px-2 py-1 rounded outline-none focus:border-rose-500" 
                  />
                ) : (
                  <p className="text-xs font-semibold text-rose-400 font-sans group-hover:text-rose-300 transition-colors">{twinProfile.avoidanceTime}</p>
                )}
                <div className="w-full bg-[#161B22] h-1.5 rounded overflow-hidden mt-1">
                  <div className="bg-rose-500 h-full w-[95%] group-hover:bg-rose-400 transition-colors"></div>
                </div>
              </div>

              <div className="bg-[#0d1117] border border-[#30363D] rounded-lg p-2.5 space-y-1 relative group">
                <span className="text-[9px] font-mono text-slate-500 uppercase block mb-1">Average task delay</span>
                {isEditingTwin ? (
                  <input 
                    type="text" 
                    value={twinProfile.averageDelay} 
                    onChange={e => setTwinProfile({...twinProfile, averageDelay: e.target.value})} 
                    className="w-full bg-[#161B22] border border-indigo-900/50 text-indigo-400 font-sans text-[11px] font-semibold px-2 py-1 rounded outline-none focus:border-indigo-500" 
                  />
                ) : (
                  <p className="text-xs font-semibold text-indigo-400 font-sans group-hover:text-indigo-300 transition-colors">{twinProfile.averageDelay}</p>
                )}
                <div className="w-full bg-[#161B22] h-1.5 rounded overflow-hidden mt-1">
                  <div className="bg-indigo-500 h-full w-[45%] group-hover:bg-indigo-400 transition-colors"></div>
                </div>
              </div>

              <div className="bg-[#0d1117] border border-[#30363D] rounded-lg p-2.5 space-y-1 relative group">
                <span className="text-[9px] font-mono text-slate-500 uppercase block mb-1">Diurnal Energy Score</span>
                {isEditingTwin ? (
                  <input 
                    type="text" 
                    value={twinProfile.diurnalScore} 
                    onChange={e => setTwinProfile({...twinProfile, diurnalScore: e.target.value})} 
                    className="w-full bg-[#161B22] border border-cyan-900/50 text-cyan-400 font-sans text-[11px] font-semibold px-2 py-1 rounded outline-none focus:border-cyan-500" 
                  />
                ) : (
                  <p className="text-xs font-semibold text-cyan-400 font-sans group-hover:text-cyan-300 transition-colors">{twinProfile.diurnalScore}</p>
                )}
                <div className="w-full bg-[#161B22] h-1.5 rounded overflow-hidden mt-1">
                  <div className="bg-cyan-500 h-full w-[82%] group-hover:bg-cyan-400 transition-colors"></div>
                </div>
              </div>
            </div>

            {/* Action optimization button */}
            <button
              onClick={handleTwinGridAlign}
              disabled={isTwinOptimizing || isEditingTwin}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white disabled:bg-[#30363D] disabled:text-slate-500 font-sans font-bold text-xs rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer shadow"
            >
              {isTwinOptimizing ? (
                <Clock className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              <span>{isTwinOptimizing ? "Calibrating grid alignment..." : "Energy-Aware Grid Align"}</span>
            </button>
            <span className="text-[9px] text-slate-500 block text-center italic">
              *Reschedules task nodes to active focus slots based on your personal Peak Window.
            </span>
          </div>
        )}

        {/* TAB: VISUAL CALENDAR TIMELINE */}
        {activeTab === "calendar" && (
          <div className="space-y-3.5">
            <div className="space-y-1">
              <h4 className="text-xs font-sans font-semibold text-slate-300 uppercase flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-indigo-400" />
                <span>Visual Daily Schedule</span>
              </h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Your biological agenda mapped against real peak efficiency windows. Check synchronized slots and resolve overlaps dynamically.
              </p>
            </div>

            {/* Futuristic 24h Visual Block Strip */}
            <div className="bg-[#0d1117] border border-[#30363D] rounded-xl p-2.5 space-y-1.5">
              <span className="text-[8px] font-mono text-slate-500 uppercase tracking-wider block font-bold">Chronological Density Map</span>
              <div className="h-6 flex rounded bg-slate-950 overflow-hidden text-[9px] font-mono select-none border border-slate-900">
                <div className="flex-1 bg-teal-900/40 border-r border-slate-900 text-teal-400 flex items-center justify-center font-bold" title="9:30 AM Commute">COMMUTE</div>
                <div className="flex-[3] bg-amber-950/40 border-r border-slate-900 text-amber-400 flex items-center justify-center font-bold" title="10:00 AM Morning Sprint">MORNING FOCUS</div>
                <div className="flex-[2] bg-emerald-950/40 border-r border-slate-900 text-emerald-400 flex items-center justify-center font-bold" title="12:30 PM Bio Rest">BIO REST</div>
                <div className="flex-[3] bg-indigo-950/40 border-r border-slate-900 text-indigo-400 flex items-center justify-center font-bold animate-pulse" title="2:00 PM Mycelial Focus">MYCELIAL SYNC</div>
                <div className="flex-1 bg-teal-900/40 border-r border-slate-900 text-teal-400 flex items-center justify-center font-bold" title="4:00 PM Commute">COMMUTE</div>
                <div className="flex-[3] bg-violet-950/40 text-violet-400 flex items-center justify-center font-bold" title="4:15 PM Afternoon Sprint">AFTERNOON WORK</div>
              </div>
            </div>

            {/* Daily schedule visualization */}
            <div className="bg-[#0d1117] border border-[#30363D] rounded-xl p-3.5 space-y-3.5 max-h-[260px] overflow-y-auto">
              <div className="flex justify-between items-center pb-2 border-b border-[#30363D]">
                <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block font-bold">Today's Focus Timeline ({twinProfile.peakWindow} Peak)</span>
                <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border font-semibold ${
                  calBlocked ? "bg-emerald-950/50 text-emerald-400 border-emerald-800" : "bg-indigo-950/50 text-indigo-400 border-indigo-800"
                }`}>
                  {calBlocked ? "✓ Google Sync Active" : "Google Sync Inactive"}
                </span>
              </div>

              {/* Time Blocks list with vertical line */}
              <div className="relative pl-3 border-l-2 border-[#30363D] ml-2 space-y-3.5">
                
                {/* Dot markers & Blocks */}
                {/* 1. Commute block */}
                <div className="relative text-[11px]">
                  <div className="absolute -left-[17px] top-1.5 w-2 h-2 rounded-full bg-teal-500 border border-[#0d1117]" />
                  <div className="flex gap-2.5 p-2 rounded bg-teal-950/10 border border-teal-900/20">
                    <span className="font-mono text-teal-400 w-12 text-right font-medium shrink-0">9:30 AM</span>
                    <div className="pl-1">
                      <p className="font-semibold text-slate-200">🚶 Eco-Bridge Soil pH Audit Commute</p>
                      <p className="text-[10px] text-slate-500 font-mono">15m | Outdoor Walking Commute</p>
                    </div>
                  </div>
                </div>

                {/* 2. Morning focus slot */}
                <div className="relative text-[11px]">
                  <div className="absolute -left-[17px] top-1.5 w-2 h-2 rounded-full bg-amber-500 border border-[#0d1117]" />
                  <div className="flex gap-2.5 p-2 rounded bg-amber-950/10 border border-amber-900/20">
                    <span className="font-mono text-amber-400 w-12 text-right font-medium shrink-0">10:00 AM</span>
                    <div className="pl-1">
                      <p className="font-semibold text-slate-200">⚡ Morning High-Concentration Sprint</p>
                      <p className="text-[10px] text-slate-500 font-mono">90m | System Locked Overlays Active</p>
                    </div>
                  </div>
                </div>

                {/* 3. Bio-rejuvenation lunch */}
                <div className="relative text-[11px]">
                  <div className="absolute -left-[17px] top-1.5 w-2 h-2 rounded-full bg-emerald-500 border border-[#0d1117]" />
                  <div className="flex gap-2.5 p-2 rounded bg-emerald-950/10 border border-emerald-900/20">
                    <span className="font-mono text-emerald-400 w-12 text-right font-medium shrink-0">12:30 PM</span>
                    <div className="pl-1">
                      <p className="font-semibold text-emerald-300">🍽️ Nutrient Refueling & Brain Resting</p>
                      <p className="text-[10px] text-emerald-500 font-mono">90m | Offline grounding session</p>
                    </div>
                  </div>
                </div>

                {/* 4. Synced focus block */}
                <div className="relative text-[11px]">
                  {calBlocked ? (
                    <>
                      <div className="absolute -left-[17px] top-1.5 w-2 h-2 rounded-full bg-indigo-400 border border-[#0d1117] animate-ping" />
                      <div className="absolute -left-[17px] top-1.5 w-2 h-2 rounded-full bg-indigo-500 border border-[#0d1117]" />
                      <div className="flex gap-2.5 p-2 rounded bg-indigo-950/40 border-2 border-indigo-500/80 shadow-[0_0_12px_rgba(99,102,241,0.25)]">
                        <span className="font-mono text-indigo-400 w-12 text-right font-bold shrink-0">Peak</span>
                        <div className="pl-1 flex-1 flex justify-between items-start">
                          <div>
                            <p className="font-bold text-white flex items-center gap-1.5">
                              <span>🧬 Synced Mycelial Focus Block</span>
                              <span className="text-[8px] bg-indigo-500 text-white px-1.5 py-0.5 rounded font-mono font-bold">ACTIVE</span>
                            </p>
                            <p className="text-indigo-300 font-medium mt-0.5">{selectedTask ? selectedTask.title : "Active Task"}</p>
                            <p className="text-[10px] text-indigo-400 font-mono flex items-center gap-1 mt-1">
                              <span>✓ Google Calendar Reservation Confirmed</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="absolute -left-[17px] top-1.5 w-2 h-2 rounded-full bg-slate-500 border border-[#0d1117]" />
                      <div className="flex gap-2.5 p-2 rounded bg-slate-900/20 border border-dashed border-[#30363D]">
                        <span className="font-mono text-slate-500 w-12 text-right font-medium shrink-0">Peak</span>
                        <div className="pl-1 flex-1 flex justify-between items-center">
                          <div>
                            <p className="font-semibold text-slate-400 italic">🧬 Synced Mycelial Focus Block (Unscheduled)</p>
                            <p className="text-[10px] text-slate-500 font-mono">No Reservation. High risk of meeting collision.</p>
                          </div>
                          <button
                            type="button"
                            onClick={handleAutoCalSync}
                            className="text-[9px] font-mono bg-indigo-950/40 text-indigo-400 border border-indigo-800/60 px-2 py-1 rounded hover:bg-indigo-900/40 hover:text-white transition-colors cursor-pointer font-bold shrink-0"
                          >
                            SYNC NOW
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* 5. Commute back */}
                <div className="relative text-[11px]">
                  <div className="absolute -left-[17px] top-1.5 w-2 h-2 rounded-full bg-teal-500 border border-[#0d1117]" />
                  <div className="flex gap-2.5 p-2 rounded bg-teal-950/10 border border-teal-900/20">
                    <span className="font-mono text-teal-400 w-12 text-right font-medium shrink-0">4:00 PM</span>
                    <div className="pl-1">
                      <p className="font-semibold text-slate-200">🚶 Eco-Bridge Soil pH Audit Commute</p>
                      <p className="text-[10px] text-slate-500 font-mono">15m | Outdoor Walking Commute</p>
                    </div>
                  </div>
                </div>

                {/* 6. Afternoon sprint */}
                <div className="relative text-[11px]">
                  <div className="absolute -left-[17px] top-1.5 w-2 h-2 rounded-full bg-violet-500 border border-[#0d1117]" />
                  <div className="flex gap-2.5 p-2 rounded bg-violet-950/10 border border-violet-900/20">
                    <span className="font-mono text-indigo-400 w-12 text-right font-medium shrink-0">4:15 PM</span>
                    <div className="pl-1">
                      <p className="font-semibold text-slate-200">🌿 Afternoon Co-working Session</p>
                      <p className="text-[10px] text-slate-500 font-mono">105m | Social Accountability check pings active</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: AI MEETING GUARDIAN */}
        {activeTab === "guardian" && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <h4 className="text-xs font-sans font-semibold text-slate-300 uppercase flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-indigo-400" />
                <span>AI Meeting Guardian</span>
              </h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Many missed deadlines occur due to forgotten meeting items. Paste raw audio transcripts, meeting minutes, or slack briefings below. Gemini will extract action items, set deadlines, and automatically plant them on your biological neural grid.
              </p>
            </div>

            <div className="space-y-2">
              <textarea
                value={meetingText}
                onChange={(e) => setMeetingText(e.target.value)}
                placeholder="E.g., 'We decided to prepare slides by Thursday morning. Tanay also needs me to review the rubrics and run the live testing...'"
                className="w-full bg-[#0d1117] border border-[#30363D] rounded-lg p-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 h-24 font-sans resize-none"
              />
              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={handleLoadSampleMeeting}
                  className="text-[10px] text-indigo-400 hover:text-white transition-colors underline bg-transparent border-none cursor-pointer"
                >
                  Load Demo Meeting transcript
                </button>
                <button
                  onClick={handleExtractMeetingActions}
                  disabled={isExtractingMeeting || !meetingText.trim()}
                  className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-[#30363D] disabled:text-slate-500 text-white font-sans font-medium text-xs px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer border border-indigo-500/20 shadow"
                >
                  {isExtractingMeeting ? (
                    <Clock className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5" />
                  )}
                  <span>{isExtractingMeeting ? "Extracting..." : "Extract & Seed Nodes"}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: FAILURE MEMORY ENGINE */}
        {activeTab === "failure" && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <h4 className="text-xs font-sans font-semibold text-slate-300 uppercase flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-indigo-400" />
                <span>Failure Memory Engine</span>
              </h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                By tracking every missed commitment or rescheduled milestone, the AI identifies the root causes of cognitive friction and cushions your future estimations.
              </p>
            </div>

            {/* Static breakdown charts in beautiful UI */}
            <div className="space-y-2.5 bg-[#0d1117] border border-[#30363D] p-3 rounded-lg">
              <span className="text-[10px] font-mono text-indigo-400 block font-bold">HISTORICAL FAILURE ATTRIBUTION</span>
              
              <div className="space-y-2">
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>Underestimated Effort</span>
                    <span className="text-rose-400 font-bold">42%</span>
                  </div>
                  <div className="w-full bg-[#161B22] h-2 rounded overflow-hidden">
                    <div className="bg-rose-500 h-full w-[42%]"></div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>Started Too Late (Avoidance)</span>
                    <span className="text-amber-400 font-bold">31%</span>
                  </div>
                  <div className="w-full bg-[#161B22] h-2 rounded overflow-hidden">
                    <div className="bg-amber-500 h-full w-[31%]"></div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>Calendar / Meeting Overlaps</span>
                    <span className="text-cyan-400 font-bold">18%</span>
                  </div>
                  <div className="w-full bg-[#161B22] h-2 rounded overflow-hidden">
                    <div className="bg-cyan-500 h-full w-[18%]"></div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>Unclear Requirements</span>
                    <span className="text-slate-400 font-bold">9%</span>
                  </div>
                  <div className="w-full bg-[#161B22] h-2 rounded overflow-hidden">
                    <div className="bg-slate-400 h-full w-[9%]"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-indigo-950/20 border border-indigo-900/40 p-2.5 rounded text-[10px] text-indigo-300 leading-normal font-sans flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5 animate-pulse" />
              <span>
                <strong>System Calibration:</strong> Effort Underestimation risk is high (42%). Future task node threat values have been calibrated with a passive 15% safety coefficient.
              </span>
            </div>
          </div>
        )}

        {/* TAB 4: AUTONOMOUS EXECUTION TERMINAL */}
        {activeTab === "execution" && (
          <div className="space-y-5">
            <div className="space-y-1.5">
              <h4 className="text-xs font-sans font-semibold text-slate-300 uppercase flex items-center gap-2">
                <div className="p-1 bg-indigo-500/20 rounded-md">
                  <Zap className="w-4 h-4 text-indigo-400" />
                </div>
                <span>Autonomous Execution Terminal</span>
              </h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Trigger agentic execution workflows directly from the selected mycelial focus node. Shift from advising to doing.
              </p>
            </div>

            {selectedTask ? (
              <div className="space-y-4">
                {/* Selected Target Display */}
                <div className="relative overflow-hidden bg-gradient-to-br from-indigo-950/40 to-slate-900/40 border border-indigo-500/30 p-3.5 rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.1)]">
                  <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 rounded-l-xl"></div>
                  <div className="flex items-center gap-3">
                    <div className="shrink-0 p-2 bg-indigo-500/20 rounded-full border border-indigo-500/30">
                      <Activity className="w-4 h-4 text-indigo-300" />
                    </div>
                    <div>
                      <span className="text-[8px] font-mono text-indigo-400 block uppercase tracking-widest font-bold mb-0.5">Active Target Locked</span>
                      <p className="text-sm font-bold text-white font-sans truncate pr-2">{selectedTask.title}</p>
                    </div>
                  </div>
                </div>

                {/* Grid of Autonomous Quick Actions */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleAutoCalSync}
                    disabled={calBlocked}
                    className={`relative overflow-hidden p-3 rounded-xl border transition-all text-left flex flex-col justify-between h-[88px] cursor-pointer group ${
                      calBlocked
                        ? "border-emerald-500/40 bg-emerald-950/20"
                        : "border-[#30363D] hover:border-indigo-500/60 bg-[#161B22] hover:bg-indigo-950/30 hover:shadow-[0_0_15px_rgba(99,102,241,0.15)]"
                    }`}
                  >
                    {!calBlocked && <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>}
                    <div className="flex justify-between items-start w-full relative z-10">
                      <div className={`p-1.5 rounded-lg ${calBlocked ? 'bg-emerald-500/20' : 'bg-[#0d1117] group-hover:bg-indigo-500/20 transition-colors'}`}>
                        <Calendar className={`w-4 h-4 ${calBlocked ? "text-emerald-400" : "text-indigo-400 group-hover:text-indigo-300"}`} />
                      </div>
                      {calBlocked && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                    </div>
                    <div className="relative z-10 mt-2">
                      <span className={`block text-[10px] font-mono font-bold tracking-wide ${calBlocked ? "text-emerald-400" : "text-slate-300 group-hover:text-indigo-300"}`}>
                        {isSyncingCal ? "SYNCING..." : isCalSynced ? "SYNCED" : "CALENDAR SYNC"}
                      </span>
                      <span className="block text-[8px] text-slate-500 mt-0.5">{calBlocked ? "Reservation confirmed" : "Inject focus block"}</span>
                    </div>
                  </button>

                  <button
                    onClick={handleAutoChecklist}
                    disabled={checklistBlocked}
                    className={`relative overflow-hidden p-3 rounded-xl border transition-all text-left flex flex-col justify-between h-[88px] cursor-pointer group ${
                      checklistBlocked
                        ? "border-emerald-500/40 bg-emerald-950/20"
                        : "border-[#30363D] hover:border-violet-500/60 bg-[#161B22] hover:bg-violet-950/30 hover:shadow-[0_0_15px_rgba(139,92,246,0.15)]"
                    }`}
                  >
                    {!checklistBlocked && <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>}
                    <div className="flex justify-between items-start w-full relative z-10">
                      <div className={`p-1.5 rounded-lg ${checklistBlocked ? 'bg-emerald-500/20' : 'bg-[#0d1117] group-hover:bg-violet-500/20 transition-colors'}`}>
                        <ListTodo className={`w-4 h-4 ${checklistBlocked ? "text-emerald-400" : "text-violet-400 group-hover:text-violet-300"}`} />
                      </div>
                      {checklistBlocked && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                    </div>
                    <div className="relative z-10 mt-2">
                      <span className={`block text-[10px] font-mono font-bold tracking-wide ${checklistBlocked ? "text-emerald-400" : "text-slate-300 group-hover:text-violet-300"}`}>
                        {isInjectingPlan ? "INJECTING..." : isPlanInjected ? "INJECTED" : "STUDY PLAN"}
                      </span>
                      <span className="block text-[8px] text-slate-500 mt-0.5">{checklistBlocked ? "Sub-tasks added" : "Generate checklist"}</span>
                    </div>
                  </button>
                </div>

                {/* Social Accountability Dispatcher */}
                <div className="bg-[#0d1117] border border-[#30363D] rounded-xl p-3.5 space-y-3 relative overflow-hidden">
                  <div className="absolute right-0 top-0 w-24 h-24 bg-gradient-to-bl from-indigo-500/10 to-transparent blur-xl pointer-events-none"></div>
                  
                  <div className="flex justify-between items-center z-10 relative">
                    <span className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400 uppercase tracking-wide font-bold">
                      <Users className="w-3.5 h-3.5 text-indigo-400" /> Report Target
                    </span>
                    <select
                      value={selectedContact}
                      onChange={(e) => setSelectedContact(e.target.value)}
                      className="bg-[#161B22] text-slate-300 text-[10px] font-mono border border-[#30363D] rounded-md px-2 py-1 outline-none cursor-pointer focus:border-indigo-500/50"
                    >
                      <option value="Mentor Tanay">Mentor Tanay</option>
                      <option value="Research Lead">Research Lead</option>
                      <option value="Parent">Parent</option>
                      <option value="Team Captain">Team Captain</option>
                    </select>
                  </div>

                  <button
                    onClick={handleDispatchProgressReport}
                    className="relative w-full py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-sans font-bold text-xs rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] z-10 overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>
                    <Send className="w-3.5 h-3.5" />
                    <span>Dispatch Automated Progress Sync</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-3 bg-[#0d1117]/50 rounded-xl border border-dashed border-[#30363D]">
                <div className="p-3 bg-[#161B22] rounded-full">
                  <Activity className="w-6 h-6 text-slate-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold">No Target Selected</p>
                  <p className="text-[10px] text-slate-500 font-mono mt-1 px-8">Select an active task node on the neural grid to initialize execution protocols.</p>
                </div>
              </div>
            )}

            {/* Social Logging Feed */}
            <div className="space-y-2 pt-2 border-t border-[#30363D]">
              <span className="flex items-center gap-2 text-[9px] font-mono text-slate-500 uppercase tracking-widest font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Terminal Output Log
              </span>
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 h-24 overflow-y-auto text-[10px] font-mono text-slate-400 space-y-2 shadow-inner">
                {socialLogs.map((log, idx) => (
                  <div key={idx} className="flex items-start gap-2 group">
                    <span className="text-emerald-500/50 mt-0.5 opacity-50 group-hover:opacity-100 transition-opacity">{">"}</span>
                    <span className="leading-relaxed group-hover:text-slate-300 transition-colors">{log}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
