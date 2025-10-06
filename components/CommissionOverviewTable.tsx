

import React from 'react';
import { CommissionSummary } from '../types';
import { CheckIcon, SquareIcon, RightArrowIcon, EmailIcon } from './icons/Icons';

interface CommissionOverviewTableProps {
  commissions: CommissionSummary[];
  onSelectCommission: (commission: CommissionSummary) => void;
  onUpdateCommission: (numActa: number, dataComissio: string, field: keyof CommissionSummary, value: any) => void;
  onMarkCommissionAsSent: (numActa: number, dataComissio: string) => void;
}

const CommissionStatusPill: React.FC<{ status: 'Finalitzada' | 'Oberta' }> = ({ status }) => {
  const baseClasses = "px-3 py-1 text-sm font-semibold rounded-full";
  const statusClasses = status === 'Finalitzada'
    ? "bg-red-100 text-red-800"
    : "bg-green-100 text-green-800";
  return <span className={`${baseClasses} ${statusClasses}`}>{status}</span>;
};


const CommissionOverviewTable: React.FC<CommissionOverviewTableProps> = ({ commissions, onSelectCommission, onUpdateCommission, onMarkCommissionAsSent }) => {

  const itemsPerColumn = Math.ceil(commissions.length / 3);
  const columns = itemsPerColumn > 0 ? [
    commissions.slice(0, itemsPerColumn),
    commissions.slice(itemsPerColumn, 2 * itemsPerColumn),
    commissions.slice(2 * itemsPerColumn)
  ] : [[], [], []];


  const formatDateToYYYYMMDD = (dateStr: string | null): string => {
    if (!dateStr) return '';
    const parts = dateStr.split('/');
    if (parts.length !== 3) return ''; // handle invalid format gracefully
    const [day, month, year] = parts;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  };

  const formatDateToDDMMYYYY = (dateStr: string): string => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return ''; // handle invalid format gracefully
    const [year, month, day] = parts;
    return `${day}/${month}/${year}`;
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTableRowElement>, commission: CommissionSummary) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSelectCommission(commission);
    }
  };

  return (
    <div className="mt-6 bg-white p-6 rounded-2xl shadow-xl">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {columns.map((column, colIndex) => (
          <div key={colIndex} className="bg-white/50 p-2 rounded-md">
            <table className="w-full border-collapse" role="grid">
              <thead role="rowgroup">
                <tr className="text-left text-xs text-gray-600" role="row">
                  <th className="p-2" role="columnheader">Núm. Acta</th>
                  <th className="p-2" role="columnheader">Núm. Temes</th>
                  <th className="p-2" role="columnheader">Dia</th>
                  <th className="p-2" role="columnheader">Comissió</th>
                  <th className="p-2 text-center" role="columnheader">Avis email</th>
                  <th className="p-2" role="columnheader">Data email</th>
                  <th className="p-2 text-center" role="columnheader">Acció</th>
                  <th className="p-2" role="columnheader">Estat</th>
                </tr>
              </thead>
              <tbody role="rowgroup">
                {column.map((commission, index) => (
                  <tr
                    key={commission.numActa + commission.dataComissio}
                    onClick={() => onSelectCommission(commission)}
                    onKeyDown={(e) => handleKeyDown(e, commission)}
                    className={`border-t border-gray-200 text-sm hover:bg-gray-100 transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-300 rounded`}
                    tabIndex={0}
                    role="row"
                    aria-rowindex={index + 1}
                  >
                    <td className="p-2 font-bold" role="gridcell">{commission.numActa}</td>
                    <td className="p-2" role="gridcell">{commission.numTemes}</td>
                    <td className="p-2" role="gridcell">{commission.diaSetmana}</td>
                    <td className="p-2" role="gridcell">{commission.dataComissio}</td>
                    <td 
                        className="p-2"
                        onClick={(e) => e.stopPropagation()}
                        role="gridcell"
                    >
                        <label className="flex items-center justify-center space-x-2 p-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={commission.avisEmail}
                                onChange={(e) => {
                                    onUpdateCommission(commission.numActa, commission.dataComissio, 'avisEmail', e.target.checked);
                                }}
                                className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                        </label>
                    </td>
                    <td 
                        className="p-2"
                        onClick={(e) => e.stopPropagation()}
                        role="gridcell"
                    >
                         <input
                            type="date"
                            aria-label="Data de l'email"
                            value={formatDateToYYYYMMDD(commission.dataEmail)}
                            disabled={!commission.avisEmail}
                            onChange={(e) => {
                                onUpdateCommission(commission.numActa, commission.dataComissio, 'dataEmail', formatDateToDDMMYYYY(e.target.value));
                            }}
                            className="w-full text-sm p-1 border rounded bg-transparent disabled:bg-gray-100 disabled:cursor-not-allowed focus:outline-none focus:ring-1 focus:ring-indigo-400"
                        />
                    </td>
                     <td className="p-2 text-center" onClick={(e) => e.stopPropagation()} role="gridcell">
                        {!commission.avisEmail && (
                            <button
                                onClick={() => onMarkCommissionAsSent(commission.numActa, commission.dataComissio)}
                                title="Marcar com a enviat"
                                className="py-2 px-3 bg-teal-500 text-white text-xs font-bold rounded-lg hover:bg-teal-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-teal-400 flex items-center justify-center space-x-1"
                            >
                                <EmailIcon />
                                <span>Enviat</span>
                            </button>
                        )}
                    </td>
                    <td className="p-2" role="gridcell">
                        <CommissionStatusPill status={commission.estat} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
        <div className="text-right text-xs text-gray-400 mt-4 pr-2">
            Última actualització: 14/08/2025
        </div>
    </div>
  );
};

export default CommissionOverviewTable;