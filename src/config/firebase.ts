import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBkkFF0XhNZeWuDmOfEhsgdfX1VBG7WTas",
  authDomain: "social-media-feed-b3c0d.firebaseapp.com",
  projectId: "social-media-feed-b3c0d",
  storageBucket: "social-media-feed-b3c0d.appspot.com",
  messagingSenderId: "1034582141048",
  appId: "1:1034582141048:web:1234567890abcdef123456"
};

// Log config for debugging (remove in production)
console.log('Firebase Config:', {
  ...firebaseConfig,
  apiKey: '**hidden**'  // Don't log the actual API key
});

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize auth state listener
auth.onAuthStateChanged((user) => {
  console.log('Auth state changed:', user ? 'User logged in' : 'User logged out');
});
