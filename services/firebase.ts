
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, OAuthProvider, Auth } from "firebase/auth";
import { getAnalytics, Analytics } from "firebase/analytics";
import { getFirestore, Firestore } from "firebase/firestore";

// Safe variable access helper
const getEnv = (key: string, defaultValue: string) => {
  try {
    // @ts-ignore
    if (import.meta && import.meta.env && import.meta.env[key]) {
      // @ts-ignore
      return import.meta.env[key];
    }
  } catch (e) {
    // ignore
  }
  return defaultValue;
};

const firebaseConfig = {
  apiKey: getEnv("VITE_FIREBASE_API_KEY", "AIzaSyA1oy-aDXoHN5dhM6DE2irI98HiZ3t1w_8"),
  authDomain: getEnv("VITE_FIREBASE_AUTH_DOMAIN", "proheadshot-ai-f7c02.firebaseapp.com"),
  projectId: getEnv("VITE_FIREBASE_PROJECT_ID", "proheadshot-ai-f7c02"),
  storageBucket: getEnv("VITE_FIREBASE_STORAGE_BUCKET", "proheadshot-ai-f7c02.firebasestorage.app"),
  messagingSenderId: getEnv("VITE_FIREBASE_MESSAGING_SENDER_ID", "600103177183"),
  appId: getEnv("VITE_FIREBASE_APP_ID", "1:600103177183:web:f9bde70f56ff8cb290526a"),
  measurementId: getEnv("VITE_FIREBASE_MEASUREMENT_ID", "G-EMRDHJ3Q21")
};

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let analytics: Analytics | undefined;
let db: Firestore | undefined;

try {
  // Check if an app is already initialized to prevent "Component has not been registered" errors
  if (getApps().length > 0) {
    app = getApp();
  } else {
    app = initializeApp(firebaseConfig);
  }

  // Initialize services
  auth = getAuth(app);
  db = getFirestore(app);

  // Initialize analytics only in browser
  if (typeof window !== 'undefined') {
    try {
      analytics = getAnalytics(app);
    } catch (e) {
      console.warn("Analytics failed to initialize (optional):", e);
    }
  }
} catch (error) {
  console.error("Firebase initialization failed:", error);
}

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
const appleProvider = new OAuthProvider('apple.com');

export { auth, db, googleProvider, facebookProvider, appleProvider, analytics };
