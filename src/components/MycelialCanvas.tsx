import React, { useMemo, useState, useRef } from "react";
import { MycelialTask } from "../types";
import { Zap, AlertTriangle, CheckCircle2, ShieldAlert, X } from "lucide-react";

interface MycelialCanvasProps {
  tasks: MycelialTask[];
  selectedTaskId: string | null;
  onSelectTask: (id: string) => void;
  onToggleComplete: (id: string) => void;
  onUpdateProgress: (id: string, progress: number) => void;
  onNodeMove?: (id: string, gridX: number, gridY: number) => void;
  onDeleteTask?: (id: string) => void;
}

export const MycelialCanvas: React.FC<MycelialCanvasProps> = ({
  tasks,
  selectedTaskId,
  onSelectTask,
  onToggleComplete,
  onUpdateProgress,
  onNodeMove,
  onDeleteTask,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Local state for live responsive dragging position
  const [localDragPos, setLocalDragPos] = useState<{ id: string; gridX: number; gridY: number } | null>(null);

  // State to track drag operations
  const [dragState, setDragState] = useState<{
    taskId: string;
    startX: number;
    startY: number;
    initialGridX: number;
    initialGridY: number;
    hasMoved: boolean;
  } | null>(null);

  // State for long-press deletion
  const [nodeToDelete, setNodeToDelete] = useState<string | null>(null);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

  // Compute tasks to display, projecting currently dragged task position optimistically
  const displayTasks = useMemo(() => {
    if (!localDragPos) return tasks;
    return tasks.map((task) => {
      if (task.id === localDragPos.id) {
        return {
          ...task,
          gridX: localDragPos.gridX,
          gridY: localDragPos.gridY,
        };
      }
      return task;
    });
  }, [tasks, localDragPos]);

  // Generate hyphae connections using displayTasks coordinates
  const connections = useMemo(() => {
    const lines: { x1: number; y1: number; x2: number; y2: number; id: string; active: boolean }[] = [];
    const taskMap = new Map<string, MycelialTask>(displayTasks.map((t) => [t.id, t]));

    displayTasks.forEach((task) => {
      task.connectedTo.forEach((targetId) => {
        const target = taskMap.get(targetId);
        if (target) {
          const connectionId = [task.id, targetId].sort().join("-");
          if (!lines.some((l) => l.id === connectionId)) {
            lines.push({
              x1: task.gridX,
              y1: task.gridY,
              x2: target.gridX,
              y2: target.gridY,
              id: connectionId,
              active: !task.completed && !target.completed,
            });
          }
        }
      });

      if (task.connectedTo.length === 0 && displayTasks.length > 1) {
        let nearest: MycelialTask | null = null;
        let minDist = Infinity;

        displayTasks.forEach((other) => {
          if (other.id !== task.id) {
            const dx = other.gridX - task.gridX;
            const dy = other.gridY - task.gridY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < minDist) {
              minDist = dist;
              nearest = other;
            }
          }
        });

        if (nearest) {
          const target: MycelialTask = nearest;
          const connectionId = [task.id, target.id].sort().join("-");
          if (!lines.some((l) => l.id === connectionId)) {
            lines.push({
              x1: task.gridX,
              y1: task.gridY,
              x2: target.gridX,
              y2: target.gridY,
              id: connectionId,
              active: !task.completed && !target.completed,
            });
          }
        }
      }
    });

    return lines;
  }, [displayTasks]);

  // Drag handlers using Pointer Events for unified touch and mouse support
  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>, task: MycelialTask) => {
    e.stopPropagation();
    if (e.button !== 0) return; // only left click
    
    // Hide delete option if we click elsewhere
    if (nodeToDelete !== task.id) {
      setNodeToDelete(null);
    }
    
    e.currentTarget.setPointerCapture(e.pointerId);
    
    setDragState({
      taskId: task.id,
      startX: e.clientX,
      startY: e.clientY,
      initialGridX: task.gridX,
      initialGridY: task.gridY,
      hasMoved: false,
    });

    if (longPressTimer.current) clearTimeout(longPressTimer.current);
    longPressTimer.current = setTimeout(() => {
      setNodeToDelete(task.id);
    }, 3000);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!dragState) return;

    const dx = e.clientX - dragState.startX;
    const dy = e.clientY - dragState.startY;

    // Filter out micro-movements to avoid eating simple select clicks
    if (!dragState.hasMoved && Math.sqrt(dx * dx + dy * dy) < 4) {
      return;
    }

    if (!dragState.hasMoved) {
      setDragState((prev) => (prev ? { ...prev, hasMoved: true } : null));
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
        longPressTimer.current = null;
      }
    }

    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const gridDX = (dx / rect.width) * 100;
      const gridDY = (dy / rect.height) * 100;

      // Keep nodes slightly inset from edges for clean canvas framing
      const nextGridX = Math.max(4, Math.min(96, Math.round(dragState.initialGridX + gridDX)));
      const nextGridY = Math.max(12, Math.min(88, Math.round(dragState.initialGridY + gridDY)));

      setLocalDragPos({
        id: dragState.taskId,
        gridX: nextGridX,
        gridY: nextGridY,
      });
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }

    if (!dragState) return;
    e.currentTarget.releasePointerCapture(e.pointerId);

    if (dragState.hasMoved && localDragPos) {
      onNodeMove?.(dragState.taskId, localDragPos.gridX, localDragPos.gridY);
    } else {
      onSelectTask(dragState.taskId);
    }

    setDragState(null);
    setLocalDragPos(null);
  };

  const getNodeColor = (task: MycelialTask) => {
    if (task.completed) return "text-emerald-400 border-emerald-500/50 bg-emerald-950/25";
    if (task.riskScore >= 75) return "text-rose-400 border-rose-500/50 bg-rose-950/25 animate-pulse";
    if (task.riskScore >= 45) return "text-amber-400 border-amber-500/50 bg-amber-950/25";
    if (task.priority === "critical") return "text-indigo-400 border-indigo-500/50 bg-indigo-950/25";
    return "text-indigo-400 border-indigo-500/50 bg-indigo-950/25";
  };

  return (
    <div 
      className="relative w-full h-[380px] bg-[#161B22] border border-[#30363D] rounded-xl overflow-hidden shadow-2xl flex flex-col justify-between"
      onPointerDown={() => setNodeToDelete(null)}
    >
      {/* HUD Header */}
      <div className="absolute top-3 left-4 right-4 z-10 flex justify-between items-center pointer-events-none">
        <div className="flex items-center gap-2 bg-[#0d1117]/90 border border-[#30363D] px-3 py-1.5 rounded-md backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
          <span className="text-xs font-mono tracking-wider text-indigo-400 uppercase">Mycelial Node Grid</span>
        </div>
        <div className="text-[10px] font-mono text-slate-500 bg-[#0d1117]/90 border border-[#30363D] px-2 py-1 rounded">
          ACTIVE HYPHAE: {connections.length} | NODES: {tasks.length}
        </div>
      </div>

      {/* Grid Canvas */}
      <div ref={containerRef} className="relative w-full h-full">
        <svg className="w-full h-full absolute inset-0 pointer-events-none">
          <defs>
            {/* Background Dot Grid */}
            <pattern id="dot-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="#30363D" />
            </pattern>
            {/* Glowing lines filter */}
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Grid Fill */}
          <rect width="100%" height="100%" fill="url(#dot-pattern)" />

          {/* Hyphae Connections */}
          {connections.map((conn) => (
            <g key={conn.id}>
              {/* Glow filter underlay */}
              <line
                x1={`${conn.x1}%`}
                y1={`${conn.y1}%`}
                x2={`${conn.x2}%`}
                y2={`${conn.y2}%`}
                stroke={conn.active ? "#818cf8" : "#30363D"}
                strokeWidth="4"
                strokeOpacity={conn.active ? 0.15 : 0.1}
                filter="url(#glow)"
              />
              {/* Base line */}
              <line
                x1={`${conn.x1}%`}
                y1={`${conn.y1}%`}
                x2={`${conn.x2}%`}
                y2={`${conn.y2}%`}
                stroke={conn.active ? "#818cf8" : "#30363D"}
                strokeWidth={conn.active ? "1.5" : "1"}
                strokeOpacity={conn.active ? 0.45 : 0.3}
                strokeDasharray={conn.active ? "none" : "3,3"}
              />
              {/* Traveling nutrient signal (pulse bullet) */}
              {conn.active && (
                <circle r="2" fill="#818cf8" filter="url(#glow)">
                  <animateMotion
                    dur="3s"
                    repeatCount="indefinite"
                    path={`M ${conn.x1}% ${conn.y1}% L ${conn.x2}% ${conn.y2}%`}
                  />
                </circle>
              )}
            </g>
          ))}
        </svg>

        {/* Floating Interactive Node Cells */}
        {displayTasks.map((task) => {
          const colorClasses = getNodeColor(task);
          const isSelected = task.id === selectedTaskId;
          const isCurrentlyDragging = dragState?.taskId === task.id;
          
          return (
            <button
              key={task.id}
              onPointerDown={(e) => handlePointerDown(e, task)}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              style={{ left: `${task.gridX}%`, top: `${task.gridY}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 p-2.5 rounded-full border-2 transition-all duration-300 backdrop-blur-sm z-10 flex items-center justify-center group touch-none ${colorClasses} ${
                isSelected ? "scale-125 ring-2 ring-indigo-400 border-white z-20" : "hover:scale-110"
              } ${isCurrentlyDragging ? "cursor-grabbing" : "cursor-grab"}`}
            >
              <div className="absolute inset-0 rounded-full bg-current opacity-10 group-hover:opacity-20 transition-opacity"></div>
              
              {/* Inner symbol based on status */}
              {task.completed ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              ) : task.riskScore >= 75 ? (
                <ShieldAlert className="w-5 h-5 text-rose-400 animate-bounce" />
              ) : task.riskScore >= 45 ? (
                <AlertTriangle className="w-5 h-5 text-amber-400" />
              ) : (
                <Zap className="w-5 h-5 text-indigo-400" />
              )}

              {/* Delete Cross Overlay */}
              {nodeToDelete === task.id && (
                <div
                  className="absolute -top-3 -right-3 bg-rose-600 rounded-full p-1 border border-rose-900 cursor-pointer z-50 hover:bg-rose-500 hover:scale-110 transition-transform shadow-lg animate-in zoom-in"
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    if (longPressTimer.current) clearTimeout(longPressTimer.current);
                    onDeleteTask?.(task.id);
                    setNodeToDelete(null);
                  }}
                >
                  <X className="w-4 h-4 text-white" />
                </div>
              )}

              {/* Hover Tooltip / HUD label - Hidden during active dragging for visibility */}
              {!isCurrentlyDragging && (
                <div className="absolute top-10 scale-0 group-hover:scale-100 transition-transform duration-200 origin-top bg-slate-900 border border-slate-700 text-white text-[11px] font-sans font-medium rounded-md px-2.5 py-1.5 shadow-xl w-48 text-center pointer-events-none z-30">
                  <p className="font-semibold truncate">{task.title}</p>
                  <div className="flex justify-between items-center mt-1 text-[9px] text-slate-400 font-mono">
                    <span>Risk: {task.riskScore}%</span>
                    <span>{task.deadline}</span>
                  </div>
                </div>
              )}

              {/* Glowing aura for selected/risk */}
              {isSelected && (
                <span className="absolute inset-[-6px] rounded-full border border-indigo-400 opacity-60 animate-ping"></span>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend / Status Overlay */}
      <div className="bg-[#161B22]/95 border-t border-[#30363D] p-3 text-[11px] font-sans text-slate-400 flex flex-wrap gap-4 items-center justify-between z-10 backdrop-blur">
        <div className="flex gap-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse border border-rose-400"></span>
            <span>Decaying Node (&gt;75% Risk)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 border border-amber-400"></span>
            <span>Unstable (45-75% Risk)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 border border-indigo-400"></span>
            <span>Nutritional Node (Safe)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-emerald-400"></span>
            <span>Assimilated (Completed)</span>
          </div>
        </div>
        <div className="text-[10px] text-slate-500">
          *Drag nodes to rearrange. Risk slowly rises as deadlines draw closer.
        </div>
      </div>
    </div>
  );
};
