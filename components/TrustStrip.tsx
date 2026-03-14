import React from 'react';

const TRUST_ITEMS = [
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
    title: 'Secure Infrastructure',
    desc: 'Bank-grade encryption'
  },
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
    title: 'AI Trading Engine',
    desc: 'Automated execution'
  },
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
    title: 'Long-Term Equity Access',
    desc: 'Tesla shares portfolio'
  },
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>,
    title: 'Transparent Fees',
    desc: 'Zero hidden costs'
  },
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
    title: 'Multi-Income Platform',
    desc: 'Diversified growth'
  }
];

const TrustStrip: React.FC = () => {
  return (
    <div className="border-y border-white/10 bg-white/[0.02] py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {TRUST_ITEMS.map((item, i) => (
            <div key={i} className="flex flex-col items-center text-center p-4 rounded-xl border border-transparent hover:border-white/10 hover:bg-white/5 transition-all duration-300">
              <div className="text-prime-cyan mb-3 opacity-80">
                {item.icon}
              </div>
              <h3 className="text-white font-bold text-sm mb-1">{item.title}</h3>
              <p className="text-slate-400 text-xs">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrustStrip;
