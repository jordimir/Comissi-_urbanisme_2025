

import React, { useState } from 'react';
import Header from './Header';
import CommissionOverviewTable from './CommissionOverviewTable';
import StatisticsView from './StatisticsView';
import TechnicianWorkloadTable from './TechnicianWorkloadTable';
import { CommissionSummary, StatisticsData } from '../types';

interface DashboardProps {
  commissions: CommissionSummary[];
  onSelectCommission: (commission: CommissionSummary) => void;
  statistics: StatisticsData;
  onUpdateCommission: (numActa: number, dataComissio: string, field: keyof CommissionSummary, value: any) => void;
  onMarkCommissionAsSent: (numActa: number, dataComissio: string) => void;
  onNavigateToAdmin: () => void;
  onGenerateCommissions: () => void;
  availableYears: string[];
  selectedYear: string;
  onYearChange: (year: string) => void;
  isFocusMode: boolean;
  onToggleFocusMode: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  commissions, 
  onSelectCommission, 
  statistics, 
  onUpdateCommission,
  onMarkCommissionAsSent,
  onNavigateToAdmin,
  onGenerateCommissions,
  availableYears,
  selectedYear,
  onYearChange,
  isFocusMode,
  onToggleFocusMode
}) => {
  const [isWorkloadTableVisible, setIsWorkloadTableVisible] = useState(false);
  const [isStatisticsVisible, setIsStatisticsVisible] = useState(false);

  return (
    <div className="space-y-8">
      {!isFocusMode && (
        <Header 
          onNavigateToAdmin={onNavigateToAdmin} 
          onGenerateCommissions={onGenerateCommissions}
          onToggleFocusMode={onToggleFocusMode}
        />
      )}
      <main>
        <div className="my-4 flex justify-end items-center space-x-2">
            <label htmlFor="year-select" className="font-semibold text-gray-700">Seleccionar Any:</label>
            <select
              id="year-select"
              value={selectedYear}
              onChange={(e) => onYearChange(e.target.value)}
              className="p-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              {availableYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
        </div>

        <CommissionOverviewTable
          commissions={commissions}
          onSelectCommission={onSelectCommission}
          onUpdateCommission={onUpdateCommission}
          onMarkCommissionAsSent={onMarkCommissionAsSent}
        />

        <div className="my-6 flex justify-center gap-4 no-print">
          <button
            onClick={() => setIsWorkloadTableVisible(prev => !prev)}
            className="bg-indigo-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-indigo-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500"
          >
            {isWorkloadTableVisible ? "Amagar Taula d'Expedients" : "Veure Taula d'Expedients"}
          </button>
           <button
            onClick={() => setIsStatisticsVisible(prev => !prev)}
            className="bg-teal-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-teal-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-teal-500"
          >
            {isStatisticsVisible ? "Amagar Estadístiques Anuals" : "Veure Estadístiques Anuals"}
          </button>
        </div>

        {isWorkloadTableVisible && <TechnicianWorkloadTable data={statistics.technicianWorkload} />}

        {isStatisticsVisible && <StatisticsView statistics={statistics} />}
      </main>
    </div>
  );
};

export default Dashboard;