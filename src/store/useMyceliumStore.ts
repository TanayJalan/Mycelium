import { create } from 'zustand';
import { MycelialTask, EcosystemTask, ChatMessage } from '../types';
import { db } from '../lib/firebase';
import { collection, doc, setDoc, updateDoc, onSnapshot, deleteDoc, getDoc } from 'firebase/firestore';

export const INITIAL_TASKS: MycelialTask[] = [
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

export const INITIAL_ECOSYSTEM_TASKS: EcosystemTask[] = [
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

interface MyceliumState {
  tasks: MycelialTask[];
  ecosystemTasks: EcosystemTask[];
  vitalityPoints: number;
  messages: ChatMessage[];
  
  // Internal Setters (called by listeners)
  setTasks: (tasks: MycelialTask[]) => void;
  setEcosystemTasks: (tasks: EcosystemTask[]) => void;
  setVitalityPoints: (points: number) => void;
  setMessages: (messages: ChatMessage[]) => void;
  
  // Actions
  addTask: (task: MycelialTask, userId: string | null) => void;
  updateTaskProgress: (id: string, progress: number, userId: string | null) => void;
  toggleTaskComplete: (id: string, userId: string | null) => void;
  updateTaskPosition: (id: string, x: number, y: number, userId: string | null) => void;
  deleteTask: (id: string, userId: string | null) => void;
  logEcosystemTask: (id: string, userId: string | null) => void;
  addMessage: (message: ChatMessage, userId: string | null) => void;
}

export const useMyceliumStore = create<MyceliumState>((set, get) => ({
  tasks: INITIAL_TASKS,
  ecosystemTasks: INITIAL_ECOSYSTEM_TASKS,
  vitalityPoints: 120,
  messages: [],

  setTasks: (tasks) => set({ tasks }),
  setEcosystemTasks: (ecosystemTasks) => set({ ecosystemTasks }),
  setVitalityPoints: (vitalityPoints) => set({ vitalityPoints }),
  setMessages: (messages) => set({ messages }),

  addTask: async (task, userId) => {
    // Optimistic UI Update
    set((state) => ({ tasks: [...state.tasks, task] }));
    
    // Background sync
    if (!userId) return;
    try {
      const taskRef = doc(db, `users/${userId}/tasks/${task.id}`);
      await setDoc(taskRef, task);
    } catch (e) {
      console.error("Failed to sync new task to Firestore:", e);
    }
  },
  
  updateTaskProgress: async (id, progress, userId) => {
    set((state) => ({
      tasks: state.tasks.map(t => t.id === id ? { ...t, progress } : t)
    }));
    
    if (!userId) return;
    try {
      const taskRef = doc(db, `users/${userId}/tasks/${id}`);
      await updateDoc(taskRef, { progress });
    } catch (e) {
      console.error("Failed to sync progress to Firestore:", e);
    }
  },

  toggleTaskComplete: async (id, userId) => {
    let newStatus = false;
    let newProgress = 0;
    
    set((state) => ({
      tasks: state.tasks.map(t => {
        if (t.id === id) {
          newStatus = !t.completed;
          newProgress = newStatus ? 100 : t.progress;
          return { ...t, completed: newStatus, progress: newProgress };
        }
        return t;
      })
    }));
    
    if (!userId) return;
    try {
      const taskRef = doc(db, `users/${userId}/tasks/${id}`);
      await updateDoc(taskRef, { completed: newStatus, progress: newProgress });
    } catch (e) {
      console.error("Failed to sync completion to Firestore:", e);
    }
  },

  updateTaskPosition: async (id, x, y, userId) => {
    set((state) => ({
      tasks: state.tasks.map(t => t.id === id ? { ...t, gridX: x, gridY: y } : t)
    }));
    
    if (!userId) return;
    try {
      const taskRef = doc(db, `users/${userId}/tasks/${id}`);
      await updateDoc(taskRef, { gridX: x, gridY: y });
    } catch (e) {
      console.error("Failed to sync position to Firestore:", e);
    }
  },

  deleteTask: async (id, userId) => {
    set((state) => ({
      tasks: state.tasks.filter(t => t.id !== id)
    }));
    
    if (!userId) return;
    try {
      const taskRef = doc(db, `users/${userId}/tasks/${id}`);
      await deleteDoc(taskRef);
    } catch (e) {
      console.error("Failed to delete task from Firestore:", e);
    }
  },

  logEcosystemTask: async (id, userId) => {
    let pointsToAdd = 0;
    let newTotal = get().vitalityPoints;

    set((state) => {
      const updatedTasks = state.ecosystemTasks.map(t => {
        if (t.id === id && t.status === "available") {
          pointsToAdd = t.vitalityPoints;
          return { ...t, status: "logged" as const };
        }
        return t;
      });
      newTotal = state.vitalityPoints + pointsToAdd;
      return { ecosystemTasks: updatedTasks, vitalityPoints: newTotal };
    });
    
    if (!userId || pointsToAdd === 0) return;
    
    try {
      // Update ecosystem task status
      const ecoRef = doc(db, `users/${userId}/ecosystem_logs/${id}`);
      await setDoc(ecoRef, { status: "logged" }, { merge: true });
      
      // Update user vitality
      const userRef = doc(db, `users/${userId}`);
      await setDoc(userRef, { vitalityPoints: newTotal }, { merge: true });
    } catch (e) {
      console.error("Failed to sync ecosystem log to Firestore:", e);
    }
  },

  addMessage: async (message, userId) => {
    set((state) => {
      // Avoid duplicate intros
      const lastMsg = state.messages[state.messages.length - 1];
      if (lastMsg && lastMsg.content === message.content) return state;
      return { messages: [...state.messages, message] };
    });
    
    if (!userId) return;
    try {
      const msgRef = doc(db, `users/${userId}/messages/${message.id}`);
      await setDoc(msgRef, message);
    } catch (e) {
      console.error("Failed to sync chat message to Firestore:", e);
    }
  }
}));

// -- Firestore Real-Time Listeners --

let unsubTasks: (() => void) | null = null;
let unsubEco: (() => void) | null = null;
let unsubMsgs: (() => void) | null = null;
let unsubUser: (() => void) | null = null;

export const initializeStoreListeners = async (userId: string | null) => {
  const store = useMyceliumStore.getState();
  
  if (!userId) {
    // Revert to demo state when logged out
    store.setTasks(INITIAL_TASKS);
    store.setEcosystemTasks(INITIAL_ECOSYSTEM_TASKS);
    store.setMessages([]);
    clearStoreListeners();
    return;
  }

  try {
    // 1. Initialize Default Data for New Users
    const userRef = doc(db, `users/${userId}`);
    const userDocSnap = await getDoc(userRef);
    
    if (!userDocSnap.exists()) {
      console.log("[Mycelium] New user detected. Seeding initial task and ecosystem nodes...");
      await setDoc(userRef, { vitalityPoints: 120, createdAt: new Date().toISOString() });
      
      for (const t of INITIAL_TASKS) {
        await setDoc(doc(db, `users/${userId}/tasks/${t.id}`), t);
      }
      for (const e of INITIAL_ECOSYSTEM_TASKS) {
        await setDoc(doc(db, `users/${userId}/ecosystem_logs/${e.id}`), e);
      }
    } else {
      const data = userDocSnap.data();
      if (data.vitalityPoints !== undefined) {
        store.setVitalityPoints(data.vitalityPoints);
      }
    }

    // 2. Setup Real-time Listeners
    unsubUser = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists() && docSnap.data().vitalityPoints !== undefined) {
        useMyceliumStore.getState().setVitalityPoints(docSnap.data().vitalityPoints);
      }
    });

    unsubTasks = onSnapshot(collection(db, `users/${userId}/tasks`), (snap) => {
      if (!snap.empty) {
        const fetchedTasks = snap.docs.map(d => d.data() as MycelialTask);
        useMyceliumStore.getState().setTasks(fetchedTasks);
      }
    });

    unsubEco = onSnapshot(collection(db, `users/${userId}/ecosystem_logs`), (snap) => {
      if (!snap.empty) {
        // Merge the status back into the INITIAL array to keep the base info (like coords/points)
        // In a full production app, you'd store the whole object in Firestore.
        const fetchedLogs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        const mergedEco = INITIAL_ECOSYSTEM_TASKS.map(baseTask => {
          const remoteTask = fetchedLogs.find(r => r.id === baseTask.id) as any;
          return remoteTask ? { ...baseTask, status: remoteTask.status as "available" | "logged" } : baseTask;
        });
        useMyceliumStore.getState().setEcosystemTasks(mergedEco);
      }
    });

    unsubMsgs = onSnapshot(collection(db, `users/${userId}/messages`), (snap) => {
      if (!snap.empty) {
        const fetchedMsgs = snap.docs.map(d => d.data() as ChatMessage)
          .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
        useMyceliumStore.getState().setMessages(fetchedMsgs);
      }
    });
    
  } catch (error) {
    console.error("[Mycelium] Error initializing Firestore listeners:", error);
  }
};

export const clearStoreListeners = () => {
  if (unsubTasks) { unsubTasks(); unsubTasks = null; }
  if (unsubEco) { unsubEco(); unsubEco = null; }
  if (unsubMsgs) { unsubMsgs(); unsubMsgs = null; }
  if (unsubUser) { unsubUser(); unsubUser = null; }
};
