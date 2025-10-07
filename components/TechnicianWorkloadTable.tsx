
import React from 'react';
import { TechnicianWorkload } from '../types';

interface TechnicianWorkloadTableProps {
  data: TechnicianWorkload;
}

const TechnicianWorkloadTable: React.FC<TechnicianWorkloadTableProps> = ({ data }) => {
  const { headers, technicians, data: workloadData, rowTotals, columnTotals, grandTotal } = data;

  if (!headers || headers.length === 0) {
    return null; // Don't render if there's no data for the year
  }

  return (
    <div className="mt-8 bg-white p-6 rounded-2xl shadow-xl">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Expedients Aportats a la CCUU pels Tècnics</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-center text-sm">
          <thead>
            <tr className="bg-teal-500 text-white">
              <th className="p-2 border border-teal-600 sticky left-0 bg-teal-500 z-10 font-semibold">TÈCNICS</th>
              {headers.map(header => (
                <th key={header.date} className="p-2 border border-teal-600 text-xs font-semibold whitespace-nowrap">{header.date}</th>
              ))}
              <th className="p-2 border border-teal-600 whitespace-nowrap font-bold">TOTAL</th>
            </tr>
          </thead>
          <tbody>
            {technicians.map(tech => (
              <tr key={tech} className="even:bg-gray-50">
                <td className="p-2 border border-gray-300 font-semibold text-left sticky left-0 bg-teal-500 text-white z-10">{tech}</td>
                {headers.map(header => (
                  <td key={`${tech}-${header.date}`} className={`p-2 border border-gray-300 font-medium ${header.isFuture ? 'bg-gray-100 text-gray-400' : 'bg-teal-50'}`}>
                    {workloadData[tech]?.[header.date] ?? 0}
                  </td>
                ))}
                <td className="p-2 border border-gray-300 font-bold bg-gray-200">{rowTotals[tech] ?? 0}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-amber-400 font-bold text-gray-800">
              <td className="p-2 border border-gray-300 text-left sticky left-0 bg-amber-400 z-10">ESTADÍSTIQUES</td>
              {columnTotals.map((total, index) => (
                <td key={`total-${index}`} className="p-2 border border-gray-300">{total}</td>
              ))}
              <td className="p-2 border border-gray-300 bg-amber-500">{grandTotal}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default TechnicianWorkloadTable;
