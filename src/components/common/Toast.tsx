import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
      {toasts.map((toast) => {
        let icon = <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />;
        let borderClass = 'border-emerald-300 bg-white text-slate-800 shadow-lg';

        if (toast.type === 'error') {
          icon = <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />;
          borderClass = 'border-rose-300 bg-white text-slate-800 shadow-lg';
        } else if (toast.type === 'warning') {
          icon = <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />;
          borderClass = 'border-amber-300 bg-white text-slate-800 shadow-lg';
        } else if (toast.type === 'info') {
          icon = <Info className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />;
          borderClass = 'border-teal-300 bg-white text-slate-800 shadow-lg';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-2.5 p-3 rounded-xl border text-xs leading-snug animate-in slide-in-from-bottom-2 duration-150 ${borderClass}`}
          >
            {icon}
            <div className="flex-1 font-medium">{toast.message}</div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
