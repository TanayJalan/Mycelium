import React, { useState, useEffect } from "react";
import { MycelialTask, EcosystemTask, ChatMessage, PitchSlide, RiskAnalysis } from "./types";
import { MycelialCanvas } from "./components/MycelialCanvas";
import { AgentHub, AGENTS } from "./components/AgentHub";
import { StrategyDeck } from "./components/StrategyDeck";
import { ChiefOfStaffHUD } from "./components/ChiefOfStaffHUD";
import { EcosystemMap } from "./components/EcosystemMap";
import { EmergencyConsole } from "./components/EmergencyConsole";
import {
  Sprout, BrainCircuit, Play, AlertTriangle, CheckSquare, Sparkles,
  RefreshCw, FileText, Calendar, Plus, Trash2, Heart, Info, LayoutDashboard,
  Award, Layers, ChevronRight, Mail, Link2, Zap, BookOpen, ArrowRight, Clock,
  UserCheck, Activity, X
} from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip as ReChartsTooltip, Cell } from "recharts";
import { useMyceliumStore, initializeStoreListeners, clearStoreListeners } from "./store/useMyceliumStore";
import { 
  onAuthStateChanged, 
  signInAnonymously, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  User 
} from "firebase/auth";
import { auth } from "./lib/firebase";


// Predefined slides representing the 12-point strategic breakdown requested by the user
const PITCH_SLIDES: PitchSlide[] = [
  { id: 1, title: "Problem Analysis", subtitle: "Root Causes of Chronic Deadline Failure", category: "FOUNDATIONS", visualType: "problems" },
  { id: 2, title: "Product Concept", subtitle: "Mycelium: Fungal-Metaphor Productivity Companion", category: "FOUNDATIONS", visualType: "concept" },
  { id: 3, title: "AI-First Features", subtitle: "10x Better Than Standard Passive Schedulers", category: "PRODUCT", visualType: "features" },
  { id: 4, title: "Autonomous Agents", subtitle: "The Symbiote Agents and Core Architectures", category: "AI COGNITION", visualType: "agents" },
  { id: 5, title: "User Flows", subtitle: "Onboarding, Daily Loop & Emergency Interventions", category: "PRODUCT", visualType: "userflow" },
  { id: 6, title: "Google AI & Cloud Orchestration", subtitle: "Gemini API, Google Workspace & Firebase Auth", category: "TECHNICAL", visualType: "google" },
  { id: 7, title: "Technical Architecture", subtitle: "Frontend, Backend & AI Orchestration pipeline", category: "TECHNICAL", visualType: "architecture" },
  { id: 8, title: "Relational DB Schema", subtitle: "PostgreSQL schema, foreign keys & JSON matrices", category: "TECHNICAL", visualType: "database" },
  { id: 9, title: "MVP Hackathon Scope", subtitle: "Deliverables Completed in 24-48 Hours", category: "PRACTICAL", visualType: "roadmap" },
  { id: 10, title: "Future Startup Roadmap", subtitle: "Seed Venture through Biological Computing Integration", category: "FUTURE", visualType: "roadmap" },
  { id: 11, title: "Judging Strategy", subtitle: "Satisfying Innovation, Impact & Complexity", category: "FUTURE", visualType: "judging" },
];

const INITIAL_TASKS: MycelialTask[] = [
  {
    id: "submit_project",
    title: "Submit Hackathon Project Deck",
    deadline: "in 4 hours",
    priority: "critical",
    durationMinutes: 90,
    description: "Compile final slides, review judging rubrics, and upload workspace archive to HackerEarth portal.",
    category: "professional",
    progress: 65,
    gridX: 35,
    gridY: 45,
    decayRate: 1.5,
    riskScore: 82,
    connectedTo: ["demo_rehearsal"],
    completed: false,
  },
  {
    id: "demo_rehearsal",
    title: "Rehearse 3-Minute Presentation Demo",
    deadline: "in 5 hours",
    priority: "critical",
    durationMinutes: 30,
    description: "Run through script times, verify screen record flows, and test Gemini chat connection live.",
    category: "professional",
    progress: 0,
    gridX: 20,
    gridY: 65,
    decayRate: 1.8,
    riskScore: 78,
    connectedTo: [],
    completed: false,
  },
  {
    id: "chem_quiz",
    title: "Study for Organic Chemistry Quiz",
    deadline: "tomorrow, 9:00 AM",
    priority: "high",
    durationMinutes: 120,
    description: "Review carbonyl addition reactions, mechanisms, and functional group synthesis guides.",
    category: "academic",
    progress: 20,
    gridX: 65,
    gridY: 30,
    decayRate: 1.1,
    riskScore: 55,
    connectedTo: ["buy_materials"],
    completed: false,
  },
  {
    id: "buy_materials",
    title: "Get Lab Notebook & Supplies",
    deadline: "tomorrow, 8:00 AM",
    priority: "medium",
    durationMinutes: 45,
    description: "Pickup carbon copies notebooks from university bookstore for chemical biology exams.",
    category: "academic",
    progress: 0,
    gridX: 75,
    gridY: 65,
    decayRate: 0.8,
    riskScore: 40,
    connectedTo: [],
    completed: false,
  },
  {
    id: "pay_internet",
    title: "Pay Broadband Bill",
    deadline: "in 3 days",
    priority: "low",
    durationMinutes: 10,
    description: "Submit broadband invoice online to avoid service speed throttle and late fine charges.",
    category: "billing",
    progress: 100,
    gridX: 50,
    gridY: 85,
    decayRate: 0.3,
    riskScore: 0,
    connectedTo: [],
    completed: true,
  },
];

const INITIAL_ECOSYSTEM_TASKS: EcosystemTask[] = [
  {
    id: "litter_1",
    name: "Campus Path Litter Loop",
    type: "trash",
    vitalityPoints: 15,
    description: "Clear plastic waste along the path to bookstore.",
    gridX: 72,
    gridY: 78,
    status: "available",
  },
  {
    id: "soil_1",
    name: "Biology Quad Moisture Check",
    type: "soil",
    vitalityPoints: 20,
    description: "Insert temperature/moisture probe to log soil health.",
    gridX: 48,
    gridY: 52,
    status: "available",
  },
  {
    id: "tree_1",
    name: "Oak Canopy Shade Density Survey",
    type: "biodiversity",
    vitalityPoints: 25,
    description: "Log tree shade shadows to measure campus cooling index.",
    gridX: 62,
    gridY: 25,
    status: "available",
  },
];

export default function App() {
  const [viewMode, setViewMode] = useState<"strategy" | "cockpit">("cockpit");
  const { tasks, setTasks, ecosystemTasks, setEcosystemTasks, vitalityPoints, setVitalityPoints, messages, setMessages, addTask, updateTaskProgress, toggleTaskComplete, updateTaskPosition, deleteTask, logEcosystemTask, addMessage } = useMyceliumStore();
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>("submit_project");

  // Authentication states
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Monitor Auth Changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const userId = user?.uid || null;
  
  // Onboarding landing/splash screen state
  const [isOnboarded, setIsOnboarded] = useState(false);

  // Zero-to-One Quickstart starter generator state
  const [quickstartText, setQuickstartText] = useState<string | null>(null);
  const [isGeneratingQuickstart, setIsGeneratingQuickstart] = useState(false);

  // Rescue Mode extension requester state
  const [isRescueModalOpen, setIsRescueModalOpen] = useState(false);
  const [rescueRecipient, setRescueRecipient] = useState("Professor / Manager / Client");
  const [isGeneratingRescue, setIsGeneratingRescue] = useState(false);
  const [rescueData, setRescueData] = useState<{ emailDraft: string; microPlan: string[] } | null>(null);

  // Agent chat state
  const [agentType, setAgentType] = useState<"planner" | "accountability" | "focus" | "ecosystem">("planner");
    const [isSendingChat, setIsSendingChat] = useState(false);

  // Ecosystem simulation state
    
  // Ingestion parsing state
  const [ingestText, setIngestText] = useState("");
  const [isParsingText, setIsParsingText] = useState(false);

  // Risk prediction diagnostic state
  const [riskAnalysis, setRiskAnalysis] = useState<RiskAnalysis | null>(null);
  const [isRunningDiagnostic, setIsRunningDiagnostic] = useState(false);

  // Core modes triggers
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);
  const [focusDuration, setFocusDuration] = useState(1500); // concentration timer duration (seconds)
  const [isFocusShieldActive, setIsFocusShieldActive] = useState(true);
  const [procrastinationAlert, setProcrastinationAlert] = useState(false);

  const selectedTask = tasks.find((t) => t.id === selectedTaskId) || null;

  // Initialize introductory message when agent switches
  useEffect(() => {
    const agent = AGENTS.find((a) => a.id === agentType);
    if (agent) {
      const introMsg: ChatMessage = {
        id: `intro-${agentType}-${Date.now()}`,
        role: "assistant",
        content: `[Spore Intercom Active] ${agent.phrase}\n\nI am configured and tracking your active node pathways. How can I assist with your commitments today?`,
        timestamp: new Date().toISOString(),
      };
      addMessage(introMsg, userId);
    }
  }, [agentType]);

  // Load tasks from Firestore via Zustand
  useEffect(() => {
    initializeStoreListeners(userId);
    return () => clearStoreListeners();
  }, [userId]);

  

  // Periodic simulated decay: Every 15 seconds, uncompleted task risks go up slightly to demonstrate kinetic stress!
  useEffect(() => {
    const timer = setInterval(() => {
      // TODO: Move decay timer to Zustand if needed, or implement setTask logic
      const currentTasks = useMyceliumStore.getState().tasks;
      setTasks(
        currentTasks.map((t) => {
          if (t.completed) return t;
          const nextRisk = Math.min(99, Math.round(t.riskScore + t.decayRate * 1));
          return { ...t, riskScore: nextRisk };
        })
      );
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  // Handler: Select Task
  const handleSelectTask = (id: string) => {
    setSelectedTaskId(id);
  };

  // Handler: Toggle Task Complete
  const handleToggleComplete = (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (task) {
      toggleTaskComplete(id, userId);
    }
  };

  // Handler: Update Task progress slider
  const handleUpdateProgress = (id: string, value: number) => {
    const task = tasks.find((t) => t.id === id);
    if (task) {
      updateTaskProgress(id, value, userId);
    }
  };

  // Handler: Move / Reposition Node on Biological Neural Grid
  const handleNodeMove = (id: string, gridX: number, gridY: number) => {
    updateTaskPosition(id, gridX, gridY, userId);
  };

  // Handler: Add Mycelial Task dynamically (e.g. from Chief of Staff HUD or Meeting Guardian)
  const handleAddMycelialTask = (taskDetails: Omit<MycelialTask, "id" | "progress" | "completed">) => {
    const id = `extracted-${Date.now()}`;
    const newTask: MycelialTask = {
      ...taskDetails,
      id,
      progress: 0,
      completed: false,
    };
    addTask(newTask, userId);
    setSelectedTaskId(id);
  };

  // Handler: Update Mycelial Task properties dynamically
  const handleUpdateMycelialTask = (id: string, updates: Partial<MycelialTask>) => {
    const currentTasks = useMyceliumStore.getState().tasks;
    setTasks(currentTasks.map((t) => (t.id === id ? { ...t, ...updates } : t)));
    // Fallback since updateTask is gone
    // we can dispatch a direct updateDoc here if needed, but for MVP it's handled by state
  };

  // Handler: Inject chat messages directly from HUD elements
  const handleAddChatMessageDirectly = (content: string, role: "user" | "assistant") => {
    addMessage({ id: `cos-msg-${Date.now()}`, role, content, timestamp: new Date().toLocaleTimeString() }, userId);
  };

  // Handler: Delete Task
  const handleDeleteTask = (id: string) => {
    deleteTask(id, userId);
    if (selectedTaskId === id) setSelectedTaskId(null);
  };

  // Handler: Log physical crowdsourced ecosystem coordinates
  const handleLogEcosystemTask = (id: string) => {
    logEcosystemTask(id, userId); setAgentType("ecosystem");
  };

  // Handler: Call server to parse chaotic text to new biological nodes
  const handleParseSyllabus = async () => {
    if (!ingestText.trim()) return;
    setIsParsingText(true);

    try {
      const response = await fetch("/api/gemini/task-parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: ingestText }),
      });

      const data = await response.json();
      if (response.ok && data.tasks) {
        // Append parsed tasks with coordinates
        const newNodes: MycelialTask[] = data.tasks.map((task: any, index: number) => {
          const id = `parsed-${Date.now()}-${index}`;
          const node: MycelialTask = {
            id,
            title: task.title,
            deadline: task.deadline,
            priority: task.priority || "high",
            durationMinutes: task.durationMinutes || 60,
            description: task.description,
            category: task.category || "academic",
            progress: 0,
            riskScore: task.priority === "critical" ? 80 : task.priority === "high" ? 60 : 35,
            completed: false,
            gridX: Math.round(15 + Math.random() * 70),
            gridY: Math.round(15 + Math.random() * 70),
            decayRate: task.priority === "critical" ? 1.6 : 0.9,
            connectedTo: selectedTaskId ? [selectedTaskId] : [],
          };
          addTask(node, userId);
          return node;
        });

        if (newNodes.length > 0) {
          setSelectedTaskId(newNodes[0].id);
        }
        setIngestText("");
        
        // Append chat log from Spore planner
        addMessage({
          id: `parse-done-${Date.now()}`,
          role: "assistant",
          content: `[The Spore Ingestion Report] Successfully parsed unstructured input. Created ${newNodes.length} new biological nodes and mapped nutrient paths across your neural grid! Select any node to explore its temporal properties.`,
          timestamp: new Date().toISOString(),
        }, userId);
        setAgentType("planner");
      } else {
        alert(data.error || "Failed to parse content.");
      }
    } catch (err: any) {
      console.error(err);
      alert("Error interacting with Gemini server-side. Running in local fallback mode.");
    } finally {
      setIsParsingText(false);
    }
  };

  // Handler: Run automated Risk assessment
  const handleRunDiagnostic = async () => {
    setIsRunningDiagnostic(true);
    try {
      const response = await fetch("/api/gemini/risk-predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tasks }),
      });
      const data = await response.json();
      if (response.ok) {
        setRiskAnalysis(data);
      } else {
        alert("Failed to analyze task risk index.");
      }
    } catch (err: any) {
      console.error(err);
      // Mock fallback if offline
      setRiskAnalysis({
        overallRisk: "High Risk (78%)",
        assessment: "Syllabus indicates sudden deadline overlap on academic quiz and professional deck submission.",
        reasons: [
          "Multiple critical-path tasks are expiring within a single 4-hour window.",
          "High duration overhead vs actual remaining time before deadline expiration."
        ],
        mitigations: [
          "Defuse Study for Quiz node by carving out immediate 45-minute micro-milestone block.",
          "Engage Map commute checks to replenish cortisol reserves."
        ]
      });
    } finally {
      setIsRunningDiagnostic(false);
    }
  };

  // Handler: Talk to Agent
  const handleSendChatMessage = async (content: string) => {
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content,
      timestamp: new Date().toISOString(),
    };

    addMessage(userMsg, userId);
    setIsSendingChat(true);

    try {
      // Gather current conversation history
      const history = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history,
          agentType,
        }),
      });

      const data = await response.json();
      if (response.ok && data.response) {
        addMessage({
            id: `assistant-${Date.now()}`,
            role: "assistant",
            content: data.response,
            timestamp: new Date().toISOString(),
          }, userId);
      } else {
        throw new Error(data.error || "Server error");
      }
    } catch (err: any) {
      console.error(err);
      addMessage({
        id: `err-${Date.now()}`,
        role: "assistant",
        content: `[Simulation Intercept] Hello! I'm operating in offline sandbox mode right now, but normally I would connect directly to Gemini 3.5 to help you organize that schedule loam! Let's get down to business and complete this task!`,
        timestamp: new Date().toISOString(),
      }, userId);
    } finally {
      setIsSendingChat(false);
    }
  };

  // Handler: Generate Zero-to-One Quickstart Outline
  const handleGenerateQuickstart = async (task: MycelialTask) => {
    setIsGeneratingQuickstart(true);
    setQuickstartText(null);
    try {
      const response = await fetch("/api/gemini/zero-to-one", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: task.title, description: task.description }),
      });
      const data = await response.json();
      if (response.ok && data.draftText) {
        setQuickstartText(data.draftText);
      } else {
        alert("Failed to generate quickstart draft.");
      }
    } catch (err) {
      console.error(err);
      setQuickstartText(`### 🚀 Quickstart for "${task.title}"\n\n- Spend 15 minutes setting up a minimal draft.\n- Identify 3 reference links.\n- Complete the first 50 words right now!\n\n*(Simulation Mode fallback outline)*`);
    } finally {
      setIsGeneratingQuickstart(false);
    }
  };

  // Handler: Generate Rescue Mode extension template
  const handleGenerateRescueDraft = async (task: MycelialTask) => {
    setIsGeneratingRescue(true);
    setRescueData(null);
    try {
      const response = await fetch("/api/gemini/rescue-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: task.title, recipientContext: rescueRecipient }),
      });
      const data = await response.json();
      if (response.ok && data.emailDraft) {
        setRescueData({
          emailDraft: data.emailDraft,
          microPlan: data.microPlan || []
        });
      } else {
        alert("Failed to compile Rescue Mode template.");
      }
    } catch (err) {
      console.error(err);
      setRescueData({
        emailDraft: `Subject: Status update: ${task.title}\n\nDear ${rescueRecipient},\n\nI am writing to update you on my progress with "${task.title}". Due to some unexpected delays, I would appreciate a brief extension. Thank you.`,
        microPlan: ["Calm down and outline steps", "Commit 30 minutes in Lockdown", "Send first draft"]
      });
    } finally {
      setIsGeneratingRescue(false);
    }
  };

  // Handler: Explicitly link two task nodes (draw hyphae line)
  const handleLinkTask = (taskId: string, targetId: string) => {
    if (!targetId) return;
    const task = tasks.find((t) => t.id === taskId);
    if (task && !task.connectedTo.includes(targetId)) {
      const currentTasks = useMyceliumStore.getState().tasks;
      setTasks(currentTasks.map((t) => t.id === taskId ? { ...t, connectedTo: [...t.connectedTo, targetId] } : t));
    }
  };


  // Simple custom Markdown formatter helper
  const renderSimpleMarkdown = (text: string) => {
    return text.split("\n").map((line, idx) => {
      if (line.startsWith("### ")) {
        return <h4 key={idx} className="text-sm font-bold text-indigo-300 mt-3 mb-1 font-display">{line.replace("### ", "")}</h4>;
      }
      if (line.startsWith("## ")) {
        return <h3 key={idx} className="text-base font-bold text-indigo-400 mt-4 mb-2 font-display">{line.replace("## ", "")}</h3>;
      }
      if (line.startsWith("# ")) {
        return <h2 key={idx} className="text-lg font-extrabold text-white mt-5 mb-3 font-display">{line.replace("# ", "")}</h2>;
      }
      if (line.startsWith("- ") || line.startsWith("* ")) {
        return <li key={idx} className="ml-4 list-disc text-xs text-slate-300 mb-1 leading-relaxed">{line.substring(2)}</li>;
      }
      const boldRegex = /\*\*(.*?)\*\*/g;
      if (boldRegex.test(line)) {
        const parts = line.split("**");
        return (
          <p key={idx} className="text-[11px] text-slate-300 my-1 leading-relaxed">
            {parts.map((part, i) => i % 2 === 1 ? <strong key={i} className="text-white font-bold">{part}</strong> : part)}
          </p>
        );
      }
      return line.trim() ? <p key={idx} className="text-[11px] text-slate-300 my-1 leading-relaxed">{line}</p> : <div key={idx} className="h-2" />;
    });
  };

  // Custom task form to add manually
  const [newTitle, setNewTitle] = useState("");
  const [newDeadline, setNewDeadline] = useState("");
  const [newPriority, setNewPriority] = useState<"critical" | "high" | "medium" | "low">("high");
  const [newDesc, setNewDesc] = useState("");
  const [newCategory, setNewCategory] = useState<"academic" | "professional" | "billing" | "personal">("academic");

  const handleCreateTaskManually = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDeadline.trim()) return;

    const id = `manual-${Date.now()}`;
    const newTask: MycelialTask = {
      id,
      title: newTitle.trim(),
      deadline: newDeadline.trim(),
      priority: newPriority,
      durationMinutes: newCategory === "academic" ? 90 : 45,
      description: newDesc.trim() || "Manual biological task node created by user.",
      category: newCategory,
      progress: 0,
      riskScore: newPriority === "critical" ? 85 : newPriority === "high" ? 60 : 35,
      completed: false,
      gridX: Math.round(15 + Math.random() * 70),
      gridY: Math.round(15 + Math.random() * 70),
      decayRate: newPriority === "critical" ? 1.5 : 0.8,
      connectedTo: selectedTaskId ? [selectedTaskId] : [],
    };

    addTask(newTask, userId);
    setSelectedTaskId(id);
    
    // reset form fields
    setNewTitle("");
    setNewDeadline("");
    setNewDesc("");
  };

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      console.error("Google Sign-In failed:", err);
      alert("Authentication failed. Guest anonymous network remains active.");
    }
  };

  const handleAnonymousSignIn = async () => {
    try {
      setAuthError(null);
      await signInAnonymously(auth);
    } catch (err: any) {
      console.error("Anonymous Sign-In failed:", err);
      if (err.code === "auth/admin-restricted-operation" || err.message?.includes("admin-restricted-operation")) {
        setAuthError("Anonymous sign-in is disabled by administrator. Please use Secure Google Sync or proceed as local Guest.");
      } else {
        setAuthError(err.message || "Anonymous login failed.");
      }
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (err: any) {
      console.error("Sign-Out failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0C10] text-white flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-400">
      
      {/* ONBOARDING SPLASH SCREEN OVERLAY */}
      {!isOnboarded && (
        <div className="fixed inset-0 bg-[#0A0C10] z-50 flex flex-col justify-center items-center p-4 overflow-y-auto">
          <div className="max-w-xl w-full text-center space-y-8 bg-[#161B22] border border-[#30363D] p-8 md:p-12 rounded-2xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500" />
            
            <div className="flex justify-center">
              <div className="bg-indigo-950/50 border border-indigo-500/30 p-4 rounded-full text-indigo-400 animate-pulse-slow relative">
                <Sprout className="w-12 h-12" />
                <span className="absolute inset-0 rounded-full border border-indigo-500/20 animate-ping" />
              </div>
            </div>

            <div className="space-y-3">
              <h1 className="font-display font-extrabold text-3xl tracking-wider text-white">
                MYCELIUM
              </h1>
              <p className="text-xs font-mono text-indigo-400 uppercase tracking-widest">
                Biological Neural Network for Adaptive Productivity
              </p>
            </div>

            <div className="text-xs text-slate-400 leading-relaxed space-y-4 max-w-md mx-auto text-left">
              <p>
                Welcome to <strong className="text-white font-semibold">Mycelium</strong>. Traditional calendars and todo lists rely on passive reminders that are easily ignored. Mycelium acts as an active, living biological organism that links your commitments as nodes of a subterranean fungal network.
              </p>
              <p>
                As time passes, neglected tasks suffer <strong className="text-rose-400 font-semibold">decay and rot</strong>, escalating the risk index. If danger looms, the system triggers the <strong className="text-indigo-400 font-semibold">Emergency Decay Protocol</strong> to force focus. Connect physical actions, coordinate with autonomous AI symbiote agents, and save your deadlines.
              </p>
            </div>

            <div className="pt-4">
              <button
                onClick={() => setIsOnboarded(true)}
                className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white font-sans font-bold text-xs px-8 py-3.5 rounded-xl shadow-lg shadow-indigo-950/50 transition-all hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer mx-auto"
              >
                <span>SYNC SUBTERRANEAN RESERVES</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="text-[10px] font-mono text-slate-500 pt-2">
              ACTIVE SEED RESERVES SYNCHRONIZING • GEMINI 3.5 FLASH ENGAGED
            </div>
          </div>
        </div>
      )}
      {/* HUD HEADER */}
      <header className="bg-[#161B22] border-b border-[#30363D] py-4 px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-4 z-10 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-950/60 border border-indigo-500/40 p-2 rounded-xl text-indigo-400 animate-pulse-slow">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-display font-extrabold text-lg tracking-wider text-white flex items-center gap-2">
              MYCELIUM <span className="text-[10px] font-mono bg-indigo-950/40 text-indigo-400 border border-indigo-800/40 px-1.5 py-0.5 rounded tracking-normal font-medium">HACKATHON MVP</span>
            </h1>
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest leading-none mt-1">
              Biological Neural Network for Adaptive Productivity
            </p>
          </div>
        </div>

        {/* Authentication and View mode controls */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* Mycelial Identity Node Status */}
          <div className="flex items-center gap-2.5 bg-[#0d1117] border border-[#30363D] rounded-xl px-3 py-1.5">
            {isAuthLoading ? (
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                <span>Syncing Identity...</span>
              </div>
            ) : user ? (
              <div className="flex items-center gap-2.5">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    referrerPolicy="no-referrer"
                    alt={user.displayName || "User"}
                    className="w-5 h-5 rounded-full border border-indigo-500/50"
                  />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-indigo-950 border border-indigo-500/50 flex items-center justify-center text-[10px] font-mono text-indigo-300 font-bold">
                    {user.displayName ? user.displayName[0].toUpperCase() : "M"}
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-200 leading-none">
                    {user.displayName || (user.isAnonymous ? "Anonymous Spore" : "Spore Member")}
                  </span>
                  <span className="text-[8px] font-mono text-emerald-400 leading-none mt-0.5 uppercase tracking-wider">
                    {user.isAnonymous ? "Anonymous Network" : "Secure DNA Sync"}
                  </span>
                </div>
                <button
                  onClick={handleSignOut}
                  title="Disconnect Identity"
                  className="text-slate-500 hover:text-red-400 p-0.5 rounded transition-all cursor-pointer ml-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest hidden lg:inline">
                  IDENTITY:
                </span>
                <button
                  onClick={handleAnonymousSignIn}
                  className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 text-[10px] font-mono text-slate-300 transition-all cursor-pointer flex items-center gap-1"
                >
                  <UserCheck className="w-3 h-3 text-emerald-400" />
                  <span>Go Anonymous</span>
                </button>
                <button
                  onClick={handleGoogleSignIn}
                  className="px-2 py-1 rounded bg-indigo-950/40 hover:bg-indigo-900/50 border border-indigo-800/40 hover:border-indigo-700 text-[10px] font-mono text-indigo-300 transition-all cursor-pointer flex items-center gap-1"
                >
                  <Zap className="w-3 h-3 text-indigo-400" />
                  <span>Sync Google</span>
                </button>
              </div>
            )}
          </div>

          {/* View mode toggle switches */}
          <div className="flex items-center bg-[#0d1117] border border-[#30363D] rounded-xl p-1.5 gap-1">
            <button
              onClick={() => setViewMode("cockpit")}
              className={`px-4 py-2 rounded-lg text-xs font-sans transition-all flex items-center gap-2 cursor-pointer ${
                viewMode === "cockpit"
                  ? "bg-indigo-950/40 border border-indigo-500/30 text-indigo-400 font-semibold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <BrainCircuit className="w-4 h-4" /> Interactive Cockpit (Demo)
            </button>
            <button
              onClick={() => setViewMode("strategy")}
              className={`px-4 py-2 rounded-lg text-xs font-sans transition-all flex items-center gap-2 cursor-pointer ${
                viewMode === "strategy"
                  ? "bg-indigo-950/40 border border-indigo-500/30 text-indigo-400 font-semibold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Layers className="w-4 h-4" /> Strategy & Pitch Deck
            </button>
          </div>
        </div>
      </header>

      {authError && (
        <div className="bg-amber-950/20 border-b border-amber-500/30 text-amber-300 px-4 py-2 text-xs font-mono flex items-center justify-between gap-4 animate-fade-in shrink-0">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
            <span>{authError}</span>
          </div>
          <button
            onClick={() => setAuthError(null)}
            className="text-amber-400 hover:text-white hover:bg-amber-900/30 p-1 rounded transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* EMERGENCY MODE SCREEN OVERLAY */}
      {isEmergencyActive && selectedTask && (
        <EmergencyConsole
          task={selectedTask}
          onDefuse={(id) => {
            handleToggleComplete(id);
            setIsEmergencyActive(false);
          }}
          onExit={() => setIsEmergencyActive(false)}
          initialSeconds={focusDuration}
        />
      )}

      {/* RESCUE MODE MODAL OVERLAY */}
      {isRescueModalOpen && selectedTask && (
        <div className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="max-w-2xl w-full bg-[#161B22] border border-[#30363D] rounded-2xl shadow-2xl p-6 relative flex flex-col max-h-[90vh] overflow-hidden">
            <button
              onClick={() => {
                setIsRescueModalOpen(false);
                setRescueData(null);
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white hover:bg-[#30363D]/40 p-1.5 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-[#30363D] pb-3 mb-4">
              <div className="bg-red-950/40 border border-red-500/30 p-2 rounded-xl text-red-400">
                <AlertTriangle className="w-5 h-5 animate-bounce" />
              </div>
              <div>
                <h3 className="font-display font-extrabold text-base tracking-wide text-white">
                  Active Rescue Mode Pathways
                </h3>
                <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest leading-none mt-1">
                  Mitigate impending deadline fallout via Gemini
                </p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-1.5">
              <div className="bg-red-950/15 border border-red-900/30 p-3.5 rounded-xl text-xs text-slate-300 leading-relaxed">
                <span className="text-white font-semibold block mb-1">🚨 Decaying Node Warning:</span>
                Your node <strong className="text-white">"{selectedTask.title}"</strong> is nearing deadline rot. Overcome immediate procrastination or request a brief breathing-room extension from your stakeholders.
              </div>

              {/* Input for Recipient Context */}
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block font-bold">
                  RECIPIENT DESIGNATION
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={rescueRecipient}
                    onChange={(e) => setRescueRecipient(e.target.value)}
                    placeholder="E.g., Professor Carter, Project Lead Sarah, My Advisor"
                    className="flex-1 bg-[#0d1117] border border-[#30363D] rounded-xl px-3 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-red-500"
                  />
                  <button
                    onClick={() => handleGenerateRescueDraft(selectedTask)}
                    disabled={isGeneratingRescue || !rescueRecipient.trim()}
                    className="bg-red-600 hover:bg-red-500 disabled:bg-[#30363D] disabled:text-slate-500 text-white font-sans font-bold text-xs px-5 py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-red-950/20"
                  >
                    {isGeneratingRescue ? (
                      <RefreshCw className="w-4 h-4 animate-spin text-red-200" />
                    ) : (
                      <Mail className="w-4 h-4" />
                    )}
                    <span>{isGeneratingRescue ? "Compiling..." : "Draft Escape Pathway"}</span>
                  </button>
                </div>
              </div>

              {/* Results */}
              {rescueData ? (
                <div className="space-y-4 pt-2 border-t border-[#30363D] animate-fade-in">
                  {/* Email Draft Box */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest block font-bold">
                        COMMUNICATION TEMPLATE
                      </span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(rescueData.emailDraft);
                          alert("Draft copied to clipboard!");
                        }}
                        className="text-[10px] font-mono text-slate-400 hover:text-white bg-[#0d1117] border border-[#30363D] px-2.5 py-1 rounded"
                      >
                        Copy to Clipboard
                      </button>
                    </div>
                    <textarea
                      value={rescueData.emailDraft}
                      readOnly
                      className="w-full bg-[#0d1117] border border-[#30363D] rounded-xl p-3 text-xs text-slate-200 font-mono h-40 focus:outline-none select-all focus:border-[#30363D] resize-none"
                    />
                  </div>

                  {/* Micro-Plan Box */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest block font-bold">
                      3-STEP ACCELERATED RECOVERY PATHWAY
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {rescueData.microPlan.map((step, idx) => (
                        <div key={idx} className="bg-[#0d1117] border border-[#30363D] p-3.5 rounded-xl flex flex-col gap-2">
                          <div className="flex items-center gap-1.5">
                            <span className="w-5 h-5 rounded-full bg-red-950/50 border border-red-900/60 flex items-center justify-center text-[10px] font-mono font-bold text-red-400">
                              0{idx + 1}
                            </span>
                            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider font-bold">ACTION STEP</span>
                          </div>
                          <p className="text-[11px] text-slate-300 leading-relaxed font-sans font-medium">
                            {step}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : isGeneratingRescue ? (
                <div className="py-12 flex flex-col items-center justify-center gap-3 border-t border-[#30363D]">
                  <RefreshCw className="w-6 h-6 text-red-500 animate-spin" />
                  <span className="text-xs font-mono text-slate-500">Gemini 3.5 compiling extension templates...</span>
                </div>
              ) : null}
            </div>

            <div className="border-t border-[#30363D] pt-3.5 mt-4 text-[10px] font-mono text-slate-600 flex justify-between items-center">
              <span>MYCELIAL ESCAPE COMPILER V1.1</span>
              <span>EMERGENCY SECURE CHANNEL</span>
            </div>
          </div>
        </div>
      )}

      {/* MAIN LAYOUT FRAME */}
      <main className="flex-1 p-4 md:p-6 max-w-7xl w-full mx-auto space-y-6">
        
        {/* VIEW: STRATEGY PRESENTATION DECK */}
        {viewMode === "strategy" && (
          <div className="space-y-4">
            <div className="bg-[#161B22] border border-[#30363D] p-4 rounded-xl flex items-center justify-between shadow-2xl">
              <div className="flex items-center gap-2.5">
                <Award className="w-5 h-5 text-indigo-400" />
                <p className="text-xs text-slate-300">
                  This interactive system models all <strong className="text-white">12 required strategic sections</strong> of our hackathon pitch deck. Use the sidebar to explore technical databases, slide outlines, and pitch schedules.
                </p>
              </div>
              <button
                onClick={() => setViewMode("cockpit")}
                className="text-xs bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 rounded-lg text-white font-sans transition-all cursor-pointer shadow-md"
              >
                Go to Live Demo →
              </button>
            </div>
            <StrategyDeck slides={PITCH_SLIDES} />
          </div>
        )}

        {/* VIEW: COCKPIT INTERACTIVE DEMO SANDBOX */}
        {viewMode === "cockpit" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT AREA: INTERACTIVE NEURAL MAP & TOOLS (Col span 7) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Biological neural map cell board */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="font-display font-bold text-sm tracking-wide text-slate-400 uppercase flex items-center gap-1.5">
                    <span>1. Biological Neural Grid</span>
                    <Info className="w-3.5 h-3.5 text-slate-500 cursor-pointer" title="Click nodes to select. Tasks decay dynamically over time!" />
                  </h3>
                  {selectedTask && (
                    <span className="text-[10px] font-mono text-lime-400 bg-lime-950/40 border border-lime-900 px-2 py-0.5 rounded">
                      FOCUS NODE: {selectedTask.title}
                    </span>
                  )}
                </div>
                <MycelialCanvas
                  tasks={tasks}
                  selectedTaskId={selectedTaskId}
                  onSelectTask={handleSelectTask}
                  onToggleComplete={handleToggleComplete}
                  onUpdateProgress={handleUpdateProgress}
                  onNodeMove={handleNodeMove}
                  onDeleteTask={handleDeleteTask}
                />
              </div>

              {/* Ingestion & Extraction Center */}
              <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-4 space-y-3 shadow-md">
                <div className="flex items-center justify-between border-b border-[#30363D] pb-2">
                  <h4 className="font-display font-semibold text-xs text-slate-300 uppercase flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-indigo-400" />
                    <span>2. Ingest Chaotic Syllabus or Messy Emails</span>
                  </h4>
                  <span className="text-[9px] font-mono text-slate-500">AI EXTRACTION (GEMINI 3.5)</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Paste raw syllabus excerpts, messy emails from professors/clients, or calendar details. Gemini will autonomously parse and structure them as connected mycelial task nodes on your grid.
                </p>
                <div className="flex gap-2">
                  <textarea
                    value={ingestText}
                    onChange={(e) => setIngestText(e.target.value)}
                    placeholder="E.g., 'Make sure to submit chemical biology research proposal before Friday night. Also, remember pay monthly broadband bill due in 3 days...'"
                    className="flex-1 bg-[#0d1117] border border-[#30363D] rounded-lg p-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 h-16 font-sans resize-none"
                  />
                  <button
                    onClick={handleParseSyllabus}
                    disabled={isParsingText || !ingestText.trim()}
                    className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-[#30363D] disabled:text-slate-500 text-white font-sans font-medium text-xs px-4 rounded-lg flex flex-col justify-center items-center gap-1.5 transition-all cursor-pointer border border-indigo-500/40 shadow"
                  >
                    {isParsingText ? (
                      <RefreshCw className="w-4 h-4 animate-spin text-indigo-300" />
                    ) : (
                      <Sparkles className="w-4 h-4 text-indigo-300" />
                    )}
                    <span>{isParsingText ? "Parsing..." : "Extract"}</span>
                  </button>
                </div>
              </div>

              {/* Urban commute & environmental crowdsourcing */}
              <div className="space-y-2">
                <h3 className="font-display font-bold text-sm tracking-wide text-slate-400 uppercase">
                  3. Commute Navigation & Crowdsourced Ecosystem Logging
                </h3>
                <EcosystemMap
                  tasks={ecosystemTasks}
                  onLogTask={handleLogEcosystemTask}
                  vitalityPoints={vitalityPoints}
                />
              </div>
            </div>

            {/* RIGHT AREA: AGENT COMPANION & HUB HUD CONTROLLER (Col span 5) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Specialized Symbiote Chat Agent */}
              <div className="space-y-2">
                <h3 className="font-display font-bold text-sm tracking-wide text-slate-400 uppercase">
                  4. Active Symbiote AI Intercom
                </h3>
                <AgentHub
                  messages={messages}
                  onSendMessage={handleSendChatMessage}
                  selectedAgent={agentType}
                  onChangeAgent={(agent) => setAgentType(agent)}
                  isSending={isSendingChat}
                />
              </div>

              {/* Holographic Active Node Controller */}
              <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-4 space-y-4 shadow-md">
                <div className="flex justify-between items-center border-b border-[#30363D] pb-2">
                  <h4 className="font-display font-bold text-xs text-slate-300 uppercase">
                    5. Active Task HUD Controller
                  </h4>
                  {selectedTask && (
                    <span className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded ${
                      selectedTask.completed
                        ? "bg-indigo-950/50 text-indigo-400 border border-indigo-900"
                        : selectedTask.riskScore >= 75
                        ? "bg-red-950/50 text-red-400 border border-red-900 animate-pulse"
                        : "bg-slate-900 text-slate-400 border border-slate-800"
                    }`}>
                      {selectedTask.completed ? "ASSIMILATED" : `${selectedTask.riskScore}% DECAY`}
                    </span>
                  )}
                </div>

                {selectedTask ? (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-display font-bold text-white leading-tight">
                        {selectedTask.title}
                      </h4>
                      <div className="flex gap-2 items-center mt-1 text-[10px] font-mono text-slate-400 uppercase">
                        <span>PRIORITY: <strong className={selectedTask.priority === "critical" ? "text-red-400" : "text-slate-300"}>{selectedTask.priority}</strong></span>
                        <span>•</span>
                        <span>DEADLINE: <strong className="text-slate-300">{selectedTask.deadline}</strong></span>
                      </div>
                      <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                        {selectedTask.description}
                      </p>
                    </div>

                    {/* Progress Slider */}
                    <div className="space-y-1.5 bg-[#0d1117] border border-[#30363D] p-3 rounded-lg">
                      <div className="flex justify-between text-[10px] font-mono text-slate-500">
                        <span>ACCUMULATED ASSIMILATION</span>
                        <span className="text-indigo-400 font-bold">{selectedTask.progress}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={selectedTask.progress}
                        onChange={(e) => handleUpdateProgress(selectedTask.id, parseInt(e.target.value))}
                        disabled={selectedTask.completed}
                        className="w-full h-1 bg-[#30363D] rounded-lg appearance-none cursor-pointer accent-indigo-500"
                      />
                    </div>

                    {/* Threat override actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleToggleComplete(selectedTask.id)}
                        className={`flex-1 py-2.5 rounded-lg font-sans font-semibold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                          selectedTask.completed
                            ? "bg-[#0d1117] border border-[#30363D] text-slate-500"
                            : "bg-indigo-600 hover:bg-indigo-500 text-white shadow"
                        }`}
                      >
                        <CheckSquare className="w-4 h-4" />
                        {selectedTask.completed ? "Re-open Task Cell" : "Complete Node"}
                      </button>

                      {!selectedTask.completed && (
                        <button
                          onClick={() => {
                            setSelectedTaskId(selectedTask.id);
                            setIsEmergencyActive(true);
                          }}
                          className="px-4 py-2.5 rounded-lg bg-red-950/20 border border-red-900/60 text-red-400 hover:bg-red-950/40 hover:text-red-300 text-xs font-mono font-bold flex items-center gap-1 animate-pulse cursor-pointer"
                        >
                          <AlertTriangle className="w-4 h-4" /> EMERGENCY
                        </button>
                      )}

                      <button
                        onClick={() => handleDeleteTask(selectedTask.id)}
                        className="p-2.5 rounded-lg bg-[#0d1117] border border-[#30363D] text-slate-500 hover:text-red-400 hover:border-red-900/40 transition-colors cursor-pointer"
                        title="Decay Cell Completely (Delete)"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Zero-to-One Quickstart Generator & Rescue Trigger buttons */}
                    {!selectedTask.completed && (
                      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#30363D]">
                        <button
                          onClick={() => handleGenerateQuickstart(selectedTask)}
                          disabled={isGeneratingQuickstart}
                          className="py-2.5 px-3 bg-indigo-950/40 border border-indigo-500/30 hover:border-indigo-400 text-indigo-300 hover:text-white rounded-lg text-xs font-sans font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          {isGeneratingQuickstart ? (
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Zap className="w-3.5 h-3.5 text-indigo-400" />
                          )}
                          <span>🌱 Zero-to-One Starter</span>
                        </button>

                        <button
                          onClick={() => setIsRescueModalOpen(true)}
                          className="py-2.5 px-3 bg-red-950/20 border border-red-900/40 hover:border-red-400 text-red-300 hover:text-white rounded-lg text-xs font-sans font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Mail className="w-3.5 h-3.5 text-red-400" />
                          <span>🚨 Trigger Rescue</span>
                        </button>
                      </div>
                    )}

                    {/* Quickstart output text box */}
                    {quickstartText && !selectedTask.completed && (
                      <div className="bg-[#0d1117] border border-[#30363D] p-3.5 rounded-xl space-y-2 relative animate-fade-in max-h-52 overflow-y-auto">
                        <button
                          onClick={() => setQuickstartText(null)}
                          className="absolute top-2.5 right-2.5 text-slate-500 hover:text-white"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <div className="flex items-center gap-1.5 text-indigo-400 font-display font-semibold text-xs border-b border-[#30363D] pb-1.5">
                          <BookOpen className="w-4 h-4" />
                          <span>Gemini Actionable Starter Draft</span>
                        </div>
                        <div className="space-y-1">
                          {renderSimpleMarkdown(quickstartText)}
                        </div>
                      </div>
                    )}

                    {/* Interactive Accountability, Procrastination Shield & Consequence Simulator widgets */}
                    {!selectedTask.completed && (
                      <div className="space-y-4 border-t border-[#30363D] pt-4">
                        
                        {/* 1. ANTI-PROCRASTINATION SENTINEL & SHIELD */}
                        <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-3 space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                              🛡️ Sentinel Shield Active
                            </span>
                            <button
                              onClick={() => {
                                setIsFocusShieldActive(!isFocusShieldActive);
                              }}
                              className={`text-[9px] font-mono px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                                isFocusShieldActive
                                  ? "bg-emerald-950/40 border-emerald-800 text-emerald-400 hover:bg-emerald-900/40"
                                  : "bg-red-950/40 border-red-900 text-red-400 hover:bg-red-900/40"
                              }`}
                            >
                              {isFocusShieldActive ? "ARMED" : "DISARMED"}
                            </button>
                          </div>
                          
                          <p className="text-[10px] text-slate-400 font-sans leading-relaxed">
                            Continuous monitoring of calendar, app usage, and focus duration detects avoidance patterns automatically.
                          </p>

                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setProcrastinationAlert(true);
                                handleAddChatMessageDirectly(
                                  `🚨 Avoidance alert triggered for "${selectedTask.title}". System detected Doom Scrolling/Task Avoidance pattern. Activating accountability partner flow.`,
                                  "assistant"
                                );
                              }}
                              className="w-full py-1.5 px-2.5 bg-amber-950/30 border border-amber-900/60 hover:border-amber-400 text-amber-300 rounded text-[10px] font-mono font-bold transition-colors cursor-pointer flex items-center justify-center gap-1"
                            >
                              ⚡ Simulate Doom Scrolling Event
                            </button>
                          </div>

                          {procrastinationAlert && (
                            <div className="bg-amber-950/20 border border-amber-800/40 rounded-lg p-2.5 space-y-1.5 animate-fade-in relative">
                              <button
                                onClick={() => setProcrastinationAlert(false)}
                                className="absolute top-1.5 right-1.5 text-amber-500 hover:text-white text-xs font-bold"
                              >
                                ×
                              </button>
                              <div className="flex items-center gap-1 text-amber-400 font-bold text-[10px] font-mono">
                                <AlertTriangle className="w-3.5 h-3.5 animate-bounce" />
                                <span>AVOIDANCE BEHAVIOR PREVENTED</span>
                              </div>
                              <p className="text-[10px] text-slate-300 font-sans">
                                We noticed continuous avoidance on <strong>{selectedTask.title}</strong>. Please engage the Accountability flow below.
                              </p>
                            </div>
                          )}
                        </div>

                        {/* 2. AI ACCOUNTABILITY PARTNER INTERCEPT */}
                        <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-3 space-y-2.5">
                          <div className="flex items-center gap-1.5 border-b border-slate-800 pb-1.5">
                            <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
                            <h5 className="text-[10px] font-display font-semibold text-slate-200 uppercase tracking-wider">
                              🤝 Mycelium Accountability Partner
                            </h5>
                          </div>
                          
                          <div className="space-y-1">
                            <span className="text-[9px] font-mono text-indigo-400 block font-bold">AI PARTNER PROMPT:</span>
                            <blockquote className="text-[10px] text-slate-300 italic bg-[#0d1117] p-2 rounded border border-slate-800 leading-relaxed">
                              "You scheduled concentration on '{selectedTask.title}' for {selectedTask.durationMinutes} minutes. No neural progress is currently registered. What action shall we take to protect your timeline?"
                            </blockquote>
                          </div>

                          <div className="grid grid-cols-1 gap-1.5 pt-1">
                            <button
                              onClick={() => {
                                setFocusDuration(900); // 15 mins
                                setIsEmergencyActive(true);
                                handleAddChatMessageDirectly("Initiated a 15-minute high-concentration quick focus session. Distraction shields raised.", "assistant");
                              }}
                              className="py-1.5 px-2 bg-indigo-950/40 hover:bg-indigo-900/40 border border-indigo-800/60 hover:border-indigo-400 text-indigo-300 text-[10px] font-sans text-left rounded font-medium flex items-center justify-between transition-colors cursor-pointer"
                            >
                              <span>1. Launch 15-Minute Micro-Focus session</span>
                              <span className="text-[9px] font-mono bg-indigo-900/60 px-1 py-0.5 rounded text-indigo-200">START</span>
                            </button>

                            <button
                              onClick={() => {
                                const newY = Math.min(95, Math.round(selectedTask.gridY + 15));
                                handleUpdateMycelialTask(selectedTask.id, { gridY: newY });
                                handleAddChatMessageDirectly(`Rescheduled "${selectedTask.title}" node. Relocated to lower latency coordinate row ${newY}.`, "assistant");
                              }}
                              className="py-1.5 px-2 bg-slate-900 border border-slate-800 hover:border-slate-500 text-slate-300 text-[10px] font-sans text-left rounded font-medium flex items-center justify-between transition-colors cursor-pointer"
                            >
                              <span>2. Relocate Node coordinate (Reschedule)</span>
                              <span className="text-[9px] font-mono bg-slate-800 px-1 py-0.5 rounded text-slate-400">SHIFT</span>
                            </button>

                            <button
                              onClick={() => {
                                const checklist = `\n\n📌 **AI Extraction Action Plan:**\n- [ ] STEP 1: Gather references and notes (10m)\n- [ ] STEP 2: Draft initial outline block (20m)\n- [ ] STEP 3: Complete execution & submit (15m)`;
                                handleUpdateMycelialTask(selectedTask.id, { 
                                  description: selectedTask.description + checklist 
                                });
                                handleAddChatMessageDirectly(`Injected 3-step actionable study guide into "${selectedTask.title}". Check description.`, "assistant");
                              }}
                              className="py-1.5 px-2 bg-slate-900 border border-slate-800 hover:border-slate-500 text-slate-300 text-[10px] font-sans text-left rounded font-medium flex items-center justify-between transition-colors cursor-pointer"
                            >
                              <span>3. Delegate/Extract 3-step action checklist</span>
                              <span className="text-[9px] font-mono bg-slate-800 px-1 py-0.5 rounded text-slate-400">INJECT</span>
                            </button>
                          </div>
                        </div>

                        {/* 3. CONSEQUENCE SIMULATOR (DREAD MATRIX) */}
                        <div className="bg-red-950/10 border border-red-900/35 rounded-xl p-3 space-y-2">
                          <div className="flex items-center gap-1.5">
                            <Activity className="w-3.5 h-3.5 text-red-400" />
                            <h5 className="text-[10px] font-display font-semibold text-red-300 uppercase tracking-wider">
                              📉 Real-Time Consequence Simulator
                            </h5>
                          </div>
                          
                          <p className="text-[10px] text-slate-400 font-sans leading-relaxed">
                            Skipping this mycelial task node will cause instant cascading decay across your neural pathways:
                          </p>

                          <div className="grid grid-cols-3 gap-2 pt-1">
                            <div className="bg-slate-950/40 p-2 rounded border border-slate-800 text-center">
                              <span className="text-[9px] text-slate-500 uppercase block font-mono">Competency Drop</span>
                              <span className="text-xs font-mono font-bold text-red-400">-42%</span>
                            </div>
                            <div className="bg-slate-950/40 p-2 rounded border border-slate-800 text-center">
                              <span className="text-[9px] text-slate-500 uppercase block font-mono">Completion Chance</span>
                              <span className="text-xs font-mono font-bold text-red-400">18%</span>
                            </div>
                            <div className="bg-slate-950/40 p-2 rounded border border-slate-800 text-center">
                              <span className="text-[9px] text-slate-500 uppercase block font-mono">Expected Sleep Loss</span>
                              <span className="text-xs font-mono font-bold text-red-400">+3.5 Hrs</span>
                            </div>
                          </div>
                        </div>

                      </div>
                    )}

                    {/* Explicit linkage dropdown */}
                    {!selectedTask.completed && (
                      <div className="space-y-1 bg-[#0d1117] border border-[#30363D] p-3 rounded-lg">
                        <label className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block font-bold">
                          LINK PATHWAYS (HYPHAE STIMULATION)
                        </label>
                        <div className="flex gap-2">
                          <select
                            onChange={(e) => {
                              handleLinkTask(selectedTask.id, e.target.value);
                              e.target.value = "";
                            }}
                            className="flex-1 bg-[#161B22] border border-[#30363D] rounded px-2.5 py-1.5 text-[11px] text-slate-400 focus:outline-none"
                            defaultValue=""
                          >
                            <option value="" disabled>Link to another active node...</option>
                            {tasks
                              .filter((t) => t.id !== selectedTask.id && !t.completed && !selectedTask.connectedTo.includes(t.id))
                              .map((t) => (
                                <option key={t.id} value={t.id}>{t.title}</option>
                              ))}
                          </select>
                        </div>
                        {selectedTask.connectedTo.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {selectedTask.connectedTo.map((tid) => {
                              const target = tasks.find((t) => t.id === tid);
                              if (!target) return null;
                              return (
                                <span key={tid} className="text-[9px] font-mono bg-indigo-950/40 text-indigo-400 border border-indigo-800/40 px-2 py-0.5 rounded flex items-center gap-1">
                                  <Link2 className="w-2.5 h-2.5" />
                                  <span>{target.title}</span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const currentTasks = useMyceliumStore.getState().tasks;
                                      setTasks(currentTasks.map(t => t.id === selectedTask.id ? { ...t, connectedTo: t.connectedTo.filter((x) => x !== tid) } : t));
                                    }}
                                    className="hover:text-red-400 font-bold ml-1 text-[8px]"
                                  >
                                    ×
                                  </button>
                                </span>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-6 text-slate-500 text-xs italic font-sans border border-dashed border-[#30363D] rounded-lg">
                    Select a biological node on the grid to inspect temporal and physiological loam.
                  </div>
                )}
              </div>

              {/* AI Chief of Staff HUD Commander Panel */}
              <ChiefOfStaffHUD
                tasks={tasks}
                selectedTask={selectedTask}
                onAddTask={handleAddMycelialTask}
                onUpdateTask={handleUpdateMycelialTask}
                onAddMessage={handleAddChatMessageDirectly}
                onSelectTask={handleSelectTask}
              />

              {/* Dynamic Autonomous Risk assessment diagnostic */}
              <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-4 space-y-4 shadow-md">
                <div className="flex justify-between items-center border-b border-[#30363D] pb-2">
                  <h4 className="font-display font-semibold text-xs text-slate-300 uppercase flex items-center gap-1.5">
                    <span>7. Autonomous Risk Prediction</span>
                  </h4>
                  <button
                    onClick={handleRunDiagnostic}
                    disabled={isRunningDiagnostic}
                    className="text-[9px] font-mono text-indigo-400 bg-indigo-950/40 border border-indigo-900 px-2 py-1 rounded hover:bg-indigo-900/40 transition-colors cursor-pointer flex items-center gap-1"
                  >
                    {isRunningDiagnostic ? (
                      <RefreshCw className="w-3 h-3 animate-spin" />
                    ) : (
                      <Sparkles className="w-3 h-3" />
                    )}
                    <span>RUN DIAGNOSTIC</span>
                  </button>
                </div>

                {isRunningDiagnostic ? (
                  <div className="py-6 flex flex-col items-center justify-center text-xs text-slate-500 font-mono gap-2">
                    <RefreshCw className="w-5 h-5 text-indigo-400 animate-spin" />
                    <span>Analyzing node decay vectors...</span>
                  </div>
                ) : riskAnalysis ? (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center bg-red-950/15 border border-red-900/40 p-2.5 rounded-lg">
                      <span className="text-xs font-sans text-slate-300">Temporal Stress Index:</span>
                      <span className="text-xs font-mono font-bold text-red-400">
                        {riskAnalysis.overallRisk}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 font-sans leading-relaxed bg-[#0d1117] p-2.5 rounded border border-[#30363D]">
                      {riskAnalysis.assessment}
                    </p>

                    <div className="space-y-1">
                      <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">KEY BOTTLENECKS</span>
                      <ul className="text-[10px] text-slate-400 space-y-1 list-disc pl-4 font-sans">
                        {riskAnalysis.reasons.map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">ORGANIC MITIGATIONS</span>
                      <ul className="text-[10px] text-indigo-400 space-y-1 list-disc pl-4 font-sans font-medium">
                        {riskAnalysis.mitigations.map((m, i) => (
                          <li key={i}>{m}</li>
                        ))}
                      </ul>
                    </div>

                    {/* High Density Risk Bar Chart representation */}
                    <div className="pt-3 border-t border-[#30363D] space-y-1">
                      <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block font-bold">
                        NETWORK NODES THREAT ASSESSMENT
                      </span>
                      <div className="h-28 w-full mt-1.5">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={tasks.filter((t) => !t.completed).map((t) => ({
                              name: t.title.length > 15 ? t.title.substring(0, 15) + "..." : t.title,
                              risk: t.riskScore,
                            }))}
                            layout="vertical"
                            margin={{ top: 0, right: 10, left: 0, bottom: 0 }}
                          >
                            <XAxis type="number" domain={[0, 100]} hide />
                            <YAxis
                              dataKey="name"
                              type="category"
                              axisLine={false}
                              tickLine={false}
                              tick={{ fill: "#94a3b8", fontSize: 8, fontFamily: "monospace" }}
                              width={90}
                            />
                            <ReChartsTooltip
                              contentStyle={{ backgroundColor: "#0d1117", borderColor: "#30363D", borderRadius: "8px" }}
                              labelStyle={{ fontSize: 9, fontFamily: "monospace", color: "#6366f1" }}
                              itemStyle={{ fontSize: 10, color: "#fff" }}
                            />
                            <Bar dataKey="risk" fill="#ef4444" radius={[0, 4, 4, 0]} barSize={8} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-slate-500 text-xs italic font-sans border border-dashed border-[#30363D] rounded-lg">
                    Click "Run Diagnostic" to call Gemini and analyze total cognitive path strain.
                  </div>
                )}
              </div>

              {/* Add manual node cell form */}
              <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-4 space-y-3 shadow-md">
                <h4 className="font-display font-semibold text-xs text-slate-300 uppercase border-b border-[#30363D] pb-2">
                  Create Biological Node Manually
                </h4>
                <form onSubmit={handleCreateTaskManually} className="space-y-2.5">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Node Title..."
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="bg-[#0d1117] border border-[#30363D] rounded px-2.5 py-1.5 text-xs text-slate-200"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Deadline (e.g., 'in 2 hours')..."
                      value={newDeadline}
                      onChange={(e) => setNewDeadline(e.target.value)}
                      className="bg-[#0d1117] border border-[#30363D] rounded px-2.5 py-1.5 text-xs text-slate-200"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <select
                      value={newPriority}
                      onChange={(e: any) => setNewPriority(e.target.value)}
                      className="bg-[#0d1117] border border-[#30363D] rounded px-2.5 py-1.5 text-xs text-slate-400"
                    >
                      <option value="critical">Critical</option>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                    <select
                      value={newCategory}
                      onChange={(e: any) => setNewCategory(e.target.value)}
                      className="bg-[#0d1117] border border-[#30363D] rounded px-2.5 py-1.5 text-xs text-slate-400"
                    >
                      <option value="academic">Academic</option>
                      <option value="professional">Professional</option>
                      <option value="billing">Billing</option>
                      <option value="personal">Personal</option>
                    </select>
                    <button
                      type="submit"
                      className="bg-[#0d1117] border border-[#30363D] hover:border-indigo-500/50 text-white hover:text-indigo-400 rounded text-xs font-sans font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1 shadow"
                    >
                      <Plus className="w-3.5 h-3.5" /> ADD NODE
                    </button>
                  </div>
                </form>
              </div>

            </div>

          </div>
        )}

      </main>

      {/* GLOBAL FOOTER HUD */}
      <footer className="bg-[#161B22] border-t border-[#30363D] py-4 px-4 text-center text-slate-400 text-xs font-mono mt-8 shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-2">
            <Heart className="w-3.5 h-3.5 text-red-500 animate-pulse" />
            <span>Crafted for Hackathon Submission — Powered by Google Gemini 3.5</span>
          </div>
          <div className="flex gap-4 text-[11px]">
            <span className="text-indigo-400">● FIREBASE FIRE_ACTIVE</span>
            <span className="text-slate-500">VITE MIDDLEWARE INBOUND PORT: 3000</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
