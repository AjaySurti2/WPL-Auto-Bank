import {
    listBankAccounts,
    createBankAccount,
    updateBankAccount,
    deleteBankAccount,
    listDownloadSchedules,
    createDownloadSchedule,
    updateDownloadSchedule,
    deleteDownloadSchedule,
    listStatements,
    createStatement,
    listNotifications,
    createNotification,
    markNotificationRead as markNotificationReadDC,
    createUser,
    getUser
} from '@dataconnect/generated';
import { dataconnect } from './firebase';
import { BankAccount, SyncSchedule, ActivityLog, BankStatus, User } from '../types';

// Helper to prevent infinite hangs and provide offline fallback
const withTimeout = <T>(promise: Promise<T>, ms: number = 10000, opName: string): Promise<T> => {
    return Promise.race([
        promise,
        new Promise<T>((_, reject) =>
            setTimeout(() => reject(new Error(`${opName} timed out`)), ms)
        )
    ]);
};

// --- User Synchronization ---
export const syncUser = async (user: User) => {
    try {
        console.log("Checking user in Data Connect...");
        const { data } = await withTimeout(getUser(dataconnect), 10000, "getUser");
        if (!data.user) {
            console.log("User missing in Data Connect. Creating...");
            await withTimeout(createUser(dataconnect, {
                displayName: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                photoUrl: user.avatar
            }), 10000, "createUser");
            console.log("User created in Data Connect.");
        }
    } catch (e: any) {
        console.warn("Failed to sync user with Data Connect:", e.message || e);
    }
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
        const { data } = await withTimeout(listBankAccounts(dataconnect), 30000, "getAccounts");
        const cloudData: BankAccount[] = data.bankAccounts.map(acc => ({
            id: acc.id,
            bankName: acc.bankName,
            bankUrl: acc.bankUrl || '',
            accountNumber: acc.accountNumber || '',
            accountNumberMasked: acc.accountNumberMasked,
            userId: '',
            lastSync: acc.lastSyncedAt || '',
            status: acc.connectionStatus as BankStatus,
            requiresOtp: !!acc.requiresOtp,
            logo: acc.logo || '',
            lastSyncedAt: acc.lastSyncedAt || undefined,
            accountType: acc.accountType || undefined
        }));
        console.log(`[Cloud] Success: Fetched ${cloudData.length} accounts.`);
        saveLocal('accounts_cache', cloudData);
        return cloudData;
    } catch (e: any) {
        console.warn(`[Cloud] Sync Failed (getAccounts): ${e.message || e}. Using LOCAL fallback.`);
        return loadLocal<BankAccount>('accounts_cache');
    }
};

export const addAccount = async (account: Omit<BankAccount, 'id'>) => {
    try {
        const { data } = await withTimeout(createBankAccount(dataconnect, {
            bankName: account.bankName,
            bankUrl: account.bankUrl,
            logo: account.logo,
            accountNumber: account.accountNumber,
            accountNumberMasked: account.accountNumberMasked,
            connectionStatus: account.status,
            requiresOtp: account.requiresOtp,
            accountType: account.accountType
        }), 30000, "addAccount");

        // Robust ID extraction for Data Connect's KeyOutput
        const newId = (data.bankAccount_insert as any)?.id || data.bankAccount_insert;
        const newAcc = {
            id: typeof newId === 'string' ? newId : `local_${Date.now()}`,
            ...account
        };

        console.log(`[Cloud] Success: Account created with ID: ${newAcc.id}`);

        const localData = loadLocal<BankAccount>('accounts_cache');
        saveLocal('accounts_cache', [...localData, newAcc as BankAccount]);

        return newAcc;
    } catch (e: any) {
        console.warn(`[Cloud] Sync Failed (addAccount): ${e.message || e}. Using LOCAL fallback.`);
        const localData = loadLocal<BankAccount>('accounts_cache');
        const newAcc = { id: `local_${Date.now()}`, ...account };
        saveLocal('accounts_cache', [...localData, newAcc]);
        return newAcc as any;
    }
};

export const updateAccount = async (id: string, updates: Partial<BankAccount>) => {
    try {
        await withTimeout(updateBankAccount(dataconnect, {
            id,
            bankName: updates.bankName,
            bankUrl: updates.bankUrl,
            logo: updates.logo,
            accountNumber: updates.accountNumber,
            accountNumberMasked: updates.accountNumberMasked,
            connectionStatus: updates.status,
            requiresOtp: updates.requiresOtp,
            accountType: updates.accountType
        }), 30000, "updateAccount");
        const localData = loadLocal<BankAccount>('accounts_cache');
        saveLocal('accounts_cache', localData.map(a => a.id === id ? { ...a, ...updates } : a));
    } catch (e: any) {
        console.warn(`[Cloud] Sync Failed (updateAccount): ${e.message || e}. Using LOCAL fallback.`);
        const localData = loadLocal<BankAccount>('accounts_cache');
        saveLocal('accounts_cache', localData.map(a => a.id === id ? { ...a, ...updates } : a));
    }
};

export const deleteAccount = async (id: string) => {
    try {
        await withTimeout(deleteBankAccount(dataconnect, { id }), 30000, "deleteAccount");
        const localData = loadLocal<BankAccount>('accounts_cache');
        saveLocal('accounts_cache', localData.filter(a => a.id !== id));
    } catch (e: any) {
        console.warn(`[Cloud] Sync Failed (deleteAccount): ${e.message || e}. Using LOCAL fallback.`);
        const localData = loadLocal<BankAccount>('accounts_cache');
        saveLocal('accounts_cache', localData.filter(a => a.id !== id));
    }
};

// Schedules
export const getSchedules = async (): Promise<SyncSchedule[]> => {
    try {
        const { data } = await withTimeout(listDownloadSchedules(dataconnect), 30000, "getSchedules");
        const cloudData: SyncSchedule[] = data.downloadSchedules.map(s => ({
            id: s.id,
            bankId: s.bankAccount.id,
            frequency: s.frequency as any,
            scheduledTime: s.scheduledTime || '',
            targetFolder: s.targetFolder || '',
            storageType: (s.storageType as any) || 'Local',
            nextRun: s.nextDownloadAt,
            isActive: s.isActive,
            nextDownloadAt: s.nextDownloadAt,
            lastDownloadAt: s.lastDownloadAt || undefined
        }));
        saveLocal('schedules_cache', cloudData);
        return cloudData;
    } catch { return loadLocal('schedules_cache'); }
};

export const addSchedule = async (schedule: Omit<SyncSchedule, 'id'>) => {
    try {
        console.log(`[Cloud] Attempting to create schedule for bank: ${schedule.bankId}`);

        // Final sanity check for timestamp format
        let timestamp = schedule.nextRun;
        try {
            new Date(timestamp).toISOString();
        } catch {
            console.warn("[Cloud] Invalid timestamp in schedule. Resetting to now.");
            timestamp = new Date().toISOString();
        }

        const { data } = await withTimeout(createDownloadSchedule(dataconnect, {
            bankAccountId: schedule.bankId,
            frequency: schedule.frequency,
            scheduledTime: schedule.scheduledTime,
            targetFolder: schedule.targetFolder,
            storageType: schedule.storageType,
            nextDownloadAt: timestamp,
            isActive: schedule.isActive
        }), 30000, "addSchedule");

        // Robust ID extraction
        const newId = (data.downloadSchedule_insert as any)?.id || data.downloadSchedule_insert;
        const newSched = {
            id: typeof newId === 'string' ? newId : `local_sched_${Date.now()}`,
            ...schedule,
            nextRun: timestamp
        };

        console.log(`[Cloud] Success: Schedule created with ID: ${newSched.id}`);

        const localData = loadLocal<SyncSchedule>('schedules_cache');
        saveLocal('schedules_cache', [...localData, newSched as SyncSchedule]);

        return newSched;
    } catch (e: any) {
        console.error(`[Cloud] Sync Failed (addSchedule):`, e);
        const localData = loadLocal<SyncSchedule>('schedules_cache');
        const newSched = { id: `local_${Date.now()}`, ...schedule };
        saveLocal('schedules_cache', [...localData, newSched]);
        return newSched as any;
    }
};

export const updateSchedule = async (id: string, updates: Partial<SyncSchedule>) => {
    try {
        await withTimeout(updateDownloadSchedule(dataconnect, {
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
        await withTimeout(deleteDownloadSchedule(dataconnect, { id }), 30000, "deleteSchedule");
    } catch {
        const localData = loadLocal<SyncSchedule>('schedules_cache');
        saveLocal('schedules_cache', localData.filter(s => s.id !== id));
    }
};

// Logs / Statements
export const getLogs = async (): Promise<ActivityLog[]> => {
    try {
        const { data } = await withTimeout(listStatements(dataconnect), 30000, "getLogs");
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
        await withTimeout(createNotification(dataconnect, {
            message: log.details || `${log.action} for ${log.bankName}`,
            type: log.status === 'Success' ? 'INFO' : 'ERROR'
        }), 10000, "addLog");
    } catch {
        const localData = loadLocal<ActivityLog>('logs_cache');
        const newLog = { ...log, timestamp: new Date().toISOString() };
        saveLocal('logs_cache', [{ id: `local_${Date.now()}`, ...newLog } as ActivityLog, ...localData].slice(0, 50));
    }
};

// Notifications
export const getNotifications = async () => {
    try {
        const { data } = await withTimeout(listNotifications(dataconnect), 30000, "getNotifications");
        return data.notifications;
    } catch { return []; }
};

export const markNotificationRead = async (id: string) => {
    try {
        await withTimeout(markNotificationReadDC(dataconnect, { id }), 10000, "markNotificationRead");
    } catch (e: any) {
        console.warn(`[Cloud] Sync Failed (markNotificationRead): ${e.message || e}.`);
    }
};

export const getUsers = async (): Promise<User[]> => {
    try {
        const { data } = await withTimeout(getUser(dataconnect), 10000, "getUsers");
        if (data.user) {
            return [{
                id: data.user.id,
                name: data.user.displayName,
                email: data.user.email,
                role: data.user.role as any,
                avatar: data.user.avatar || '👤'
            }];
        }
        return [];
    } catch {
        return loadLocal<User>('users_cache');
    }
};

export const addUser = async (user: Omit<User, 'id'>) => {
    try {
        const { data } = await withTimeout(createUser(dataconnect, {
            displayName: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            photoUrl: user.avatar
        }), 10000, "addUser");

        const newId = (data.user_insert as any)?.id || data.user_insert;
        const newUser = { id: typeof newId === 'string' ? newId : `local_user_${Date.now()}`, ...user };

        const localData = loadLocal<User>('users_cache');
        saveLocal('users_cache', [...localData, newUser as User]);
        return newUser;
    } catch (e: any) {
        console.error(`[Cloud] Sync Failed (addUser):`, e);
        const newUser = { id: `local_${Date.now()}`, ...user } as User;
        const localData = loadLocal<User>('users_cache');
        saveLocal('users_cache', [...localData, newUser]);
        return newUser;
    }
};

export const deleteUser = async (id: string) => {
    // Note: deleteUser mutation would need to be added to queries.gql
    // For now we just clean local cache
    const localData = loadLocal<User>('users_cache');
    saveLocal('users_cache', localData.filter(u => u.id !== id));
};
