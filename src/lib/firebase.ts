import { initializeApp } from "firebase/app";
import { 
  initializeFirestore, 
  persistentLocalCache, 
  persistentMultipleTabManager 
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
// Initialize Firebase App
const firebaseConfig = {
  projectId: "mesmerizing-park-s224x",
  appId: "1:236120592145:web:62c533806c409901b1c6b0",
  apiKey: "AIzaSyCvZEYBFlncRpqx-u5mvD4Pwqq67dzDggM",
  authDomain: "mesmerizing-park-s224x.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-759ef204-016a-437a-bc75-6eaee62bc1e7",
  storageBucket: "mesmerizing-park-s224x.firebasestorage.app",
  messagingSenderId: "236120592145",
  measurementId: ""
};

const app = initializeApp({
  apiKey: firebaseConfig.apiKey,
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
  storageBucket: firebaseConfig.storageBucket,
  messagingSenderId: firebaseConfig.messagingSenderId,
  appId: firebaseConfig.appId
});

// Initialize Firestore with the databaseId and persistent cache configuration
export const db = initializeFirestore(
  app, 
  {
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager()
    })
  },
  firebaseConfig.firestoreDatabaseId || "(default)"
);

// Initialize Firebase Auth
export const auth = getAuth(app);
