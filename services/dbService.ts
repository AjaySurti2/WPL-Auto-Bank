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
    getUser,
    listUsers,
    adminUpsertUser,
    updateUserProfile,
    deleteUser as deleteUserDC
} from '@dataconnect/generated';
import { dataconnect } from './firebase';
import { BankAccount, DownloadSchedule, ActivityLog, BankStatus, User } from '../types';

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
                displayName: user.displayName,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                photoUrl: user.avatar
            }), 10000, "createUser");
            console.log("User synced with Data Connect.");
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
        console.log("Fetching accounts (Data Connect: Shared Mode)...");
        const response = await withTimeout(listBankAccounts(dataconnect), 30000, "getAccounts");

        if (!response || !response.data) {
            throw new Error("Empty response from cloud service");
        }

        const cloudData: BankAccount[] = response.data.bankAccounts.map(acc => ({
            id: acc.id,
            bankName: acc.bankName,
            bankUrl: acc.bankUrl || '',
            accountNumber: acc.accountNumber || '',
            accountNumberMasked: acc.accountNumberMasked,
            userId: (acc as any).userId || 'Shared',
            creatorName: (acc as any).creatorName,
            lastSyncedAt: acc.lastSyncedAt || '',
            connectionStatus: acc.connectionStatus as BankStatus,
            requiresOtp: !!acc.requiresOtp,
            logo: acc.logo || '',
            accountType: acc.accountType || undefined
        }));

        console.log(`[Cloud] ✅ Successfully fetched ${cloudData.length} organization bank accounts.`);
        saveLocal('accounts_cache', cloudData);
        return cloudData;
    } catch (e: any) {
        console.error(`[Cloud] ❌ getAccounts failed:`, e);
        const cached = loadLocal<BankAccount>('accounts_cache');
        console.log(`[Cloud] Falling back to local cache (${cached.length} items).`);
        return cached;
    }
};

export const addAccount = async (account: Omit<BankAccount, 'id'>) => {
    try {
        const { data } = await withTimeout(createBankAccount(dataconnect, {
            bankName: account.bankName,
            bankUrl: account.bankUrl,
            logo: account.logo,
            accountNumberMasked: account.accountNumberMasked,
            connectionStatus: account.connectionStatus,
            requiresOtp: account.requiresOtp,
            accountType: account.accountType,
            creatorName: account.creatorName // Store the human name in creatorName
        } as any), 30000, "addAccount");

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
            accountNumberMasked: updates.accountNumberMasked,
            connectionStatus: updates.connectionStatus,
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
export const getSchedules = async (): Promise<DownloadSchedule[]> => {
    try {
        const { data } = await withTimeout(listDownloadSchedules(dataconnect), 30000, "getSchedules");
        const cloudData: DownloadSchedule[] = data.downloadSchedules.map(s => ({
            id: s.id,
            bankId: s.bankAccount.id,
            frequency: s.frequency as any,
            scheduledTime: s.scheduledTime || '',
            targetFolder: s.targetFolder || '',
            storageType: (s.storageType as any) || 'Local',
            nextDownloadAt: s.nextDownloadAt,
            isActive: s.isActive,
            bankAccountName: s.bankAccount?.bankName || 'Unknown',
            userId: (s as any).userId || 'Shared',
            userName: (s as any).creatorName,
            lastDownloadAt: s.lastDownloadAt || undefined,
        }));
        saveLocal('schedules_cache', cloudData);
        return cloudData;
    } catch { return loadLocal('schedules_cache'); }
};

export const addSchedule = async (schedule: Omit<DownloadSchedule, 'id'>) => {
    try {
        console.log(`[Cloud] Attempting to create schedule for bank: ${schedule.bankId}`);

        // Final sanity check for timestamp format
        let timestamp = schedule.nextDownloadAt;
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
            nextDownloadAt: timestamp
        };

        console.log(`[Cloud] Success: Schedule created with ID: ${newSched.id}`);

        const localData = loadLocal<DownloadSchedule>('schedules_cache');
        saveLocal('schedules_cache', [...localData, newSched as DownloadSchedule]);

        return newSched;
    } catch (e: any) {
        console.error(`[Cloud] Sync Failed (addSchedule):`, e);
        const localData = loadLocal<DownloadSchedule>('schedules_cache');
        const newSched = { id: `local_${Date.now()}`, ...schedule };
        saveLocal('schedules_cache', [...localData, newSched]);
        return newSched as any;
    }
};

export const updateSchedule = async (id: string, updates: Partial<DownloadSchedule>) => {
    try {
        await withTimeout(updateDownloadSchedule(dataconnect, {
            id,
            frequency: updates.frequency,
            scheduledTime: updates.scheduledTime,
            targetFolder: updates.targetFolder,
            storageType: updates.storageType,
            nextDownloadAt: updates.nextDownloadAt,
            isActive: updates.isActive,
            lastDownloadAt: (updates as any).lastDownloadAt
        }), 30000, "updateSchedule");
    } catch {
        const localData = loadLocal<DownloadSchedule>('schedules_cache');
        saveLocal('schedules_cache', localData.map(s => s.id === id ? { ...s, ...updates } : s));
    }
};

export const deleteSchedule = async (id: string) => {
    try {
        await withTimeout(deleteDownloadSchedule(dataconnect, { id }), 30000, "deleteSchedule");
    } catch {
        const localData = loadLocal<DownloadSchedule>('schedules_cache');
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
        console.log("Fetching all users (Data Connect)...");
        const { data } = await withTimeout(listUsers(dataconnect), 30000, "getUsers");
        const cloudData: User[] = data.users.map(u => ({
            id: u.id,
            displayName: u.displayName,
            email: u.email,
            role: u.role as any,
            avatar: u.avatar || '👤'
        }));
        console.log(`[Cloud] Success: Fetched ${cloudData.length} users.`);
        saveLocal('users_cache', cloudData);
        return cloudData;
    } catch (e: any) {
        console.warn(`[Cloud] Sync Failed (getUsers): ${e.message || e}. Using LOCAL fallback.`);
        return loadLocal<User>('users_cache');
    }
};

export const getCurrentUser = async (): Promise<User | null> => {
    try {
        console.log("Fetching current user profile (Data Connect)...");
        const { data } = await withTimeout(getUser(dataconnect), 10000, "getCurrentUser");
        if (data.user) {
            return {
                id: data.user.id,
                displayName: data.user.displayName,
                email: data.user.email,
                role: data.user.role as any,
                avatar: data.user.avatar || (data.user.displayName ? data.user.displayName[0].toUpperCase() : 'U')
            };
        }
        return null;
    } catch (e) {
        console.warn("[Cloud] Failed to fetch current user profile:", e);
        return null;
    }
};

export const addUser = async (user: User) => {
    try {
        console.log(`[Cloud] Attempting to create user: ${user.displayName}`);
        const { data } = await withTimeout(adminUpsertUser(dataconnect, {
            id: user.id,
            displayName: user.displayName,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            photoUrl: user.avatar // Removed password field per lint error
        }), 10000, "addUser");

        console.log(`[Cloud] Success: User created/updated.`);
        const localData = loadLocal<User>('users_cache');
        saveLocal('users_cache', [...localData.filter(u => u.id !== user.id), user]);
        return user;
    } catch (e: any) {
        if (e.message?.includes('404') || e.message?.includes('not found')) {
            console.warn(`[Cloud] AdminUpsertUser not found, falling back to basic createUser.`);
            try {
                await withTimeout(createUser(dataconnect, {
                    displayName: user.displayName,
                    email: user.email,
                    role: user.role,
                    avatar: user.avatar,
                    photoUrl: user.avatar
                    // Removed password field per lint error
                }), 10000, "addUserFallback");
                console.log(`[Cloud] Success: User created (fallback).`);
                const localData = loadLocal<User>('users_cache');
                saveLocal('users_cache', [...localData.filter(u => u.id !== user.id), user]);
                return user;
            } catch (innerError: any) {
                console.error(`[Cloud] Fallback also failed:`, innerError);
            }
        }
        console.error(`[Cloud] Sync Failed (addUser):`, e);
        const localData = loadLocal<User>('users_cache');
        saveLocal('users_cache', [...localData.filter(u => u.id !== user.id), user]);
        return user;
    }
};

export const updateUser = async (id: string, updates: Partial<User>) => {
    try {
        console.log(`[Cloud] Updating user: ${id}`);
        const { data } = await withTimeout(updateUserProfile(dataconnect, {
            id,
            displayName: updates.displayName,
            avatar: updates.avatar,
            role: updates.role
            // Removed password field per lint error
        }), 10000, "updateUser");

        const localData = loadLocal<User>('users_cache');
        saveLocal('users_cache', localData.map(u => u.id === id ? { ...u, ...updates } : u));
    } catch (e: any) {
        console.error(`[Cloud] Sync Failed (updateUser):`, e);
        const localData = loadLocal<User>('users_cache');
        saveLocal('users_cache', localData.map(u => u.id === id ? { ...u, ...updates } : u));
    }
}

export const deleteUser = async (id: string) => {
    try {
        await withTimeout(deleteUserDC(dataconnect, { id }), 10000, "deleteUser");
        const localData = loadLocal<User>('users_cache');
        saveLocal('users_cache', localData.filter(u => u.id !== id));
    } catch (e: any) {
        console.error(`[Cloud] Sync Failed (deleteUser):`, e);
        const localData = loadLocal<User>('users_cache');
        saveLocal('users_cache', localData.filter(u => u.id !== id));
    }
};
