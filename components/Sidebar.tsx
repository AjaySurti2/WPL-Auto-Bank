import React from 'react';
import { LayoutDashboard, Building2, CalendarClock, ShieldAlert, FileText, Settings, LogOut } from 'lucide-react';
import { User } from '../types';

interface SidebarProps {
  currentPage: string;
  setPage: (page: string) => void;
  pendingOtpCount: number;
  currentUser: User;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, setPage, pendingOtpCount, currentUser, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'bank-master', label: 'Bank Master', icon: Building2, disabled: currentUser.role === 'Downloader' },
    { id: 'scheduler', label: 'Scheduler', icon: CalendarClock, disabled: currentUser.role === 'Downloader' },
    { id: 'action-center', label: 'Action Center', icon: ShieldAlert, badge: pendingOtpCount > 0 ? pendingOtpCount : undefined },
    { id: 'insights', label: 'AI Insights', icon: FileText },
  ];

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen fixed left-0 top-0">
      <div className="p-6">
        <img
          src="/wpl-logo.jpg"
          alt="Wellknown Polyesters Limited"
          className="w-full h-auto object-contain mb-2 rounded-lg"
        />
        <p className="text-slate-500 text-xs mt-1 font-medium text-center">SYNC & AUTOMATE</p>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {menuItems.map((item) => {
          if (item.disabled) return null;
          const isActive = currentPage === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors relative
                    ${isActive
                  ? 'bg-blue-600/10 text-blue-500'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
              {item.badge && (
                <span className="absolute right-3 top-3 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button
          onClick={() => setPage('settings')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors mb-2
                ${currentPage === 'settings' ? 'bg-blue-600/10 text-blue-500' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}
            `}
        >
          <Settings className="w-5 h-5" />
          Settings
        </button>
        <button
          onClick={() => {
            if (window.confirm('Are you sure you want to sign out?')) {
              onLogout();
            }
          }}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-900/10 rounded-lg text-sm font-medium transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </div>
  );
};