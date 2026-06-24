import { initializeApp } from "firebase/app";
import { 
  initializeFirestore, 
  persistentLocalCache, 
  persistentMultipleTabManager 
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
// Initialize Firebase App
const firebaseConfig = {
  apiKey: "AIzaSyAzbr7IVLlFMVHTjT61MyHe4N7YjOMVGXQ",
  authDomain: "mycelium-565cd.firebaseapp.com",
  projectId: "mycelium-565cd",
  storageBucket: "mycelium-565cd.firebasestorage.app",
  messagingSenderId: "781204970188",
  appId: "1:781204970188:web:ef7d1ab361c95a4ab08069"
};

const app = initializeApp(firebaseConfig);

// Initialize Firestore with persistent cache configuration
export const db = initializeFirestore(
  app, 
  {
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager()
    })
  }
);

// Initialize Firebase Auth
export const auth = getAuth(app);
