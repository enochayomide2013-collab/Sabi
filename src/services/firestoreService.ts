import { doc, setDoc, collection, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { UserProfile } from '../types';

export const saveUserToFirestore = async (user: UserProfile) => {
  try {
    if (!user || !user.id) return;
    await setDoc(doc(db, 'users', user.id), {
      ...user,
      lastUpdated: Timestamp.now()
    }, { merge: true });
  } catch (e) {
    console.warn('Firestore user sync notice:', e);
  }
};

export const updatePresenceInFirestore = async (userId: string, name: string) => {
  try {
    if (!userId) return;
    await setDoc(doc(db, 'presence', userId), {
      userId,
      name: name || 'Spotter',
      lastActive: Timestamp.now()
    }, { merge: true });
  } catch (e) {
    console.warn('Firestore presence sync notice:', e);
  }
};

export const subscribeToPresenceList = (callback: (activeUserIds: string[]) => void) => {
  try {
    const presenceCol = collection(db, 'presence');
    
    return onSnapshot(presenceCol, (snapshot) => {
      const now = Date.now();
      const activeIds: string[] = [];
      
      snapshot.docs.forEach(d => {
        const data = d.data();
        if (!data.lastActive || !data.userId) return;
        
        const lastActiveMs = data.lastActive.toMillis 
          ? data.lastActive.toMillis() 
          : new Date(data.lastActive).getTime();
          
        // A user is considered active if they sent a heartbeat in the last 2 minutes
        if ((now - lastActiveMs) < 2 * 60 * 1000) {
          activeIds.push(data.userId);
        }
      });
      
      callback(activeIds);
    }, (error) => {
      console.warn("Firestore presence subscription notice:", error?.message || error);
    });
  } catch (err) {
    console.warn("Firestore initialization notice:", err);
    return () => {};
  }
};
