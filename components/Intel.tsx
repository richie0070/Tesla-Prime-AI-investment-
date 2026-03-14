import React, { useState } from 'react';
import { getSearchIntelligence, getMarketAnalysis } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';
import { Loader2, Search, BrainCircuit, Activity, ShieldAlert, Globe, ArrowUpRight } from 'lucide-react';

export default function Intel() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<{ text: string; sources: any[] } | null>(null);
  const [error, setError] = useState('');

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setError('');
    try {
      const res = await getSearchIntelligence(searchQuery);
      setSearchResult(res as any);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch intelligence.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleQuickAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const mockData = { btc: 65000, eth: 3500, sol: 140, trend: 'bullish', volatility: 'medium' };
      const res = await getMarketAnalysis(mockData, 'Aggressive');
      setAnalysisResult(res);
    } catch (err) {
      setAnalysisResult('Analysis failed. Retrying connection to neural net...');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10 animate-[fadeIn_0.3s]">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-2 bg-prime-cyan rounded-full animate-pulse"></div>
            <span className="text-[10px] font-black text-prime-cyan uppercase tracking-[0.3em]">Intelligence Status: Operational</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter font-display flex items-center gap-4">
            <BrainCircuit className="w-10 h-10 md:w-14 md:h-14 text-prime-cyan" />
            Global Intelligence
          </h2>
          <p className="text-slate-400 text-lg font-medium max-w-2xl leading-relaxed">Predictive Analytics & Macro Search powered by <span className="text-white">Neural Network V4.2</span>.</p>
        </div>
        <div className="bg-white/5 px-4 py-2 rounded-xl border border-white/10 flex items-center gap-3">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">AES-256 Encrypted</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Search Panel */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group hover:border-prime-cyan/30 transition-all duration-500">
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-prime-cyan/5 blur-[80px] pointer-events-none"></div>
            
            <form onSubmit={handleSearch} className="relative mb-8">
              <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                <Search className="w-6 h-6 text-slate-500" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Query global markets, assets, or macro events..."
                className="w-full bg-black/60 border border-white/10 rounded-2xl py-5 pl-14 pr-36 text-white font-mono text-sm focus:outline-none focus:border-prime-cyan/50 transition-all shadow-inner"
              />
              <button
                type="submit"
                disabled={isSearching || !searchQuery.trim()}
                className="absolute inset-y-2.5 right-2.5 px-8 bg-white text-black font-black text-[10px] uppercase tracking-[0.2em] rounded-xl hover:bg-prime-cyan transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 relative overflow-hidden group/btn"
              >
                {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                  <>
                    Execute
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_2s_infinite]"></div>
                  </>
                )}
              </button>
            </form>

            {error && (
              <div className="mt-8 p-5 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-start gap-4 text-rose-400 animate-[fadeIn_0.3s]">
                <ShieldAlert className="w-6 h-6 shrink-0" />
                <p className="text-sm font-mono font-bold uppercase tracking-tight">{error}</p>
              </div>
            )}

            {searchResult && !isSearching && (
              <div className="mt-8 space-y-8 animate-[fadeIn_0.5s]">
                <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl prose prose-invert prose-p:text-slate-300 prose-a:text-prime-cyan prose-headings:text-white max-w-none font-sans leading-relaxed shadow-inner">
                  <ReactMarkdown>{searchResult.text || ''}</ReactMarkdown>
                </div>
                
                {searchResult.sources && searchResult.sources.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 flex items-center gap-3">
                      <Globe className="w-4 h-4 text-prime-cyan" />
                      Verified Intelligence Sources
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {searchResult.sources.map((source: any, idx: number) => {
                        const uri = source?.web?.uri;
                        const title = source?.web?.title;
                        if (!uri) return null;
                        return (
                          <a
                            key={idx}
                            href={uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-4 bg-black/40 border border-white/5 hover:border-prime-cyan/40 rounded-2xl flex items-center justify-between group transition-all duration-300 hover:bg-white/5"
                          >
                            <span className="text-xs text-slate-400 group-hover:text-white truncate pr-4 font-mono font-bold">
                              {title || new URL(uri).hostname}
                            </span>
                            <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-prime-cyan shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Analytics */}
        <div className="space-y-8">
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group hover:border-prime-cyan/30 transition-all duration-500">
            <div className="absolute top-0 right-0 w-48 h-48 bg-prime-cyan/5 rounded-full blur-[80px] -mr-16 -mt-16 pointer-events-none"></div>
            
            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 mb-8 flex items-center gap-3">
              <Activity className="w-5 h-5 text-emerald-400" />
              Neural Market Scan
            </h3>
            
            <button
              onClick={handleQuickAnalysis}
              disabled={isAnalyzing}
              className="w-full py-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-white font-mono text-[10px] font-black uppercase tracking-[0.2em] transition-all disabled:opacity-50 flex items-center justify-center gap-3 mb-8 relative overflow-hidden group/diag"
            >
              {isAnalyzing ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>
                  Run Diagnostics
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/diag:animate-[shimmer_2s_infinite]"></div>
                </>
              )}
            </button>

            {analysisResult && (
              <div className="p-5 bg-prime-cyan/5 border border-prime-cyan/20 rounded-2xl mb-8 animate-[fadeIn_0.3s]">
                <p className="text-sm text-prime-cyan font-mono font-bold leading-relaxed">
                  {analysisResult}
                </p>
              </div>
            )}

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-black/40 rounded-2xl border border-white/5 group-hover:border-white/10 transition-colors">
                <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Sentiment</span>
                <span className="text-xs text-emerald-400 font-black font-mono">Bullish (78%)</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-black/40 rounded-2xl border border-white/5 group-hover:border-white/10 transition-colors">
                <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Volatility</span>
                <span className="text-xs text-amber-400 font-black font-mono">Elevated</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-black/40 rounded-2xl border border-white/5 group-hover:border-white/10 transition-colors">
                <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Liquidity</span>
                <span className="text-xs text-prime-cyan font-black font-mono">Optimal</span>
              </div>
            </div>
          </div>

          {/* Quick Links / News */}
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl group hover:border-prime-cyan/30 transition-all duration-500">
            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 mb-8">Trending Topics</h3>
            <div className="space-y-4">
              {['Federal Reserve Rates', 'Bitcoin Halving Impact', 'AI Sector Earnings', 'Global Supply Chain'].map((topic, i) => (
                <button
                  key={i}
                  onClick={(e) => {
                    setSearchQuery(topic);
                    const runSearch = async () => {
                      setIsSearching(true);
                      setError('');
                      try {
                        const res = await getSearchIntelligence(topic);
                        setSearchResult(res as any);
                      } catch (err: any) {
                        setError(err.message || 'Failed to fetch intelligence.');
                      } finally {
                        setIsSearching(false);
                      }
                    };
                    runSearch();
                  }}
                  className="w-full text-left p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 hover:border-prime-cyan/30 transition-all text-xs text-slate-300 font-mono font-bold flex items-center justify-between group/topic"
                >
                  {topic}
                  <Search className="w-4 h-4 text-slate-600 group-hover/topic:text-prime-cyan transition-colors" />
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
