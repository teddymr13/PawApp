'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';

/* ─── Types ─── */
type ToastVariant = 'success' | 'error' | 'warning' | 'info';

interface ToastItem {
  id: string;
  message: string;
  variant: ToastVariant;
  duration: number;
  dismissing: boolean;
}

interface ToastContextValue {
  showToast: (message: string, variant?: ToastVariant, duration?: number) => void;
}

/* ─── Context ─── */
const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within <ToastProvider>');
  return ctx;
}

/* ─── Provider ─── */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: string) => {
    // Start exit animation
    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, dismissing: true } : t)));
    // Remove after animation
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 350);
  }, []);

  const showToast = useCallback(
    (message: string, variant: ToastVariant = 'info', duration = 4000) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      setToasts((prev) => [...prev, { id, message, variant, duration, dismissing: false }]);

      const timer = setTimeout(() => dismiss(id), duration);
      timers.current.set(id, timer);
    },
    [dismiss],
  );

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      timers.current.forEach((t) => clearTimeout(t));
    };
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast Container */}
      <div
        aria-live="polite"
        className="fixed top-6 right-6 z-[9999] flex flex-col-reverse items-end gap-3 pointer-events-none"
      >
        {toasts.map((toast) => (
          <ToastCard key={toast.id} toast={toast} onDismiss={() => dismiss(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

/* ─── Config per variant ─── */
const variantConfig: Record<
  ToastVariant,
  {
    icon: React.ReactNode;
    bg: string;
    border: string;
    iconColor: string;
    progressColor: string;
  }
> = {
  success: {
    icon: <CheckCircle2 size={20} />,
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    iconColor: 'text-emerald-500',
    progressColor: 'bg-emerald-400',
  },
  error: {
    icon: <XCircle size={20} />,
    bg: 'bg-red-50',
    border: 'border-red-200',
    iconColor: 'text-red-500',
    progressColor: 'bg-red-400',
  },
  warning: {
    icon: <AlertTriangle size={20} />,
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    iconColor: 'text-amber-500',
    progressColor: 'bg-amber-400',
  },
  info: {
    icon: <Info size={20} />,
    bg: 'bg-sky-50',
    border: 'border-sky-200',
    iconColor: 'text-sky-500',
    progressColor: 'bg-sky-400',
  },
};

/* ─── Single Toast Card ─── */
function ToastCard({ toast, onDismiss }: { toast: ToastItem; onDismiss: () => void }) {
  const cfg = variantConfig[toast.variant];

  return (
    <div
      role="alert"
      style={{
        animation: toast.dismissing
          ? 'toast-slide-out 0.35s cubic-bezier(0.4, 0, 1, 1) forwards'
          : 'toast-slide-in 0.4s cubic-bezier(0, 0, 0.2, 1) forwards',
      }}
      className={`pointer-events-auto relative flex w-[360px] max-w-[calc(100vw-2rem)] items-start gap-3 overflow-hidden rounded-2xl border ${cfg.border} ${cfg.bg} p-4 shadow-lg shadow-black/5 backdrop-blur-sm`}
    >
      {/* Icon */}
      <span className={`mt-0.5 shrink-0 ${cfg.iconColor}`}>{cfg.icon}</span>

      {/* Message */}
      <p className="flex-1 text-sm leading-relaxed text-slate-700 font-medium">{toast.message}</p>

      {/* Close button */}
      <button
        type="button"
        onClick={onDismiss}
        className="shrink-0 rounded-lg p-1 text-slate-400 transition hover:bg-white/80 hover:text-slate-600"
        aria-label="Close"
      >
        <X size={16} />
      </button>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 h-[3px] w-full overflow-hidden">
        <div
          className={`h-full ${cfg.progressColor} rounded-full opacity-60`}
          style={{
            animation: `toast-progress ${toast.duration}ms linear forwards`,
          }}
        />
      </div>
    </div>
  );
}
