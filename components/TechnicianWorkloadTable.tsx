
import React from 'react';
import { TechnicianWorkload } from '../types';

interface TechnicianWorkloadTableProps {
  data: TechnicianWorkload;
  selectedTechnician: string | null;
  onClearSelection: () => void;
}

const TechnicianWorkloadTable: React.FC<TechnicianWorkloadTableProps> = ({ data, selectedTechnician, onClearSelection }) => {
  const { headers, technicians, data: workloadData, rowTotals, columnTotals, grandTotal } = data;

  if (!headers || headers.length === 0) {
    return null;
  }

  const techniciansToDisplay = selectedTechnician ? [selectedTechnician] : technicians;

  return (
    <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Expedients Aportats a la CCUU pels Tècnics</h2>
        {selectedTechnician && (
            <button
                onClick={onClearSelection}
                className="bg-red-500 text-white font-bold py-1 px-3 rounded-lg hover:bg-red-600 transition-colors text-sm"
            >
                &times; Netejar selecció
            </button>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-center text-sm">
          <thead>
            <tr className="bg-teal-500 text-white">
              <th className="p-2 border border-teal-600 dark:border-teal-400 sticky left-0 bg-teal-500 dark:bg-teal-700 z-10 font-semibold">TÈCNICS</th>
              {headers.map(header => (
                <th key={header.date} className="p-2 border border-teal-600 dark:border-teal-400 text-xs font-semibold whitespace-nowrap">{header.date}</th>
              ))}
              <th className="p-2 border border-teal-600 dark:border-teal-400 whitespace-nowrap font-bold">TOTAL</th>
            </tr>
          </thead>
          <tbody>
            {techniciansToDisplay.map(tech => (
              <tr key={tech} className="even:bg-gray-50 dark:even:bg-gray-900/50">
                <td className="p-2 border border-gray-300 dark:border-gray-700 font-semibold text-left sticky left-0 bg-teal-500 dark:bg-teal-700 text-white z-10">{tech}</td>
                {headers.map(header => (
                  <td key={`${tech}-${header.date}`} className={`p-2 border border-gray-300 dark:border-gray-700 font-medium ${header.isFuture ? 'bg-gray-100 dark:bg-gray-700 text-gray-400' : 'bg-teal-50 dark:bg-teal-900/50'}`}>
                    {workloadData[tech]?.[header.date] ?? 0}
                  </td>
                ))}
                <td className="p-2 border border-gray-300 dark:border-gray-700 font-bold bg-gray-200 dark:bg-gray-600">{rowTotals[tech] ?? 0}</td>
              </tr>
            ))}
          </tbody>
          {!selectedTechnician && (
             <tfoot>
                <tr className="bg-amber-400 dark:bg-amber-600 font-bold text-gray-800 dark:text-white">
                <td className="p-2 border border-gray-300 dark:border-gray-600 text-left sticky left-0 bg-amber-400 dark:bg-amber-600 z-10">ESTADÍSTIQUES</td>
                {columnTotals.map((total, index) => (
                    <td key={`total-${index}`} className="p-2 border border-gray-300 dark:border-gray-600">{total}</td>
                ))}
                <td className="p-2 border border-gray-300 dark:border-gray-600 bg-amber-500 dark:bg-amber-700">{grandTotal}</td>
                </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
};

export default TechnicianWorkloadTable;