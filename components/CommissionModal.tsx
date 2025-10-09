
import React, { useState, useEffect } from 'react';
import { CommissionSummary } from '../types';
import Modal from './Modal';

interface CommissionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: { numActa: number; dataComissio: string; }) => void;
    commission?: CommissionSummary;
    isSaving: boolean;
}

const CommissionModal: React.FC<CommissionModalProps> = ({ isOpen, onClose, onSave, commission, isSaving }) => {
    const [numActa, setNumActa] = useState('');
    const [dataComissio, setDataComissio] = useState('');
    
    useEffect(() => {
        if (isOpen) {
            if (commission) {
                setNumActa(commission.numActa.toString());
                const parts = commission.dataComissio.split('/');
                if (parts.length === 3) {
                    const [day, month, year] = parts;
                    setDataComissio(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
                } else {
                     setDataComissio('');
                }
            } else {
                setNumActa('');
                setDataComissio('');
            }
        }
    }, [commission, isOpen]);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        const parts = dataComissio.split('-');
        if (parts.length === 3) {
            const [year, month, day] = parts;
            const formattedDate = `${day}/${month}/${year}`;
            onSave({
                numActa: parseInt(numActa, 10),
                dataComissio: formattedDate
            });
        }
    };
    
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={commission ? "Editar Comissió" : "Afegir Nova Comissió"}
        >
            <form onSubmit={handleSave} className="space-y-4">
                <div>
                    <label htmlFor="numActa" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Número d'Acta
                    </label>
                    <input
                        type="number"
                        id="numActa"
                        value={numActa}
                        onChange={(e) => setNumActa(e.target.value)}
                        required
                        className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label htmlFor="dataComissio" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Data de la Comissió
                    </label>
                    <input
                        type="date"
                        id="dataComissio"
                        value={dataComissio}
                        onChange={(e) => setDataComissio(e.target.value)}
                        required
                        className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500 dark:hover:bg-gray-500">
                        Cancel·lar
                    </button>
                    <button type="submit" disabled={isSaving || !numActa || !dataComissio} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400">
                        {isSaving ? "Desant..." : "Desar"}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default CommissionModal;
