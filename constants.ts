import { BankAccount, BankStatus, SyncSchedule, ActivityLog, User } from './types';

export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    name: 'Administrator',
    email: 'admin@autobank.com',
    role: 'Admin',
    password: 'password123',
    avatar: 'AD'
  },
  {
    id: 'u2',
    name: 'Ops Manager',
    email: 'ops@autobank.com',
    role: 'Scheduler',
    password: 'password123',
    avatar: 'OM'
  },
  {
    id: 'u3',
    name: 'Audit Team',
    email: 'audit@autobank.com',
    role: 'Downloader',
    password: 'password123',
    avatar: 'AT'
  }
];

export const MOCK_ACCOUNTS: BankAccount[] = [
  {
    id: '1',
    bankName: 'Chase Bank',
    bankUrl: 'https://www.chase.com',
    accountNumber: '9876544432',
    accountNumberMasked: '**** 4432',
    userId: 'jdoe_business',
    lastSync: '2023-10-26 14:30',
    status: BankStatus.CONNECTED,
    requiresOtp: false,
    logo: 'https://picsum.photos/40/40?random=1'
  },
  {
    id: '2',
    bankName: 'Bank of America',
    bankUrl: 'https://www.bankofamerica.com',
    accountNumber: '1234568891',
    accountNumberMasked: '**** 8891',
    userId: 'jdoe_personal',
    lastSync: '2023-10-25 09:00',
    status: BankStatus.OTP_REQUIRED,
    requiresOtp: true,
    logo: 'https://picsum.photos/40/40?random=2'
  },
  {
    id: '3',
    bankName: 'Wells Fargo',
    bankUrl: 'https://www.wellsfargo.com',
    accountNumber: '5555551120',
    accountNumberMasked: '**** 1120',
    userId: 'jdoe_savings',
    lastSync: '2023-10-20 18:45',
    status: BankStatus.NEEDS_ATTENTION,
    requiresOtp: true,
    logo: 'https://picsum.photos/40/40?random=3'
  }
];

export const MOCK_SCHEDULES: SyncSchedule[] = [
  {
    id: 's1',
    bankId: '1',
    frequency: 'Daily',
    scheduledTime: '02:00',
    targetFolder: '/Finance/Chase/2023',
    storageType: 'GoogleDrive',
    nextRun: '2023-10-27 02:00',
    isActive: true
  },
  {
    id: 's2',
    bankId: '2',
    frequency: 'Monthly',
    scheduledTime: '00:00',
    targetFolder: 'C:\\Users\\Admin\\Downloads\\Statements',
    storageType: 'Local',
    nextRun: '2023-11-01 00:00',
    isActive: true
  }
];

export const MOCK_LOGS: ActivityLog[] = [
  { id: 'l1', bankName: 'Chase Bank', action: 'Download Statement (Oct)', timestamp: '2023-10-26 14:30', status: 'Success', triggeredBy: 'System' },
  { id: 'l2', bankName: 'Bank of America', action: 'Login Attempt', timestamp: '2023-10-26 14:25', status: 'Pending', details: 'Waiting for OTP', triggeredBy: 'System' },
  { id: 'l3', bankName: 'Wells Fargo', action: 'Download Statement (Sept)', timestamp: '2023-10-20 18:45', status: 'Failed', details: 'Password expired', triggeredBy: 'Administrator' },
];