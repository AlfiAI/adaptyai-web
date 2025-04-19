
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyBEQTeBrm5HQnV99YyZx0W8a068FA0Hb4U",
  authDomain: "adapty-ai-agency.firebaseapp.com",
  projectId: "adapty-ai-agency",
  storageBucket: "adapty-ai-agency.firebasestorage.app",
  messagingSenderId: "242986017069",
  appId: "1:242986017069:web:dcd64c9a793538fdc5f3a4",
  measurementId: "G-SKPB2HNE3P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize Analytics
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { analytics };

export default app;
