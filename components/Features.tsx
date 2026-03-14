import React from 'react';
import { useNavigate } from 'react-router-dom';

const FEATURES = [
  {
    title: 'Tesla Shares Long-Term Investment',
    desc: 'Build wealth through structured exposure to Tesla equity with automated portfolio balancing.',
    icon: <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>,
    bullets: ['Direct equity exposure', 'Automated rebalancing', 'Long-term growth focus'],
    link: '/about'
  },
  {
    title: 'AI Bot Trading Automation',
    desc: 'Deploy institutional-grade algorithmic trading bots that execute strategies with zero emotion.',
    icon: <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>,
    bullets: ['High-frequency execution', 'Dynamic risk management', '24/7 market scanning'],
    link: '/features'
  },
  {
    title: 'Short-Term Investment Plans',
    desc: 'Accelerate capital growth through fixed-cycle investment plans with predictable return targets.',
    icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>,
    bullets: ['Daily & weekly cycles', 'Fixed return targets', 'High liquidity'],
    link: '/features'
  },
  {
    title: 'Real Estate Participation',
    desc: 'Diversify your portfolio with fractional access to premium real estate development projects.',
    icon: <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>,
    bullets: ['Fractional ownership', 'Stable yield generation', 'Asset appreciation'],
    link: '/real-estate'
  },
  {
    title: 'Global Reseller Program',
    desc: 'Generate active income by joining our exclusive agent network and distributing premium financial products.',
    icon: <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M16 3.13a4 4 0 0 1 0 7.75"/>,
    bullets: ['High commission rates', 'Global distribution', 'Real-time tracking'],
    link: '/reseller'
  },
  {
    title: 'Wallet and Fee Transparency',
    desc: 'Maintain complete control over your capital with a secure wallet and crystal-clear fee structures.',
    icon: <><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>,
    bullets: ['Zero hidden costs', 'Instant settlements', 'Bank-grade security'],
    link: '/fees'
  }
];

const Features: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section id="features" className="py-24 md:py-32 px-4 md:px-6 relative text-white overflow-hidden bg-transparent">
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16 md:mb-24">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-6">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Platform Ecosystem</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tighter">Core Financial Modules</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg font-medium">
                A comprehensive suite of wealth generation tools designed for the modern institutional investor.
            </p>
        </div>

        {/* Core Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {FEATURES.map((f, i) => (
            <div key={i} className="p-8 rounded-3xl bg-black/40 backdrop-blur-xl border border-white/5 hover:border-white/20 transition-all duration-500 group hover:-translate-y-1 shadow-lg flex flex-col h-full">
              <div className="mb-6 w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-prime-cyan border border-white/10">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {f.icon}
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">{f.title}</h3>
              <p className="text-slate-400 leading-relaxed text-sm font-medium mb-6 flex-1">{f.desc}</p>
              
              <ul className="space-y-2 mb-8">
                {f.bullets.map((bullet, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                        <span className="text-emerald-400">✓</span> {bullet}
                    </li>
                ))}
              </ul>

              <button 
                onClick={() => {
                  navigate(f.link);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="text-left text-xs font-bold text-prime-cyan uppercase tracking-widest hover:text-white transition-colors mt-auto flex items-center gap-2"
              >
                  Learn More <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;