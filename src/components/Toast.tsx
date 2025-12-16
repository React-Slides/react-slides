import React from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

const toastStyles = {
  success: {
    bg: 'bg-green-50 border-green-500',
    text: 'text-green-800',
    icon: CheckCircle,
    iconColor: 'text-green-500'
  },
  error: {
    bg: 'bg-red-50 border-red-500',
    text: 'text-red-800',
    icon: AlertCircle,
    iconColor: 'text-red-500'
  },
  warning: {
    bg: 'bg-yellow-50 border-yellow-500',
    text: 'text-yellow-800',
    icon: AlertTriangle,
    iconColor: 'text-yellow-500'
  },
  info: {
    bg: 'bg-blue-50 border-blue-500',
    text: 'text-blue-800',
    icon: Info,
    iconColor: 'text-blue-500'
  }
};

const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {toasts.map(toast => {
        const style = toastStyles[toast.type];
        const IconComponent = style.icon;

        return (
          <div
            key={toast.id}
            className={`${style.bg} ${style.text} border-l-4 p-4 rounded-md shadow-lg flex items-start gap-3 animate-slide-in`}
            role="alert"
          >
            <IconComponent className={`${style.iconColor} w-5 h-5 flex-shrink-0 mt-0.5`} />
            <p className="flex-1 text-sm font-medium">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ToastContainer;
