/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface EcosystemTask {
  id: string;
  name: string;
  type: "trash" | "biodiversity" | "soil" | "carbon";
  vitalityPoints: number;
  description: string;
  gridX: number; // 0 to 100 for simulated map coordinate
  gridY: number; // 0 to 100
  status: "available" | "logged";
}

export interface MycelialTask {
  id: string;
  title: string;
  deadline: string;
  priority: "critical" | "high" | "medium" | "low";
  durationMinutes: number;
  description: string;
  category: "academic" | "professional" | "billing" | "personal";
  progress: number; // 0 to 100
  connectedTo: string[]; // IDs of other tasks
  riskScore: number; // 0 to 100
  completed: boolean;
  gridX: number; // For node positioning on neural canvas
  gridY: number;
  decayRate: number; // How fast risk rises over time
  ecosystemTask?: EcosystemTask;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface AIAgent {
  id: "planner" | "accountability" | "focus" | "ecosystem";
  name: string;
  title: string;
  role: string;
  phrase: string;
  description: string;
  glowColor: string;
  accentClass: string;
}

export interface PitchSlide {
  id: number;
  title: string;
  subtitle?: string;
  category: string;
  visualType:
    | "problems"
    | "concept"
    | "features"
    | "agents"
    | "userflow"
    | "google"
    | "architecture"
    | "database"
    | "roadmap"
    | "demo"
    | "judging";
}

export interface RiskAnalysis {
  overallRisk: string;
  assessment: string;
  reasons: string[];
  mitigations: string[];
}
