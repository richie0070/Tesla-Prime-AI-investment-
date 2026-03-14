import React, { useEffect, useState } from 'react';

export interface Toast {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error' | 'system';
  timestamp: number;
}

interface NotificationSystemProps {
  toasts: Toast[];
  removeToast: (id: string) => void;
}

const icons = {
  success: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>,
  info: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>,
  warning: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  error: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  system: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
};

const colors = {
  success: 'border-emerald-500 bg-emerald-500/10 text-emerald-400',
  info: 'border-blue-500 bg-blue-500/10 text-blue-400',
  warning: 'border-amber-500 bg-amber-500/10 text-amber-400',
  error: 'border-rose-500 bg-rose-500/10 text-rose-400',
  system: 'border-prime-cyan bg-prime-cyan/10 text-prime-cyan'
};

const ToastItem: React.FC<{ toast: Toast; onRemove: (id: string) => void }> = ({ toast, onRemove }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onRemove(toast.id), 300); // Wait for exit animation
    }, 5000);

    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  return (
    <div className={`relative w-80 md:w-96 overflow-hidden backdrop-blur-2xl border-l-2 shadow-[0_20px_50px_rgba(0,0,0,0.8)] rounded-lg mb-3 transition-all duration-300 transform ${
      isExiting ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100 animate-[slideLeft_0.3s_ease-out]'
    } ${colors[toast.type]} bg-black/60 border-white/10 ring-1 ring-white/5`}>
      
      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 h-0.5 w-full bg-white/10">
        <div className={`h-full ${toast.type === 'system' ? 'bg-prime-cyan' : toast.type === 'success' ? 'bg-emerald-500' : toast.type === 'warning' ? 'bg-amber-500' : toast.type === 'error' ? 'bg-rose-500' : 'bg-blue-500'} animate-[progress_5s_linear]`}></div>
      </div>

      <div className="p-4 flex gap-4">
        <div className={`mt-1 p-2 rounded-full bg-white/5 border border-white/5 ${colors[toast.type].split(' ')[2]}`}>
          {icons[toast.type]}
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-white font-display mb-1">{toast.title}</h4>
            <button onClick={() => { setIsExiting(true); setTimeout(() => onRemove(toast.id), 300); }} className="text-slate-500 hover:text-white transition-colors">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
          <p className="text-xs text-slate-400 font-medium leading-relaxed">{toast.message}</p>
          <div className="mt-2 text-[9px] text-slate-600 font-mono text-right">{new Date(toast.timestamp).toLocaleTimeString()}</div>
        </div>
      </div>
    </div>
  );
};

const NotificationSystem: React.FC<NotificationSystemProps> = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-24 right-4 md:right-8 z-[100] flex flex-col items-end pointer-events-none">
      <div className="pointer-events-auto">
        {toasts.map(toast => (
          <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>
    </div>
  );
};

export default NotificationSystem;