
import React, { useState } from 'react';
import { CommissionSummary, User } from '../types';
import { CheckIcon, SquareIcon, EmailIcon, DotsVerticalIcon, PencilIcon, TrashIcon } from './icons/Icons';

interface CommissionOverviewTableProps {
  commissions: CommissionSummary[];
  onSelectCommission: (commission: CommissionSummary) => void;
  onUpdateCommission: (numActa: number, dataComissio: string, field: keyof CommissionSummary, value: any) => void;
  onMarkCommissionAsSent: (numActa: number, dataComissio: string) => void;
  onEditCommission: (commission: CommissionSummary) => void;
  onDeleteCommission: (commission: CommissionSummary) => void;
  currentUser: User;
  isSaving: boolean;
}

const CommissionOverviewTable: React.FC<CommissionOverviewTableProps> = ({ commissions, onSelectCommission, onUpdateCommission, onMarkCommissionAsSent, onEditCommission, onDeleteCommission, currentUser, isSaving }) => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  
  const canEdit = currentUser.role === 'admin' || currentUser.role === 'editor';

  const handleMenuToggle = (commissionKey: string) => {
    setOpenMenu(openMenu === commissionKey ? null : commissionKey);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">Nº Acta</th>
              <th scope="col" className="px-6 py-3">Data Comissió</th>
              <th scope="col" className="px-6 py-3">Dia</th>
              <th scope="col" className="px-6 py-3 text-center">Nº Temes</th>
              <th scope="col" className="px-6 py-3">Estat</th>
              <th scope="col" className="px-6 py-3 text-center">Email enviat</th>
              <th scope="col" className="px-6 py-3">Data Enviament</th>
              {canEdit && <th scope="col" className="px-6 py-3 text-center">Accions</th>}
            </tr>
          </thead>
          <tbody>
            {commissions.map((c) => {
                const commissionKey = `${c.numActa}-${c.dataComissio}`;
                return (
                    <tr 
                        key={commissionKey} 
                        className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer"
                        onClick={() => onSelectCommission(c)}
                    >
                        <td className="px-6 py-4 font-bold text-gray-900 dark:text-white whitespace-nowrap">{c.numActa}</td>
                        <td className="px-6 py-4">{c.dataComissio}</td>
                        <td className="px-6 py-4 capitalize">{c.diaSetmana}</td>
                        <td className="px-6 py-4 text-center">{c.numTemes}</td>
                        <td className="px-6 py-4">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${c.estat === 'Oberta' ? 'bg-yellow-200 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100' : 'bg-green-200 text-green-800 dark:bg-green-700 dark:text-green-100'}`}>
                                {c.estat}
                            </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                            {canEdit ? (
                                <button
                                    onClick={(e) => { e.stopPropagation(); onUpdateCommission(c.numActa, c.dataComissio, 'avisEmail', !c.avisEmail); }}
                                    className="p-1 rounded-md disabled:opacity-50"
                                    title={c.avisEmail ? "Marcar com a no enviat" : "Marcar com a enviat"}
                                    disabled={isSaving}
                                >
                                    {c.avisEmail ? <CheckIcon /> : <SquareIcon />}
                                </button>
                            ) : (
                                <div className="flex justify-center">{c.avisEmail ? <CheckIcon /> : <SquareIcon />}</div>
                            )}
                        </td>
                        <td className="px-6 py-4">{c.dataEmail || '-'}</td>
                        {canEdit && (
                            <td className="px-6 py-4 text-center relative" onClick={e => e.stopPropagation()}>
                                <button
                                    onClick={(e) => { e.stopPropagation(); onMarkCommissionAsSent(c.numActa, c.dataComissio); }}
                                    className="p-2 rounded-full text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    title="Marcar com a enviat avui"
                                    disabled={isSaving}
                                >
                                    <EmailIcon />
                                </button>
                                <button
                                    onClick={() => handleMenuToggle(commissionKey)}
                                    className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50"
                                    disabled={isSaving}
                                >
                                    <DotsVerticalIcon />
                                </button>
                                {openMenu === commissionKey && (
                                    <div className="absolute right-8 top-full mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg z-10 border dark:border-gray-600">
                                        <button onClick={() => { onEditCommission(c); setOpenMenu(null); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center gap-2">
                                            <PencilIcon /> Editar
                                        </button>
                                        <button onClick={() => { onDeleteCommission(c); setOpenMenu(null); }} className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50 flex items-center gap-2">
                                            <TrashIcon /> Eliminar
                                        </button>
                                    </div>
                                )}
                            </td>
                        )}
                    </tr>
                )
            })}
             {commissions.length === 0 && (
                <tr>
                    <td colSpan={canEdit ? 8 : 7} className="text-center py-8 text-gray-500">No s'han trobat comissions amb els filtres seleccionats.</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CommissionOverviewTable;
