import React, { useState } from 'react';
import { Building2, Lock, Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import { User } from '../types';
import { login } from '../services/authService';

interface LoginProps {
    onLogin: (user: User) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [email, setEmail] = useState('admin@wellknown.com');
    const [password, setPassword] = useState('password123');
    const [view, setView] = useState<'login' | 'forgot' | 'reset-sent'>('login');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await login(email, password);
            // onLogin will be handled by App.tsx subscription
        } catch (err: any) {
            console.error("Login Error:", err);
            setError('Login failed: ' + (err.message || 'Unknown error'));
            setLoading(false);
        }
    };

    const handleReset = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate API call
        setTimeout(() => {
            setView('reset-sent');
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            <div className="bg-slate-900 w-full max-w-md border border-slate-800 rounded-2xl p-8 shadow-2xl">
                <div className="flex flex-col items-center justify-center mb-8 gap-4">
                    <div className="bg-white p-4 rounded-xl shadow-lg">
                        <img src="/wpl-logo.jpg" alt="WPL Logo" className="h-16 w-auto object-contain" />
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-white text-center mb-2">
                    {view === 'login' ? 'Welcome Back' : view === 'forgot' ? 'Reset Password' : 'Check your email'}
                </h2>
                <p className="text-slate-400 text-center mb-8 text-sm">
                    {view === 'login' ? 'Sign in to access your automation dashboard' :
                        view === 'forgot' ? 'Enter your email to receive reset instructions' :
                            'We have sent a password reset link to your email address.'}
                </p>

                {view === 'login' && (
                    <form onSubmit={handleLogin} className="space-y-4">
                        {error && <div className="bg-red-900/20 border border-red-900/50 text-red-400 text-sm p-3 rounded-lg text-center">{error}</div>}
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-600" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                    placeholder="name@company.com"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-600" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <button type="button" onClick={() => setView('forgot')} className="text-xs text-blue-400 hover:text-blue-300">Forgot Password?</button>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Signing In...' : <>Sign In <ArrowRight className="w-4 h-4" /></>}
                        </button>
                    </form>
                )}

                {view === 'forgot' && (
                    <form onSubmit={handleReset} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Email Address</label>
                            <input
                                type="email"
                                required
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                placeholder="name@company.com"
                            />
                        </div>
                        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-colors">
                            Send Reset Link
                        </button>
                        <button type="button" onClick={() => setView('login')} className="w-full text-slate-400 hover:text-white text-sm">
                            Back to Login
                        </button>
                    </form>
                )}

                {view === 'reset-sent' && (
                    <div className="text-center space-y-6">
                        <div className="inline-flex bg-green-900/20 p-4 rounded-full">
                            <CheckCircle2 className="w-12 h-12 text-green-500" />
                        </div>
                        <button onClick={() => setView('login')} className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-lg transition-colors">
                            Return to Login
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};