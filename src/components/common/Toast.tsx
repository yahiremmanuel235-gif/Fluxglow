import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  showToast: (toast: Omit<ToastMessage, 'id'>) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: ToastMessage = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);

    const duration = toast.duration ?? 3500;
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  const success = useCallback((title: string, message?: string) => {
    showToast({ type: 'success', title, message });
  }, [showToast]);

  const error = useCallback((title: string, message?: string) => {
    showToast({ type: 'error', title, message });
  }, [showToast]);

  const info = useCallback((title: string, message?: string) => {
    showToast({ type: 'info', title, message });
  }, [showToast]);

  const warning = useCallback((title: string, message?: string) => {
    showToast({ type: 'warning', title, message });
  }, [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, success, error, info, warning }}>
      {children}
      {/* Toast Container */}
      <div 
        className="fixed top-5 right-5 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-3"
        aria-live="polite"
      >
        {toasts.map((toast) => {
          const typeStyles = {
            success: {
              border: 'border-emerald-500/40',
              bg: 'bg-[#faf8f4]',
              icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />,
              badge: 'bg-emerald-100 text-emerald-800',
            },
            error: {
              border: 'border-rose-500/40',
              bg: 'bg-[#faf8f4]',
              icon: <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />,
              badge: 'bg-rose-100 text-rose-800',
            },
            warning: {
              border: 'border-amber-500/40',
              bg: 'bg-[#faf8f4]',
              icon: <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />,
              badge: 'bg-amber-100 text-amber-800',
            },
            info: {
              border: 'border-[#548c71]/40',
              bg: 'bg-[#faf8f4]',
              icon: <Info className="w-5 h-5 text-[#548c71] shrink-0 mt-0.5" />,
              badge: 'bg-[#e2eee6] text-[#253d33]',
            },
          }[toast.type];

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border shadow-lg ${typeStyles.border} ${typeStyles.bg} animate-fadeIn transition-all`}
              role="alert"
            >
              {typeStyles.icon}
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-stone-900 leading-snug">
                  {toast.title}
                </h4>
                {toast.message && (
                  <p className="text-[11px] text-stone-600 mt-0.5 leading-relaxed">
                    {toast.message}
                  </p>
                )}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="p-1 text-stone-400 hover:text-stone-700 rounded-lg transition-colors shrink-0 cursor-pointer"
                aria-label="Cerrar notificación"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
