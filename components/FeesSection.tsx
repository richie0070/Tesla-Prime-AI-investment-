import React from 'react';
import { useNavigate } from 'react-router-dom';

const FEES = [
  {
    title: 'Investment Fees',
    amount: '0.5% - 1.5%',
    desc: 'Applied when allocating funds to long-term Tesla shares or short-term plans.'
  },
  {
    title: 'Trading Fees',
    amount: '0.1%',
    desc: 'Applied to AI bot automated trades and manual executions. Volume discounts available.'
  },
  {
    title: 'Wallet Fees',
    amount: '0.00%',
    desc: 'Internal transfers between your own modules are completely free.'
  },
  {
    title: 'Reseller Deductions',
    amount: 'Variable',
    desc: 'Commissions are deducted automatically from the platform fee, not your principal.'
  }
];

const FeesSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section id="fees" className="py-24 md:py-32 relative border-t border-white/5 bg-black">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16 md:mb-24">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-6">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Transparency</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-6">
                Transparent Fees Built into Every Action
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg font-medium">
                We believe in complete transparency. All fees are clearly displayed before you confirm any action, and you can track your complete fee history directly from your dashboard.
            </p>
        </div>

        {/* Fees Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {FEES.map((fee, i) => (
                <div key={i} className="bg-white/[0.02] border border-white/10 rounded-2xl p-8 hover:bg-white/5 transition-colors">
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">{fee.title}</h4>
                    <div className="text-3xl font-mono font-bold text-white mb-4">{fee.amount}</div>
                    <p className="text-sm text-slate-500 leading-relaxed">{fee.desc}</p>
                </div>
            ))}
        </div>

        {/* CTA */}
        <div className="text-center">
            <button 
                onClick={() => { navigate('/fees'); window.scrollTo(0, 0); }}
                className="px-8 py-4 bg-transparent border border-white/20 text-white hover:bg-white hover:text-black font-black text-xs rounded-full transition-all uppercase tracking-[0.2em]"
            >
                View Full Fee Schedule
            </button>
        </div>

      </div>
    </section>
  );
};

export default FeesSection;
