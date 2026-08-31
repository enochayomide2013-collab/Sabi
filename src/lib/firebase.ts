import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyD_YRKSII5JaridOKFV0Z9WdtYsS7fcxfE",
  authDomain: "gen-lang-client-0414855588.firebaseapp.com",
  projectId: "gen-lang-client-0414855588",
  storageBucket: "gen-lang-client-0414855588.firebasestorage.app",
  messagingSenderId: "68373253435",
  appId: "1:68373253435:web:4f73f67f2ccbb0fe493b1e"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, "ai-studio-sabi-d3e3de2e-b85b-4a83-b3ef-3e6e60816865");
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
