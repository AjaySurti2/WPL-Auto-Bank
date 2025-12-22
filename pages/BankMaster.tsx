import React, { useState } from 'react';
import { BankAccount, BankStatus, User } from '../types';
import { Plus, Trash2, Lock, ShieldCheck, ShieldAlert, CreditCard, Globe, ExternalLink, AlertCircle, Edit2, RotateCw, Building2, Cloud, Database, RefreshCw, Bug, Settings as SettingsIcon } from 'lucide-react';
import * as dbService from '../services/dbService';

interface BankMasterProps {
    accounts: BankAccount[];
    currentUser: User;
    onManualDownload: (bankIds: string[]) => void;
    addAccount: (acc: BankAccount) => Promise<void> | void;
    updateAccount: (acc: BankAccount) => Promise<void> | void;
    removeAccount: (id: string) => Promise<void> | void;
}

export const BankMaster: React.FC<BankMasterProps> = ({
    accounts, currentUser, onManualDownload, addAccount, updateAccount, removeAccount
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [syncingId, setSyncingId] = useState<string | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [fetchStatus, setFetchStatus] = useState<{ count: number, error: string | null, source: 'cloud' | 'cache' | null }>({ count: 0, error: null, source: null });

    const forceRefresh = async () => {
        setIsRefreshing(true);
        try {
            console.log("[Diagnostic] Manual cloud fetch triggered...");
            const data = await dbService.getAccounts();
            setFetchStatus({
                count: data.length,
                error: data.length > 0 ? null : 'Empty Cloud Data',
                source: 'cloud'
            });
        } catch (e: any) {
            setFetchStatus({ count: 0, error: e.message || 'Unknown fetch error', source: null });
        } finally {
            setIsRefreshing(false);
        }
    };

    const canManage = currentUser.role === 'Admin' || currentUser.role === 'Scheduler';

    const [newBankName, setNewBankName] = useState('');
    const [newBankUrl, setNewBankUrl] = useState('');
    const [newUserId, setNewUserId] = useState('');
    const [newAccountNumber, setNewAccountNumber] = useState('');
    const [newRequiresOtp, setNewRequiresOtp] = useState(true);
    const [urlError, setUrlError] = useState('');

    const validateUrl = (url: string) => {
        try {
            new URL(url);
            setUrlError('');
            return true;
        } catch {
            setUrlError('Please enter a valid URL (e.g. https://www.bank.com)');
            return false;
        }
    };

    const handleOpenModal = (account?: BankAccount) => {
        if (account) {
            setEditingId(account.id);
            setNewBankName(account.bankName);
            setNewBankUrl(account.bankUrl);
            setNewUserId(account.userId);
            setNewAccountNumber(account.accountNumber);
            setNewRequiresOtp(account.requiresOtp);
        } else {
            resetForm();
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateUrl(newBankUrl)) {
            return;
        }

        setIsSubmitting(true);
        const masked = newAccountNumber.length > 4
            ? '**** ' + newAccountNumber.slice(-4)
            : newAccountNumber;

        try {
            if (editingId) {
                // Update existing
                const updatedAccount: BankAccount = {
                    id: editingId,
                    bankName: newBankName,
                    bankUrl: newBankUrl,
                    accountNumber: newAccountNumber,
                    accountNumberMasked: masked,
                    userId: newUserId,
                    // Preserve existing status/sync info
                    lastSyncedAt: accounts.find(a => a.id === editingId)?.lastSyncedAt || 'Never',
                    connectionStatus: accounts.find(a => a.id === editingId)?.connectionStatus || BankStatus.CONNECTED,
                    requiresOtp: newRequiresOtp,
                    logo: accounts.find(a => a.id === editingId)?.logo || `https://picsum.photos/40/40?random=${Date.now()}`
                };
                await updateAccount(updatedAccount);
            } else {
                // Create new
                const newAccount: BankAccount = {
                    id: Date.now().toString(),
                    bankName: newBankName,
                    bankUrl: newBankUrl,
                    accountNumber: newAccountNumber,
                    accountNumberMasked: masked,
                    userId: newUserId,
                    lastSyncedAt: 'Never',
                    connectionStatus: BankStatus.CONNECTED,
                    requiresOtp: newRequiresOtp,
                    logo: `https://picsum.photos/40/40?random=${Date.now()}`
                };
                await addAccount(newAccount);
            }

            setIsModalOpen(false);
            resetForm();
        } catch (error) {
            console.error("Submission failed", error);
            alert("Failed to save configuration. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setEditingId(null);
        setNewBankName('');
        setNewBankUrl('');
        setNewUserId('');
        setNewAccountNumber('');
        setNewRequiresOtp(true);
        setUrlError('');
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-white">Bank Master</h2>
                    <p className="text-slate-400 text-sm">Manage banking credentials and security preferences.</p>
                </div>
                {canManage && (
                    <button
                        onClick={() => handleOpenModal()}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium transition-all"
                    >
                        <Plus className="w-4 h-4" /> Add Bank
                    </button>
                )}
            </div>

            {/* Diagnostic Toolbar */}
            <div className="bg-slate-900/40 border border-slate-700/50 rounded-xl p-4 flex flex-wrap items-center gap-4 justify-between">
                <div className="flex items-center gap-6">
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Current Active Identity</span>
                        <div className="flex items-center gap-2 mt-0.5">
                            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                            <span className="text-sm font-semibold text-white">{currentUser.displayName}</span>
                            <span className="text-[10px] px-1.5 py-0.5 bg-slate-700 text-slate-300 rounded uppercase">{currentUser.role}</span>
                        </div>
                    </div>

                    <div className="h-8 w-px bg-slate-700"></div>

                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Cloud Sync Status</span>
                        <div className="flex items-center gap-2 mt-0.5">
                            {fetchStatus.error ? (
                                <AlertCircle className="w-4 h-4 text-red-400" />
                            ) : (
                                <Cloud className={`w-4 h-4 ${fetchStatus.source === 'cloud' ? 'text-green-400' : 'text-slate-500'}`} />
                            )}
                            <span className="text-sm font-semibold text-white">
                                {isRefreshing ? 'Syncing...' : (fetchStatus.error ? 'Fetch Error' : 'Connected')}
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col items-center">
                        <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Records Found</span>
                        <span className="text-sm font-bold text-blue-400 mt-0.5">{accounts.length}</span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={forceRefresh}
                        disabled={isRefreshing}
                        className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold transition-all border border-slate-700 hover:border-blue-500/50"
                    >
                        <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                        Forced Cloud Re-Sync
                    </button>
                    <button
                        onClick={() => alert(`Diagnostics:\nUser: ${currentUser.email}\nRole: ${currentUser.role}\nLocal Storage Key: accounts_cache\nLast Error: ${fetchStatus.error || 'None'}`)}
                        className="p-1.5 text-slate-400 hover:text-white transition-colors"
                        title="Debug Info"
                    >
                        <SettingsIcon className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {fetchStatus.error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-center gap-3 text-red-400 text-sm animate-in fade-in slide-in-from-top-2">
                    <AlertCircle className="w-5 h-5" />
                    <div>
                        <p className="font-bold">Fetch Warning</p>
                        <p className="opacity-80">{fetchStatus.error}</p>
                    </div>
                </div>
            )}

            {accounts.length === 0 ? (
                <div className="bg-slate-800/50 border border-dashed border-slate-700 rounded-2xl p-12 text-center">
                    <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Building2 className="w-8 h-8 text-slate-500" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">No Bank Accounts Found</h3>
                    <p className="text-slate-400 max-w-sm mx-auto mb-6">
                        Organizations accounts will appear here once configured by an Admin or Scheduler.
                    </p>
                    {canManage && (
                        <button
                            onClick={() => handleOpenModal()}
                            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-lg font-bold transition-all"
                        >
                            <Plus className="w-4 h-4" /> Connect Your First Bank
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {accounts.map(acc => (
                        <div key={acc.id} className="bg-slate-800 border border-slate-700 rounded-xl p-5 hover:border-blue-500/50 transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <img src={acc.logo} alt={acc.bankName} className="w-10 h-10 rounded-full bg-slate-700 object-cover" />
                                    <div>
                                        <h3 className="font-semibold text-white">{acc.bankName}</h3>
                                        <div className="flex items-center gap-1.5 mt-0.5">
                                            <span className={`w-1.5 h-1.5 rounded-full ${acc.requiresOtp ? 'bg-blue-400' : 'bg-slate-500'}`}></span>
                                            <p className="text-xs text-slate-400">{acc.requiresOtp ? 'OTP Enabled' : 'No OTP'}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className={`w-2 h-2 rounded-full ${acc.connectionStatus === BankStatus.CONNECTED ? 'bg-green-500' :
                                    acc.connectionStatus === BankStatus.OTP_REQUIRED ? 'bg-red-500 animate-pulse' : 'bg-yellow-500'
                                    }`} title={acc.connectionStatus}></div>
                            </div>

                            <div className="space-y-3">
                                <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800">
                                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                                        <CreditCard className="w-3 h-3" /> Account Number
                                    </p>
                                    <p className="text-sm text-slate-300 font-mono tracking-wide">{acc.accountNumberMasked}</p>
                                </div>

                                <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800">
                                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                                        <Globe className="w-3 h-3" /> Bank Portal
                                    </p>
                                    <a href={acc.bankUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-400 hover:text-blue-300 hover:underline font-mono truncate block flex items-center gap-1">
                                        {acc.bankUrl} <ExternalLink className="w-3 h-3" />
                                    </a>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800">
                                        <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Configured By</p>
                                        <p className="text-sm text-slate-300 font-mono truncate">{acc.creatorName || acc.userId}</p>
                                    </div>
                                    <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800 flex flex-col justify-center">
                                        <p className="text-xs text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                                            Password <Lock className="w-3 h-3" />
                                        </p>
                                        <p className="text-sm text-slate-500 font-mono">••••••</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-5 flex gap-2">
                                <button
                                    onClick={() => {
                                        setSyncingId(acc.id);
                                        onManualDownload([acc.id]);
                                        setTimeout(() => setSyncingId(null), 2000);
                                    }}
                                    disabled={!!syncingId}
                                    className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-slate-700/50 hover:bg-blue-600/10 hover:text-blue-400 hover:border-blue-500/50 rounded-lg border border-slate-700 transition-all text-slate-300 disabled:opacity-50"
                                >
                                    <RotateCw className={`w-4 h-4 ${syncingId === acc.id ? 'animate-spin' : ''}`} />
                                    <span className="text-xs font-semibold">Manual Sync</span>
                                </button>
                                {canManage && (
                                    <>
                                        <button
                                            onClick={() => handleOpenModal(acc)}
                                            className="p-2 text-slate-400 hover:text-blue-400 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                                            title="Edit Bank"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => removeAccount(acc.id)}
                                            className="p-2 text-slate-400 hover:text-red-400 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                                            title="Remove Bank"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add/Edit Bank Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-800 w-full max-w-lg rounded-2xl border border-slate-700 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-900/50">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                {editingId ? <Edit2 className="w-5 h-5 text-blue-500" /> : <Plus className="w-5 h-5 text-blue-500" />}
                                {editingId ? 'Edit Bank Account' : 'Connect New Bank'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">✕</button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-5">

                            {/* Bank Name */}
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Bank Name</label>
                                <input
                                    type="text"
                                    required
                                    value={newBankName}
                                    onChange={(e) => setNewBankName(e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-600"
                                    placeholder="e.g. Citibank Corporate"
                                />
                            </div>

                            {/* Bank URL */}
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Bank Portal URL</label>
                                <input
                                    type="url"
                                    required
                                    value={newBankUrl}
                                    onChange={(e) => {
                                        setNewBankUrl(e.target.value);
                                        if (urlError) validateUrl(e.target.value);
                                    }}
                                    onBlur={() => validateUrl(newBankUrl)}
                                    className={`w-full bg-slate-900 border ${urlError ? 'border-red-500 focus:border-red-500' : 'border-slate-700 focus:border-blue-500'} rounded-lg px-4 py-2.5 text-white focus:outline-none transition-colors placeholder:text-slate-600`}
                                    placeholder="https://www.bank.com"
                                />
                                {urlError && (
                                    <div className="flex items-center gap-1.5 mt-2 text-red-400 animate-in fade-in slide-in-from-top-1">
                                        <AlertCircle className="w-3.5 h-3.5" />
                                        <span className="text-xs">{urlError}</span>
                                    </div>
                                )}
                            </div>

                            {/* Account Number */}
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Account Number</label>
                                <input
                                    type="text"
                                    required
                                    value={newAccountNumber}
                                    onChange={(e) => setNewAccountNumber(e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white font-mono focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-600"
                                    placeholder="0000 0000 0000"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {/* User ID */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">User ID</label>
                                    <input
                                        type="text"
                                        required
                                        value={newUserId}
                                        onChange={(e) => setNewUserId(e.target.value)}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-600"
                                        placeholder="User ID"
                                    />
                                </div>
                                {/* Password */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Password</label>
                                    <input
                                        type="password"
                                        required={!editingId} // Only required if creating new
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-600"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            {/* OTP Configuration */}
                            <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-sm font-semibold text-white">OTP Verification Required?</label>
                                    <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700">
                                        <button
                                            type="button"
                                            onClick={() => setNewRequiresOtp(true)}
                                            className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${newRequiresOtp ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
                                        >
                                            YES
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setNewRequiresOtp(false)}
                                            className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${!newRequiresOtp ? 'bg-slate-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
                                        >
                                            NO
                                        </button>
                                    </div>
                                </div>
                                <p className="text-xs text-slate-500 leading-relaxed">
                                    Enable this if your bank sends a One-Time Password (OTP) via SMS or Email during login. AutoBank will pause and request this OTP via the Action Center.
                                </p>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-2.5 text-slate-300 hover:bg-slate-700 rounded-lg transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold shadow-lg shadow-blue-900/20 transition-all hover:scale-[1.02] ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {isSubmitting ? 'Saving...' : (editingId ? 'Update Configuration' : 'Save Configuration')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};