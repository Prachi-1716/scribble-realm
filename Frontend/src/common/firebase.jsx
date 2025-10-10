import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};



const app = initializeApp(firebaseConfig);

let analytics;
if (typeof window !== "undefined" && window.location.hostname !== "localhost") {
  analytics = getAnalytics(app);
}

// Auth Setup
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const signInWithGooglePopup = async () => {
  try {
    await setPersistence(auth, browserLocalPersistence);
    const result = await signInWithPopup(auth, provider);

    return result.user;
  } catch (error) {
    console.error("Google sign-in error:", error);
    return null;
  }
};

export { signInWithGooglePopup, auth };
