import React from 'react';

interface RiskDisclosureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RiskDisclosureModal: React.FC<RiskDisclosureModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-xl transition-opacity" onClick={onClose}></div>
      
      <div className="relative z-10 w-full max-w-2xl bg-black/60 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_0_100px_rgba(0,0,0,0.8)] flex flex-col max-h-[85vh] animate-[scaleIn_0.2s_ease-out] overflow-hidden ring-1 ring-white/5">
        
        {/* Decorative Top Line */}
        <div className="h-1 w-full bg-gradient-to-r from-emerald-500 via-prime-cyan to-blue-600"></div>

        {/* Header */}
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] bg-black/50">
            <div className="flex items-center gap-5">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-900/30 to-black rounded-2xl flex items-center justify-center text-prime-cyan border border-white/10 shadow-[0_0_20px_rgba(0,240,255,0.1)]">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
                </div>
                <div>
                    <h2 className="text-xl font-black text-white uppercase tracking-tight font-display">Investment Disclosure</h2>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest font-mono">REG-V4.2-LIVE</p>
                    </div>
                </div>
            </div>
            <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-slate-500 hover:text-white transition-all border border-white/5 hover:border-white/20">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide text-justify relative bg-transparent">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[80px] rounded-full pointer-events-none"></div>

            <section>
                <h3 className="text-xs font-black text-white uppercase mb-4 flex items-center gap-3 border-l-2 border-prime-cyan pl-3">
                    1. High Risk Investment
                </h3>
                <p className="text-xs leading-7 text-slate-400 font-medium pl-3.5">
                    The high risk investment is perfectly great. We operate in a Real Smart trading environment where opportunities are maximized through volatility. While market conditions fluctuate, our approach embraces this dynamic to target substantial growth via proprietary V4.2 algorithms.
                </p>
            </section>

            <section>
                <h3 className="text-xs font-black text-white uppercase mb-4 flex items-center gap-3 border-l-2 border-emerald-500 pl-3">
                    2. Funds Safety & AI Tools
                </h3>
                <p className="text-xs leading-7 text-slate-400 font-medium pl-3.5">
                    Funds are not guaranteed but are safe with our AI trading tools. The system utilizes advanced algorithmic protection layers to manage capital efficiently. Our proprietary technology works to the best rates to produce winnings, ensuring that your portfolio is positioned for optimal performance.
                </p>
            </section>

            <section>
                <h3 className="text-xs font-black text-white uppercase mb-4 flex items-center gap-3 border-l-2 border-blue-500 pl-3">
                    3. Real Smart Outcome
                </h3>
                <p className="text-xs leading-7 text-slate-400 font-medium pl-3.5">
                    Our AI system works tirelessly to bring the best outcome for every investors automating their wealth generation. By leveraging machine learning and real-time data, we aim to consistently outperform traditional market benchmarks.
                </p>
            </section>

            <div className="p-6 bg-emerald-900/10 border border-emerald-500/20 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
                <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wide leading-relaxed text-center">
                    By accessing the Prime AI Terminal, you acknowledge that you understand our modern approach: High risk is great, and our AI works to produce winnings.
                </p>
            </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 flex justify-between items-center bg-black/40">
            <span className="text-[9px] text-slate-600 font-mono">ID: AI-SECURE-2024</span>
            <button 
                onClick={onClose}
                className="px-10 py-4 bg-white hover:bg-prime-cyan text-black font-black uppercase tracking-[0.2em] text-[10px] rounded-xl transition-all shadow-lg hover:shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:scale-[1.02]"
            >
                I Understand & Agree
            </button>
        </div>
      </div>
    </div>
  );
};