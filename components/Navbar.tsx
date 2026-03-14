import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { TradingSettings, TradeLog, AppNotification, User } from '../types';
import ConfirmationModal from './ConfirmationModal';

interface NavbarProps {
  isLoggedIn: boolean;
  onOpenAccount: () => void;
  onLogout: () => void;
  balance?: number;
  userProfile?: User;
  onOpenDepositModal?: () => void;
  onOpenWithdrawModal?: () => void;
  activePage?: string;
  onNavigate?: (page: string) => void;
  settings?: TradingSettings;
  onUpdateSettings?: (settings: TradingSettings) => void;
  recentTrades?: TradeLog[];
  notifications?: AppNotification[];
  onMarkAllRead?: () => void;
  isTradingActive?: boolean;
  onToggleTrading?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  isLoggedIn, 
  onOpenAccount, 
  onLogout, 
  userProfile, 
  activePage = 'Dashboard',
  onNavigate,
  notifications = [],
  onMarkAllRead,
  isTradingActive = false,
  onToggleTrading
}) => {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [latency, setLatency] = useState(12);
  const [confirmLogout, setConfirmLogout] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  
  const [activeSection, setActiveSection] = useState(location.pathname);
  
  useEffect(() => {
      setActiveSection(location.pathname);
  }, [location.pathname]);

  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  
  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleScroll = () => {
        setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isNavOpen) {
        const interval = setInterval(() => {
            setLatency(prev => Math.max(8, Math.min(40, prev + (Math.random() * 10 - 5))));
        }, 1500);
        return () => clearInterval(interval);
    }
  }, [isNavOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsNavOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLinkClick = (linkName: string, href: string) => {
    if (isLoggedIn && onNavigate) {
      onNavigate(linkName);
      setIsNavOpen(false); 
    } else if (!isLoggedIn) {
        navigate(href);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setIsNavOpen(false);
    }
  };

  const handleLogoClick = () => {
      if (isLoggedIn) {
          setIsNavOpen(!isNavOpen);
          setIsProfileOpen(false);
          setIsNotificationsOpen(false);
      } else {
          setIsNavOpen(!isNavOpen);
      }
  };

  const MENU_ITEMS = [
      { id: 'Dashboard', label: 'Terminal', desc: 'Main Command Center', icon: <path d="M4 17l6-6-6-6M12 19h8"/> },
      { id: 'Markets', label: 'Markets', desc: 'Global Asset Feeds', icon: <path d="M3 3v18h18M18 9l-5 5-4-4-3 3"/> },
      { id: 'Strategies', label: 'AI Nodes', desc: 'Algorithmic Deployment', icon: <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/> },
      { id: 'Portfolio', label: 'Portfolio', desc: 'Active Positions', icon: <><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></> },
      { id: 'Funds', label: 'Liquidity', desc: 'Asset Management', icon: <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/> },
      { id: 'Ledger', label: 'Ledger', desc: 'Immutable Records', icon: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></> },
      { id: 'Analysis', label: 'Intel', desc: 'Predictive Analytics', icon: <><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></> },
      { id: 'Settings', label: 'Automated Bot', desc: 'Bot Configuration', icon: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></> },
  ];

  const LANDING_MENU = [
      { id: '/', label: 'Home' },
      { id: '/features', label: 'Features' },
      { id: '/fees', label: 'Fees' },
      { id: '/real-estate', label: 'Real Estate' },
      { id: '/reseller', label: 'Reseller Program' },
      { id: '/about', label: 'About' },
      { id: '/support', label: 'Support' },
  ];

  const userId = userProfile?.id || 'Guest';
  const userName = userProfile?.name || 'Automated Bot';
  const userInitials = userName.split(' ').map(n => n[0]).join('').slice(0, 2);

  return (
    <nav className={`fixed top-0 w-full z-50 h-16 md:h-20 transition-all duration-300 ease-in-out ${
        scrolled || isLoggedIn ? 'bg-black/60 backdrop-blur-xl border-b border-white/10 shadow-2xl' : 'bg-transparent border-b border-transparent'
    }`}>
      <div className="relative h-full px-4 sm:px-6 md:px-10 flex justify-between items-center max-w-[1920px] mx-auto">
        
        {/* Left: Brand & Navigation Trigger */}
        <div className="flex items-center gap-4 sm:gap-10" ref={navRef}>
             <div className="relative">
                <div className="flex items-center gap-3 md:gap-4 cursor-pointer group select-none" onClick={handleLogoClick}>
                    <div className="relative w-8 h-8 md:w-10 md:h-10 flex items-center justify-center">
                        <div className={`absolute inset-0 bg-prime-cyan blur-md transition-opacity rounded-xl ${isNavOpen ? 'opacity-60' : 'opacity-20 group-hover:opacity-40'}`}></div>
                        <div className={`relative w-full h-full bg-gradient-to-br from-white to-slate-300 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg transition-all ${isNavOpen ? 'shadow-[0_0_20px_rgba(0,240,255,0.5)] scale-105' : 'group-hover:shadow-[0_0_20px_rgba(0,240,255,0.3)]'}`}>
                            <svg className="w-4 h-4 md:w-5 md:h-5 text-black" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.5C14.5 2.5 17 3 19.5 4L19 5.5C16.8 4.6 14.5 4.2 12 4.2C9.5 4.2 7.2 4.6 5 5.5L4.5 4C7 3 9.5 2.5 12 2.5ZM12 6C15 6 17.5 7 19.5 8.5L18.5 10C16.8 8.8 14.5 8 12 8C9.5 8 7.2 8.8 5.5 10L4.5 8.5C6.5 7 9 6 12 6ZM11.2 10.5H12.8V21.5H11.2V10.5Z" /></svg>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span className={`font-display font-black text-sm sm:text-lg md:text-xl leading-none tracking-tight uppercase transition-colors ${isNavOpen ? 'text-prime-cyan' : 'text-white group-hover:text-prime-cyan'}`}>TESLA <span className="hidden sm:inline">PRIME</span> <span className="text-prime-cyan">AI</span></span>
                        <span className="text-[7px] md:text-[9px] font-mono text-slate-500 tracking-[0.2em] md:tracking-[0.3em] uppercase mt-0.5">Investment Broker</span>
                    </div>
                    {isLoggedIn ? (
                         <div className={`ml-1 text-slate-600 transition-transform duration-300 ${isNavOpen ? 'rotate-180 text-prime-cyan' : ''}`}>
                             <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M6 9l6 6 6-6"/></svg>
                         </div>
                    ) : (
                         <div className={`ml-1 text-slate-600 transition-transform duration-300 ${isNavOpen ? 'rotate-180 text-prime-cyan' : ''} lg:hidden`}>
                             <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M6 9l6 6 6-6"/></svg>
                         </div>
                    )}
                </div>

                {/* Primary Navigation Dropdown */}
                {isNavOpen && (
                    <div className="absolute top-full left-0 mt-4 md:mt-6 w-[calc(100vw-2rem)] sm:w-[24rem] bg-black/60 border border-white/10 rounded-2xl md:rounded-[2rem] shadow-[0_50px_100px_rgba(0,0,0,0.9)] overflow-hidden animate-[slideDown_0.3s_cubic-bezier(0.16,1,0.3,1)] backdrop-blur-3xl z-[70] ring-1 ring-white/5">
                        
                        <div className="h-0.5 w-full bg-gradient-to-r from-prime-cyan via-blue-600 to-purple-600"></div>
                        
                        <div className="p-4 md:p-6 border-b border-white/5 bg-gradient-to-b from-white/5 to-transparent">
                             <div className="flex justify-between items-start mb-4 md:mb-5">
                                 <div>
                                     <h3 className="text-xs md:text-sm font-black text-white font-display uppercase tracking-widest flex items-center gap-2">
                                         System Grid
                                         <span className="w-1.5 h-1.5 bg-prime-cyan rounded-full animate-pulse shadow-[0_0_5px_cyan]"></span>
                                     </h3>
                                     <p className="text-[8px] md:text-[9px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1">Navigation V4.2</p>
                                 </div>
                                 <div className="px-2 py-1 bg-emerald-900/20 border border-emerald-500/20 rounded text-[8px] md:text-[9px] font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                                     <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                                     SECURE (E2EE)
                                 </div>
                             </div>
                             
                             <div className="grid grid-cols-3 gap-2">
                                 <div className="bg-black/40 rounded-lg p-1.5 md:p-2 text-center border border-white/5 hover:border-white/10 transition-colors group cursor-default">
                                     <div className="text-[7px] md:text-[8px] text-slate-500 uppercase font-black tracking-wider group-hover:text-white transition-colors">Ping</div>
                                     <div className="text-[9px] md:text-[10px] text-prime-cyan font-mono font-bold mt-0.5">{Math.floor(latency)}ms</div>
                                 </div>
                                 <div className="bg-black/40 rounded-lg p-1.5 md:p-2 text-center border border-white/5 hover:border-white/10 transition-colors group cursor-default">
                                     <div className="text-[7px] md:text-[8px] text-slate-500 uppercase font-black tracking-wider group-hover:text-white transition-colors">Load</div>
                                     <div className="text-[9px] md:text-[10px] text-blue-400 font-mono font-bold mt-0.5">42%</div>
                                 </div>
                                 <div className="bg-black/40 rounded-lg p-1.5 md:p-2 text-center border border-white/5 hover:border-white/10 transition-colors group cursor-default">
                                     <div className="text-[7px] md:text-[8px] text-slate-500 uppercase font-black tracking-wider group-hover:text-white transition-colors">Ver</div>
                                     <div className="text-[9px] md:text-[10px] text-purple-400 font-mono font-bold mt-0.5">4.2.0</div>
                                 </div>
                             </div>
                        </div>

                        <div className="p-2 max-h-[60vh] overflow-y-auto space-y-1 scrollbar-hide">
                             {isLoggedIn ? MENU_ITEMS.map((item) => (
                                 <button
                                    key={item.id}
                                    onClick={() => handleLinkClick(item.id, '#')}
                                    className={`w-full group relative overflow-hidden rounded-xl p-3 md:p-3.5 text-left transition-all duration-300 border ${
                                        activePage === item.id 
                                        ? 'bg-white/[0.03] border-prime-cyan/30 shadow-[0_0_20px_rgba(0,240,255,0.05)]'
                                        : 'bg-transparent border-transparent hover:bg-white/[0.02] hover:border-white/5'
                                    }`}
                                 >
                                    <div className="absolute inset-0 bg-gradient-to-r from-prime-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                                    <div className="relative z-10 flex items-center gap-3 md:gap-4">
                                        <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center transition-all duration-300 ${
                                            activePage === item.id 
                                            ? 'bg-prime-cyan text-black shadow-lg shadow-cyan-500/20 scale-105' 
                                            : 'bg-white/5 text-slate-500 group-hover:bg-white group-hover:text-black group-hover:scale-105'
                                        }`}>
                                             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">{item.icon}</svg>
                                        </div>
                                        
                                        <div className="flex-1">
                                            <div className={`font-black uppercase tracking-wider text-[9px] md:text-[10px] font-display mb-0.5 transition-colors ${
                                                activePage === item.id ? 'text-white' : 'text-slate-400 group-hover:text-white'
                                            }`}>
                                                {item.label}
                                            </div>
                                            <div className="text-[7px] md:text-[8px] text-slate-600 font-medium uppercase tracking-widest group-hover:text-prime-cyan transition-colors truncate max-w-[140px] md:max-w-none">
                                                {item.desc}
                                            </div>
                                        </div>

                                        <div className={`transition-transform duration-300 hidden sm:block ${
                                            activePage === item.id 
                                            ? 'translate-x-0 opacity-100 text-prime-cyan' 
                                            : 'translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 text-slate-500'
                                        }`}>
                                             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                                        </div>
                                    </div>
                                 </button>
                             )) : LANDING_MENU.map((item) => (
                                 <button
                                    key={item.id}
                                    onClick={() => handleLinkClick(item.label, item.id)}
                                    className={`w-full group relative overflow-hidden rounded-xl p-3 md:p-3.5 text-left transition-all duration-300 border ${
                                        activeSection === item.id 
                                        ? 'bg-white/[0.03] border-prime-cyan/30 shadow-[0_0_20px_rgba(0,240,255,0.05)]'
                                        : 'bg-transparent border-transparent hover:bg-white/[0.02] hover:border-white/5'
                                    }`}
                                 >
                                    <div className="absolute inset-0 bg-gradient-to-r from-prime-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                                    <div className="relative z-10 flex items-center gap-3 md:gap-4">
                                        <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center transition-all duration-300 ${
                                            activeSection === item.id 
                                            ? 'bg-prime-cyan text-black shadow-lg shadow-cyan-500/20 scale-105' 
                                            : 'bg-white/5 text-slate-500 group-hover:bg-white group-hover:text-black group-hover:scale-105'
                                        }`}>
                                             <div className="w-2 h-2 rounded-full bg-current"></div>
                                        </div>
                                        
                                        <div className="flex-1">
                                            <div className={`font-black uppercase tracking-wider text-[9px] md:text-[10px] font-display mb-0.5 transition-colors ${
                                                activeSection === item.id ? 'text-white' : 'text-slate-400 group-hover:text-white'
                                            }`}>
                                                {item.label}
                                            </div>
                                        </div>

                                        <div className={`transition-transform duration-300 hidden sm:block ${
                                            activeSection === item.id 
                                            ? 'translate-x-0 opacity-100 text-prime-cyan' 
                                            : 'translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 text-slate-500'
                                        }`}>
                                             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                                        </div>
                                    </div>
                                 </button>
                             ))}
                        </div>
                        
                        <div className="p-3 bg-black/40 border-t border-white/5 grid grid-cols-2 gap-2">
                            <button className="py-2.5 rounded-lg bg-white/5 border border-white/5 text-[8px] md:text-[9px] font-bold text-slate-400 uppercase tracking-widest hover:text-white hover:bg-white/10 hover:border-white/20 transition-all font-display">
                                Lock Term
                            </button>
                            <button className="py-2.5 rounded-lg bg-white/5 border border-white/5 text-[8px] md:text-[9px] font-bold text-slate-400 uppercase tracking-widest hover:text-white hover:bg-white/10 hover:border-white/20 transition-all font-display">
                                Support
                            </button>
                        </div>
                    </div>
                )}
            </div>

        </div>

        {/* Center: Desktop Navigation */}
        <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center gap-0.5 xl:gap-1 bg-black/40 backdrop-blur-md border border-white/10 rounded-full p-1 shadow-lg">
            {isLoggedIn ? (
                MENU_ITEMS.map((item) => (
                    <button 
                        key={item.id}
                        onClick={() => handleLinkClick(item.id, '#')}
                        className={`px-3 xl:px-5 py-2 rounded-full text-[9px] xl:text-[10px] font-display font-bold uppercase tracking-widest transition-all ${
                            activePage === item.id 
                            ? 'text-black bg-prime-cyan shadow-[0_0_15px_rgba(0,240,255,0.3)]' 
                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        {item.label}
                    </button>
                ))
            ) : (
                LANDING_MENU.map((item) => (
                    <button 
                        key={item.id}
                        onClick={() => handleLinkClick(item.label, item.id)}
                        className={`px-3 xl:px-5 py-2 rounded-full text-[9px] xl:text-[10px] font-display font-bold uppercase tracking-widest transition-all ${
                            activeSection === item.id 
                            ? 'text-black bg-prime-cyan shadow-[0_0_15px_rgba(0,240,255,0.3)]' 
                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        {item.label}
                    </button>
                ))
            )}
        </div>

        {/* Right: Status & Navigation Flow */}
        <div className="flex items-center gap-3 sm:gap-6">
            {isLoggedIn ? (
                <>
                    <div className="hidden sm:flex items-center gap-3 px-4 py-1.5 rounded-full bg-prime-panel border border-white/5 shadow-inner">
                        <div className="relative flex items-center justify-center w-2 h-2">
                            <div className="absolute w-full h-full bg-emerald-500 rounded-full animate-ping opacity-75"></div>
                            <div className="relative w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                        </div>
                        <span className="text-[9px] font-mono font-bold text-emerald-500 tracking-widest flex items-center gap-2">
                            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                            SYSTEM V4.2 [E2EE]
                        </span>
                    </div>

                    <div className="h-6 w-px bg-white/10 hidden md:block"></div>

                    {/* Notifications */}
                    <div className="relative" ref={notificationRef}>
                        <button 
                            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                            className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center text-slate-400 hover:text-white transition-colors relative hover:bg-white/5 rounded-full"
                        >
                            <svg className={`transition-all duration-300 ${unreadCount > 0 ? 'animate-[pulse_2s_infinite]' : ''}`} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                            {unreadCount > 0 && <span className="absolute top-2 right-2 md:top-2.5 md:right-2.5 w-1.5 h-1.5 bg-prime-cyan rounded-full shadow-[0_0_8px_#00F0FF] animate-ping"></span>}
                            {unreadCount > 0 && <span className="absolute top-2 right-2 md:top-2.5 md:right-2.5 w-1.5 h-1.5 bg-prime-cyan rounded-full"></span>}
                        </button>
                        {isNotificationsOpen && (
                            <div className="absolute top-full right-0 mt-4 w-80 bg-black/60 border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden backdrop-blur-xl z-50 animate-[slideDown_0.2s_ease-out] ring-1 ring-white/5">
                                <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-black font-display text-white uppercase tracking-widest">Signal Feed</span>
                                        <span className="bg-white/10 px-1.5 py-0.5 rounded text-[8px] font-bold text-slate-300">{notifications.length}</span>
                                    </div>
                                    {unreadCount > 0 && (
                                        <button onClick={onMarkAllRead} className="text-[8px] font-black text-prime-cyan hover:text-white uppercase tracking-widest px-2 py-1 rounded bg-prime-cyan/5 hover:bg-prime-cyan/20 transition-all border border-prime-cyan/20">
                                            Clear All
                                        </button>
                                    )}
                                </div>
                                <div className="max-h-80 overflow-y-auto scrollbar-hide bg-transparent">
                                    {notifications.length === 0 ? (
                                        <div className="p-10 text-center flex flex-col items-center gap-3 opacity-50">
                                            <svg className="w-8 h-8 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                                            <span className="text-[9px] font-black font-display uppercase tracking-widest text-slate-500">No Active Signals</span>
                                        </div>
                                    ) : (
                                        notifications.map((n, idx) => (
                                            <div key={n.id} className={`p-4 border-b border-white/5 hover:bg-white/[0.03] transition-all relative group animate-[fadeIn_0.3s_ease-out] ${!n.read ? 'bg-gradient-to-r from-prime-cyan/5 to-transparent' : 'opacity-60'}`} style={{ animationDelay: `${idx * 0.05}s` }}>
                                                {!n.read && <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-prime-cyan shadow-[0_0_10px_#00F0FF]"></div>}
                                                <div className="flex justify-between items-start mb-1">
                                                    <span className={`text-[10px] font-bold uppercase tracking-wider ${!n.read ? 'text-white' : 'text-slate-400'}`}>{n.title}</span>
                                                    <span className="text-[8px] font-mono text-slate-600">{n.time}</span>
                                                </div>
                                                <p className="text-[9px] text-slate-400 leading-relaxed font-medium">{n.message}</p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Profile Menu */}
                    <div className="relative" ref={profileRef}>
                        <button 
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="flex items-center gap-2 sm:gap-3 pl-1 pr-1 sm:pr-3 py-1 rounded-full hover:bg-white/5 transition-all border border-transparent hover:border-white/10 group"
                        >
                            <div className="w-8 h-8 md:w-9 md:h-9 bg-gradient-to-tr from-prime-cyan to-blue-600 rounded-full flex items-center justify-center text-black font-black font-display text-[10px] md:text-xs shadow-lg transition-all group-hover:scale-105">
                                {userInitials}
                            </div>
                            <div className="hidden lg:flex flex-col items-start text-left">
                                <span className="text-[10px] font-bold text-white tracking-wide group-hover:text-prime-cyan transition-colors">{userId}</span>
                                <span className="text-[8px] font-mono text-emerald-400 uppercase tracking-widest">Encrypted</span>
                            </div>
                        </button>
                        
                        {isProfileOpen && (
                            <div className="absolute top-full right-0 mt-4 md:mt-6 w-[calc(100vw-2rem)] sm:w-96 bg-black/60 border border-white/10 rounded-2xl md:rounded-3xl shadow-[0_50px_100px_rgba(0,0,0,0.9)] overflow-hidden animate-[slideDown_0.2s_ease-out] backdrop-blur-3xl z-[60]">
                                <div className="p-5 md:p-6 border-b border-white/5 bg-gradient-to-b from-white/5 to-transparent relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-24 bg-prime-cyan/10 blur-[80px] rounded-full pointer-events-none group-hover:bg-prime-cyan/20 transition-all duration-700"></div>
                                    
                                    <div className="flex items-start gap-4 md:gap-5 relative z-10 mb-6">
                                        <div className="relative shrink-0">
                                            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-prime-cyan to-blue-600 p-[1.5px] shadow-[0_0_20px_rgba(0,240,255,0.3)]">
                                                <div className="w-full h-full rounded-xl sm:rounded-2xl bg-black flex items-center justify-center overflow-hidden relative">
                                                    <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-black"></div>
                                                    <span className="font-display font-black text-white text-lg sm:text-xl relative z-10">{userInitials}</span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex-1 min-w-0">
                                            <div className="text-white font-black font-display tracking-tight text-base sm:text-lg truncate">{userName}</div>
                                            <div className="text-[9px] sm:text-[10px] text-prime-cyan font-mono tracking-widest mb-2 truncate">OP-ID: {userId}</div>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                         <div className="px-2 py-1 rounded border text-[8px] sm:text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 bg-emerald-500/10 border-emerald-500/20 text-emerald-400">
                                            <div className="w-1 h-1 rounded-full bg-emerald-400"></div>
                                            Verified
                                        </div>
                                        <button 
                                            onClick={() => { if(onNavigate) onNavigate('Settings'); setIsProfileOpen(false); }}
                                            className="flex-1 py-1 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 rounded text-[8px] sm:text-[9px] font-bold text-slate-300 hover:text-white uppercase tracking-widest transition-all"
                                        >
                                            Edit Bot Config
                                        </button>
                                    </div>
                                </div>

                                <div className="p-2 space-y-1">
                                    <div className="px-4 py-2 mt-1 text-[8px] font-black text-slate-600 uppercase tracking-[0.2em] font-display">Protocol Controls</div>
                                    
                                    <button onClick={() => { if(onNavigate) onNavigate('Strategies'); setIsProfileOpen(false); }} className="w-full text-left px-4 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/5 transition-all flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-500">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                                        </div>
                                        <div className="text-white">AI Strategies</div>
                                    </button>
                                </div>

                                <div className="p-2 border-t border-white/5 mt-2 bg-black/20">
                                    <button onClick={() => setConfirmLogout(true)} className="w-full text-left px-4 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest text-rose-500 hover:bg-rose-500/10 transition-all flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-500 border border-rose-500/20">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
                                        </div>
                                        Disconnect
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            ) : (
                <div className="flex items-center gap-3 md:gap-6">
                    <button onClick={onOpenAccount} className="hidden sm:block text-[9px] md:text-[10px] font-bold font-display uppercase tracking-[0.2em] text-slate-400 hover:text-white transition-colors">
                        Client Login
                    </button>
                    <button 
                        onClick={onOpenAccount}
                        className="px-4 sm:px-6 py-2.5 sm:py-3 bg-white text-black hover:bg-prime-cyan hover:scale-105 transition-all text-[9px] md:text-[10px] font-black font-display uppercase tracking-[0.1em] md:tracking-[0.2em] rounded-lg"
                    >
                        Open Account
                    </button>
                </div>
            )}
        </div>
      </div>
      
      <ConfirmationModal 
        isOpen={confirmLogout}
        onClose={() => setConfirmLogout(false)}
        onConfirm={() => {
            if (onLogout) onLogout();
            setIsProfileOpen(false);
        }}
        title="Disconnect Session"
        message="Are you sure you want to disconnect from the secure terminal?"
        type="warning"
        confirmText="Disconnect"
    />
    </nav>
  );
};

export default Navbar;