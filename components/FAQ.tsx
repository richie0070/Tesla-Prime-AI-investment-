import React, { useState } from 'react';

const FAQS = [
  {
    q: "How does Tesla shares investing work?",
    a: "Our platform provides direct, fractionalized access to Tesla equity. Your capital is allocated to long-term holding strategies designed to capture the growth of Tesla's ecosystem, managed securely within your portfolio."
  },
  {
    q: "How do the AI trading bots operate?",
    a: "The AI bots execute high-frequency trades across global markets using advanced predictive algorithms. They operate 24/7, managing risk through dynamic stop-losses and capitalizing on micro-market movements."
  },
  {
    q: "What are the short-term investment plans?",
    a: "Short-term plans are fixed-yield smart contracts. You lock your capital for a specified duration (e.g., 7, 14, or 30 days) and receive a guaranteed return upon completion, along with your principal."
  },
  {
    q: "How does the reseller program pay out?",
    a: "Resellers earn commissions based on the activity of their referrals. Payouts are calculated in real-time and credited directly to your platform wallet, where they can be withdrawn or reinvested immediately."
  },
  {
    q: "Are there hidden fees?",
    a: "No. We operate with complete transparency. All investment, trading, and withdrawal fees are clearly stated before you execute any transaction. You can review our full fee schedule at any time."
  }
];

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 md:py-32 relative border-t border-white/5 bg-transparent">
      <div className="max-w-3xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-6">
                Frequently Asked Questions
            </h2>
            <p className="text-slate-400 text-lg font-medium">
                Everything you need to know about the Tesla Prime AI ecosystem.
            </p>
        </div>
        
        {/* Accordion */}
        <div className="space-y-4">
          {FAQS.map((faq, i) => (
            <div key={i} className={`border-b border-white/10 transition-colors duration-300 ${openIndex === i ? 'bg-white/[0.02]' : 'hover:bg-white/[0.01]'}`}>
              <button 
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex justify-between items-center py-6 text-left focus:outline-none"
              >
                <span className={`font-bold text-lg transition-colors duration-300 ${openIndex === i ? 'text-prime-cyan' : 'text-white'}`}>
                    {faq.q}
                </span>
                <span className="ml-6 shrink-0 flex items-center justify-center w-8 h-8 rounded-full border border-white/10 text-slate-400">
                    {openIndex === i ? (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/></svg>
                    ) : (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
                    )}
                </span>
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === i ? 'max-h-48 opacity-100 pb-6' : 'max-h-0 opacity-0'}`}
              >
                <p className="text-slate-400 leading-relaxed pr-12">
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default FAQ;