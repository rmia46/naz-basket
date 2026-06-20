import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const clientCredentials = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Check if we have valid client credentials from env
const hasEnvCredentials = !!(clientCredentials.apiKey && clientCredentials.projectId);

let firebaseConfig = { ...clientCredentials };

// If we are in the browser and env credentials are missing, check localStorage
if (typeof window !== 'undefined' && !hasEnvCredentials) {
  const localConfig = localStorage.getItem('launchpad_firebase_config');
  if (localConfig) {
    try {
      const parsed = JSON.parse(localConfig);
      if (parsed.apiKey && parsed.projectId) {
        firebaseConfig = parsed;
      }
    } catch (e) {
      console.error('Error parsing local firebase config', e);
    }
  }
}

// Initialize Firebase variables
let app: any = null;
let auth: any = null;
let db: any = null;
let googleProvider: any = null;

const isFirebaseInitialized = () => {
  return !!(firebaseConfig && firebaseConfig.apiKey && firebaseConfig.projectId);
};

if (isFirebaseInitialized()) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
    googleProvider = new GoogleAuthProvider();
  } catch (error) {
    console.error('Firebase initialization error', error);
  }
}

export { app, auth, db, googleProvider, isFirebaseInitialized, hasEnvCredentials };
export function getFirebaseConfig() {
  return firebaseConfig;
}
export function saveFirebaseConfig(config: typeof clientCredentials) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('launchpad_firebase_config', JSON.stringify(config));
    window.location.reload();
  }
}
export function clearFirebaseConfig() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('launchpad_firebase_config');
    window.location.reload();
  }
}
