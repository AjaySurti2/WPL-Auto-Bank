import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { BankMaster } from './pages/BankMaster';
import { Scheduler } from './pages/Scheduler';
import { ActionCenter } from './pages/ActionCenter';
import { Insights } from './pages/Insights';
import { Settings } from './pages/Settings';
import { Login } from './pages/Login';
import { MOCK_ACCOUNTS, MOCK_LOGS, MOCK_SCHEDULES, MOCK_USERS } from './constants';
import { BankAccount, BankStatus, User, ActivityLog, SyncSchedule } from './types';

const App: React.FC = () => {
  // Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // App Data State
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [accounts, setAccounts] = useState<BankAccount[]>(MOCK_ACCOUNTS);
  const [schedules, setSchedules] = useState(MOCK_SCHEDULES);
  const [logs, setLogs] = useState<ActivityLog[]>(MOCK_LOGS);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  
  // Counts
  const pendingOtpCount = accounts.filter(a => a.status === BankStatus.OTP_REQUIRED).length;

  // Actions
  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  // --- Bank Account Management ---
  const addAccount = (acc: BankAccount) => {
    setAccounts(prev => [...prev, acc]);
    addLog(`Added new bank: ${acc.bankName}`, 'Settings');
  };

  const updateAccount = (updatedAcc: BankAccount) => {
    setAccounts(prev => prev.map(a => a.id === updatedAcc.id ? updatedAcc : a));
    addLog(`Updated bank details: ${updatedAcc.bankName}`, 'Settings');
  };

  const removeAccount = (id: string) => {
    setAccounts(prev => prev.filter(a => a.id !== id));
    // Also remove associated schedules
    setSchedules(prev => prev.filter(s => s.bankId !== id));
    addLog('Removed bank account', 'Settings');
  };

  // --- Schedule Management ---
  const toggleSchedule = (id: string) => {
    setSchedules(prev => prev.map(s => s.id === id ? { ...s, isActive: !s.isActive } : s));
  };

  const addSchedule = (schedule: SyncSchedule) => {
    setSchedules(prev => [...prev, schedule]);
    addLog('Created new sync schedule', 'Scheduler');
  };

  const updateSchedule = (updatedSchedule: SyncSchedule) => {
    setSchedules(prev => prev.map(s => s.id === updatedSchedule.id ? updatedSchedule : s));
    addLog('Updated sync schedule configuration', 'Scheduler');
  };

  const removeSchedule = (id: string) => {
    setSchedules(prev => prev.filter(s => s.id !== id));
    addLog('Deleted sync schedule', 'Scheduler');
  };

  const resolveOtp = (bankId: string) => {
    setAccounts(prev => prev.map(a => 
      a.id === bankId ? { ...a, status: BankStatus.CONNECTED, lastSync: 'Just now' } : a
    ));
    setTimeout(() => {
        alert("OTP Verified. Download initiated.");
        addLog('OTP Verified & Download Started', 'Action Center');
    }, 500);
  };

  const handleManualDownload = (bankIds: string[]) => {
      const bankNames = accounts.filter(a => bankIds.includes(a.id)).map(a => a.bankName);
      
      // Update logs
      const newLogs: ActivityLog[] = bankNames.map((name, idx) => ({
          id: Date.now() + idx + '',
          bankName: name,
          action: 'Manual Download Triggered',
          timestamp: 'Just now',
          status: 'Pending',
          triggeredBy: currentUser?.name
      }));
      setLogs(prev => [...newLogs, ...prev]);

      // Simulate success after delay
      setTimeout(() => {
          setLogs(prev => prev.map(l => 
            newLogs.find(nl => nl.id === l.id) ? { ...l, status: 'Success', timestamp: 'Just now' } : l
          ));
          setAccounts(prev => prev.map(a => 
            bankIds.includes(a.id) ? { ...a, lastSync: 'Just now' } : a
          ));
      }, 3000);
  };

  // User Management
  const addUser = (user: User) => {
      setUsers(prev => [...prev, user]);
  };

  const removeUser = (id: string) => {
      setUsers(prev => prev.filter(u => u.id !== id));
  };

  const addLog = (action: string, context: string) => {
      const newLog: ActivityLog = {
          id: Date.now().toString(),
          bankName: context,
          action: action,
          timestamp: 'Just now',
          status: 'Success',
          triggeredBy: currentUser?.name
      };
      setLogs(prev => [newLog, ...prev]);
  };

  // Router logic
  const renderPage = () => {
    if (!currentUser) return null; // Should be handled by Login view

    switch (currentPage) {
      case 'dashboard':
        return <Dashboard accounts={accounts} logs={logs} setPage={setCurrentPage} onManualDownload={handleManualDownload} />;
      case 'bank-master':
        return currentUser.role === 'Downloader' 
            ? <Dashboard accounts={accounts} logs={logs} setPage={setCurrentPage} onManualDownload={handleManualDownload} /> // Redirect if unauthorized
            : <BankMaster 
                accounts={accounts} 
                addAccount={addAccount} 
                updateAccount={updateAccount}
                removeAccount={removeAccount} 
              />;
      case 'scheduler':
        return currentUser.role === 'Downloader'
            ? <Dashboard accounts={accounts} logs={logs} setPage={setCurrentPage} onManualDownload={handleManualDownload} />
            : <Scheduler 
                schedules={schedules} 
                accounts={accounts} 
                toggleSchedule={toggleSchedule} 
                addSchedule={addSchedule}
                updateSchedule={updateSchedule}
                removeSchedule={removeSchedule}
              />;
      case 'action-center':
        return <ActionCenter accounts={accounts} resolveOtp={resolveOtp} />;
      case 'insights':
        return <Insights />;
      case 'settings':
        return <Settings users={users} currentUser={currentUser} addUser={addUser} removeUser={removeUser} />;
      default:
        return <Dashboard accounts={accounts} logs={logs} setPage={setCurrentPage} onManualDownload={handleManualDownload} />;
    }
  };

  if (!currentUser) {
      return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500/30">
      <Sidebar 
        currentPage={currentPage} 
        setPage={setCurrentPage} 
        pendingOtpCount={pendingOtpCount} 
        currentUser={currentUser}
        onLogout={handleLogout}
      />
      
      <main className="flex-1 ml-64 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white capitalize">{currentPage.replace('-', ' ')}</h1>
            <p className="text-slate-500 text-sm">Welcome back, {currentUser.name}</p>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="bg-slate-800 rounded-full px-4 py-1.5 border border-slate-700 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-xs font-medium text-slate-300">System Online</span>
             </div>
             <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-500/20">
                {currentUser.avatar}
             </div>
          </div>
        </header>

        <div className="animate-in fade-in duration-500">
            {renderPage()}
        </div>
      </main>
    </div>
  );
};

export default App;