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
  lastSync: string;
  status: BankStatus;
  requiresOtp: boolean;
  logo: string; // Placeholder URL
}

export interface SyncSchedule {
  id: string;
  bankId: string;
  frequency: 'Daily' | 'Weekly' | 'Monthly';
  scheduledTime: string; // HH:mm format
  targetFolder: string; // Google Drive folder name or Local path
  storageType: 'GoogleDrive' | 'Local'; // New field for storage preference
  nextRun: string;
  isActive: boolean;
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
  name: string;
  email: string;
  role: UserRole;
  password?: string; // In reality, this would be hashed
  avatar?: string;
}