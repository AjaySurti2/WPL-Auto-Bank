export enum BankStatus {
  CONNECTED = 'Connected',
  NEEDS_ATTENTION = 'Needs Attention',
  DISCONNECTED = 'Disconnected',
  OTP_REQUIRED = 'OTP Required'
}

export interface BankAccount {
  id: string;
  bankName: string;
  bankUrl: string;
  accountNumber: string;
  accountNumberMasked: string;
  userId: string;
  creatorName?: string; // Human readable name of creator
  lastSyncedAt: string; // Renamed from lastSync
  connectionStatus: BankStatus; // Renamed from status
  requiresOtp: boolean;
  logo: string;
  accountType?: string;
}

export interface DownloadSchedule { // Renamed from SyncSchedule
  id: string;
  bankId: string;
  frequency: 'Daily' | 'Weekly' | 'Monthly';
  scheduledTime: string; // HH:mm format
  targetFolder: string;
  storageType: 'GoogleDrive' | 'Local';
  nextDownloadAt: string; // Renamed from nextRun
  isActive: boolean;
  userName?: string;
  bankAccountName?: string; // Helper for UI
  lastDownloadAt?: string;
}

export interface ActivityLog {
  id: string;
  bankName: string;
  action: string;
  timestamp: string;
  status: 'Success' | 'Failed' | 'Pending';
  details?: string;
  triggeredBy?: string;
}

export interface GeminiAnalysisResult {
  summary: string;
  spendingTrends: { category: string; amount: number }[];
  anomalies: string[];
}

export type UserRole = 'Admin' | 'Scheduler' | 'Downloader';

export interface User {
  id: string;
  displayName: string; // Renamed from name
  email: string;
  role: UserRole;
  password?: string;
  avatar?: string;
  photoUrl?: string;
}