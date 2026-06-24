import { db, auth } from "./firebase";
import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  updateDoc, 
  onSnapshot, 
  getDocs, 
  query,
  getDocFromServer,
  writeBatch
} from "firebase/firestore";
import { MycelialTask } from "../types";

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified || null,
      isAnonymous: auth.currentUser?.isAnonymous || null,
      tenantId: auth.currentUser?.tenantId || null,
      providerInfo: auth.currentUser?.providerData?.map(p => ({
        providerId: p.providerId,
        email: p.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Validate connection to Firestore as per system instructions
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log("Firestore connection validated successfully.");
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Firestore client is offline. Please check your Firebase configuration.");
    } else {
      console.log("Firestore connection check bypassed or completed.");
    }
  }
}

// Helper to get user-specific or global collection reference
export function getTasksCollection(userId?: string | null) {
  if (userId) {
    return collection(db, "users", userId, "tasks");
  }
  return collection(db, "tasks");
}

// Helper to get user-specific or global doc reference
export function getTaskDoc(id: string, userId?: string | null) {
  if (userId) {
    return doc(db, "users", userId, "tasks", id);
  }
  return doc(db, "tasks", id);
}

/**
 * Seed initial tasks in firestore if empty
 */
export async function seedInitialTasksIfNeeded(initialTasks: MycelialTask[], userId?: string | null) {
  const collRef = getTasksCollection(userId);
  const path = userId ? `users/${userId}/tasks` : "tasks";
  try {
    const q = query(collRef);
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      console.log(`Firestore tasks collection is empty for user [${userId || 'global'}]. Seeding initial tasks...`);
      const batch = writeBatch(db);
      initialTasks.forEach((task) => {
        const docRef = getTaskDoc(task.id, userId);
        batch.set(docRef, task);
      });
      await batch.commit();
      console.log("Successfully seeded initial tasks.");
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Subscribe to tasks collection in real-time
 */
export function subscribeTasks(onUpdate: (tasks: MycelialTask[]) => void, userId?: string | null) {
  const collRef = getTasksCollection(userId);
  const path = userId ? `users/${userId}/tasks` : "tasks";
  return onSnapshot(collRef, (snapshot) => {
    const tasks: MycelialTask[] = [];
    snapshot.forEach((doc) => {
      tasks.push(doc.data() as MycelialTask);
    });
    onUpdate(tasks);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, path);
  });
}

/**
 * Save a single task node (create or fully overwrite)
 */
export async function saveTask(task: MycelialTask, userId?: string | null) {
  const path = userId ? `users/${userId}/tasks/${task.id}` : `tasks/${task.id}`;
  try {
    const docRef = getTaskDoc(task.id, userId);
    await setDoc(docRef, task);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Update partial fields of a task node
 */
export async function updateTask(id: string, fields: Partial<MycelialTask>, userId?: string | null) {
  const path = userId ? `users/${userId}/tasks/${id}` : `tasks/${id}`;
  try {
    const docRef = getTaskDoc(id, userId);
    await updateDoc(docRef, fields);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

/**
 * Delete a task node
 */
export async function deleteTask(id: string, userId?: string | null) {
  const path = userId ? `users/${userId}/tasks/${id}` : `tasks/${id}`;
  try {
    const docRef = getTaskDoc(id, userId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}
