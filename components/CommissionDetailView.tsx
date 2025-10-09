
import React, { useState, useEffect, useMemo } from 'react';
import { CommissionDetail, AdminData, Expedient, User, CommissionStatus } from '../types';
import ExpedientTable from './ExpedientTable';
import EmailPreviewModal from './EmailPreviewModal';

interface CommissionDetailViewProps {
  commissionDetail: CommissionDetail;
  adminData: AdminData;
  onBack: () => void;
  onSave: (detail: CommissionDetail) => void;
  isSaving: boolean;
  currentUser: User;
  theme: 'light' | 'dark';
}

const CommissionDetailView: React.FC<CommissionDetailViewProps> = ({ commissionDetail, adminData, onBack, onSave, isSaving, currentUser }) => {
  const [detail, setDetail] = useState<CommissionDetail>(JSON.parse(JSON.stringify(commissionDetail)));
  const [isEmailPreviewOpen, setIsEmailPreviewOpen] = useState(false);

  useEffect(() => {
    setDetail(JSON.parse(JSON.stringify(commissionDetail)));
  }, [commissionDetail]);

  const canEdit = useMemo(() => currentUser.role === 'admin' || currentUser.role === 'editor', [currentUser.role]);

  const handleDetailChange = (field: keyof Omit<CommissionDetail, 'expedients'>, value: string) => {
    setDetail(prev => ({ ...prev, [field]: value }));
  };

  const handleExpedientsChange = (updatedExpedients: Expedient[]) => {
    setDetail(prev => ({ 
        ...prev, 
        expedients: updatedExpedients,
        expedientsCount: updatedExpedients.length 
    }));
  };

  const hasChanges = useMemo(() => {
    return JSON.stringify(detail) !== JSON.stringify(commissionDetail);
  }, [detail, commissionDetail]);

  const handleSave = () => {
    if (hasChanges) {
      onSave(detail);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
        <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Detall de la Comissió</h1>
            <div className="flex items-center gap-2">
                <button
                    onClick={() => setIsEmailPreviewOpen(true)}
                    className="bg-purple-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-600 transition-colors disabled:bg-gray-400"
                    disabled={detail.expedients.length === 0}
                >
                    Vista prèvia Email
                </button>
                <button
                    onClick={onBack}
                    className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                    &larr; Tornar
                </button>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <label className="font-semibold text-gray-600 dark:text-gray-400 block">Nº Acta</label>
                <p className="text-gray-900 dark:text-white font-medium">{detail.numActa}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <label htmlFor="sessio" className="font-semibold text-gray-600 dark:text-gray-400 block">Data Sessió</label>
                 <input
                    id="sessio"
                    type="text"
                    value={detail.sessio}
                    onChange={(e) => handleDetailChange('sessio', e.target.value)}
                    className="w-full bg-transparent text-gray-900 dark:text-white font-medium focus:outline-none"
                    readOnly={!canEdit}
                />
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <label htmlFor="hora" className="font-semibold text-gray-600 dark:text-gray-400 block">Hora</label>
                <input
                    id="hora"
                    type="text"
                    value={detail.hora}
                    onChange={(e) => handleDetailChange('hora', e.target.value)}
                    className="w-full bg-transparent text-gray-900 dark:text-white font-medium focus:outline-none"
                    readOnly={!canEdit}
                />
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <label htmlFor="estat" className="font-semibold text-gray-600 dark:text-gray-400 block">Estat</label>
                <select 
                    id="estat"
                    value={detail.estat}
                    onChange={(e) => handleDetailChange('estat', e.target.value as CommissionStatus)}
                    className="w-full bg-transparent text-gray-900 dark:text-white font-medium focus:outline-none appearance-none"
                    disabled={!canEdit}
                >
                    <option value="Oberta">Oberta</option>
                    <option value="Finalitzada">Finalitzada</option>
                </select>
            </div>
             <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <label htmlFor="mitja" className="font-semibold text-gray-600 dark:text-gray-400 block">Mitjà</label>
                <input
                    id="mitja"
                    type="text"
                    value={detail.mitja}
                    onChange={(e) => handleDetailChange('mitja', e.target.value)}
                    className="w-full bg-transparent text-gray-900 dark:text-white font-medium focus:outline-none"
                    readOnly={!canEdit}
                />
            </div>
             <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <label className="font-semibold text-gray-600 dark:text-gray-400 block">Nº Expedients</label>
                <p className="text-gray-900 dark:text-white font-medium">{detail.expedients.length}</p>
            </div>
        </div>
      </div>
      
      <ExpedientTable
        expedients={detail.expedients}
        onExpedientsChange={handleExpedientsChange}
        adminData={adminData}
        canEdit={canEdit}
      />

      {canEdit && (
        <div className="flex justify-end mt-6">
            <button
                onClick={handleSave}
                disabled={!hasChanges || isSaving}
                className="bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
                {isSaving ? 'Desant...' : 'Desar Canvis'}
            </button>
        </div>
      )}

      <EmailPreviewModal 
        isOpen={isEmailPreviewOpen}
        onClose={() => setIsEmailPreviewOpen(false)}
        commissionDetail={detail}
      />
    </div>
  );
};

export default CommissionDetailView;
