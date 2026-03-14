import React from 'react';

const SupportPage: React.FC = () => {
  return (
    <div className="relative z-10 pt-32 pb-20 px-6 max-w-7xl mx-auto text-white">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-display font-black uppercase tracking-tight mb-6">Support Center</h1>
        <p className="text-slate-400 text-lg max-w-3xl mx-auto">
          Get help with your account, fees, or investment guidance. Our team is here to assist you 24/7.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
        <div className="lg:col-span-4 space-y-6">
          <h2 className="text-2xl font-bold font-display uppercase tracking-wide mb-6">Support Categories</h2>
          
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors cursor-pointer group">
            <h4 className="text-lg font-bold mb-2 group-hover:text-prime-cyan transition-colors">Account Assistance</h4>
            <p className="text-slate-400 text-sm">KYC verification, password resets, and profile management.</p>
          </div>
          
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors cursor-pointer group">
            <h4 className="text-lg font-bold mb-2 group-hover:text-prime-cyan transition-colors">Fees Assistance</h4>
            <p className="text-slate-400 text-sm">Questions about trading fees, withdrawal limits, and commission payouts.</p>
          </div>
          
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors cursor-pointer group">
            <h4 className="text-lg font-bold mb-2 group-hover:text-prime-cyan transition-colors">Investment Guidance</h4>
            <p className="text-slate-400 text-sm">Help with AI bot configuration, real estate allocation, and portfolio strategy.</p>
          </div>
        </div>

        <div className="lg:col-span-8">
          <div className="bg-black/40 border border-white/10 rounded-2xl p-8 backdrop-blur-md flex flex-col items-center justify-center text-center min-h-[400px]">
            <div className="w-20 h-20 bg-prime-cyan/10 rounded-full flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-prime-cyan"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            </div>
            <h2 className="text-3xl font-bold font-display uppercase tracking-wide mb-4">Live Support</h2>
            <p className="text-slate-400 mb-8 max-w-md">
              Our dedicated support team is available 24/7 to assist you with any questions or issues regarding your account, investments, or the platform.
            </p>
            <button 
              type="button" 
              onClick={() => {
                if (typeof (window as any).jivo_api !== 'undefined') {
                  (window as any).jivo_api.open();
                } else {
                  alert('Live chat is currently initializing. Please try again in a moment.');
                }
              }}
              className="px-8 py-4 bg-prime-cyan text-black font-black font-display uppercase tracking-widest rounded-xl hover:bg-white transition-colors shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]"
            >
              Start Live Chat
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-display font-black uppercase tracking-tight mb-8 text-center">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h4 className="text-lg font-bold mb-2">How long does KYC verification take?</h4>
            <p className="text-slate-400 text-sm">Standard KYC verification is typically completed within 24 hours. If additional documentation is required, our compliance team will contact you directly.</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h4 className="text-lg font-bold mb-2">I forgot my password. How do I reset it?</h4>
            <p className="text-slate-400 text-sm">Click the "Forgot Password" link on the login screen. You will receive an email with a secure link to reset your credentials.</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h4 className="text-lg font-bold mb-2">How do I contact my dedicated account manager?</h4>
            <p className="text-slate-400 text-sm">If you are a premium tier investor, your dedicated account manager's contact information is available in the "Profile" section of your dashboard.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
