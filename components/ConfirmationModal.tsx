import React from 'react';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'info';
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title, 
    message, 
    confirmText = 'Confirm', 
    cancelText = 'Cancel',
    type = 'warning'
}) => {
    if (!isOpen) return null;

    const typeStyles = {
        danger: 'bg-rose-500/20 text-rose-400 border-rose-500/30 hover:bg-rose-500/30',
        warning: 'bg-amber-500/20 text-amber-400 border-amber-500/30 hover:bg-amber-500/30',
        info: 'bg-prime-cyan/20 text-prime-cyan border-prime-cyan/30 hover:bg-prime-cyan/30'
    };

    return (
        <div className="fixed inset-0 z-[300] bg-black/90 flex items-center justify-center p-6 backdrop-blur-3xl animate-[fadeIn_0.2s]">
            <div className="bg-black/60 backdrop-blur-2xl border border-white/10 p-8 rounded-[2.5rem] w-full max-w-md shadow-[0_0_100px_rgba(0,240,255,0.05)] ring-1 ring-white/5 animate-[scaleIn_0.2s]">
                <div className="text-center space-y-6">
                    <div className="mx-auto w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                        {type === 'danger' && (
                            <svg className="w-8 h-8 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        )}
                        {type === 'warning' && (
                            <svg className="w-8 h-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        )}
                        {type === 'info' && (
                            <svg className="w-8 h-8 text-prime-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        )}
                    </div>
                    
                    <div>
                        <h3 className="text-xl font-black text-white uppercase tracking-widest mb-2">{title}</h3>
                        <p className="text-slate-400 text-sm">{message}</p>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button 
                            onClick={onClose}
                            className="flex-1 py-3 bg-white/5 text-white border border-white/10 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all"
                        >
                            {cancelText}
                        </button>
                        <button 
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }}
                            className={`flex-1 py-3 border rounded-xl text-xs font-black uppercase tracking-widest transition-all ${typeStyles[type]}`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
