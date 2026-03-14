import React, { useEffect, useState } from 'react';

const Loader: React.FC = () => {
  const [text, setText] = useState('Initializing Cryptographic Handshake...');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const steps = [
      { t: 'Initializing Tesla-Resistant Encryption...', p: 15 },
      { t: 'Deriving Session Keys (AES-256-GCM)...', p: 40 },
      { t: 'Verifying Zero-Knowledge Proofs...', p: 65 },
      { t: 'Establishing End-to-End Encrypted Tunnel...', p: 90 },
      { t: 'Secure Uplink Established.', p: 100 },
    ];

    let currentStep = 0;

    const interval = setInterval(() => {
      if (currentStep >= steps.length) {
        clearInterval(interval);
        return;
      }
      setText(steps[currentStep].t);
      setProgress(steps[currentStep].p);
      currentStep++;
    }, 600);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center text-white">
      <div className="w-64 relative mb-8">
         {/* Tech Ring Animation */}
         <div className="absolute inset-0 border-t-2 border-prime-cyan rounded-full animate-spin"></div>
         <div className="absolute inset-2 border-r-2 border-blue-600 rounded-full animate-spin reverse"></div>
         <div className="h-16 w-16 mx-auto bg-prime-cyan/10 rounded-full flex items-center justify-center backdrop-blur-md border border-prime-cyan/30 shadow-[0_0_20px_rgba(0,240,255,0.2)]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-prime-cyan"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
         </div>
      </div>

      <h2 className="text-lg font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-prime-cyan to-blue-500 mb-4 animate-pulse uppercase tracking-widest text-center">
        {text}
      </h2>

      {/* Progress Bar */}
      <div className="w-80 h-0.5 bg-slate-900 rounded-full overflow-hidden relative">
        <div 
            className="h-full bg-prime-cyan transition-all duration-500 ease-out shadow-[0_0_10px_rgba(0,240,255,0.8)]"
            style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      <div className="mt-6 flex items-center gap-2 text-[10px] text-slate-500 font-mono uppercase tracking-[0.2em]">
        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
        E2EE Protocol Active
      </div>
    </div>
  );
};

export default Loader;