import React from 'react';

const STEPS = [
  {
    num: '01',
    title: 'Create your account',
    desc: 'Register in seconds to access the secure investor portal.'
  },
  {
    num: '02',
    title: 'Verify your profile',
    desc: 'Complete identity verification to unlock full platform features.'
  },
  {
    num: '03',
    title: 'Choose your path',
    desc: 'Allocate capital to equity, bots, real estate, or join as a reseller.'
  },
  {
    num: '04',
    title: 'Monitor growth',
    desc: 'Track yields, commissions, and portfolio value from one dashboard.'
  }
];

const HowItWorks: React.FC = () => {
  return (
    <section className="py-24 md:py-32 relative border-t border-white/5 bg-transparent">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16 md:mb-24">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-6">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Onboarding</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-6">
                Streamlined Setup
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg font-medium">
                Begin your wealth generation journey in four simple steps.
            </p>
        </div>

        {/* Steps Grid */}
        <div className="relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-px bg-white/10"></div>
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-8">
                {STEPS.map((step, i) => (
                    <div key={i} className="relative text-center group">
                        {/* Number Circle */}
                        <div className="w-24 h-24 mx-auto bg-black border border-white/10 rounded-full flex items-center justify-center mb-8 relative z-10 group-hover:border-prime-cyan transition-colors duration-500 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                            <span className="text-3xl font-mono font-bold text-white group-hover:text-prime-cyan transition-colors duration-500">{step.num}</span>
                            {/* Inner Glow */}
                            <div className="absolute inset-0 rounded-full bg-prime-cyan/0 group-hover:bg-prime-cyan/5 transition-colors duration-500"></div>
                        </div>
                        
                        <h3 className="text-xl font-bold text-white mb-4">{step.title}</h3>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-[250px] mx-auto">{step.desc}</p>
                    </div>
                ))}
            </div>
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;
