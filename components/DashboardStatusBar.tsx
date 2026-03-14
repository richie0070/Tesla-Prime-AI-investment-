import React from 'react';
import { Terminal, Briefcase, ListOrdered, Settings, Activity } from 'lucide-react';

interface DashboardStatusBarProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

const DashboardStatusBar: React.FC<DashboardStatusBarProps> = ({ activePage, onNavigate }) => {
  const TABS = [
    { id: 'Dashboard', label: 'Terminal', icon: Terminal },
    { id: 'Markets', label: 'Markets', icon: Activity },
    { id: 'Portfolio', label: 'Portfolio', icon: Briefcase },
    { id: 'Ledger', label: 'Ledger', icon: ListOrdered },
    { id: 'Settings', label: 'Automated Bot', icon: Settings },
  ];

  return (
    <div className="fixed z-[90] bottom-[calc(1rem+env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-md lg:hidden">
      <div className="bg-[#0a0a0a]/90 backdrop-blur-3xl border border-white/10 rounded-3xl h-[76px] flex justify-around items-center px-2 shadow-[0_20px_40px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.1)] relative overflow-hidden">
        {/* Subtle animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-prime-cyan/5 via-transparent to-blue-500/5 opacity-50 pointer-events-none"></div>
        
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activePage === tab.id;
          
          return (
            <button 
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className="relative flex flex-col items-center justify-center w-16 h-full group outline-none z-10"
            >
              {/* Active Indicator Glow Behind */}
              {isActive && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-12 h-12 bg-prime-cyan/20 rounded-full blur-xl"></div>
                </div>
              )}
              
              {/* Icon & Label Container */}
              <div className="relative flex flex-col items-center justify-center w-full h-full">
                <div className={`relative flex items-center justify-center w-11 h-11 rounded-2xl transition-all duration-500 z-10 ${
                  isActive 
                    ? '-translate-y-2.5 bg-gradient-to-br from-prime-cyan/20 to-blue-500/20 text-prime-cyan shadow-[inset_0_0_20px_rgba(0,240,255,0.2),0_0_15px_rgba(0,240,255,0.2)] border border-prime-cyan/30' 
                    : 'translate-y-0 text-slate-500 group-hover:text-slate-300 group-hover:bg-white/5 group-active:scale-95 border border-transparent'
                }`}>
                  <Icon size={22} strokeWidth={isActive ? 2.5 : 2} className={`transition-transform duration-500 ${isActive ? 'scale-110' : ''}`} />
                </div>
                
                {/* Label */}
                <span className={`absolute bottom-2.5 text-[9px] font-black tracking-widest uppercase transition-all duration-500 ${
                  isActive ? 'text-white opacity-100 translate-y-0' : 'text-slate-500 opacity-0 translate-y-2'
                }`}>
                  {tab.label}
                </span>

                {/* Active Dot (Bottom) */}
                {isActive && (
                  <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-prime-cyan rounded-full shadow-[0_0_8px_#00f0ff]"></div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardStatusBar;