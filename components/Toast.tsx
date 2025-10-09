
import React, { useEffect } from 'react';
import { ToastMessage } from '../types';
import { CheckIcon, XIcon, WarningIcon } from './icons/Icons';

interface ToastProps {
  toasts: ToastMessage[];
  onRemove: (id: number) => void;
}

const Toast: React.FC<ToastProps> = ({ toasts, onRemove }) => {
  return (
    <div className="fixed bottom-4 right-4 z-[100] w-full max-w-xs space-y-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
};

interface ToastItemProps {
  toast: ToastMessage;
  onRemove: (id: number) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onRemove }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onRemove(toast.id);
        }, 5000);

        return () => {
            clearTimeout(timer);
        };
    }, [toast.id, onRemove]);

    const isSuccess = toast.type === 'success';

    return (
        <div className={`flex items-center justify-between p-3 rounded-lg shadow-lg text-white animate-slide-up-toast ${isSuccess ? 'bg-green-500' : 'bg-red-500'}`}>
            <div className="flex items-center">
                <div className="flex-shrink-0">
                    {isSuccess ? <CheckIcon /> : <WarningIcon />}
                </div>
                <div className="ml-3">
                    <p className="text-sm font-medium">{toast.message}</p>
                    {toast.onUndo && (
                        <button onClick={() => { toast.onUndo?.(); onRemove(toast.id); }} className="mt-1 text-sm font-bold hover:underline">
                            Desfer
                        </button>
                    )}
                </div>
            </div>
            <button onClick={() => onRemove(toast.id)} className="ml-4 p-1 rounded-full hover:bg-black/20">
                <XIcon />
            </button>
        </div>
    );
};

export default Toast;
