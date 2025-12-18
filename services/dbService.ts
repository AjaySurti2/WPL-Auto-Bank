import {
    listBankAccounts,
    createBankAccount,
    listDownloadSchedules,
    createDownloadSchedule,
    updateDownloadSchedule,
    deleteDownloadSchedule,
    listStatements,
    createStatement,
    listNotifications,
    createNotification
} from '@dataconnect/generated';
import { BankAccount, SyncSchedule, ActivityLog, BankStatus } from '../types';

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
        console.log("Fetching accounts (Data Connect)...");
        const { data } = await withTimeout(listBankAccounts(), 30000, "getAccounts");
        const cloudData: BankAccount[] = data.bankAccounts.map(acc => ({
            id: acc.id,
            bankName: acc.bankName,
            bankUrl: acc.bankUrl || '',
            accountNumber: acc.accountNumber || '',
            accountNumberMasked: acc.accountNumberMasked,
            userId: '', // Data Connect doesn't expose User ID directly in this query yet
            lastSync: acc.lastSyncedAt || '',
            status: acc.connectionStatus as BankStatus,
            requiresOtp: !!acc.requiresOtp,
            logo: acc.logo || '',
            lastSyncedAt: acc.lastSyncedAt || undefined,
            accountType: acc.accountType || undefined
        }));
        saveLocal('accounts_cache', cloudData); // Update cache
        return cloudData;
    } catch (e: any) {
        console.warn("Cloud unreachable. Using Offline Mode (LocalStorage). Error:", e.message || e);
        return loadLocal<BankAccount>('accounts_cache');
    }
};

export const addAccount = async (account: Omit<BankAccount, 'id'>) => {
    try {
        const { data } = await withTimeout(createBankAccount({
            bankName: account.bankName,
            bankUrl: account.bankUrl,
            logo: account.logo,
            accountNumber: account.accountNumber,
            accountNumberMasked: account.accountNumberMasked,
            connectionStatus: account.status,
            requiresOtp: account.requiresOtp,
            accountType: account.accountType
        }), 30000, "addAccount");
        return { id: data.bankAccount_insert.id, ...account };
    } catch (e: any) {
        console.warn("Cloud unreachable. Saving Locally. Error:", e.message || e);
        const localData = loadLocal<BankAccount>('accounts_cache');
        const newAcc = { id: `local_${Date.now()}`, ...account };
        saveLocal('accounts_cache', [...localData, newAcc]);
        return newAcc as any; // Cast needed due to Omit
    }
};

export const updateAccount = async (id: string, updates: Partial<BankAccount>) => {
    // Note: Data Connect update for BankAccount not yet implemented in queries.gql
    console.warn("Update account for Data Connect not implemented yet.");
};

export const deleteAccount = async (id: string) => {
    // Note: Data Connect delete for BankAccount not yet implemented in queries.gql
    console.warn("Delete account for Data Connect not implemented yet.");
};

// Schedules
export const getSchedules = async (): Promise<SyncSchedule[]> => {
    try {
        const { data } = await withTimeout(listDownloadSchedules(), 30000, "getSchedules");
        const cloudData: SyncSchedule[] = data.downloadSchedules.map(s => ({
            id: s.id,
            bankId: s.bankAccount.id,
            frequency: s.frequency as any,
            scheduledTime: s.scheduledTime || '',
            targetFolder: s.targetFolder || '',
            storageType: (s.storageType as any) || 'Local',
            nextRun: s.nextDownloadAt,
            isActive: s.isActive,
            nextDownloadAt: s.nextDownloadAt, // internal mapping support
            lastDownloadAt: s.lastDownloadAt || undefined
        }));
        saveLocal('schedules_cache', cloudData);
        return cloudData;
    } catch { return loadLocal('schedules_cache'); }
};

export const addSchedule = async (schedule: Omit<SyncSchedule, 'id'>) => {
    try {
        const { data } = await withTimeout(createDownloadSchedule({
            bankAccountId: schedule.bankId,
            frequency: schedule.frequency,
            scheduledTime: schedule.scheduledTime,
            targetFolder: schedule.targetFolder,
            storageType: schedule.storageType,
            nextDownloadAt: schedule.nextRun,
            isActive: schedule.isActive
        }), 30000, "addSchedule");
        return { id: data.downloadSchedule_insert.id, ...schedule };
    } catch {
        const localData = loadLocal<SyncSchedule>('schedules_cache');
        const newSched = { id: `local_${Date.now()}`, ...schedule };
        saveLocal('schedules_cache', [...localData, newSched]);
        return newSched as any;
    }
};

export const updateSchedule = async (id: string, updates: Partial<SyncSchedule>) => {
    try {
        await withTimeout(updateDownloadSchedule({
            id,
            frequency: updates.frequency,
            scheduledTime: updates.scheduledTime,
            targetFolder: updates.targetFolder,
            storageType: updates.storageType,
            nextDownloadAt: updates.nextRun,
            isActive: updates.isActive,
            lastDownloadAt: (updates as any).lastDownloadAt
        }), 30000, "updateSchedule");
    } catch {
        const localData = loadLocal<SyncSchedule>('schedules_cache');
        saveLocal('schedules_cache', localData.map(s => s.id === id ? { ...s, ...updates } : s));
    }
};

export const deleteSchedule = async (id: string) => {
    try {
        await withTimeout(deleteDownloadSchedule({ id }), 30000, "deleteSchedule");
    } catch {
        const localData = loadLocal<SyncSchedule>('schedules_cache');
        saveLocal('schedules_cache', localData.filter(s => s.id !== id));
    }
};

// Logs / Statements (Mapping Statements to ActivityLog for now)
export const getLogs = async (): Promise<ActivityLog[]> => {
    try {
        const { data } = await withTimeout(listStatements(), 30000, "getLogs");
        const cloudData: ActivityLog[] = data.statements.map(s => ({
            id: s.id,
            bankName: s.bankAccount.bankName,
            action: 'Statement Download',
            timestamp: s.downloadDate,
            status: (s.status === 'SUCCESS' ? 'Success' : 'Failed') as any,
            details: `Downloaded ${s.fileName}`
        }));
        return cloudData;
    } catch { return loadLocal('logs_cache'); }
};

export const addLog = async (log: Omit<ActivityLog, 'id' | 'timestamp'>) => {
    try {
        await withTimeout(createNotification({
            message: log.details || `${log.action} for ${log.bankName}`,
            type: log.status === 'Success' ? 'INFO' : 'ERROR'
        }), 5000, "addLog");
    } catch {
        const localData = loadLocal<ActivityLog>('logs_cache');
        const newLog = { ...log, timestamp: new Date().toISOString() };
        saveLocal('logs_cache', [{ id: `local_${Date.now()}`, ...newLog } as ActivityLog, ...localData].slice(0, 50));
    }
};

// Notifications
export const getNotifications = async () => {
    try {
        const { data } = await withTimeout(listNotifications(), 30000, "getNotifications");
        return data.notifications;
    } catch { return []; }
};

export const markNotificationRead = async (id: string) => {
    // Not implemented in GQL yet
    console.warn("Mark notification read not implemented yet.");
};
