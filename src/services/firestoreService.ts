import { doc, setDoc, collection, onSnapshot, Timestamp, addDoc, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { UserProfile, SabiersChatMessage, OnlineSabier } from '../types';

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

export const updatePresenceInFirestore = async (userId: string, name: string, userDetails?: Partial<UserProfile>) => {
  try {
    if (!userId) return;
    await setDoc(doc(db, 'presence', userId), {
      userId,
      name: name || 'Spotter',
      avatarUrl: userDetails?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      trustLevel: userDetails?.trustLevel || 'Bronze',
      tier: userDetails?.userTier || 'Member',
      role: userDetails?.role || 'member',
      state: userDetails?.state || 'Lagos',
      lga: userDetails?.lga || 'Ikeja',
      lastActive: Timestamp.now()
    }, { merge: true });
  } catch (e) {
    console.warn('Firestore presence sync notice:', e);
  }
};

export const subscribeToPresenceList = (callback: (onlineSabiers: OnlineSabier[], count: number) => void) => {
  try {
    const presenceCol = collection(db, 'presence');
    
    return onSnapshot(presenceCol, (snapshot) => {
      const now = Date.now();
      const list: OnlineSabier[] = [];
      
      snapshot.docs.forEach(d => {
        const data = d.data();
        if (!data.lastActive || !data.userId) return;
        
        const lastActiveMs = data.lastActive.toMillis 
          ? data.lastActive.toMillis() 
          : new Date(data.lastActive).getTime();
          
        const diffMinutes = Math.floor((now - lastActiveMs) / 60000);
        const isOnline = diffMinutes < 5; // Consider online if active within last 5 minutes
        
        list.push({
          id: data.userId,
          name: data.name || 'Spotter',
          avatarUrl: data.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          trustLevel: data.trustLevel || 'Bronze',
          tier: data.tier || 'Member',
          role: data.role || 'member',
          state: data.state || 'Lagos',
          lga: data.lga || 'Ikeja',
          currentActivity: isOnline ? '🟢 Live on SABI' : `Active ${diffMinutes}m ago`,
          isOnline,
          lastActive: isOnline ? 'Just now' : `${diffMinutes}m ago`
        });
      });
      
      // Sort online first
      list.sort((a, b) => (b.isOnline ? 1 : 0) - (a.isOnline ? 1 : 0));

      const onlineCount = list.filter(s => s.isOnline).length;
      callback(list, onlineCount);
    }, (error) => {
      console.warn("Firestore presence subscription notice:", error?.message || error);
    });
  } catch (err) {
    console.warn("Firestore presence initialization notice:", err);
    return () => {};
  }
};

export const sendChatMessageToFirestore = async (msg: Omit<SabiersChatMessage, 'id'>) => {
  try {
    const msgCol = collection(db, 'messages');
    const docRef = await addDoc(msgCol, {
      ...msg,
      createdAt: Date.now(),
      serverTimestamp: Timestamp.now()
    });
    return docRef.id;
  } catch (e) {
    console.warn('Firestore send message notice:', e);
    return null;
  }
};

export const subscribeToChatMessages = (callback: (messages: SabiersChatMessage[]) => void) => {
  try {
    const msgCol = collection(db, 'messages');
    const q = query(msgCol, orderBy('createdAt', 'asc'), limit(100));

    return onSnapshot(q, (snapshot) => {
      const messages: SabiersChatMessage[] = [];
      snapshot.docs.forEach(d => {
        const data = d.data();
        messages.push({
          id: d.id,
          senderId: data.senderId || 'unknown',
          senderName: data.senderName || 'Anonymous',
          senderAvatar: data.senderAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          senderTrustLevel: data.senderTrustLevel || 'Bronze',
          senderRole: data.senderRole || 'member',
          senderTier: data.senderTier || 'Member',
          state: data.state || 'Lagos',
          lga: data.lga || 'Ikeja',
          channel: data.channel || 'general',
          message: data.message || '',
          timestamp: data.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          reactions: data.reactions || [],
          attachedTag: data.attachedTag
        });
      });
      callback(messages);
    }, (error) => {
      console.warn("Firestore chat subscription notice:", error?.message || error);
    });
  } catch (err) {
    console.warn("Firestore chat initialization notice:", err);
    return () => {};
  }
};
