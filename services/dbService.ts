import { db } from './firebase';
import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    orderBy,
    where
} from 'firebase/firestore';
import { BankAccount, SyncSchedule, ActivityLog, User } from '../types';

// Collection References
const accountsCollection = collection(db, 'accounts');
const schedulesCollection = collection(db, 'schedules');
const logsCollection = collection(db, 'logs');

// Helper to prevent infinite hangs and provide offline fallback
const withTimeout = <T>(promise: Promise<T>, ms: number = 5000, opName: string): Promise<T> => {
    return Promise.race([
        promise,
        new Promise<T>((_, reject) =>
            setTimeout(() => reject(new Error(`${opName} timed out`)), ms)
        )
    ]);
};

// --- Offline Storage Helpers ---
const loadLocal = <T>(key: string): T[] => {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    } catch { return []; }
};
const saveLocal = <T>(key: string, data: T[]) => localStorage.setItem(key, JSON.stringify(data));

// Accounts
export const getAccounts = async (): Promise<BankAccount[]> => {
    try {
        console.log("Fetching accounts (Cloud)...");
        const snapshot = await withTimeout(getDocs(accountsCollection), 30000, "getAccounts");
        const cloudData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BankAccount));
        saveLocal('accounts_cache', cloudData); // Update cache
        return cloudData;
    } catch (e: any) {
        console.warn("Cloud unreachable. Using Offline Mode (LocalStorage). Error:", e.message || e);
        return loadLocal<BankAccount>('accounts_cache');
    }
};

export const addAccount = async (account: Omit<BankAccount, 'id'>) => {
    try {
        const docRef = await withTimeout(addDoc(accountsCollection, account), 30000, "addAccount");
        return { id: docRef.id, ...account };
    } catch (e: any) {
        console.warn("Cloud unreachable. Saving Locally. Error:", e.message || e);
        const localData = loadLocal<BankAccount>('accounts_cache');
        const newAcc = { id: `local_${Date.now()}`, ...account };
        saveLocal('accounts_cache', [...localData, newAcc]);
        return newAcc;
    }
};

export const updateAccount = async (id: string, updates: Partial<BankAccount>) => {
    try {
        const docRef = doc(db, 'accounts', id);
        await withTimeout(updateDoc(docRef, updates), 30000, "updateAccount");
    } catch (e: any) {
        console.warn("Cloud unreachable. Updating Locally. Error:", e.message || e);
        const localData = loadLocal<BankAccount>('accounts_cache');
        const updated = localData.map(a => a.id === id ? { ...a, ...updates } : a);
        saveLocal('accounts_cache', updated);
    }
};

export const deleteAccount = async (id: string) => {
    try {
        const docRef = doc(db, 'accounts', id);
        await withTimeout(deleteDoc(docRef), 30000, "deleteAccount");
    } catch (e: any) {
        console.warn("Deleting Locally. Error:", e.message || e);
        const localData = loadLocal<BankAccount>('accounts_cache');
        saveLocal('accounts_cache', localData.filter(a => a.id !== id));
    }
};

// Schedules
export const getSchedules = async (): Promise<SyncSchedule[]> => {
    try {
        const snapshot = await withTimeout(getDocs(schedulesCollection), 30000, "getSchedules");
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SyncSchedule));
    } catch { return loadLocal('schedules_cache'); }
};

export const addSchedule = async (schedule: Omit<SyncSchedule, 'id'>) => {
    try {
        const docRef = await withTimeout(addDoc(schedulesCollection, schedule), 30000, "addSchedule");
        return { id: docRef.id, ...schedule };
    } catch {
        const localData = loadLocal<SyncSchedule>('schedules_cache');
        const newSched = { id: `local_${Date.now()}`, ...schedule };
        saveLocal('schedules_cache', [...localData, newSched]);
        return newSched;
    }
};

export const updateSchedule = async (id: string, updates: Partial<SyncSchedule>) => {
    try {
        const docRef = doc(db, 'schedules', id);
        await withTimeout(updateDoc(docRef, updates), 30000, "updateSchedule");
    } catch {
        const localData = loadLocal<SyncSchedule>('schedules_cache');
        saveLocal('schedules_cache', localData.map(s => s.id === id ? { ...s, ...updates } : s));
    }
};

export const deleteSchedule = async (id: string) => {
    try {
        const docRef = doc(db, 'schedules', id);
        await withTimeout(deleteDoc(docRef), 30000, "deleteSchedule");
    } catch {
        const localData = loadLocal<SyncSchedule>('schedules_cache');
        saveLocal('schedules_cache', localData.filter(s => s.id !== id));
    }
};

// Logs
export const getLogs = async (): Promise<ActivityLog[]> => {
    try {
        const q = query(logsCollection, orderBy('timestamp', 'desc'));
        const snapshot = await withTimeout(getDocs(q), 30000, "getLogs");
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ActivityLog));
    } catch { return loadLocal('logs_cache'); }
};

export const addLog = async (log: Omit<ActivityLog, 'id' | 'timestamp'>) => {
    const newLog = { ...log, timestamp: new Date().toISOString() };
    try {
        // Logs can be faster, but let's give them 5s just in case
        await withTimeout(addDoc(logsCollection, newLog), 5000, "addLog");
    } catch {
        const localData = loadLocal<ActivityLog>('logs_cache');
        saveLocal('logs_cache', [{ id: `local_${Date.now()}`, ...newLog } as ActivityLog, ...localData].slice(0, 50));
    }
};

// Users (Managed List)
const usersCollection = collection(db, 'users');

export const getUsers = async (): Promise<User[]> => {
    try {
        const snapshot = await withTimeout(getDocs(usersCollection), 5000, "getUsers");
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
    } catch { return []; }
};

export const addUser = async (user: Omit<User, 'id'>) => {
    // Only cloud users supported for now
    const docRef = await addDoc(usersCollection, user);
    return { id: docRef.id, ...user };
};

export const deleteUser = async (id: string) => {
    const docRef = doc(db, 'users', id);
    await deleteDoc(docRef);
};
