import React from 'react';

interface ModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onClose: () => void;
  onConfirm?: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, title, message, onClose, onConfirm }) => {
  if (!isOpen) {
    return null;
  }

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 animate-fade-in"
        onClick={onClose}
    >
      <div 
        className="bg-white p-6 rounded-xl shadow-2xl max-w-md w-full m-4 transform transition-all animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        <h3 className="text-xl font-bold text-gray-800 mb-4">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
          >
            {onConfirm ? 'Cancel·lar' : 'Tancar'}
          </button>
          {onConfirm && (
            <button
              onClick={handleConfirm}
              className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
            >
              Confirmar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;