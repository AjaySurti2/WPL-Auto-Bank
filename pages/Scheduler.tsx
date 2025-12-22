import React, { useState } from 'react';
import { DownloadSchedule, BankAccount } from '../types';
import { CalendarClock, FolderOpen, ToggleRight, ToggleLeft, Folder, ChevronRight, Home, Check, X, ArrowLeft, Plus, Edit2, Trash2, Clock, User, HardDrive, Cloud } from 'lucide-react';

interface SchedulerProps {
    schedules: DownloadSchedule[];
    accounts: BankAccount[];
    toggleSchedule: (id: string) => void;
    addSchedule: (schedule: DownloadSchedule) => Promise<void>;
    updateSchedule: (schedule: DownloadSchedule) => Promise<void>;
    removeSchedule: (id: string) => void;
    currentUser: any; // User type usually, but 'any' to avoid type issues if not imported here
}

// Mock Google Drive Structure
const DRIVE_DATA: Record<string, string[]> = {
    'My Drive': ['Finance', 'Personal', 'Business', 'Archive'],
    'Finance': ['Chase', 'Bank of America', 'Wells Fargo', 'Tax 2023'],
    'Personal': ['Photos', 'Receipts', 'Insurance'],
    'Business': ['Invoices', 'Contracts', 'Payroll'],
    'Chase': ['Statements', 'Correspondence', '2023', '2022'],
    'Bank of America': ['Statements', 'Checks'],
    'Wells Fargo': ['Mortgage', 'Checking', 'Savings'],
    'Archive': ['2021', '2020']
};

export const Scheduler: React.FC<SchedulerProps> = ({
    schedules, accounts, toggleSchedule, addSchedule, updateSchedule, removeSchedule, currentUser
}) => {
    const canManage = currentUser.role === 'Admin' || currentUser.role === 'Scheduler';
    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFolderPickerOpen, setIsFolderPickerOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form State
    const [selectedBankId, setSelectedBankId] = useState('');
    const [frequency, setFrequency] = useState<'Daily' | 'Weekly' | 'Monthly'>('Monthly');
    const [scheduledTime, setScheduledTime] = useState('09:00');
    const [targetFolder, setTargetFolder] = useState('');
    const [storageType, setStorageType] = useState<'GoogleDrive' | 'Local'>('GoogleDrive');
    const [isActive, setIsActive] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Folder Picker State
    const [currentPath, setCurrentPath] = useState<string[]>(['My Drive']);
    const currentFolder = currentPath[currentPath.length - 1];
    const subFolders = DRIVE_DATA[currentFolder] || [];

    // --- CRUD Handlers ---

    const handleOpenModal = (schedule?: DownloadSchedule) => {
        if (schedule) {
            setEditingId(schedule.id);
            setSelectedBankId(schedule.bankId);
            setFrequency(schedule.frequency);
            setScheduledTime(schedule.scheduledTime || '09:00');
            setTargetFolder(schedule.targetFolder);
            setStorageType(schedule.storageType || 'GoogleDrive');
            setIsActive(schedule.isActive);
        } else {
            setEditingId(null);
            setSelectedBankId(accounts[0]?.id || '');
            setFrequency('Monthly');
            setScheduledTime('09:00');
            setTargetFolder('');
            setStorageType('GoogleDrive');
            setIsActive(true);
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Calculate actual next run timestamp for Data Connect
        let nextDate = new Date();
        const [hours, minutes] = scheduledTime.split(':').map(Number);
        nextDate.setHours(hours, minutes, 0, 0);

        // If time has already passed today, set for tomorrow
        if (nextDate.getTime() < Date.now()) {
            nextDate.setDate(nextDate.getDate() + 1);
        }

        const newScheduleData: DownloadSchedule = {
            id: editingId || Date.now().toString(),
            bankId: selectedBankId,
            frequency,
            scheduledTime,
            targetFolder: storageType === 'Local' && !targetFolder ? 'Downloads Folder (Default)' : targetFolder,
            storageType,
            nextDownloadAt: nextDate.toISOString(),
            isActive
        };

        try {
            if (editingId) {
                await updateSchedule(newScheduleData);
            } else {
                await addSchedule(newScheduleData);
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error(error);
            alert("Failed to save schedule. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- Folder Picker Handlers ---

    const handleOpenFolderPicker = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (storageType === 'GoogleDrive') {
            setCurrentPath(['My Drive']);
            setIsFolderPickerOpen(true);
        } else {
            try {
                // Check if API is supported
                if ('showDirectoryPicker' in window) {
                    // @ts-ignore
                    const dirHandle = await window.showDirectoryPicker();
                    setTargetFolder(dirHandle.name);
                } else {
                    alert("Directory Picker not supported in this browser. Please manually enter the path.");
                }
            } catch (err) {
                // User cancelled or error
                console.log('Directory selection cancelled');
            }
        }
    };

    const handleNavigate = (folderName: string) => {
        setCurrentPath([...currentPath, folderName]);
    };

    const handleGoBack = () => {
        if (currentPath.length > 1) {
            setCurrentPath(currentPath.slice(0, -1));
        }
    };

    const handleSelectFolder = () => {
        const fullPath = '/' + currentPath.join('/').replace('My Drive', 'Drive');
        setTargetFolder(fullPath);
        setIsFolderPickerOpen(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-white">Download Scheduler</h2>
                    <p className="text-slate-400 text-sm">Configure automated downloads to Cloud or Local storage.</p>
                </div>
                {canManage && (
                    <button
                        onClick={() => handleOpenModal()}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium transition-all"
                    >
                        <Plus className="w-4 h-4" /> Create Schedule
                    </button>
                )}
            </div>

            <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-900/50 text-slate-400 text-xs uppercase font-medium">
                        <tr>
                            <th className="px-6 py-4">Bank Account</th>
                            <th className="px-6 py-4">Frequency & Time</th>
                            <th className="px-6 py-4">Storage</th>
                            <th className="px-6 py-4">Destination</th>
                            <th className="px-6 py-4 text-center">Active</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700 text-sm">
                        {schedules.map(schedule => {
                            const bank = accounts.find(a => a.id === schedule.bankId);
                            if (!bank) return null; // Skip if bank deleted
                            return (
                                <tr key={schedule.id} className="hover:bg-slate-700/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">
                                                {bank.bankName.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-white font-medium">{bank.bankName}</p>
                                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                                    <span>{bank.accountNumberMasked}</span>
                                                    <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                                                    <span className="flex items-center gap-1" title="Created By"><User className="w-3 h-3 text-blue-400" /> {schedule.userName}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                            <span className="inline-flex items-center gap-2 text-slate-200">
                                                <CalendarClock className="w-3.5 h-3.5 text-blue-400" />
                                                {schedule.frequency}
                                            </span>
                                            <span className="inline-flex items-center gap-2 text-xs text-slate-500 font-mono">
                                                <Clock className="w-3 h-3" />
                                                {schedule.scheduledTime || '09:00'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {schedule.storageType === 'Local' ? (
                                            <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-700 border border-slate-600 text-xs font-medium text-slate-300">
                                                <HardDrive className="w-3 h-3" /> Local
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-900/30 border border-blue-800 text-xs font-medium text-blue-300">
                                                <Cloud className="w-3 h-3" /> Drive
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-slate-400 group relative cursor-help">
                                            <FolderOpen className="w-4 h-4 text-yellow-500/50" />
                                            <span className="truncate max-w-[150px] font-mono text-xs text-slate-300" title={schedule.targetFolder}>{schedule.targetFolder}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button
                                            onClick={() => canManage && toggleSchedule(schedule.id)}
                                            disabled={!canManage}
                                            className={`transition-colors ${!canManage ? 'cursor-not-allowed opacity-50' : ''} ${schedule.isActive ? 'text-green-400 hover:text-green-300' : 'text-slate-600 hover:text-slate-500'}`}
                                        >
                                            {schedule.isActive ? <ToggleRight className="w-8 h-8 mx-auto" /> : <ToggleLeft className="w-8 h-8 mx-auto" />}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            {canManage ? (
                                                <>
                                                    <button
                                                        onClick={() => handleOpenModal(schedule)}
                                                        className="p-2 text-slate-400 hover:text-blue-400 bg-slate-900 hover:bg-slate-700 rounded-lg transition-colors"
                                                        title="Edit Schedule"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => removeSchedule(schedule.id)}
                                                        className="p-2 text-slate-400 hover:text-red-400 bg-slate-900 hover:bg-slate-700 rounded-lg transition-colors"
                                                        title="Delete Schedule"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </>
                                            ) : (
                                                <span className="text-xs text-slate-500 px-2 py-1 bg-slate-900 rounded">View Only</span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Schedule Add/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-800 w-full max-w-lg rounded-2xl border border-slate-700 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-900/50">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                {editingId ? <Edit2 className="w-5 h-5 text-blue-500" /> : <Plus className="w-5 h-5 text-blue-500" />}
                                {editingId ? 'Edit Schedule' : 'New Schedule'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">✕</button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-5">

                            {/* Bank Selection */}
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Bank Account</label>
                                <select
                                    value={selectedBankId}
                                    onChange={(e) => setSelectedBankId(e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors appearance-none"
                                >
                                    {accounts.map(acc => (
                                        <option key={acc.id} value={acc.id}>{acc.bankName} ({acc.accountNumberMasked}) - {acc.userId}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Frequency & Time */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Sync Frequency</label>
                                    <select
                                        value={frequency}
                                        onChange={(e) => setFrequency(e.target.value as any)}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors appearance-none"
                                    >
                                        <option value="Daily">Daily</option>
                                        <option value="Weekly">Weekly</option>
                                        <option value="Monthly">Monthly</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Scheduled Time</label>
                                    <input
                                        type="time"
                                        value={scheduledTime}
                                        onChange={(e) => setScheduledTime(e.target.value)}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                    />
                                </div>
                            </div>

                            {/* Storage Type */}
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Storage Destination</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <label className={`flex items-center justify-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${storageType === 'GoogleDrive' ? 'bg-blue-600/20 border-blue-500 text-blue-400' : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600'}`}>
                                        <input
                                            type="radio"
                                            name="storageType"
                                            value="GoogleDrive"
                                            checked={storageType === 'GoogleDrive'}
                                            onChange={() => setStorageType('GoogleDrive')}
                                            className="hidden"
                                        />
                                        <Cloud className="w-4 h-4" /> Google Drive
                                    </label>
                                    <label className={`flex items-center justify-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${storageType === 'Local' ? 'bg-blue-600/20 border-blue-500 text-blue-400' : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600'}`}>
                                        <input
                                            type="radio"
                                            name="storageType"
                                            value="Local"
                                            checked={storageType === 'Local'}
                                            onChange={() => setStorageType('Local')}
                                            className="hidden"
                                        />
                                        <HardDrive className="w-4 h-4" /> Local Storage
                                    </label>
                                </div>
                            </div>

                            {/* Target Folder */}
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                                    {storageType === 'GoogleDrive' ? 'Drive Folder' : 'Local Path'}
                                </label>
                                <div className="flex gap-2">
                                    {storageType === 'Local' ? (
                                        <input
                                            type="text"
                                            value={targetFolder}
                                            onChange={(e) => setTargetFolder(e.target.value)}
                                            placeholder="Select a folder or type path..."
                                            className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-300 font-mono text-sm focus:outline-none focus:border-blue-500 transition-colors"
                                        />
                                    ) : (
                                        <div className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-300 font-mono text-sm truncate flex items-center">
                                            {targetFolder || <span className="text-slate-600 italic">No folder selected</span>}
                                        </div>
                                    )}
                                    <button
                                        type="button"
                                        onClick={handleOpenFolderPicker}
                                        className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors flex items-center gap-2"
                                    >
                                        <FolderOpen className="w-4 h-4" /> {storageType === 'GoogleDrive' ? 'Browse' : 'Set Path'}
                                    </button>
                                </div>
                                <p className="text-[10px] text-slate-500 mt-1.5 ml-1">
                                    {storageType === 'GoogleDrive'
                                        ? 'Path relative to the authorized Google Drive account.'
                                        : 'For security reasons, web browsers typically default to the Downloads folder.'}
                                </p>
                            </div>

                            {/* Status Toggle */}
                            <div className="flex items-center justify-between bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                                <div>
                                    <span className="block text-sm font-semibold text-white">Active Status</span>
                                    <span className="text-xs text-slate-500">Enable or disable this schedule</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setIsActive(!isActive)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isActive ? 'bg-green-500' : 'bg-slate-600'}`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    disabled={isSubmitting}
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-2.5 text-slate-300 hover:bg-slate-700 rounded-lg transition-colors font-medium disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold shadow-lg shadow-blue-900/20 transition-all hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                            Saving...
                                        </>
                                    ) : (
                                        editingId ? 'Update Schedule' : 'Create Schedule'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Google Drive Folder Picker Modal */}
            {isFolderPickerOpen && storageType === 'GoogleDrive' && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
                    <div className="bg-slate-800 w-full max-w-2xl rounded-2xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-200">

                        {/* Header */}
                        <div className="p-4 border-b border-slate-700 bg-slate-900/50 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/d/da/Google_Drive_logo_%282020%29.svg" className="w-6 h-6" alt="Drive" />
                                Select Destination
                            </h3>
                            <button onClick={() => setIsFolderPickerOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Breadcrumbs */}
                        <div className="bg-slate-900 border-b border-slate-700 px-4 py-3 flex items-center gap-2 overflow-x-auto">
                            {currentPath.length > 1 && (
                                <button onClick={handleGoBack} className="p-1 hover:bg-slate-700 rounded-md text-slate-400 hover:text-white mr-2">
                                    <ArrowLeft className="w-4 h-4" />
                                </button>
                            )}
                            {currentPath.map((folder, index) => (
                                <React.Fragment key={index}>
                                    <div className={`flex items-center gap-1 text-sm font-medium whitespace-nowrap ${index === currentPath.length - 1 ? 'text-white' : 'text-slate-400'}`}>
                                        {index === 0 && <Home className="w-3.5 h-3.5 mb-0.5" />}
                                        {folder}
                                    </div>
                                    {index < currentPath.length - 1 && <ChevronRight className="w-4 h-4 text-slate-600" />}
                                </React.Fragment>
                            ))}
                        </div>

                        {/* Folder Grid */}
                        <div className="flex-1 overflow-y-auto p-4 bg-slate-800/50">
                            {subFolders.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-slate-500 py-12">
                                    <FolderOpen className="w-12 h-12 mb-3 opacity-20" />
                                    <p>This folder is empty</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                    {subFolders.map((folder) => (
                                        <button
                                            key={folder}
                                            onClick={() => handleNavigate(folder)}
                                            className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-700 bg-slate-800 hover:bg-blue-600/10 hover:border-blue-500/50 transition-all group"
                                        >
                                            <Folder className="w-10 h-10 text-slate-500 group-hover:text-blue-400 mb-2 fill-slate-500/20 group-hover:fill-blue-400/20 transition-colors" />
                                            <span className="text-sm text-slate-300 group-hover:text-white text-center truncate w-full font-medium">
                                                {folder}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-slate-700 bg-slate-900/50 flex justify-between items-center">
                            <div className="text-xs text-slate-500">
                                Selected: <span className="text-slate-300 font-mono">/{currentPath.join('/').replace('My Drive', 'Drive')}</span>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setIsFolderPickerOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSelectFolder}
                                    className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-lg shadow-lg shadow-blue-900/20 transition-all flex items-center gap-2"
                                >
                                    <Check className="w-4 h-4" /> Use this folder
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};