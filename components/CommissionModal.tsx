
import React, { useState, useEffect } from 'react';
import { CommissionSummary } from '../types';

interface CommissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (commissionData: { numActa: number, dataComissio: string }, originalData?: { numActa: number, dataComissio: string }) => void;
  commission?: CommissionSummary | null;
  selectedYear: string;
}

const CommissionModal: React.FC<CommissionModalProps> = ({ isOpen, onClose, onSave, commission, selectedYear }) => {
  const [numActa, setNumActa] = useState('');
  const [dataComissio, setDataComissio] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    if (commission) {
      setNumActa(commission.numActa.toString());
      const [day, month, year] = commission.dataComissio.split('/');
      setDataComissio(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
    } else {
      // For new commissions, default date to the selected year
      const today = new Date();
      const year = selectedYear || today.getFullYear().toString();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      setDataComissio(`${year}-${month}-${day}`);
      setNumActa('');
    }
    setError('');
  }, [commission, isOpen, selectedYear]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!numActa || !dataComissio) {
      setError('Tots els camps són obligatoris.');
      return;
    }
    
    const numericActa = parseInt(numActa, 10);
    if (isNaN(numericActa) || numericActa <= 0) {
      setError("El número d'acta ha de ser un número positiu.");
      return;
    }
    
    const [year, month, day] = dataComissio.split('-');
    const formattedDate = `${day}/${month}/${year}`;

    onSave(
      { numActa: numericActa, dataComissio: formattedDate },
      commission ? { numActa: commission.numActa, dataComissio: commission.dataComissio } : undefined
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 animate-fade-in" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl max-w-md w-full m-4 animate-slide-up" onClick={e => e.stopPropagation()}>
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          {commission ? 'Editar Comissió' : 'Afegir Nova Comissió'}
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="numActa" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Número d'Acta</label>
              <input
                type="number"
                id="numActa"
                value={numActa}
                onChange={(e) => setNumActa(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700"
                required
              />
            </div>
            <div>
              <label htmlFor="dataComissio" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Data de la Comissió</label>
              <input
                type="date"
                id="dataComissio"
                value={dataComissio}
                onChange={(e) => setDataComissio(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700"
                required
              />
            </div>
          </div>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          <div className="flex justify-end space-x-3 mt-6">
            <button type="button" onClick={onClose} className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
              Cancel·lar
            </button>
            <button type="submit" className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition-colors">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CommissionModal;
