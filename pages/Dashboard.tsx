import React, { useState } from 'react';
import { BankAccount, ActivityLog, BankStatus } from '../types';
import { ArrowUpRight, ArrowDownRight, Activity, HardDrive, AlertCircle, DownloadCloud, Check, X, Loader2, Cloud } from 'lucide-react';

interface DashboardProps {
    accounts: BankAccount[];
    logs: ActivityLog[];
    setPage: (page: string) => void;
    onManualDownload: (bankIds: string[]) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ accounts, logs, setPage, onManualDownload }) => {
    const connectedCount = accounts.filter(a => a.status === BankStatus.CONNECTED).length;
    const attentionCount = accounts.filter(a => a.status === BankStatus.OTP_REQUIRED || a.status === BankStatus.NEEDS_ATTENTION).length;

    const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
    const [selectedBanks, setSelectedBanks] = useState<string[]>([]);
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadMode, setDownloadMode] = useState<'drive' | 'local'>('local');

    const toggleBankSelection = (id: string) => {
        setSelectedBanks(prev =>
            prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
        );
    };

    const handleSelectAll = () => {
        if (selectedBanks.length === accounts.length) {
            setSelectedBanks([]);
        } else {
            setSelectedBanks(accounts.map(a => a.id));
        }
    };

    const handleTriggerDownload = () => {
        setIsDownloading(true);
        setTimeout(() => {
            if (downloadMode === 'local') {
                const timestamp = new Date().toISOString().split('T')[0];
                const content = selectedBanks.map(id => {
                    const bank = accounts.find(a => a.id === id);
                    return `Bank: ${bank?.bankName || 'Unknown'}\nAccount: ${bank?.accountNumberMasked || 'N/A'}\nStatus: ${bank?.status || 'Unknown'}\nDate: ${new Date().toLocaleString()}\n------------------------\n`;
                }).join('\n');
                const blob = new Blob([content], { type: 'text/plain' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `bank_statements_${timestamp}.txt`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            } else {
                onManualDownload(selectedBanks);
            }

            setIsDownloading(false);
            setIsDownloadModalOpen(false);
            setSelectedBanks([]);
        }, 1500);
    };

    return (
        <div className="space-y-6">

            {/* Action Header */}
            <div className="flex justify-between items-end">
                <h2 className="text-lg font-semibold text-white">Overview</h2>
                <button
                    onClick={() => setIsDownloadModalOpen(true)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-lg shadow-blue-900/20"
                >
                    <DownloadCloud className="w-4 h-4" />
                    Manual Sync
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Stat Card 1 */}
                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 relative overflow-hidden">
                    <div className="relative z-10">
                        <p className="text-slate-400 text-sm font-medium">Connected Banks</p>
                        <h3 className="text-3xl font-bold text-white mt-2">{connectedCount}/{accounts.length}</h3>
                    </div>
                    <Activity className="absolute right-4 top-4 w-12 h-12 text-blue-500/20" />
                </div>

                {/* Stat Card 2 */}
                <div
                    className="bg-slate-800 p-6 rounded-xl border border-slate-700 relative overflow-hidden cursor-pointer hover:border-red-500/50 transition-colors"
                    onClick={() => attentionCount > 0 && setPage('action-center')}
                >
                    <div className="relative z-10">
                        <p className="text-slate-400 text-sm font-medium">Pending Actions</p>
                        <h3 className="text-3xl font-bold text-white mt-2 flex items-center gap-2">
                            {attentionCount}
                            {attentionCount > 0 && <span className="text-sm font-normal text-red-400 bg-red-900/30 px-2 py-1 rounded-full">Action Req</span>}
                        </h3>
                    </div>
                    <AlertCircle className="absolute right-4 top-4 w-12 h-12 text-red-500/20" />
                </div>

                {/* Stat Card 3 */}
                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 relative overflow-hidden">
                    <div className="relative z-10">
                        <p className="text-slate-400 text-sm font-medium">Drive Storage</p>
                        <h3 className="text-3xl font-bold text-white mt-2">124 MB</h3>
                        <p className="text-xs text-green-400 mt-1 flex items-center gap-1">
                            <ArrowUpRight className="w-3 h-3" /> +12 MB this week
                        </p>
                    </div>
                    <HardDrive className="absolute right-4 top-4 w-12 h-12 text-green-500/20" />
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                <div className="p-6 border-b border-slate-700 flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-white">Recent Automation Logs</h2>
                    <button className="text-xs text-blue-400 hover:text-blue-300">View All</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-900/50 text-slate-400 text-xs uppercase font-medium">
                            <tr>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Bank</th>
                                <th className="px-6 py-4">Action</th>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Time</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700 text-sm">
                            {logs.map((log) => (
                                <tr key={log.id} className="hover:bg-slate-700/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium
                                    ${log.status === 'Success' ? 'bg-green-900/30 text-green-400 border border-green-800' :
                                                log.status === 'Failed' ? 'bg-red-900/30 text-red-400 border border-red-800' :
                                                    'bg-yellow-900/30 text-yellow-400 border border-yellow-800'
                                            }`}>
                                            {log.status === 'Success' && <ArrowDownRight className="w-3 h-3" />}
                                            {log.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-200">{log.bankName}</td>
                                    <td className="px-6 py-4 text-slate-300">
                                        {log.action}
                                        {log.details && <span className="block text-xs text-slate-500 mt-0.5">{log.details}</span>}
                                    </td>
                                    <td className="px-6 py-4 text-slate-400 text-xs">
                                        {log.triggeredBy || 'System'}
                                    </td>
                                    <td className="px-6 py-4 text-slate-500">{log.timestamp}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Manual Download Modal */}
            {isDownloadModalOpen && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-800 w-full max-w-lg rounded-2xl border border-slate-700 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-900/50">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <DownloadCloud className="w-5 h-5 text-blue-500" /> Manual Sync
                            </h3>
                            <button onClick={() => !isDownloading && setIsDownloadModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">✕</button>
                        </div>

                        <div className="p-6">

                            <div className="mb-6 bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Sync Preference</label>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setDownloadMode('drive')}
                                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${downloadMode === 'drive' ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                                    >
                                        <Cloud className="w-4 h-4" /> Save to Drive
                                    </button>
                                    <button
                                        onClick={() => setDownloadMode('local')}
                                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${downloadMode === 'local' ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                                    >
                                        <HardDrive className="w-4 h-4" /> Download to PC
                                    </button>
                                </div>
                            </div>

                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-bold text-slate-500 uppercase">Available Accounts</span>
                                <button onClick={handleSelectAll} className="text-xs text-blue-400 hover:text-blue-300">
                                    {selectedBanks.length === accounts.length ? 'Deselect All' : 'Select All'}
                                </button>
                            </div>

                            <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                {accounts.map(acc => (
                                    <div
                                        key={acc.id}
                                        onClick={() => toggleBankSelection(acc.id)}
                                        className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all
                                    ${selectedBanks.includes(acc.id)
                                                ? 'bg-blue-900/20 border-blue-500'
                                                : 'bg-slate-900/50 border-slate-700 hover:border-slate-600'}`}
                                    >
                                        <div className={`w-5 h-5 rounded border flex items-center justify-center mr-3 transition-colors
                                    ${selectedBanks.includes(acc.id) ? 'bg-blue-500 border-blue-500' : 'border-slate-600'}`}>
                                            {selectedBanks.includes(acc.id) && <Check className="w-3 h-3 text-white" />}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-white">{acc.bankName}</p>
                                            <p className="text-xs text-slate-500">{acc.accountNumberMasked}</p>
                                        </div>
                                        <div className={`w-2 h-2 rounded-full ${acc.status === 'Connected' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 flex gap-3">
                                <button
                                    onClick={() => setIsDownloadModalOpen(false)}
                                    disabled={isDownloading}
                                    className="flex-1 py-2.5 text-slate-300 hover:bg-slate-700 rounded-lg transition-colors font-medium disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleTriggerDownload}
                                    disabled={selectedBanks.length === 0 || isDownloading}
                                    className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold shadow-lg shadow-blue-900/20 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isDownloading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" /> Processing...
                                        </>
                                    ) : (
                                        <>
                                            {downloadMode === 'drive' ? 'Start Sync' : 'Download'} ({selectedBanks.length})
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};