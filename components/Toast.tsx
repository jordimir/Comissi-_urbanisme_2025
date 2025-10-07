import React, { useEffect } from 'react';
import { ToastMessage } from '../types';

interface ToastProps {
  toast: ToastMessage | null;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // Auto-dismiss after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  if (!toast) {
    return null;
  }

  const baseClasses = "fixed bottom-5 right-5 flex items-center p-4 text-white rounded-lg shadow-lg z-50 animate-slide-up";
  const typeClasses = toast.type === 'success'
    ? 'bg-green-500'
    : 'bg-red-500';

  return (
    <div className={`${baseClasses} ${typeClasses}`}>
      <span className="flex-grow">{toast.message}</span>
      <button onClick={onClose} className="ml-4 font-bold text-xl leading-none">&times;</button>
    </div>
  );
};

export default Toast;