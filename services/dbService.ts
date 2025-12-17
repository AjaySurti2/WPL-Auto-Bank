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

// Helper to prevent infinite hangs
const withTimeout = <T>(promise: Promise<T>, ms: number = 30000, opName: string): Promise<T> => {
    return Promise.race([
        promise,
        new Promise<T>((_, reject) =>
            setTimeout(() => reject(new Error(`${opName} timed out after ${ms}ms. Check your network or Firebase config.`)), ms)
        )
    ]);
};

// Accounts
export const getAccounts = async (): Promise<BankAccount[]> => {
    try {
        console.log("Fetching accounts...");
        const snapshot = await withTimeout(getDocs(accountsCollection), 30000, "getAccounts");
        console.log(`Fetched ${snapshot.docs.length} accounts`);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BankAccount));
    } catch (e) {
        console.error("getAccounts failed:", e);
        throw e;
    }
};

export const addAccount = async (account: Omit<BankAccount, 'id'>) => {
    console.log("Adding account:", account.bankName);
    const docRef = await withTimeout(addDoc(accountsCollection, account), 30000, "addAccount");
    console.log("Account added with ID:", docRef.id);
    return { id: docRef.id, ...account };
};

export const updateAccount = async (id: string, updates: Partial<BankAccount>) => {
    console.log("Updating account:", id);
    const docRef = doc(db, 'accounts', id);
    await withTimeout(updateDoc(docRef, updates), 30000, "updateAccount");
    console.log("Account updated");
};

export const deleteAccount = async (id: string) => {
    const docRef = doc(db, 'accounts', id);
    await deleteDoc(docRef);
};

// Schedules
export const getSchedules = async (): Promise<SyncSchedule[]> => {
    const snapshot = await getDocs(schedulesCollection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SyncSchedule));
};

export const addSchedule = async (schedule: Omit<SyncSchedule, 'id'>) => {
    const docRef = await addDoc(schedulesCollection, schedule);
    return { id: docRef.id, ...schedule };
};

export const updateSchedule = async (id: string, updates: Partial<SyncSchedule>) => {
    const docRef = doc(db, 'schedules', id);
    await updateDoc(docRef, updates);
};

export const deleteSchedule = async (id: string) => {
    const docRef = doc(db, 'schedules', id);
    await deleteDoc(docRef);
};

// Logs
export const getLogs = async (): Promise<ActivityLog[]> => {
    const q = query(logsCollection, orderBy('timestamp', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ActivityLog));
};

export const addLog = async (log: Omit<ActivityLog, 'id' | 'timestamp'>) => {
    await addDoc(logsCollection, { ...log, timestamp: new Date().toISOString() });
};

// Users (Managed List)
const usersCollection = collection(db, 'users');

export const getUsers = async (): Promise<User[]> => {
    const snapshot = await getDocs(usersCollection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
};

export const addUser = async (user: Omit<User, 'id'>) => {
    const docRef = await addDoc(usersCollection, user);
    return { id: docRef.id, ...user };
};

export const deleteUser = async (id: string) => {
    const docRef = doc(db, 'users', id);
    await deleteDoc(docRef);
};
