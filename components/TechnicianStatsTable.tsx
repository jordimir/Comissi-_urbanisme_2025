import React, { useMemo } from 'react';
import { CommissionSummary, CommissionDetail } from '../types';

interface TechnicianStatsTableProps {
  commissions: CommissionSummary[];
  commissionDetails: CommissionDetail[];
  selectedYear: string;
}

interface TechnicianStats {
  technicianName: string;
  commissionCounts: { [numActa: number]: number };
  total: number;
}

const TechnicianStatsTable: React.FC<TechnicianStatsTableProps> = ({
  commissions,
  commissionDetails,
  selectedYear,
}) => {
  const stats = useMemo(() => {
    const yearCommissions = commissions
      .filter(c => c.dataComissio.endsWith(selectedYear))
      .sort((a, b) => a.numActa - b.numActa);

    const yearCommissionNumbers = yearCommissions.map(c => c.numActa);

    const yearDetails = commissionDetails.filter(d =>
      yearCommissionNumbers.includes(d.numActa) && d.sessio.endsWith(selectedYear)
    );

    const technicianMap = new Map<string, TechnicianStats>();

    yearDetails.forEach(detail => {
      detail.expedients.forEach(exp => {
        const techName = exp.tecnic || 'No assignat';

        if (!technicianMap.has(techName)) {
          technicianMap.set(techName, {
            technicianName: techName,
            commissionCounts: {},
            total: 0,
          });
        }

        const stats = technicianMap.get(techName)!;
        stats.commissionCounts[detail.numActa] = (stats.commissionCounts[detail.numActa] || 0) + 1;
        stats.total += 1;
      });
    });

    const techStats = Array.from(technicianMap.values()).sort((a, b) => b.total - a.total);

    const columnTotals = yearCommissionNumbers.reduce((acc, numActa) => {
      acc[numActa] = 0;
      yearDetails.forEach(detail => {
        if (detail.numActa === numActa) {
          acc[numActa] += detail.expedients.length;
        }
      });
      return acc;
    }, {} as { [numActa: number]: number });

    const grandTotal = Object.values(columnTotals).reduce((sum, val) => sum + val, 0);

    return {
      technicians: techStats,
      commissionNumbers: yearCommissionNumbers,
      commissions: yearCommissions,
      columnTotals,
      grandTotal,
    };
  }, [commissions, commissionDetails, selectedYear]);

  if (stats.commissionNumbers.length === 0) {
    return (
      <div className="text-center p-8 text-gray-500">
        No hi ha dades per a l'any seleccionat
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300 text-sm">
        <thead>
          <tr className="bg-teal-500 text-white">
            <th className="border border-gray-300 px-3 py-2 text-left font-bold sticky left-0 bg-teal-500 z-10">
              EXPEDIENTS APORTATS A LA CCIU PELS TÈCNICS
            </th>
            {stats.commissionNumbers.map(numActa => {
              const commission = stats.commissions.find(c => c.numActa === numActa);
              const date = commission ? commission.dataComissio.split('/').slice(0, 2).join('/') : numActa;
              return (
                <th
                  key={numActa}
                  className="border border-gray-300 px-2 py-2 text-center font-bold min-w-[50px]"
                  title={`Acta ${numActa}`}
                >
                  {date}
                </th>
              );
            })}
            <th className="border border-gray-300 px-3 py-2 text-center font-bold bg-teal-600 sticky right-0 z-10">
              TOTAL
            </th>
          </tr>
        </thead>
        <tbody>
          {stats.technicians.map((tech, idx) => (
            <tr
              key={tech.technicianName}
              className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
            >
              <td className="border border-gray-300 px-3 py-2 font-semibold text-gray-700 sticky left-0 bg-inherit z-10">
                {tech.technicianName}
              </td>
              {stats.commissionNumbers.map(numActa => (
                <td
                  key={numActa}
                  className="border border-gray-300 px-2 py-2 text-center"
                >
                  {tech.commissionCounts[numActa] || 0}
                </td>
              ))}
              <td className="border border-gray-300 px-3 py-2 text-center font-bold bg-teal-100 sticky right-0 z-10">
                {tech.total}
              </td>
            </tr>
          ))}
          <tr className="bg-orange-400 text-white font-bold">
            <td className="border border-gray-300 px-3 py-2 sticky left-0 bg-orange-400 z-10">
              ESTADÍSTIQUES
            </td>
            {stats.commissionNumbers.map(numActa => (
              <td
                key={numActa}
                className="border border-gray-300 px-2 py-2 text-center"
              >
                {stats.columnTotals[numActa]}
              </td>
            ))}
            <td className="border border-gray-300 px-3 py-2 text-center bg-orange-500 sticky right-0 z-10">
              {stats.grandTotal}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default TechnicianStatsTable;
