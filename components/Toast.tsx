
import React, { useEffect } from 'react';
import { ToastMessage } from '../types';

interface ToastProps {
  toast: ToastMessage | null;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    if (toast) {
      const duration = toast.onUndo ? 5000 : 3000;
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  if (!toast) {
    return null;
  }

  const handleUndo = () => {
    if (toast.onUndo) {
        toast.onUndo();
    }
    onClose();
  };

  const baseClasses = "fixed bottom-5 right-5 flex items-center p-4 text-white rounded-lg shadow-lg z-50 animate-slide-up";
  const typeClasses = toast.type === 'success'
    ? 'bg-green-500'
    : 'bg-red-500';

  return (
    <div className={`${baseClasses} ${typeClasses}`}>
      <span className="flex-grow">{toast.message}</span>
      {toast.onUndo && (
        <button onClick={handleUndo} className="ml-4 font-bold py-1 px-2 rounded-md bg-white/20 hover:bg-white/40 transition-colors">
            Desfer
        </button>
      )}
      <button onClick={onClose} className="ml-4 font-bold text-xl leading-none">&times;</button>
    </div>
  );
};

export default Toast;
