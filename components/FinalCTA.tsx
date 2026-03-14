import React from 'react';
import { useNavigate } from 'react-router-dom';

interface FinalCTAProps {
  onStart: () => void;
}

const FinalCTA: React.FC<FinalCTAProps> = ({ onStart }) => {
  const navigate = useNavigate();

  return (
    <div className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-prime-cyan/5 to-transparent"></div>
      
      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
        <h2 className="text-4xl md:text-6xl font-display font-black uppercase tracking-tight text-white mb-6">
          Start Building a Smarter Financial Future
        </h2>
        <p className="text-slate-400 text-lg mb-12 max-w-2xl mx-auto">
          Join Tesla Prime AI today and gain access to institutional-grade investment tools, AI bot trading, and premium real estate opportunities.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
          <button 
            onClick={onStart}
            className="px-8 py-4 bg-prime-cyan text-black font-black font-display uppercase tracking-widest rounded-xl hover:bg-white transition-colors text-lg w-full sm:w-auto"
          >
            Create Account
          </button>
          <button 
            onClick={() => {
              navigate('/features');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-8 py-4 bg-white/5 border border-white/10 text-white font-bold font-display uppercase tracking-widest rounded-xl hover:bg-white/10 transition-colors text-lg w-full sm:w-auto"
          >
            Explore Solutions
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinalCTA;
