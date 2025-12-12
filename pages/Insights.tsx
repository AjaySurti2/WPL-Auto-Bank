import React, { useState } from 'react';
import { analyzeStatementSummary } from '../services/geminiService';
import { GeminiAnalysisResult } from '../types';
import { Sparkles, FileText, AlertOctagon, TrendingUp, Loader2 } from 'lucide-react';

export const Insights: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [analysis, setAnalysis] = useState<GeminiAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    try {
        const result = await analyzeStatementSummary(inputText);
        setAnalysis(result);
    } catch (e) {
        console.error(e);
        alert("Failed to analyze.");
    } finally {
        setLoading(false);
    }
  };

  // Mock population
  const fillMock = () => {
    setInputText("Statement Summary Oct 2023: Total debits $4,500. $1,200 spent on Groceries at Whole Foods and Trader Joes. $500 Utility bill. $2000 rent transfer. One unusual debit of $250 at 'Unknown Tech Store' on Oct 12.");
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
        <div className="text-center mb-8">
             <h2 className="text-3xl font-bold text-white flex items-center justify-center gap-3">
                <Sparkles className="w-8 h-8 text-purple-400" /> 
                AI Statement Insight
            </h2>
            <p className="text-slate-400 mt-2">Paste a text summary of your bank statement and let Gemini find trends and anomalies.</p>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-xl">
            <textarea
                className="w-full h-32 bg-slate-900 border border-slate-700 rounded-lg p-4 text-slate-300 focus:outline-none focus:border-purple-500 transition-colors resize-none"
                placeholder="Paste statement text here..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
            ></textarea>
            <div className="flex justify-between items-center mt-4">
                <button onClick={fillMock} className="text-xs text-slate-500 hover:text-slate-300 underline">Try with sample data</button>
                <button 
                    onClick={handleAnalyze}
                    disabled={loading || !inputText}
                    className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-all"
                >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    Analyze with Gemini
                </button>
            </div>
        </div>

        {analysis && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Summary Section */}
                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                    <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-400" /> Summary
                    </h3>
                    <p className="text-slate-300 leading-relaxed">{analysis.summary}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Trends */}
                    <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                         <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-green-400" /> Spending Trends
                        </h3>
                        <div className="space-y-3">
                            {analysis.spendingTrends.map((trend, idx) => (
                                <div key={idx} className="flex justify-between items-center p-3 bg-slate-900 rounded-lg">
                                    <span className="text-slate-300">{trend.category}</span>
                                    <span className="font-mono text-green-400">${trend.amount}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Anomalies */}
                    <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                         <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <AlertOctagon className="w-5 h-5 text-red-400" /> Detected Anomalies
                        </h3>
                        {analysis.anomalies.length > 0 ? (
                            <ul className="space-y-2">
                                {analysis.anomalies.map((item, idx) => (
                                    <li key={idx} className="flex gap-3 text-red-300 bg-red-900/10 p-3 rounded-lg border border-red-900/30 text-sm">
                                        <div className="min-w-[6px] h-[6px] rounded-full bg-red-500 mt-1.5"></div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-slate-500 italic">No anomalies detected.</p>
                        )}
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};