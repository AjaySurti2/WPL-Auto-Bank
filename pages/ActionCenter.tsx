import React, { useState } from 'react';
import { BankAccount, BankStatus } from '../types';
import { ShieldCheck, Timer, AlertTriangle } from 'lucide-react';

interface ActionCenterProps {
    accounts: BankAccount[];
    resolveOtp: (bankId: string) => void;
}

export const ActionCenter: React.FC<ActionCenterProps> = ({ accounts, resolveOtp }) => {
    const pendingAccounts = accounts.filter(a => a.connectionStatus === BankStatus.OTP_REQUIRED);
    const [otpInputs, setOtpInputs] = useState<{ [key: string]: string }>({});

    const handleInputChange = (id: string, value: string) => {
        setOtpInputs(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = (id: string) => {
        if (otpInputs[id]?.length >= 4) {
            resolveOtp(id);
            // Clear input
            setOtpInputs(prev => {
                const next = { ...prev };
                delete next[id];
                return next;
            });
        }
    };

    if (pendingAccounts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
                <div className="w-20 h-20 bg-green-900/20 rounded-full flex items-center justify-center">
                    <ShieldCheck className="w-10 h-10 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold text-white">All Systems Go</h2>
                <p className="text-slate-400 max-w-md">There are no pending OTP requests or login challenges. Your scheduled downloads are running smoothly.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-white">Action Center</h2>
                <p className="text-slate-400 text-sm">Resolve pending login challenges to proceed with downloads.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pendingAccounts.map(acc => (
                    <div key={acc.id} className="bg-slate-800 border border-red-500/50 rounded-xl p-6 shadow-lg shadow-red-900/10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-3">
                                <img src={acc.logo} alt={acc.bankName} className="w-12 h-12 rounded-full bg-slate-700 object-cover" />
                                <div>
                                    <h3 className="font-bold text-lg text-white">{acc.bankName}</h3>
                                    <p className="text-sm text-slate-400">Ending in {acc.accountNumberMasked}</p>
                                </div>
                            </div>
                            <div className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" />
                                Wait for OTP
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="p-4 bg-slate-900 rounded-lg border border-slate-700">
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-slate-400">Session Status</span>
                                    <span className="text-yellow-500 flex items-center gap-1">
                                        <Timer className="w-3 h-3" /> Expires in 02:30
                                    </span>
                                </div>
                                <p className="text-slate-300 text-sm">
                                    The bank has requested a One-Time Password (OTP) sent to your registered mobile number ending in **89.
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Enter OTP</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={otpInputs[acc.id] || ''}
                                        onChange={(e) => handleInputChange(acc.id, e.target.value)}
                                        placeholder="e.g. 123456"
                                        className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white text-lg tracking-widest focus:outline-none focus:border-blue-500 transition-colors"
                                        maxLength={8}
                                    />
                                    <button
                                        onClick={() => handleSubmit(acc.id)}
                                        disabled={!otpInputs[acc.id] || otpInputs[acc.id].length < 4}
                                        className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 rounded-lg font-medium transition-colors"
                                    >
                                        Verify
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};