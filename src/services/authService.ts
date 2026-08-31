import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';

export const AuthService = {
  signInWithGoogle: () => signInWithPopup(auth, googleProvider),
  signOut: () => signOut(auth),
  onAuthStateChanged: (callback: (user: User | null) => void) => onAuthStateChanged(auth, callback),
};
