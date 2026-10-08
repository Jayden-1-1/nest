import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'info', duration: number = 3200) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newToast: ToastItem = { id, type, message, duration };

    setToasts((prev) => [...prev.slice(-3), newToast]); // Keep max 4 toasts

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  const success = useCallback((message: string) => showToast(message, 'success'), [showToast]);
  const error = useCallback((message: string) => showToast(message, 'error'), [showToast]);
  const info = useCallback((message: string) => showToast(message, 'info'), [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, success, error, info }}>
      {children}

      {/* Floating Glass Toast Surface (iOS style) */}
      <aside 
        aria-label="Notifications"
        aria-live="polite"
        className="fixed top-20 sm:top-6 right-4 sm:right-6 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full"
      >
        {toasts.map((toast) => {
          return (
            <div
              key={toast.id}
              role="status"
              className="pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-surface/90 dark:bg-surface-container-highest/90 backdrop-blur-xl border border-surface-container-highest shadow-popover text-on-surface text-xs font-medium animate-in fade-in slide-in-from-top-3 duration-250 select-none"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
                {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-error shrink-0" />}
                {toast.type === 'info' && <Info className="w-4 h-4 text-primary shrink-0" />}
                <span className="truncate leading-snug">{toast.message}</span>
              </div>

              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="p-1 rounded-full text-secondary hover:text-on-surface hover:bg-surface-container transition-colors shrink-0"
                aria-label="Dismiss notification"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </aside>
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
