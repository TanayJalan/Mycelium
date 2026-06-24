import React from "react";
import { EcosystemTask } from "../types";
import { MapPin, Navigation, Droplets, Leaf, Trash2, Sprout, AlertCircle } from "lucide-react";

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
        return "border-orange-500 bg-orange-950/20 text-orange-400 hover:bg-orange-950/45";
      case "soil":
        return "border-blue-500 bg-blue-950/20 text-blue-400 hover:bg-blue-950/45";
      case "biodiversity":
        return "border-purple-500 bg-purple-950/20 text-purple-400 hover:bg-purple-950/45";
      case "carbon":
        return "border-emerald-500 bg-emerald-950/20 text-emerald-400 hover:bg-emerald-950/45";
      default:
        return "border-slate-500 bg-slate-950/20 text-slate-400";
    }
  };

  return (
    <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-4 flex flex-col md:flex-row gap-5 shadow-2xl">
      {/* Grid Map Canvas */}
      <div className="flex-1 h-[280px] bg-[#0d1117] border border-[#30363D] rounded-lg overflow-hidden relative shadow-inner">
        {/* Background Grid Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px]" />

        {/* Outer Boundary Map Simulation */}
        <svg className="w-full h-full absolute inset-0">
          {/* Main Transit Path Vector Line */}
          <path
            d="M 50,220 C 120,200 150,120 280,100"
            fill="none"
            stroke="#30363D"
            strokeWidth="3"
            strokeDasharray="4,4"
          />
          <path
            d="M 50,220 C 120,200 150,120 280,100"
            fill="none"
            stroke="#818cf8"
            strokeWidth="1.5"
            strokeOpacity="0.4"
          />

          {/* User Starting Node */}
          <circle cx="50" cy="220" r="5" fill="#38bdf8" />
          <circle cx="50" cy="220" r="10" fill="none" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.5" className="animate-ping" />

          {/* Destination Deadline Target */}
          <circle cx="280" cy="100" r="6" fill="#f43f5e" />
          <circle cx="280" cy="100" r="12" fill="none" stroke="#f43f5e" strokeWidth="1" strokeOpacity="0.6" />
        </svg>

        {/* User start label */}
        <div className="absolute left-[20px] top-[230px] bg-[#161B22] border border-[#30363D] rounded px-1.5 py-0.5 text-[8px] font-mono text-cyan-400">
          YOUR GPS (START)
        </div>

        {/* Target deadline label */}
        <div className="absolute left-[220px] top-[60px] bg-[#161B22] border border-rose-950/60 rounded px-1.5 py-0.5 text-[8px] font-mono text-rose-400 flex items-center gap-1">
          <MapPin className="w-2.5 h-2.5" /> DEADLINE TARGET
        </div>

        {/* Interactive Ecosystem Task Pins on Map */}
        {tasks.map((task) => {
          if (task.status === "logged") return null;
          return (
            <button
              key={task.id}
              onClick={() => onLogTask(task.id)}
              className={`absolute p-1.5 rounded-full border transition-all hover:scale-125 cursor-pointer flex items-center justify-center ${getTaskColorClass(
                task.type
              )}`}
              style={{ left: `${task.gridX}%`, top: `${task.gridY}%` }}
              title={task.name}
            >
              <div className="absolute inset-[-4px] rounded-full border border-current opacity-30 animate-pulse"></div>
              {getTaskIcon(task.type, "w-3.5 h-3.5")}
            </button>
          );
        })}

        {/* Overlay HUD stats */}
        <div className="absolute bottom-2 left-2 bg-[#0d1117]/90 border border-[#30363D] backdrop-blur rounded px-2.5 py-1 text-[9px] font-mono text-slate-400">
          ROUTING: <span className="text-indigo-400">BIOPHILIC OPTIMIZATION ON</span>
        </div>
      </div>

      {/* Control / Legend sidebar */}
      <div className="w-full md:w-[280px] flex flex-col justify-between">
        <div className="space-y-2">
          <div className="flex justify-between items-center bg-[#0d1117] border border-[#30363D] p-2.5 rounded-lg shadow-sm">
            <span className="text-xs font-semibold text-slate-300">Mycelium Vitality Score</span>
            <span className="text-sm font-mono font-bold text-indigo-400 bg-indigo-950/50 px-2 py-0.5 rounded border border-indigo-900/40">
              +{vitalityPoints} VP
            </span>
          </div>

          <p className="text-[10px] text-slate-400 leading-relaxed bg-[#0d1117]/40 border border-[#30363D] p-2 rounded">
            Completing physical environmental tasks along your walking route directly feeds carbon offsets, logging crowdsourced ecosystem metrics and boosting focus health.
          </p>

          <span className="text-[9px] font-mono tracking-widest text-slate-500 uppercase block mt-3 mb-1">
            AVAILABLE LOCAL LOGS
          </span>

          <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
            {tasks.filter((t) => t.status === "available").length === 0 ? (
              <div className="text-[10px] text-slate-500 italic p-3 text-center border border-[#30363D] rounded-lg">
                All local ecosystem coordinates synced!
              </div>
            ) : (
              tasks
                .filter((t) => t.status === "available")
                .map((task) => (
                  <button
                    key={task.id}
                    onClick={() => onLogTask(task.id)}
                    className={`w-full text-left p-2 rounded-lg border transition-all flex items-center justify-between text-[11px] font-sans hover:scale-[1.02] cursor-pointer ${getTaskColorClass(
                      task.type
                    )}`}
                  >
                    <div className="flex items-center gap-2">
                      {getTaskIcon(task.type, "w-4 h-4")}
                      <div>
                        <span className="font-semibold block text-slate-200">{task.name}</span>
                        <span className="text-[9px] text-slate-400 font-sans block leading-none">
                          {task.description}
                        </span>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-[9px] bg-[#0d1117] border border-[#30363D] px-1.5 py-0.5 rounded">
                      +{task.vitalityPoints} VP
                    </span>
                  </button>
                ))
            )}
          </div>
        </div>

        <div className="mt-3 text-[9px] text-slate-500 font-mono flex items-center gap-1 justify-center bg-[#0d1117] py-1.5 px-2 rounded border border-[#30363D]">
          <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
          <span>Tap coordinates or logs above to simulate physical checks.</span>
        </div>
      </div>
    </div>
  );
};
