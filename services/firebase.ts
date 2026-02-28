
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
  apiKey: getEnv("VITE_FIREBASE_API_KEY", ""),
  authDomain: getEnv("VITE_FIREBASE_AUTH_DOMAIN", ""),
  projectId: getEnv("VITE_FIREBASE_PROJECT_ID", ""),
  storageBucket: getEnv("VITE_FIREBASE_STORAGE_BUCKET", ""),
  messagingSenderId: getEnv("VITE_FIREBASE_MESSAGING_SENDER_ID", ""),
  appId: getEnv("VITE_FIREBASE_APP_ID", ""),
  measurementId: getEnv("VITE_FIREBASE_MEASUREMENT_ID", "")
};

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let analytics: Analytics | undefined;
let db: Firestore | undefined;

try {
  // Check if an app is already initialized to prevent "Component has not been registered" errors
  if (getApps().length > 0) {
    app = getApp();
  } else if (firebaseConfig.apiKey && firebaseConfig.apiKey.length > 0) {
    app = initializeApp(firebaseConfig);
  } else {
    console.warn("Firebase API key is missing. Firebase services will be disabled.");
  }

  if (app) {
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
  }
} catch (error) {
  console.error("Firebase initialization failed:", error);
}

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
const appleProvider = new OAuthProvider('apple.com');

export { auth, db, googleProvider, facebookProvider, appleProvider, analytics };
