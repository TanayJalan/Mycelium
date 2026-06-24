import React, { useState, useRef, useEffect } from "react";
import { ChatMessage, AIAgent } from "../types";
import { Send, Bot, ShieldAlert, HeartPulse, Compass, BrainCircuit, RefreshCw } from "lucide-react";

interface AgentHubProps {
  messages: ChatMessage[];
  onSendMessage: (content: string) => void;
  selectedAgent: "planner" | "accountability" | "focus" | "ecosystem";
  onChangeAgent: (agent: "planner" | "accountability" | "focus" | "ecosystem") => void;
  isSending: boolean;
}

export const AGENTS: AIAgent[] = [
  {
    id: "planner",
    name: "The Spore",
    title: "PLANNER AGENT",
    role: "Autonomous Scheduler & Temporal Navigator",
    phrase: "Let's align your hyphae and distribute cognitive nutrition.",
    description: "Ingests syllabus PDFs, emails, Slack logs. Predicts bottleneck overlaps and maps micro-milestones to balance daily energy reserves.",
    glowColor: "rgba(34, 197, 94, 0.2)",
    accentClass: "border-emerald-500/50 text-emerald-400 bg-emerald-950/20 hover:bg-emerald-950/30",
  },
  {
    id: "accountability",
    name: "The Shroom",
    title: "ACCOUNTABILITY AGENT",
    role: "High-Response Motivational Sentinel",
    phrase: "I've locked your socials. If you touch them, you face the network spore-shame.",
    description: "Highly aggressive, empathetic, and hilarious. Uses progressive checks, SMS pings, and co-worker 'shroom networks' to ensure compliance.",
    glowColor: "rgba(168, 85, 247, 0.2)",
    accentClass: "border-purple-500/50 text-purple-400 bg-purple-950/20 hover:bg-purple-950/30",
  },
  {
    id: "focus",
    name: "Myco-Field",
    title: "FOCUS AGENT",
    role: "Deep-Brain Botanical Audio Synthesizer",
    phrase: "Quiet your mind. Descend into the cool loam. Ground your neural frequency.",
    description: "Acts as your environmental cocoon. Synthesizes low-frequency soil-sync soundscapes and guides sensory deprivation breathing loops.",
    glowColor: "rgba(6, 182, 212, 0.2)",
    accentClass: "border-cyan-500/50 text-cyan-400 bg-cyan-950/20 hover:bg-cyan-950/30",
  },
  {
    id: "ecosystem",
    name: "Bio-Bridge",
    title: "ECOSYSTEM AGENT",
    role: "Real-World Urban Ecology Coordinator",
    phrase: "Commuting to that deadline? Log soil pH along the trail to offset stress.",
    description: "Bridges digital task accomplishment with real-world physical biodiversity and crowdsourced ecosystem health monitoring.",
    glowColor: "rgba(234, 88, 12, 0.2)",
    accentClass: "border-orange-500/50 text-orange-400 bg-orange-950/20 hover:bg-orange-950/30",
  },
];

export const AgentHub: React.FC<AgentHubProps> = ({
  messages,
  onSendMessage,
  selectedAgent,
  onChangeAgent,
  isSending,
}) => {
  const [input, setInput] = useState("");
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const activeAgent = AGENTS.find((a) => a.id === selectedAgent) || AGENTS[0];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSending) return;
    onSendMessage(input.trim());
    setInput("");
  };

  const handleSuggestion = (text: string) => {
    onSendMessage(text);
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isSending]);

  // Specific agent icon rendering
  const renderAgentIcon = (id: string, className = "w-5 h-5") => {
    switch (id) {
      case "planner":
        return <BrainCircuit className={className} />;
      case "accountability":
        return <ShieldAlert className={className} />;
      case "focus":
        return <HeartPulse className={className} />;
      case "ecosystem":
        return <Compass className={className} />;
      default:
        return <Bot className={className} />;
    }
  };

  // Predefined suggestion questions for the agent modes
  const suggestions = {
    planner: [
      "Optimize my neural task grid. Where are my bottlenecks?",
      "Parse this unstructured text to add tasks: 'Have chem exam friday and bill due tomorrow.'",
      "Draft a bio-balanced milestone plan for the hackathon submission.",
    ],
    accountability: [
      "I'm feeling lazy and want to scroll TikTok. Stop me!",
      "I just missed a milestone deadline. What are my consequences?",
      "Unlock accountability network: match me with another spore.",
    ],
    focus: [
      "Guide me through a 4-7-8 loam-sync breathing cycle.",
      "Activate biological focus soundscapes to filter noise.",
      "How does cellular focus help prevent executive dysfunction?",
    ],
    ecosystem: [
      "How do my task points help offset local emissions?",
      "Map real-world urban crowdsourcing tasks along my walk to the library.",
      "Explain the connection between human productivity and forest mycelium.",
    ],
  }[selectedAgent];

  return (
    <div className="flex flex-col h-[520px] bg-[#161B22] border border-[#30363D] rounded-xl overflow-hidden shadow-2xl">
      {/* Agent Select Matrix */}
      <div className="grid grid-cols-4 border-b border-[#30363D] bg-[#0d1117]">
        {AGENTS.map((agent) => {
          const isSelected = agent.id === selectedAgent;
          return (
            <button
              key={agent.id}
              onClick={() => onChangeAgent(agent.id)}
              className={`py-3.5 px-1 flex flex-col items-center justify-center border-r last:border-r-0 border-[#30363D] transition-all relative ${
                isSelected
                  ? "bg-[#161B22] text-white"
                  : "text-slate-500 hover:text-slate-300 hover:bg-[#0d1117]"
              }`}
            >
              {isSelected && (
                <div
                  className="absolute bottom-0 left-0 right-0 h-1 transition-all"
                  style={{ backgroundColor: activeAgent.accentClass.includes("text-emerald") ? "#10b981" : activeAgent.accentClass.includes("text-purple") ? "#a855f7" : activeAgent.accentClass.includes("text-cyan") ? "#06b6d4" : "#ea580c" }}
                />
              )}
              {renderAgentIcon(agent.id, `w-5 h-5 mb-1 ${isSelected ? activeAgent.accentClass.split(" ")[1] : "text-slate-500"}`)}
              <span className="text-[10px] font-sans font-semibold tracking-wider uppercase block text-center truncate w-full px-1">
                {agent.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Agent Briefing HUD */}
      <div
        className="p-3 border-b border-[#30363D] transition-colors flex items-start gap-3 bg-[#161B22]"
        style={{ boxShadow: `inset 0 4px 20px -2px ${activeAgent.glowColor}` }}
      >
        <div className={`p-2 rounded-lg border ${activeAgent.accentClass.split(" ")[0]} ${activeAgent.accentClass.split(" ")[1]} bg-slate-900/40`}>
          {renderAgentIcon(selectedAgent, "w-6 h-6")}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase block">
              SYMBIOTE: {activeAgent.title}
            </span>
            <span className="text-[9px] font-mono text-indigo-400 bg-indigo-950/40 border border-indigo-900 px-1.5 py-0.5 rounded animate-pulse">
              ● PROACTIVE SENSING
            </span>
          </div>
          <h4 className="text-sm font-display font-medium text-white">{activeAgent.role}</h4>
          <p className="text-xs text-slate-400 mt-1 italic font-sans">
            &ldquo;{activeAgent.phrase}&rdquo;
          </p>
        </div>
      </div>

      {/* Chat Display */}
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0d1117]">
        {messages.map((msg) => {
          const isAI = msg.role === "assistant";
          return (
            <div key={msg.id} className={`flex ${isAI ? "justify-start" : "justify-end"}`}>
              <div className={`max-w-[85%] rounded-xl px-4 py-3 text-xs leading-relaxed ${
                isAI
                  ? "bg-[#161B22] border border-[#30363D] text-slate-100"
                  : "bg-indigo-950/40 border border-indigo-900/60 text-indigo-100"
              }`}>
                {isAI && (
                  <div className="flex items-center gap-1.5 mb-1.5 pb-1 border-b border-[#30363D]">
                    {renderAgentIcon(selectedAgent, `w-3.5 h-3.5 ${activeAgent.accentClass.split(" ")[1]}`)}
                    <span className="font-display font-semibold text-[10px] tracking-wider uppercase text-slate-300">
                      {activeAgent.name}
                    </span>
                  </div>
                )}
                <div className="whitespace-pre-line font-sans">{msg.content}</div>
                <div className="text-[8px] text-right text-slate-500 mt-1 font-mono">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          );
        })}
        {isSending && (
          <div className="flex justify-start">
            <div className="bg-[#161B22] border border-[#30363D] rounded-xl px-4 py-3 flex items-center gap-2 text-xs text-slate-400">
              <RefreshCw className="w-4 h-4 text-indigo-400 animate-spin" />
              <span className="font-mono">Synthesizing neural spores...</span>
            </div>
          </div>
        )}
      </div>

      {/* Suggestion Chips */}
      <div className="px-4 py-2 border-t border-[#30363D] bg-[#161B22]/95 overflow-x-auto flex gap-2 whitespace-nowrap scrollbar-none">
        {suggestions.map((suggestion, idx) => (
          <button
            key={idx}
            onClick={() => handleSuggestion(suggestion)}
            className="text-[10px] font-sans border border-[#30363D] hover:border-indigo-500/40 hover:bg-[#0d1117] text-slate-400 hover:text-white px-2.5 py-1.5 rounded-lg transition-all cursor-pointer"
          >
            {suggestion.length > 55 ? suggestion.substring(0, 52) + "..." : suggestion}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="p-3 bg-[#0d1117] border-t border-[#30363D] flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Coordinate with ${activeAgent.name}...`}
          disabled={isSending}
          className="flex-1 bg-[#0d1117] border border-[#30363D] rounded-lg px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 font-sans"
        />
        <button
          type="submit"
          disabled={!input.trim() || isSending}
          className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-[#30363D] disabled:text-slate-500 text-white rounded-lg px-3.5 flex items-center justify-center transition-all cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
