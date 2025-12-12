import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { UserPlus, Shield, Trash2, User as UserIcon } from 'lucide-react';

interface SettingsProps {
  users: User[];
  currentUser: User;
  addUser: (user: User) => void;
  removeUser: (id: string) => void;
}

export const Settings: React.FC<SettingsProps> = ({ users, currentUser, addUser, removeUser }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('Downloader');

  const isAdmin = currentUser.role === 'Admin';

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {
        id: Date.now().toString(),
        name: newName,
        email: newEmail,
        role: newRole,
        password: 'password123', // Default password
        avatar: newName.substring(0, 2).toUpperCase()
    };
    addUser(newUser);
    setIsModalOpen(false);
    setNewName('');
    setNewEmail('');
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white">Settings & User Management</h2>
        <p className="text-slate-400 text-sm">Manage access roles and application configurations.</p>
      </div>

      {/* User Management Section */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-700 flex justify-between items-center">
            <div>
                <h3 className="text-lg font-semibold text-white">User Accounts</h3>
                <p className="text-sm text-slate-400">Control who can access the dashboard and their capabilities.</p>
            </div>
            {isAdmin && (
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium transition-all"
                >
                    <UserPlus className="w-4 h-4" /> Add User
                </button>
            )}
        </div>
        
        <table className="w-full text-left border-collapse">
            <thead className="bg-slate-900/50 text-slate-400 text-xs uppercase font-medium">
                <tr>
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Email</th>
                    {isAdmin && <th className="px-6 py-4 text-right">Actions</th>}
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-700 text-sm">
                {users.map(user => (
                    <tr key={user.id} className="hover:bg-slate-700/30 transition-colors">
                        <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-xs font-bold text-white">
                                    {user.avatar}
                                </div>
                                <span className="font-medium text-white">{user.name}</span>
                            </div>
                        </td>
                        <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border
                                ${user.role === 'Admin' ? 'bg-purple-900/30 text-purple-400 border-purple-800' :
                                  user.role === 'Scheduler' ? 'bg-blue-900/30 text-blue-400 border-blue-800' :
                                  'bg-slate-800 text-slate-400 border-slate-700'
                                }`}>
                                <Shield className="w-3 h-3" />
                                {user.role}
                            </span>
                        </td>
                        <td className="px-6 py-4 text-slate-400">{user.email}</td>
                        {isAdmin && (
                            <td className="px-6 py-4 text-right">
                                {user.id !== currentUser.id && (
                                    <button 
                                        onClick={() => removeUser(user.id)}
                                        className="text-slate-500 hover:text-red-400 transition-colors"
                                        title="Remove User"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </td>
                        )}
                    </tr>
                ))}
            </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-800 w-full max-w-md rounded-2xl border border-slate-700 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-900/50">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <UserPlus className="w-5 h-5 text-blue-500" /> Create New User
                    </h3>
                    <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">✕</button>
                </div>
                <form onSubmit={handleAddUser} className="p-6 space-y-5">
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Full Name</label>
                        <input 
                            type="text" 
                            required
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors"
                            placeholder="John Doe"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Email Address</label>
                        <input 
                            type="email" 
                            required
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors"
                            placeholder="john@company.com"
                        />
                    </div>
                    <div>
                         <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Role Assignment</label>
                         <div className="grid grid-cols-1 gap-2">
                            {(['Admin', 'Scheduler', 'Downloader'] as UserRole[]).map((role) => (
                                <label key={role} className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${newRole === role ? 'bg-blue-900/20 border-blue-500' : 'bg-slate-900 border-slate-700 hover:border-slate-600'}`}>
                                    <input 
                                        type="radio" 
                                        name="role" 
                                        value={role} 
                                        checked={newRole === role} 
                                        onChange={() => setNewRole(role)}
                                        className="hidden" 
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className={`w-2 h-2 rounded-full ${newRole === role ? 'bg-blue-400' : 'bg-slate-600'}`}></span>
                                            <span className="font-semibold text-white">{role}</span>
                                        </div>
                                        <p className="text-xs text-slate-500 mt-0.5 ml-4">
                                            {role === 'Admin' ? 'Full access to all settings and users.' :
                                             role === 'Scheduler' ? 'Can manage bank credentials and schedules.' :
                                             'Can only perform manual downloads.'}
                                        </p>
                                    </div>
                                </label>
                            ))}
                         </div>
                    </div>
                    
                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 text-slate-300 hover:bg-slate-700 rounded-lg transition-colors font-medium">
                            Cancel
                        </button>
                        <button type="submit" className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold shadow-lg shadow-blue-900/20 transition-all hover:scale-[1.02]">
                            Create User
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};