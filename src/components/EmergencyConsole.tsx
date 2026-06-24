import React, { useState, useEffect, useRef } from "react";
import { MycelialTask } from "../types";
import { AlertTriangle, Volume2, ShieldCheck, Moon, VolumeX, EyeOff, RefreshCw } from "lucide-react";

interface EmergencyConsoleProps {
  task: MycelialTask;
  onDefuse: (id: string) => void;
  onExit: () => void;
  initialSeconds?: number;
}

export const EmergencyConsole: React.FC<EmergencyConsoleProps> = ({
  task,
  onDefuse,
  onExit,
  initialSeconds = 1500,
}) => {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds); // custom concentration block length
  const [isActive, setIsActive] = useState(true);
  const [soundOn, setSoundOn] = useState(false);
  const [isHidingDistractions, setIsHidingDistractions] = useState(true);

  // Web Audio refs for synthesizing Binaural Loam Waves (Theta beats)
  const audioContextRef = useRef<AudioContext | null>(null);
  const leftOscRef = useRef<OscillatorNode | null>(null);
  const rightOscRef = useRef<OscillatorNode | null>(null);
  const subOscRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const startAudio = () => {
    try {
      if (audioContextRef.current) return; // Audio is already playing

      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;

      const ctx = new AudioContextClass();
      audioContextRef.current = ctx;

      // Base carrier frequency of 110Hz (A2) + 4.5Hz delta for theta-wave (114.5Hz on right)
      const leftOsc = ctx.createOscillator();
      const rightOsc = ctx.createOscillator();
      leftOsc.frequency.value = 110;
      rightOsc.frequency.value = 114.5;
      leftOsc.type = "sine";
      rightOsc.type = "sine";

      leftOscRef.current = leftOsc;
      rightOscRef.current = rightOsc;

      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 1.5); // 1.5s fade-in
      gainNodeRef.current = gainNode;

      // Stereo Panning for Binaural Effect
      if (ctx.createStereoPanner) {
        const leftPanner = ctx.createStereoPanner();
        leftPanner.pan.value = -1;
        const rightPanner = ctx.createStereoPanner();
        rightPanner.pan.value = 1;

        leftOsc.connect(leftPanner);
        leftPanner.connect(gainNode);

        rightOsc.connect(rightPanner);
        rightPanner.connect(gainNode);
      } else {
        // Fallback to merge
        leftOsc.connect(gainNode);
        rightOsc.connect(gainNode);
      }

      // Add a low-frequency hum (55Hz sub-harmonic) in the center to represent "deep soil connection" (the loam wave)
      const subOsc = ctx.createOscillator();
      subOsc.frequency.value = 55;
      subOsc.type = "sine";
      const subGain = ctx.createGain();
      subGain.gain.setValueAtTime(0.03, ctx.currentTime);
      
      subOsc.connect(subGain);
      subGain.connect(gainNode);
      subOscRef.current = subOsc;

      gainNode.connect(ctx.destination);

      leftOsc.start();
      rightOsc.start();
      subOsc.start();
    } catch (err) {
      console.error("Web Audio API failed to start:", err);
    }
  };

  const stopAudio = () => {
    if (audioContextRef.current) {
      const ctx = audioContextRef.current;
      const gainNode = gainNodeRef.current;
      if (gainNode && ctx) {
        try {
          gainNode.gain.setValueAtTime(gainNode.gain.value, ctx.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3); // 300ms fade-out
        } catch (e) {}
      }

      setTimeout(() => {
        try {
          if (leftOscRef.current) {
            leftOscRef.current.stop();
            leftOscRef.current.disconnect();
            leftOscRef.current = null;
          }
          if (rightOscRef.current) {
            rightOscRef.current.stop();
            rightOscRef.current.disconnect();
            rightOscRef.current = null;
          }
          if (subOscRef.current) {
            subOscRef.current.stop();
            subOscRef.current.disconnect();
            subOscRef.current = null;
          }
          if (audioContextRef.current) {
            audioContextRef.current.close();
            audioContextRef.current = null;
          }
        } catch (e) {}
      }, 350);
    }
  };

  useEffect(() => {
    if (isActive && soundOn) {
      startAudio();
    } else {
      stopAudio();
    }
    return () => {
      stopAudio();
    };
  }, [isActive, soundOn]);

  useEffect(() => {
    let interval: any = null;
    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, secondsLeft]);

  // Format countdown
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed inset-0 bg-[#0A0C10] z-50 overflow-y-auto flex flex-col justify-between items-center p-4 md:p-8 animate-pulse-glow">
      {/* Absolute top warning status lines */}
      <div className="w-full max-w-4xl flex items-center justify-between border-b border-[#30363D] pb-4">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 text-red-500 animate-bounce" />
          <div>
            <span className="text-[10px] font-mono tracking-widest text-red-500 uppercase block font-bold">
              SYSTEM OVERRIDE: EMERGENCY DECAY CONTROL
            </span>
            <h2 className="text-sm font-display font-bold text-white uppercase tracking-wider">
              Tunneling Focus: Single Node Isolation
            </h2>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-mono text-slate-500 block uppercase">NODE DECAY INDEX</span>
          <span className="text-base font-mono font-bold text-red-500">{task.riskScore}% RISK</span>
        </div>
      </div>

      {/* Main Focus Core */}
      <div className="w-full max-w-2xl bg-[#161B22] border-2 border-red-900/60 p-6 rounded-2xl shadow-2xl shadow-red-950/20 text-center my-8 space-y-6">
        <div>
          <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block mb-1">
            ACTIVE COGNITIVE BLOCK
          </span>
          <h3 className="text-2xl font-display font-bold text-white tracking-tight">
            {task.title}
          </h3>
          <p className="text-xs text-slate-400 mt-2 font-sans max-w-md mx-auto">
            {task.description}
          </p>
        </div>

        {/* Huge Countdown Clock */}
        <div className="py-4">
          <span className="text-6xl md:text-7xl font-mono font-bold tracking-tighter text-red-500 block">
            {formatTime(secondsLeft)}
          </span>
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mt-1">
            BIO-TUNNEL DEPLETION COUNTER
          </span>
        </div>

        {/* Binaural Soundwave / Distraction Shield Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
          {/* Simulated sound waves */}
          <div className="bg-[#0d1117] border border-[#30363D] rounded-xl p-3.5 flex flex-col justify-between h-[100px]">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block font-bold">
                Binaural Loam Wave
              </span>
              <button
                onClick={() => setSoundOn(!soundOn)}
                className="text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                {soundOn ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-600" />}
              </button>
            </div>
            {soundOn ? (
              <div className="flex items-end gap-1.5 h-8">
                {[12, 28, 16, 32, 20, 24, 18, 28, 14, 22, 16, 26, 12, 28, 16, 32].map((height, i) => (
                  <span
                    key={i}
                    className="flex-1 bg-cyan-500 rounded-sm animate-pulse"
                    style={{
                      height: `${height}px`,
                      animationDelay: `${i * 120}ms`,
                      animationDuration: "1s",
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="text-[10px] text-slate-600 font-mono italic">Audio synthesizer quiet.</div>
            )}
          </div>

          {/* Social shield overlay */}
          <div className="bg-[#0d1117] border border-[#30363D] rounded-xl p-3.5 flex flex-col justify-between h-[100px]">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono text-purple-400 uppercase tracking-wider block font-bold">
                Distraction Shield
              </span>
              <button
                onClick={() => setIsHidingDistractions(!isHidingDistractions)}
                className="text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                {isHidingDistractions ? <EyeOff className="w-4 h-4 text-purple-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
              </button>
            </div>
            <p className="text-[10px] text-slate-500 font-sans leading-relaxed">
              {isHidingDistractions
                ? "Active: 4 browser nodes locked. Accountability spores notified on Slack/SMS."
                : "Inactive: Caution! Distractions are allowed. Deadlines are at extreme risk!"}
            </p>
          </div>
        </div>

        {/* Actions bar */}
        <div className="flex flex-col md:flex-row gap-3 pt-4 border-t border-[#30363D]">
          <button
            onClick={() => onDefuse(task.id)}
            className="flex-1 bg-red-600 hover:bg-red-500 hover:scale-[1.02] text-white rounded-xl py-3.5 font-display font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-red-950/40"
          >
            <ShieldCheck className="w-4 h-4" /> DEFUSE THREAT (MARK COMPLETE)
          </button>
          <button
            onClick={() => setIsActive(!isActive)}
            className="px-6 py-3.5 rounded-xl border border-[#30363D] text-slate-400 hover:text-white text-xs font-mono flex items-center justify-center gap-1.5 cursor-pointer hover:bg-[#0d1117]"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isActive ? "animate-spin" : ""}`} />
            {isActive ? "PAUSE COUNTER" : "RESUME TUNNEL"}
          </button>
        </div>
      </div>

      {/* Warning footnote and bypass */}
      <div className="w-full max-w-4xl flex justify-between items-center border-t border-[#30363D] pt-4 text-[10px] font-mono text-slate-600">
        <span>ACTIVE DEEP BRAIN BIOCLASS ENGINE V1.4</span>
        <button
          onClick={onExit}
          className="hover:text-red-400 transition-colors uppercase cursor-pointer"
        >
          FORCE BYPASS & EXIT (NOT RECOMMENDED)
        </button>
      </div>
    </div>
  );
};
