import React from "react";
import { EcosystemTask } from "../types";
import { MapPin, Droplets, Leaf, Trash2, Sprout, AlertCircle, Activity, CheckCircle2 } from "lucide-react";

interface EcosystemMapProps {
  tasks: EcosystemTask[];
  onLogTask: (id: string) => void;
  vitalityPoints: number;
}

export const EcosystemMap: React.FC<EcosystemMapProps> = ({
  tasks,
  onLogTask,
  vitalityPoints,
}) => {
  // Helper to choose coordinate icon
  const getTaskIcon = (type: string, className = "w-4 h-4") => {
    switch (type) {
      case "trash":
        return <Trash2 className={`${className} text-orange-400`} />;
      case "soil":
        return <Droplets className={`${className} text-blue-400`} />;
      case "biodiversity":
        return <Sprout className={`${className} text-purple-400`} />;
      case "carbon":
        return <Leaf className={`${className} text-emerald-400`} />;
      default:
        return <Leaf className={`${className} text-slate-400`} />;
    }
  };

  const getTaskColorClass = (type: string) => {
    switch (type) {
      case "trash":
        return "border-orange-500/50 bg-orange-950/30 text-orange-400 hover:border-orange-400 shadow-[0_0_10px_rgba(249,115,22,0.1)] hover:shadow-[0_0_15px_rgba(249,115,22,0.3)]";
      case "soil":
        return "border-blue-500/50 bg-blue-950/30 text-blue-400 hover:border-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.1)] hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]";
      case "biodiversity":
        return "border-purple-500/50 bg-purple-950/30 text-purple-400 hover:border-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.1)] hover:shadow-[0_0_15px_rgba(168,85,247,0.3)]";
      case "carbon":
        return "border-emerald-500/50 bg-emerald-950/30 text-emerald-400 hover:border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.1)] hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]";
      default:
        return "border-slate-500/50 bg-slate-950/30 text-slate-400 hover:border-slate-400";
    }
  };

  const getTaskGradient = (type: string) => {
    switch (type) {
      case "trash": return "hover:bg-gradient-to-r hover:from-orange-950/40 hover:to-[#0d1117]";
      case "soil": return "hover:bg-gradient-to-r hover:from-blue-950/40 hover:to-[#0d1117]";
      case "biodiversity": return "hover:bg-gradient-to-r hover:from-purple-950/40 hover:to-[#0d1117]";
      case "carbon": return "hover:bg-gradient-to-r hover:from-emerald-950/40 hover:to-[#0d1117]";
      default: return "hover:bg-slate-900";
    }
  };

  return (
    <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-4 flex flex-col md:flex-row gap-5 shadow-2xl relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-[-50%] left-[-10%] w-[60%] h-[150%] bg-indigo-900/10 blur-[100px] pointer-events-none rounded-full" />

      {/* Grid Map Canvas */}
      <div className="w-full md:flex-1 h-[320px] shrink-0 bg-[#0d1117] border border-[#30363D] rounded-xl overflow-hidden relative shadow-[inset_0_0_40px_rgba(0,0,0,0.8)] group">
        
        {/* Radar Scanner Sweep Animation */}
        <div className="absolute inset-0 bg-[conic-gradient(from_90deg_at_50%_50%,rgba(99,102,241,0)_0%,rgba(99,102,241,0.05)_80%,rgba(99,102,241,0.15)_100%)] opacity-30 animate-[spin_4s_linear_infinite]" />
        
        {/* Background Grid Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(to_right,#818cf8_1px,transparent_1px),linear-gradient(to_bottom,#818cf8_1px,transparent_1px)] bg-[size:20px_20px]" />

        {/* Outer Boundary Map Simulation */}
        <svg className="w-full h-full absolute inset-0 z-10" viewBox="0 0 400 320" preserveAspectRatio="none">
          <defs>
            <filter id="glow-heavy" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <linearGradient id="route-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#f43f5e" />
            </linearGradient>
          </defs>

          {/* Flowing Transit Path Vector Line */}
          <path
            d="M 50,260 C 120,240 180,120 340,80"
            fill="none"
            stroke="url(#route-gradient)"
            strokeWidth="2.5"
            strokeOpacity="0.6"
            strokeDasharray="6,8"
          >
            <animate attributeName="stroke-dashoffset" from="28" to="0" dur="1s" repeatCount="indefinite" />
          </path>
          
          {/* Solid subtle backdrop line */}
          <path
            d="M 50,260 C 120,240 180,120 340,80"
            fill="none"
            stroke="#818cf8"
            strokeWidth="1"
            strokeOpacity="0.2"
          />

          {/* Traveling Blip simulating the user */}
          <circle r="3" fill="#fff" filter="url(#glow-heavy)">
            <animateMotion dur="6s" repeatCount="indefinite" path="M 50,260 C 120,240 180,120 340,80" />
          </circle>

          {/* User Starting Node */}
          <g transform="translate(50, 260)">
            <circle r="6" fill="#38bdf8" filter="url(#glow-heavy)" />
            <circle r="12" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeOpacity="0.6">
              <animate attributeName="r" from="6" to="24" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" from="0.8" to="0" dur="2s" repeatCount="indefinite" />
            </circle>
          </g>

          {/* Destination Deadline Target */}
          <g transform="translate(340, 80)">
            <circle r="7" fill="#f43f5e" filter="url(#glow-heavy)" />
            <circle r="14" fill="none" stroke="#f43f5e" strokeWidth="1.5" strokeOpacity="0.8" className="animate-pulse" />
          </g>
        </svg>

        {/* User start label */}
        <div className="absolute left-[20px] bottom-[20px] bg-sky-950/80 border border-sky-800/60 backdrop-blur-md rounded px-2 py-1 text-[9px] font-mono font-bold text-sky-400 z-20 shadow-lg">
          GPS START / ORIGIN
        </div>

        {/* Target deadline label */}
        <div className="absolute right-[20px] top-[20px] bg-rose-950/80 border border-rose-800/60 backdrop-blur-md rounded px-2 py-1 text-[9px] font-mono font-bold text-rose-400 flex items-center gap-1.5 z-20 shadow-lg">
          <MapPin className="w-3 h-3 animate-bounce" /> DEADLINE TARGET
        </div>

        {/* Interactive Ecosystem Task Pins on Map */}
        {tasks.map((task) => {
          if (task.status === "logged") return null;
          return (
            <div
              key={task.id}
              className="absolute z-30 group/pin"
              style={{ left: `${task.gridX}%`, top: `${task.gridY}%`, transform: 'translate(-50%, -50%)' }}
            >
              <button
                onClick={() => onLogTask(task.id)}
                className={`p-2 rounded-full border transition-all duration-300 transform group-hover/pin:scale-125 cursor-pointer flex items-center justify-center backdrop-blur-md ${getTaskColorClass(task.type)}`}
              >
                {getTaskIcon(task.type, "w-4 h-4")}
              </button>
              
              {/* Beautiful Holographic Tooltip */}
              <div className="absolute top-8 left-1/2 -translate-x-1/2 w-max max-w-[160px] opacity-0 group-hover/pin:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="bg-slate-900/95 border border-slate-700/60 shadow-xl rounded-lg p-2 backdrop-blur-xl">
                  <p className="text-[10px] font-bold text-white leading-tight">{task.name}</p>
                  <p className="text-[9px] font-mono text-indigo-300 mt-1">+{task.vitalityPoints} VP</p>
                </div>
              </div>
            </div>
          );
        })}

        {/* Overlay HUD stats */}
        <div className="absolute bottom-3 right-3 bg-[#0d1117]/90 border border-indigo-900/40 backdrop-blur-md shadow-lg rounded-md px-3 py-1.5 text-[10px] font-mono text-slate-400 z-20 flex items-center gap-2">
          <Activity className="w-3 h-3 text-indigo-400 animate-pulse" />
          ROUTING: <span className="text-indigo-400 font-bold">BIOPHILIC OPTIMIZATION</span>
        </div>
      </div>

      {/* Control / Legend sidebar */}
      <div className="w-full md:w-[320px] flex flex-col justify-between z-10">
        <div className="space-y-3">
          
          {/* High-tech Score Box */}
          <div className="flex justify-between items-center bg-gradient-to-br from-[#0d1117] to-[#161B22] border border-[#30363D] p-3 rounded-xl shadow-[inset_0_2px_10px_rgba(255,255,255,0.02)] relative overflow-hidden group">
            <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="text-xs font-display font-bold text-slate-300">Mycelial Vitality</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono font-bold text-indigo-300 bg-indigo-950/60 px-2.5 py-1 rounded-md border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                {vitalityPoints.toLocaleString()} VP
              </span>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed bg-[#0d1117]/60 border border-[#30363D]/60 p-3 rounded-lg shadow-sm">
            Complete physical tasks along your commute to feed carbon offsets, log crowdsourced ecosystem metrics, and restore biological focus.
          </p>

          <div className="flex items-center justify-between mt-4 mb-2">
            <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase font-bold">
              AVAILABLE LOGS
            </span>
            <span className="text-[10px] font-mono text-indigo-400 bg-indigo-950/30 px-1.5 py-0.5 rounded">
              {tasks.filter((t) => t.status === "available").length} PENDING
            </span>
          </div>

          <div className="space-y-2 max-h-[170px] overflow-y-auto pr-2 custom-scrollbar">
            {tasks.filter((t) => t.status === "available").length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 text-slate-500 p-6 border border-dashed border-[#30363D] rounded-xl bg-[#0d1117]/30">
                <CheckCircle2 className="w-6 h-6 text-emerald-500/50" />
                <span className="text-[11px] italic font-sans text-center">All local ecosystem coordinates synced. Network saturated.</span>
              </div>
            ) : (
              tasks
                .filter((t) => t.status === "available")
                .map((task) => (
                  <button
                    key={task.id}
                    onClick={() => onLogTask(task.id)}
                    className={`w-full text-left p-3 rounded-xl border border-[#30363D] bg-[#0d1117] transition-all duration-300 flex items-center justify-between hover:-translate-y-0.5 active:scale-95 cursor-pointer group ${getTaskGradient(task.type)} shadow-sm hover:shadow-md`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg border bg-opacity-20 ${getTaskColorClass(task.type).split('hover:')[0]}`}>
                        {getTaskIcon(task.type, "w-4 h-4")}
                      </div>
                      <div>
                        <span className="font-bold block text-slate-200 text-xs mb-0.5">{task.name}</span>
                        <span className="text-[10px] text-slate-500 font-sans block leading-snug line-clamp-2">
                          {task.description}
                        </span>
                      </div>
                    </div>
                    <span className="shrink-0 font-mono font-bold text-[10px] text-slate-300 bg-[#161B22] border border-[#30363D] px-2 py-1 rounded-md group-hover:border-indigo-500/50 group-hover:text-indigo-300 transition-colors">
                      +{task.vitalityPoints}
                    </span>
                  </button>
                ))
            )}
          </div>
        </div>

        <div className="mt-4 text-[10px] text-slate-500 font-mono flex items-center gap-1.5 justify-center bg-[#0d1117] py-2 px-3 rounded-lg border border-[#30363D] shadow-inner">
          <AlertCircle className="w-3.5 h-3.5 text-indigo-500/70" />
          <span>Tap logs to execute physical simulation.</span>
        </div>
      </div>
    </div>
  );
};
