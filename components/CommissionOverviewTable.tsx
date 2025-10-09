
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { CommissionSummary, CommissionStatus, User } from '../types';
import { DotsVerticalIcon, EmailIcon } from './icons/Icons';

interface CommissionOverviewTableProps {
  commissions: CommissionSummary[];
  onSelectCommission: (commission: CommissionSummary) => void;
  onUpdateCommission: (numActa: number, dataComissio: string, field: keyof CommissionSummary, value: any) => void;
  onMarkCommissionAsSent: (numActa: number, dataComissio: string) => void;
  onEditCommission: (commission: CommissionSummary) => void;
  onDeleteCommission: (commission: CommissionSummary) => void;
  currentUser: User;
}

const CommissionStatusPill: React.FC<{ status: 'Finalitzada' | 'Oberta' }> = ({ status }) => {
  const baseClasses = "px-3 py-1 text-sm font-semibold rounded-full";
  const statusClasses = status === 'Finalitzada'
    ? "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300"
    : "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300";
  return <span className={`${baseClasses} ${statusClasses}`}>{status}</span>;
};

const ActionsMenu: React.FC<{ 
    commission: CommissionSummary; 
    onUpdate: Function; 
    onMarkAsSent: Function; 
    onSelect: Function;
    onEdit: Function;
    onDelete: Function;
    currentUser: User;
}> = ({ commission, onUpdate, onMarkAsSent, onSelect, onEdit, onDelete, currentUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onUpdate(commission.numActa, commission.dataComissio, 'estat', e.target.value);
    setIsOpen(false);
  }

  return (
    <div className="relative" ref={menuRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-400">
        <DotsVerticalIcon />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-20 border dark:border-gray-700 animate-fade-in">
          <ul className="py-1 text-sm text-gray-700 dark:text-gray-200">
            <li><button onClick={() => { onSelect(commission); setIsOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">Veure Detalls</button></li>
            <li><button onClick={() => { onEdit(commission); setIsOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">Editar</button></li>
            
            <li className="border-t border-gray-200 dark:border-gray-700 my-1"></li>

            {commission.estat === 'Oberta' && (
               <li><button onClick={() => { onMarkAsSent(commission.numActa, commission.dataComissio); setIsOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">Marcar com a Enviada</button></li>
            )}
             <li>
                <label className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={commission.avisEmail}
                        onChange={(e) => onUpdate(commission.numActa, commission.dataComissio, 'avisEmail', e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 mr-2"
                    />
                    Avis per Email
                </label>
            </li>
             <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <label htmlFor={`status-select-${commission.numActa}`} className="text-xs text-gray-500">Canviar Estat</label>
                  <select id={`status-select-${commission.numActa}`} onChange={handleStatusChange} value={commission.estat} className="w-full bg-transparent focus:outline-none dark:bg-gray-800">
                    <option value="Oberta">Oberta</option>
                    <option value="Finalitzada">Finalitzada</option>
                  </select>
             </li>
            {currentUser.role === 'admin' && (
                <>
                    <li className="border-t border-gray-200 dark:border-gray-700 my-1"></li>
                    <li><button onClick={() => { onDelete(commission); setIsOpen(false); }} className="w-full text-left px-4 py-2 text-red-600 dark:text-red-400 font-semibold hover:bg-red-50 dark:hover:bg-red-900/50">Eliminar</button></li>
                </>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

const CommissionOverviewTable: React.FC<CommissionOverviewTableProps> = ({ commissions, onSelectCommission, onUpdateCommission, onMarkCommissionAsSent, onEditCommission, onDeleteCommission, currentUser }) => {

  const canEdit = useMemo(() => currentUser.role === 'admin' || currentUser.role === 'editor', [currentUser.role]);

  const groupedCommissions = useMemo(() => {
    const groups: { [key: string]: CommissionSummary[] } = {};
    commissions.forEach(c => {
      const dateParts = c.dataComissio.split('/');
      const monthYear = new Date(Number(dateParts[2]), Number(dateParts[1]) - 1).toLocaleString('ca-ES', { month: 'long', year: 'numeric' });
      if (!groups[monthYear]) {
        groups[monthYear] = [];
      }
      groups[monthYear].push(c);
    });
    return Object.entries(groups).map(([month, commissions]) => ({ month, commissions }));
  }, [commissions]);

  const itemsPerColumn = Math.ceil(groupedCommissions.length / 3);
  const columns = itemsPerColumn > 0 ? [
    groupedCommissions.slice(0, itemsPerColumn),
    groupedCommissions.slice(itemsPerColumn, 2 * itemsPerColumn),
    groupedCommissions.slice(2 * itemsPerColumn)
  ] : [[], [], []];

  const formatDateToYYYYMMDD = (dateStr: string | null): string => {
    if (!dateStr) return '';
    const parts = dateStr.split('/');
    if (parts.length !== 3) return '';
    const [day, month, year] = parts;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  };

  const formatDateToDDMMYYYY = (dateStr: string): string => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return '';
    const [year, month, day] = parts;
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="mt-6 bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-2xl shadow-xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-8">
        {columns.map((column, colIndex) => (
          <div key={colIndex} className="space-y-6">
            {column.map(({ month, commissions: monthCommissions }) => (
              <div key={month}>
                <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 mb-2 capitalize">{month}</h3>
                <div className="space-y-2">
                  {monthCommissions.map((commission) => (
                    <div
                      key={commission.numActa + commission.dataComissio}
                      className={`p-3 rounded-lg flex items-center justify-between transition-all duration-200 ${commission.estat === 'Oberta' ? 'bg-green-50 dark:bg-green-900/30' : 'bg-gray-50 dark:bg-gray-900/50'} hover:shadow-md hover:bg-gray-100 dark:hover:bg-gray-700`}
                    >
                      <div className="flex-1 cursor-pointer" onClick={() => onSelectCommission(commission)}>
                        <div className="flex items-center gap-4">
                            <span className="font-bold text-gray-800 dark:text-gray-200 w-8 text-center">{commission.numActa}</span>
                            <div>
                               <p className="font-semibold text-gray-700 dark:text-gray-300">{commission.dataComissio} <span className="text-xs text-gray-500 dark:text-gray-400">({commission.diaSetmana})</span></p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{commission.numTemes} temes</p>
                            </div>
                        </div>
                      </div>
                       <div className="flex-shrink-0 flex items-center gap-2">
                            <CommissionStatusPill status={commission.estat} />
                            {canEdit && (
                                <div className="w-28" onClick={(e) => e.stopPropagation()}>
                                    <input
                                        type="date"
                                        aria-label="Data de l'email"
                                        value={formatDateToYYYYMMDD(commission.dataEmail)}
                                        disabled={!commission.avisEmail}
                                        onChange={(e) => onUpdateCommission(commission.numActa, commission.dataComissio, 'dataEmail', formatDateToDDMMYYYY(e.target.value))}
                                        className="w-full text-sm p-1 border rounded bg-transparent dark:bg-gray-700 dark:border-gray-600 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed focus:outline-none focus:ring-1 focus:ring-indigo-400"
                                    />
                                </div>
                            )}
                            {canEdit && (
                                <div onClick={(e) => e.stopPropagation()}>
                                    <ActionsMenu 
                                        commission={commission}
                                        onUpdate={onUpdateCommission}
                                        onMarkAsSent={onMarkCommissionAsSent}
                                        onSelect={onSelectCommission}
                                        onEdit={onEditCommission}
                                        onDelete={onDeleteCommission}
                                        currentUser={currentUser}
                                    />
                                </div>
                            )}
                       </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommissionOverviewTable;