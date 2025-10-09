import React, { useState, useEffect } from 'react';
import { CommissionSummary } from '../types';

interface CommissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { numActa: number, dataComissio: string }) => void;
  commissionToEdit: CommissionSummary | null;
  existingCommissions: CommissionSummary[];
  isSaving: boolean;
}

const CommissionModal: React.FC<CommissionModalProps> = ({ isOpen, onClose, onSave, commissionToEdit, existingCommissions, isSaving }) => {
  const [numActa, setNumActa] = useState('');
  const [dataComissio, setDataComissio] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (commissionToEdit) {
      setNumActa(commissionToEdit.numActa.toString());
      const [day, month, year] = commissionToEdit.dataComissio.split('/');
      setDataComissio(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
      setError('');
    } else {
      setNumActa('');
      setDataComissio('');
      setError('');
    }
  }, [commissionToEdit, isOpen]);

  const validate = () => {
    const actaNumber = parseInt(numActa, 10);
    if (!actaNumber || actaNumber <= 0) {
      setError("El número d'acta ha de ser un número positiu.");
      return false;
    }
    if (!dataComissio) {
      setError("La data és obligatòria.");
      return false;
    }
    const year = new Date(dataComissio).getFullYear().toString();
    
    // Check for duplicates
    const isDuplicate = existingCommissions.some(c => {
        const isSameActa = c.numActa === actaNumber;
        const isSameYear = c.dataComissio.endsWith(`/${year}`);
        
        // If editing, allow the same acta number for the original commission
        if (commissionToEdit && c.numActa === commissionToEdit.numActa && c.dataComissio === commissionToEdit.dataComissio) {
            return false;
        }

        return isSameActa && isSameYear;
    });

    if (isDuplicate) {
        setError(`El número d'acta ${actaNumber} ja existeix per a l'any ${year}.`);
        return false;
    }
    
    setError('');
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      const [year, month, day] = dataComissio.split('-');
      onSave({ 
        numActa: parseInt(numActa, 10), 
        dataComissio: `${day}/${month}/${year}` 
      });
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 animate-fade-in"
        onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl max-w-md w-full m-4 transform transition-all animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          {commissionToEdit ? 'Editar Comissió' : 'Afegir Nova Comissió'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="numActa" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Número d'Acta</label>
                <input
                    type="number"
                    id="numActa"
                    value={numActa}
                    onChange={(e) => setNumActa(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                    disabled={isSaving}
                />
            </div>
             <div>
                <label htmlFor="dataComissio" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Data de la Comissió</label>
                <input
                    type="date"
                    id="dataComissio"
                    value={dataComissio}
                    onChange={(e) => setDataComissio(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                    disabled={isSaving}
                />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <div className="flex justify-end space-x-3 pt-2">
                <button
                    type="button"
                    onClick={onClose}
                    className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                    disabled={isSaving}
                >
                    Cancel·lar
                </button>
                <button
                    type="submit"
                    className="bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-600 transition-colors disabled:bg-gray-400"
                    disabled={isSaving}
                >
                    {isSaving ? 'Guardant...' : 'Desar'}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default CommissionModal;