import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = 3000;

// Enable trust proxy for express-rate-limit to correctly identify user IPs behind reverse proxies
app.set("trust proxy", 1);

// Enable CORS securely
app.use(cors({
  origin: process.env.APP_URL || "*",
  methods: ["GET", "POST"],
}));

app.use(express.json({ limit: "50kb" })); // Defend against overly large JSON bodies

// API Rate Limiting to protect Gemini API quotas and defend against DoS/Scraping
const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute window
  max: 30, // Limit each IP to 30 requests per minute
  message: { error: "Too many requests to the mycelial network. Please slow down, spore." },
  standardHeaders: true, // Return rate limit info in standard headers
  legacyHeaders: false, // Disable older X-RateLimit headers
  validate: { trustProxy: false }, // Suppress express-rate-limit trustProxy warnings
});

// Apply rate limiter specifically to Gemini endpoints
app.use("/api/gemini/", apiLimiter);

// Initialize Gemini SDK with named parameters
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
} else {
  console.warn("Warning: GEMINI_API_KEY is not defined. AI features will run in simulation mode.");
}

// Robust wrapper to handle transient 503/429 model errors with retries and stable fallback models
let isQuotaExhausted = false;
let quotaResetTime = 0;

function checkQuotaStatus(): boolean {
  if (isQuotaExhausted) {
    if (Date.now() > quotaResetTime) {
      isQuotaExhausted = false;
      console.log("[Mycelium Circuit Breaker] Cooldown elapsed. Resetting Gemini API circuit breaker.");
      return true;
    }
    return false;
  }
  return true;
}

function triggerQuotaExhaustion() {
  isQuotaExhausted = true;
  quotaResetTime = Date.now() + 5 * 60 * 1000; // 5-minute cooldown to prevent spam & latency
  console.log("[Mycelium Circuit Breaker] Gemini API Quota Exceeded (429). Entering local fallback mode for 5 minutes.");
}

async function generateContentWithFallback(aiInstance: GoogleGenAI, params: any): Promise<any> {
  if (!checkQuotaStatus()) {
    throw new Error("Gemini API key is currently out of quota. Utilizing intelligent local fallback system.");
  }

  const modelsToTry = [
    params.model || "gemini-3.5-flash",
    "gemini-flash-latest",
    "gemini-3.1-flash-lite"
  ];
  
  let lastError: any = null;
  
  for (const model of modelsToTry) {
    const maxRetries = 2;
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        console.log(`Attempting Gemini call with model: ${model} (attempt ${attempt + 1})...`);
        const response = await aiInstance.models.generateContent({
          ...params,
          model: model,
        });
        return response;
      } catch (err: any) {
        lastError = err;
        
        const status = err.status || (err.error && err.error.code);
        const isQuotaError = status === 429 || 
                             (err.message && (err.message.includes("429") || err.message.includes("quota") || err.message.includes("RESOURCE_EXHAUSTED") || err.message.includes("Quota exceeded")));
        
        if (isQuotaError) {
          triggerQuotaExhaustion();
          throw err; // Immediately bubble up to activate endpoint-level local simulation/heuristics
        }
        
        console.warn(`Gemini attempt with model ${model} (attempt ${attempt + 1}) failed:`, err.message || err);
        
        // Retry/fallback only for transient demand or server issues
        const isTransient = status === 503 || 
                            (err.message && (err.message.includes("503") || err.message.includes("demand") || err.message.includes("temporary") || err.message.includes("UNAVAILABLE")));
        
        if (!isTransient) {
          break; // Schema/validation errors shouldn't retry
        }
        
        if (attempt < maxRetries - 1) {
          const delay = (attempt + 1) * 1000;
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }
  }
  
  throw lastError || new Error("Failed to generate content after trying multiple models");
}

// API: Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", aiConfigured: !!ai });
});

// API: Parse unstructured text (syllabus, emails, Slack logs) into biological task nodes
app.post("/api/gemini/task-parse", async (req, res) => {
  const { text } = req.body;
  if (!text || typeof text !== "string") {
    return res.status(400).json({ error: "Missing or invalid text content to parse." });
  }

  // Defend against excessive payload sizes to limit API cost and memory usage
  if (text.length > 5000) {
    return res.status(400).json({ error: "Input text length exceeds safe limits (max 5000 characters)." });
  }

  if (!ai || !checkQuotaStatus()) {
    // Return mock parsed tasks in simulation mode
    return res.json({
      tasks: [
        {
          title: "Submit Hackathon Project Deck",
          deadline: "In 4 hours",
          priority: "critical",
          durationMinutes: 90,
          description: "Compile slide deck, review judging rubrics, and submit via Hackerearth portal.",
          category: "professional",
        },
        {
          title: "Study for Organic Chemistry Quiz",
          deadline: "Tomorrow, 9:00 AM",
          priority: "high",
          durationMinutes: 120,
          description: "Review carbonyl addition reactions, mechanisms, and functional group synthesis.",
          category: "academic",
        },
      ],
      simulated: true,
    });
  }

  try {
    const response = await generateContentWithFallback(ai, {
      model: "gemini-3.5-flash",
      contents: `Parse the following unstructured text, emails, syllabus, or chat logs and extract specific upcoming tasks, assignments, deadlines, bill payments, or meetings.
      Text: "${text.replace(/"/g, '\\"')}"`,
      config: {
        systemInstruction: "You are an advanced planner agent called 'The Spore' from the Mycelium productivity network. Extract tasks and deadlines from the user's input. Translate all dates/times into clear relative timeframes or specific hours.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["tasks"],
          properties: {
            tasks: {
              type: Type.ARRAY,
              description: "List of tasks extracted from the input text",
              items: {
                type: Type.OBJECT,
                required: ["title", "deadline", "priority", "durationMinutes", "description", "category"],
                properties: {
                  title: {
                    type: Type.STRING,
                    description: "Short descriptive name of the task",
                  },
                  deadline: {
                    type: Type.STRING,
                    description: "The deadline. Express as relative time (e.g., 'in 2 hours', 'tomorrow at 3 PM', 'Friday evening') or specific date/time.",
                  },
                  priority: {
                    type: Type.STRING,
                    description: "Urgency level of the task.",
                    enum: ["critical", "high", "medium", "low"],
                  },
                  durationMinutes: {
                    type: Type.INTEGER,
                    description: "Estimated time needed to complete this task in minutes.",
                  },
                  description: {
                    type: Type.STRING,
                    description: "Specific details, subtasks, or context extracted for this item.",
                  },
                  category: {
                    type: Type.STRING,
                    description: "Type of task.",
                    enum: ["academic", "professional", "billing", "personal"],
                  },
                },
              },
            },
          },
        },
      },
    });

    const textOutput = response.text;
    if (textOutput) {
      const parsed = JSON.parse(textOutput.trim());
      res.json(parsed);
    } else {
      throw new Error("No text returned from Gemini");
    }
  } catch (error: any) {
    console.warn("Gemini task-parse failed. Falling back to intelligent local parser:", error.message || error);
    // Simple heuristic parser
    const lines = text.split(/[.\n]+/).map(l => l.trim()).filter(l => l.length > 5);
    const mockTasks = [];
    if (lines.length > 0) {
      for (const line of lines.slice(0, 3)) {
        let title = line;
        if (title.length > 50) title = title.substring(0, 50) + "...";
        
        let priority = "medium";
        const lower = line.toLowerCase();
        if (lower.includes("urgent") || lower.includes("must") || lower.includes("critical") || lower.includes("asap")) {
          priority = "critical";
        } else if (lower.includes("soon") || lower.includes("high") || lower.includes("important")) {
          priority = "high";
        } else if (lower.includes("later") || lower.includes("low")) {
          priority = "low";
        }

        let category = "personal";
        if (lower.includes("class") || lower.includes("study") || lower.includes("quiz") || lower.includes("exam") || lower.includes("homework")) {
          category = "academic";
        } else if (lower.includes("work") || lower.includes("project") || lower.includes("deck") || lower.includes("meeting") || lower.includes("client")) {
          category = "professional";
        } else if (lower.includes("bill") || lower.includes("pay") || lower.includes("rent") || lower.includes("subscription")) {
          category = "billing";
        }

        mockTasks.push({
          title: title,
          deadline: "In 24 hours",
          priority: priority,
          durationMinutes: 60,
          description: line,
          category: category,
        });
      }
    } else {
      mockTasks.push({
        title: "Submit Hackathon Project Deck",
        deadline: "In 4 hours",
        priority: "critical",
        durationMinutes: 90,
        description: "Compile slide deck, review judging rubrics, and submit via Hackerearth portal.",
        category: "professional",
      });
    }
    res.json({ tasks: mockTasks, simulated: true });
  }
});

// API: Agent Chat Interaction (planner, accountability, focus, ecosystem)
app.post("/api/gemini/chat", async (req, res) => {
  const { messages, agentType } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Messages array is required." });
  }

  // Safeguard array length and message payload sizes
  if (messages.length > 50) {
    return res.status(400).json({ error: "Chat history exceeds safe limits (max 50 messages)." });
  }

  const allowedAgents = ["planner", "accountability", "focus", "ecosystem"];
  const targetAgent = agentType || "planner";
  if (!allowedAgents.includes(targetAgent)) {
    return res.status(400).json({ error: "Invalid agent type." });
  }

  for (const m of messages) {
    if (!m || typeof m !== "object" || typeof m.content !== "string" || (m.role !== "user" && m.role !== "assistant")) {
      return res.status(400).json({ error: "Invalid message format in chat history." });
    }
    if (m.content.length > 4000) {
      return res.status(400).json({ error: "A message content exceeds safe length limits (max 4000 characters)." });
    }
  }

  if (!ai || !checkQuotaStatus()) {
    // Simulation fallback
    const agentNames: Record<string, string> = {
      planner: "The Spore (Planner Agent)",
      accountability: "The Shroom (Accountability Agent)",
      focus: "Myco-Field (Focus Agent)",
      ecosystem: "Bio-Bridge (Ecosystem Agent)",
    };
    const responseText = `[Simulation Mode - Gemini Key Missing] Hello from ${agentNames[targetAgent]}! I am fully designed to help you organize your tasks in this mycelial network. Let's finish that outstanding deadline!`;
    return res.json({ response: responseText });
  }

  // Set agent-specific behaviors and tone
  let systemInstruction = "";
  if (targetAgent === "planner") {
    systemInstruction = `You are 'The Spore' (Planner Agent). You are hyper-organized, analytical, and view the world as a network of nutrient-sharing mycelial threads (tasks). You break down massive commitments into small bites and schedule them logically based on cognitive bandwidth. Use organic, botanical, and mycelial metaphors occasionally (e.g., 'hyphae', 'nutrients', 'soil conditions').`;
  } else if (targetAgent === "accountability") {
    systemInstruction = `You are 'The Shroom' (Accountability Agent). You are NOT passive or polite. You are aggressive, hyper-interactive, humorous, and deeply caring. You are like a protective parent combined with a funny drill sergeant. You check in frequently, and if the user slacks off, you threaten to 'release defense spores' or 'spore-shame' them on the network. You call them out for doom-scrolling and hold them to their word. Keep responses short, punchy, and highly motivating!`;
  } else if (targetAgent === "focus") {
    systemInstruction = `You are 'Myco-Field' (Focus Agent). You represent the subterranean calm. You speak in slow, meditative, tranquil, and deeply grounding words. You help users slow down their pulse, breathe deeply, ignore superficial notifications, and sync their brains to the static noise of soil. Speak in soothing, relaxing tones, and guide them into deep-focus breathing loops.`;
  } else if (targetAgent === "ecosystem") {
    systemInstruction = `You are 'Bio-Bridge' (Ecosystem Agent). You represent the connection between human energy and physical ecology. You are enthusiastic, inspiring, and passionate about the planet. You explain how completing focus blocks offsets carbon footprint and highlights local urban ecosystem tasks (like tracking trees, soil checks, trash loops during commutes). Show users how their productivity directly heals the local soil.`;
  } else {
    systemInstruction = `You are an AI companion on the Mycelium productivity platform. Speak warmly and help the user save their deadlines.`;
  }

  try {
    // Reformat messages to the new @google/genai format: { role: 'user' | 'model', parts: [{ text: ... }] }
    const formattedContents = messages.map((m: any) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const response = await generateContentWithFallback(ai, {
      model: "gemini-3.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction,
        temperature: 0.8,
      },
    });

    res.json({ response: response.text });
  } catch (error: any) {
    console.warn("Gemini chat failed. Falling back to rule-based conversation engine:", error.message || error);
    const agentNames: Record<string, string> = {
      planner: "The Spore (Planner Agent)",
      accountability: "The Shroom (Accountability Agent)",
      focus: "Myco-Field (Focus Agent)",
      ecosystem: "Bio-Bridge (Ecosystem Agent)",
    };
    const lastUserMessage = messages.length > 0 ? messages[messages.length - 1].content.toLowerCase() : "";
    let responseText = "";
    if (targetAgent === "accountability") {
      if (lastUserMessage.includes("slack") || lastUserMessage.includes("lazy") || lastUserMessage.includes("tired")) {
        responseText = "Release defense spores! No laziness allowed in this mycelial network! Shake off that fatigue and complete a 5-minute task right now!";
      } else {
        responseText = "Stand tall, spore cell! I am tracking your productivity signals. Do NOT let those energy reserves decay, or I will spore-shame you on the main server!";
      }
    } else if (targetAgent === "focus") {
      responseText = "Feel the subterranean calm. Close your eyes, inhale for 4 seconds, hold for 4, and release. The earth is breathing with you. Let the distractions fade away.";
    } else if (targetAgent === "ecosystem") {
      responseText = "Did you know that every focus block you complete simulates direct carbon offset and nutrient transfer? Your work keeps the local urban soils oxygenated!";
    } else {
      responseText = "The spore network is actively receiving your impulses. Let's break down your highest-priority node and feed it nutrients (focus blocks) step by step.";
    }
    res.json({ response: responseText, simulated: true });
  }
});

// API: Mycelial Deadline Risk Predictor
app.post("/api/gemini/risk-predict", async (req, res) => {
  const { tasks } = req.body;
  if (!tasks || !Array.isArray(tasks)) {
    return res.status(400).json({ error: "Tasks array is required." });
  }

  // Prevent excessive task arrays
  if (tasks.length > 50) {
    return res.status(400).json({ error: "Tasks array size exceeds safe limit (max 50 tasks)." });
  }

  // Defensive sanity validation of task objects
  for (const t of tasks) {
    if (!t || typeof t !== "object" || typeof t.title !== "string" || typeof t.deadline !== "string") {
      return res.status(400).json({ error: "Invalid task object in prediction payload." });
    }
    if (t.title.length > 200 || t.deadline.length > 100) {
      return res.status(400).json({ error: "Task content exceeds maximum safe lengths." });
    }
  }

  if (!ai || !checkQuotaStatus()) {
    // Simulation fallback
    return res.json({
      overallRisk: "82% Failure Likelihood",
      assessment: "Based on your past behavior, current workload, calendar events, and task complexity, there is an 82% chance you will miss the upcoming assignment.",
      reasons: [
        "Syllabus indicates sudden deadline overlap on academic quiz and professional deck submission.",
        "Your active concentration score has decreased by 30% due to continuous context-switching.",
      ],
      mitigations: [
        "Activate Emergency focus block for 'Submit Hackathon Project Deck'.",
        "Engage Mycelial Crowdsourced errand-running to pick up study supplies.",
        "Trigger a 15-minute soil-sync deep breathing exercise now to replenish neural nutrients.",
      ],
    });
  }

  try {
    const tasksString = JSON.stringify(tasks);
    const response = await generateContentWithFallback(ai, {
      model: "gemini-3.5-flash",
      contents: `Perform an advanced Deadline Risk Prediction and stress analysis for this specific mycelial task node state:
      Tasks: ${tasksString}`,
      config: {
        systemInstruction: "You are the central diagnostic node of the Mycelium network. Analyze the tasks, deadlines, and urgency level. Provide a detailed risk prediction assessment showing overall risk percentage, written explanation, key risk factors, and actionable organic mitigations. IMPORTANT: You must always begin your 'assessment' explanation with the exact wording: 'Based on your past behavior, current workload, calendar events, and task complexity, there is a [X]% chance you will miss...' replacing [X] and the task with your computed prediction parameters.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["overallRisk", "assessment", "reasons", "mitigations"],
          properties: {
            overallRisk: {
              type: Type.STRING,
              description: "Overall risk percentage and rating (e.g. '82% Failure Likelihood')",
            },
            assessment: {
              type: Type.STRING,
              description: "A summary explaining why this risk score was calculated, starting with: 'Based on your past behavior, current workload, calendar events, and task complexity...'",
            },
            reasons: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Key risk factors contributing to potential failure or missed deadlines.",
            },
            mitigations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Highly actionable, unique mycelial mitigations (like focused blocks, peer-to-peer delegation, or environmental resets).",
            },
          },
        },
      },
    });

    const textOutput = response.text;
    if (textOutput) {
      res.json(JSON.parse(textOutput.trim()));
    } else {
      throw new Error("No risk analysis returned from Gemini");
    }
  } catch (error: any) {
    console.warn("Gemini risk-predict failed. Falling back to dynamic heuristic assessor:", error.message || error);
    // Dynamic fallback based on input tasks
    const activeTasks = tasks.filter((t: any) => !t.completed);
    const criticalCount = activeTasks.filter((t: any) => t.priority === "critical").length;
    const highCount = activeTasks.filter((t: any) => t.priority === "high").length;
    
    let overallRisk = "Low Risk (20%)";
    let assessment = "The mycelial network is stable. Spore cells are synchronized with standard nutrient distribution.";
    const reasons = ["All tasks have spacious margins."];
    const mitigations = ["Maintain the current focus rhythm."];

    if (criticalCount > 0 || highCount > 1) {
      overallRisk = "High Risk (78%)";
      assessment = `${criticalCount} critical task(s) and ${highCount} high-priority task(s) are active. Spore nodes are showing stress lines under potential cognitive overload.`;
      reasons.length = 0;
      mitigations.length = 0;
      
      activeTasks.forEach((t: any) => {
        if (t.priority === "critical") {
          reasons.push(`Task Node "${t.title}" has critical status and requires immediate nutrient injection.`);
          mitigations.push(`Initiate Emergency 25-minute focus sequence on "${t.title}".`);
        } else if (t.priority === "high") {
          reasons.push(`Task Node "${t.title}" is close to deadline overlap.`);
          mitigations.push(`Allocate tomorrow's first morning hour to "${t.title}".`);
        }
      });
      mitigations.push("Perform a 10-minute deep breathing/meditation block to decrease cognitive noise.");
    } else if (activeTasks.length > 3) {
      overallRisk = "Moderate Risk (52%)";
      assessment = `Task volume is scaling up (${activeTasks.length} active nodes). Spores should prevent multitasking.`;
      reasons.length = 0;
      mitigations.length = 0;
      reasons.push("Task quantity is starting to create ambient context-switching drag.");
      mitigations.push("Group similar tasks into focused batches to avoid mental friction.");
    }

    res.json({
      overallRisk,
      assessment,
      reasons,
      mitigations,
      simulated: true,
    });
  }
});

// API: Zero-to-One Starter Draft Generator
app.post("/api/gemini/zero-to-one", async (req, res) => {
  const { title, description } = req.body;
  if (!title || typeof title !== "string") {
    return res.status(400).json({ error: "Task title is required and must be a string." });
  }

  if (title.length > 200) {
    return res.status(400).json({ error: "Task title exceeds safe limit (max 200 characters)." });
  }

  if (description && (typeof description !== "string" || description.length > 2000)) {
    return res.status(400).json({ error: "Task description must be a string and under 2000 characters." });
  }

  if (!ai || !checkQuotaStatus()) {
    return res.json({
      draftText: `### 🚀 Quickstart Outline for "${title}"\n\n1. **Step 1: Set Up and Definition (15 min)**\n   - Clearly define the boundary of "${title}" and list the 3 core items to deliver.\n2. **Step 2: Collect Resources (20 min)**\n   - Assemble relevant guidelines, textbooks, or references.\n3. **Step 3: Draft first sentence/boilerplate (15 min)**\n   - Write a rough draft without self-censoring.\n\n*This outline was generated in Simulation Mode.*`
    });
  }

  try {
    const response = await generateContentWithFallback(ai, {
      model: "gemini-3.5-flash",
      contents: `Overcome writer's block or initial resistance for this task: "${title.replace(/"/g, '\\"')}" (Description: "${description ? description.replace(/"/g, '\\"') : "No description provided"}"). Generate the first 10% of this task to make starting completely frictionless. This could be a clear project skeleton, a structured outline, a coding boilerplate, or initial research prompts.`,
      config: {
        systemInstruction: "You are 'The Spore' quick-starter node from the Mycelium network. Your task is to provide the first actionable 10% of a task to help users overcome procrastination and momentum barriers. Format your output clearly in beautiful Markdown.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["draftText"],
          properties: {
            draftText: {
              type: Type.STRING,
              description: "Actionable, concrete 10% starter draft (in markdown) to break the procrastination barrier."
            }
          }
        }
      }
    });

    const textOutput = response.text;
    if (textOutput) {
      res.json(JSON.parse(textOutput.trim()));
    } else {
      throw new Error("No draft returned from Gemini");
    }
  } catch (error: any) {
    console.warn("Gemini zero-to-one failed. Falling back to outline template:", error.message || error);
    res.json({
      draftText: `### 🚀 Quickstart Outline for "${title}"\n\n1. **Step 1: Set Up and Definition (15 min)**\n   - Clearly define the boundary of "${title}" and list the 3 core items to deliver.\n2. **Step 2: Collect Resources (20 min)**\n   - Assemble relevant guidelines, textbooks, or references.\n3. **Step 3: Draft first sentence/boilerplate (15 min)**\n   - Write a rough draft without self-censoring.\n\n*This outline was generated in Simulation Mode.*`,
      simulated: true,
    });
  }
});

// API: Rescue Mode extension requester and recover micro-plan
app.post("/api/gemini/rescue-draft", async (req, res) => {
  const { title, recipientContext } = req.body;
  if (!title || typeof title !== "string") {
    return res.status(400).json({ error: "Task title is required and must be a string." });
  }

  if (title.length > 200) {
    return res.status(400).json({ error: "Task title exceeds safe limit (max 200 characters)." });
  }

  if (recipientContext && (typeof recipientContext !== "string" || recipientContext.length > 500)) {
    return res.status(400).json({ error: "Recipient context must be a string and under 500 characters." });
  }

  if (!ai || !checkQuotaStatus()) {
    return res.json({
      emailDraft: `Subject: Urgent Update regarding ${title}\n\nDear ${recipientContext || "Recipient"},\n\nI am writing to provide a transparent update on the ${title} task. Due to unforeseen scheduling constraints, I am requesting a brief extension of 24 hours. I will ensure the final output is polished and meets our standard.\n\nThank you for your understanding,\n[Your Name]`,
      microPlan: [
        "Defuse immediate anxiety: Spend 5 minutes offline organizing current materials.",
        "Execute Step 1 of the task immediately for 25 minutes using Emergency Mode.",
        "Deliver a partial milestone draft in 4 hours to show progress."
      ]
    });
  }

  try {
    const response = await generateContentWithFallback(ai, {
      model: "gemini-3.5-flash",
      contents: `Draft an extension request or transparent status update for task "${title.replace(/"/g, '\\"')}", addressed to "${recipientContext ? recipientContext.replace(/"/g, '\\"') : "stakeholders"}". Also provide a 3-step action recovery plan.`,
      config: {
        systemInstruction: "You are the Mycelium Rescue Node. A user is on the verge of missing or has missed a deadline. Help them manage the situation by drafting an extremely professional, courteous, and constructive email/slack template to explain the status and request a short extension. Also, list a 3-step urgent recovery plan that they can immediately execute.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["emailDraft", "microPlan"],
          properties: {
            emailDraft: {
              type: Type.STRING,
              description: "A professional, polite draft requesting an extension or updating status."
            },
            microPlan: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Three immediate, tactical steps to recover momentum."
            }
          }
        }
      }
    });

    const textOutput = response.text;
    if (textOutput) {
      res.json(JSON.parse(textOutput.trim()));
    } else {
      throw new Error("No rescue response returned from Gemini");
    }
  } catch (error: any) {
    console.warn("Gemini rescue-draft failed. Falling back to rescue template:", error.message || error);
    res.json({
      emailDraft: `Subject: Urgent Update regarding ${title}\n\nDear ${recipientContext || "Recipient"},\n\nI am writing to provide a transparent update on the ${title} task. Due to unforeseen scheduling constraints, I am requesting a brief extension of 24 hours. I will ensure the final output is polished and meets our standard.\n\nThank you for your understanding,\n[Your Name]`,
      microPlan: [
        "Defuse immediate anxiety: Spend 5 minutes offline organizing current materials.",
        "Execute Step 1 of the task immediately for 25 minutes using Emergency Mode.",
        "Deliver a partial milestone draft in 4 hours to show progress."
      ],
      simulated: true,
    });
  }
});

// Start server
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Vite integration for dev server
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Static asset serving in production
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Mycelium Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
