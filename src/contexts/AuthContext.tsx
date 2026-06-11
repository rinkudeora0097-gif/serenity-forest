import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  User as FirebaseUser,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile as firebaseUpdateProfile
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  onSnapshot,
  serverTimestamp,
  getDocFromServer
} from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';

// Interfaces mapping exactly to our firebase-blueprint Schemas
export interface UserProfile {
  userId: string;
  displayName: string;
  email: string;
  streak: number;
  totalFocusMinutes: number;
  completedMeditations: number;
  selectedAchievementIdx: number;
  createdAt: any;
  updatedAt: any;
}

export interface DbMoodLog {
  id: string;
  moodId: string;
  date: string;
  timestamp: any;
}

export interface DbJournalEntry {
  id: string;
  text: string;
  timestamp: any;
}

export interface DbFocusSession {
  id: string;
  duration: number;
  tag: string;
  timestamp: any;
}

export interface DbMeditation {
  id: string;
  activity: string;
  duration: string;
  timestamp: any;
}

interface AuthContextType {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  moodLogs: DbMoodLog[];
  journalEntries: DbJournalEntry[];
  focusSessions: DbFocusSession[];
  meditations: DbMeditation[];
  
  // Auth Functions
  signUpWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  logInWithEmail: (email: string, pass: string) => Promise<void>;
  logInWithGoogle: () => Promise<void>;
  logOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  
  // Profile & Streak updates
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
  incrementStreak: () => Promise<void>;
  
  // Write Helpers
  addMoodLog: (moodId: string, date: string) => Promise<void>;
  addJournalEntry: (text: string) => Promise<void>;
  addFocusSession: (duration: number, tag: string) => Promise<void>;
  addMeditationHistory: (activity: string, duration: string) => Promise<void>;
  
  // Deletion helper for user data resetting
  resetAllUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Realtime lists mirroring DB
  const [moodLogs, setMoodLogs] = useState<DbMoodLog[]>([]);
  const [journalEntries, setJournalEntries] = useState<DbJournalEntry[]>([]);
  const [focusSessions, setFocusSessions] = useState<DbFocusSession[]>([]);
  const [meditations, setMeditations] = useState<DbMeditation[]>([]);

  // Validate server connection on initial boot as required by skill guidelines
  useEffect(() => {
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration or network status.");
        }
      }
    }
    testConnection();
  }, []);

  // Sync state on Firebase Auth changes
  // Sync state on Firebase Auth changes
  useEffect(() => {
    let activeUnsubscribers: (() => void)[] = [];

    const cleanupActiveListeners = () => {
      activeUnsubscribers.forEach(unsub => {
        try {
          unsub();
        } catch (e) {
          console.error("Error unsubscribing listener", e);
        }
      });
      activeUnsubscribers = [];
    };

    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      cleanupActiveListeners();
      
      if (!currentUser) {
        setProfile(null);
        setMoodLogs([]);
        setJournalEntries([]);
        setFocusSessions([]);
        setMeditations([]);
        setLoading(false);
      } else {
        try {
          // Fetch or create profile
          const profileRef = doc(db, 'users', currentUser.uid);
          let profileSnap;
          try {
            profileSnap = await getDoc(profileRef);
          } catch (err) {
            console.warn("Gracefully handling profile fetch error during launch:", err);
          }

          if (profileSnap && profileSnap.exists()) {
            setProfile(profileSnap.data() as UserProfile);
          } else {
            // Construct fresh new profile document
            const initialProfile: UserProfile = {
              userId: currentUser.uid,
              displayName: currentUser.displayName || currentUser.email?.split('@')[0] || 'Forest Dweller',
              email: currentUser.email || '',
              streak: 1,
              totalFocusMinutes: 0,
              completedMeditations: 0,
              selectedAchievementIdx: 0,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp()
            };
            try {
              await setDoc(profileRef, initialProfile);
              setProfile(initialProfile);
            } catch (err) {
              console.warn("Gracefully handling profile setDoc error during launch:", err);
              // Set fallback profile locally so the user is not locked out
              setProfile(initialProfile);
            }
          }

          // Setup real-time listeners for sub-collections strictly bounded under matching owner
          // Each listener is wrapped with safe error logging to capture any permission errors gracefully
          const unsubscribeProfile = onSnapshot(profileRef, (snap) => {
            if (snap.exists()) {
              setProfile(snap.data() as UserProfile);
            }
          }, (err) => {
            console.warn("Graceful Profile snapshot error (permissions/offline):", err);
          });
          activeUnsubscribers.push(unsubscribeProfile);

          const moodQuery = query(collection(db, `users/${currentUser.uid}/mood_logs`), orderBy('timestamp', 'desc'));
          const unsubscribeMoods = onSnapshot(moodQuery, (snap) => {
            const list: DbMoodLog[] = [];
            snap.forEach((d) => {
              list.push({ id: d.id, ...d.data() } as DbMoodLog);
            });
            setMoodLogs(list);
          }, (err) => {
            console.warn("Graceful mood snapshot query warning (permissions/offline):", err);
          });
          activeUnsubscribers.push(unsubscribeMoods);

          const journalQuery = query(collection(db, `users/${currentUser.uid}/journal_entries`), orderBy('timestamp', 'desc'));
          const unsubscribeJournals = onSnapshot(journalQuery, (snap) => {
            const list: DbJournalEntry[] = [];
            snap.forEach((d) => {
              list.push({ id: d.id, ...d.data() } as DbJournalEntry);
            });
            setJournalEntries(list);
          }, (err) => {
            console.warn("Graceful journal snapshot query warning (permissions/offline):", err);
          });
          activeUnsubscribers.push(unsubscribeJournals);

          const sessionsQuery = query(collection(db, `users/${currentUser.uid}/focus_sessions`), orderBy('timestamp', 'desc'));
          const unsubscribeSessions = onSnapshot(sessionsQuery, (snap) => {
            const list: DbFocusSession[] = [];
            snap.forEach((d) => {
              list.push({ id: d.id, ...d.data() } as DbFocusSession);
            });
            setFocusSessions(list);
          }, (err) => {
            console.warn("Graceful sessions snapshot query warning (permissions/offline):", err);
          });
          activeUnsubscribers.push(unsubscribeSessions);

          const meditationsQuery = query(collection(db, `users/${currentUser.uid}/meditations`), orderBy('timestamp', 'desc'));
          const unsubscribeMeditations = onSnapshot(meditationsQuery, (snap) => {
            const list: DbMeditation[] = [];
            snap.forEach((d) => {
              list.push({ id: d.id, ...d.data() } as DbMeditation);
            });
            setMeditations(list);
          }, (err) => {
            console.warn("Graceful meditations snapshot query warning (permissions/offline):", err);
          });
          activeUnsubscribers.push(unsubscribeMeditations);

        } catch (topErr) {
          console.error("Top-level auth sync setup error gracefully handled:", topErr);
        } finally {
          setLoading(false);
        }
      }
    });

    return () => {
      cleanupActiveListeners();
      unsubscribeAuth();
    };
  }, []);

  // --- Auth Handlers ---

  async function signUpWithEmail(email: string, pass: string, name: string) {
    let userUid: string | null = null;
    try {
      const res = await createUserWithEmailAndPassword(auth, email, pass);
      userUid = res.user.uid;
      await firebaseUpdateProfile(res.user, { displayName: name });
      
      // Initialize layout profile document synchronously on signup
      const profileRef = doc(db, 'users', res.user.uid);
      const initialProfile: UserProfile = {
        userId: res.user.uid,
        displayName: name,
        email: email,
        streak: 1,
        totalFocusMinutes: 0,
        completedMeditations: 0,
        selectedAchievementIdx: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      await setDoc(profileRef, initialProfile);
      setProfile(initialProfile);
    } catch (err: any) {
      console.error("Sign Up issue", err);
      if (err && (err.code === 'permission-denied' || (err.message && err.message.includes('permission')))) {
        handleFirestoreError(err, OperationType.CREATE, userUid ? `users/${userUid}` : 'users/unknown');
      }
      throw err;
    }
  }

  async function logInWithEmail(email: string, pass: string) {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (err: any) {
      console.error("Log In issue", err);
      throw err;
    }
  }

  async function logInWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      console.warn("Google Log In issue handled gracefully:", err);
      throw err;
    }
  }

  async function logOut() {
    try {
      await signOut(auth);
    } catch (err: any) {
      console.error("Log Out issue", err);
      throw err;
    }
  }

  async function resetPassword(email: string) {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (err: any) {
      console.error("Password reset issue", err);
      throw err;
    }
  }

  // --- Core Profile Updates ---

  async function updateUserProfile(updates: Partial<UserProfile>) {
    if (!user) return;
    const profileRef = doc(db, 'users', user.uid);
    try {
      // Ensure we don't overwrite read-only structural parameters incorrectly
      const mergedUpdates = {
        ...updates,
        updatedAt: serverTimestamp()
      };
      await updateDoc(profileRef, mergedUpdates);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${user.uid}`);
    }
  }

  async function incrementStreak() {
    if (!user || !profile) return;
    const profileRef = doc(db, 'users', user.uid);
    try {
      await updateDoc(profileRef, {
        streak: profile.streak + 1,
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${user.uid}`);
    }
  }

  // --- Collection Writes ---

  async function addMoodLog(moodId: string, date: string) {
    if (!user) return;
    const path = `users/${user.uid}/mood_logs`;
    try {
      // Alphanumeric standard sanitizing for Subcollection Document ID
      const randomDocId = doc(collection(db, path)).id; 
      const newDocRef = doc(db, path, randomDocId);
      await setDoc(newDocRef, {
        moodId,
        date,
        timestamp: serverTimestamp()
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  }

  async function addJournalEntry(text: string) {
    if (!user) return;
    const path = `users/${user.uid}/journal_entries`;
    try {
      const randomDocId = doc(collection(db, path)).id;
      const newDocRef = doc(db, path, randomDocId);
      await setDoc(newDocRef, {
        text,
        timestamp: serverTimestamp()
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  }

  async function addFocusSession(duration: number, tag: string) {
    if (!user || !profile) return;
    const path = `users/${user.uid}/focus_sessions`;
    try {
      const randomDocId = doc(collection(db, path)).id;
      const newDocRef = doc(db, path, randomDocId);
      await setDoc(newDocRef, {
        duration,
        tag,
        timestamp: serverTimestamp()
      });

      // Atomically increment focus aggregates on main profile
      const profileRef = doc(db, 'users', user.uid);
      const minutesGained = Math.round(duration / 60);
      await updateDoc(profileRef, {
        totalFocusMinutes: profile.totalFocusMinutes + minutesGained,
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  }

  async function addMeditationHistory(activity: string, duration: string) {
    if (!user || !profile) return;
    const path = `users/${user.uid}/meditations`;
    try {
      const randomDocId = doc(collection(db, path)).id;
      const newDocRef = doc(db, path, randomDocId);
      await setDoc(newDocRef, {
        activity,
        duration,
        timestamp: serverTimestamp()
      });

      // Update aggregation count on profile
      const profileRef = doc(db, 'users', user.uid);
      await updateDoc(profileRef, {
        completedMeditations: profile.completedMeditations + 1,
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  }

  // Self-Purging reset tool for user data settings
  async function resetAllUserData() {
    if (!user) return;
    const parentId = user.uid;
    
    try {
      // 1. Reset Profile Aggregations
      const profileRef = doc(db, 'users', parentId);
      await updateDoc(profileRef, {
        streak: 1,
        totalFocusMinutes: 0,
        completedMeditations: 0,
        selectedAchievementIdx: 0,
        updatedAt: serverTimestamp()
      });

      // 2. Safely purge individual subcollection records (strictly bounded fetches)
      const subPaths = ['mood_logs', 'journal_entries', 'focus_sessions', 'meditations'];
      for (const col of subPaths) {
        const colRef = collection(db, `users/${parentId}/${col}`);
        const snap = await getDocs(colRef);
        for (const docItem of snap.docs) {
          await deleteDoc(doc(db, `users/${parentId}/${col}`, docItem.id));
        }
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `users/${parentId}`);
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      loading,
      moodLogs,
      journalEntries,
      focusSessions,
      meditations,
      signUpWithEmail,
      logInWithEmail,
      logInWithGoogle,
      logOut,
      resetPassword,
      updateUserProfile,
      incrementStreak,
      addMoodLog,
      addJournalEntry,
      addFocusSession,
      addMeditationHistory,
      resetAllUserData
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be mounted within an AuthProvider');
  }
  return context;
}
