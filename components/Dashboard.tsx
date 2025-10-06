import React from 'react';
import Header from './Header';
import CommissionOverviewTable from './CommissionOverviewTable';
import StatisticsView from './StatisticsView';
import { CommissionSummary, StatisticsData } from '../types';

interface DashboardProps {
  commissions: CommissionSummary[];
  onSelectCommission: (commission: CommissionSummary) => void;
  statistics: StatisticsData;
  onUpdateCommission: (numActa: number, dataComissio: string, field: keyof CommissionSummary, value: any) => void;
  onMarkCommissionAsSent: (numActa: number, dataComissio: string) => void;
  onNavigateToAdmin: () => void;
  onGenerateCommissions: () => void;
  onShowInfoModal: (title: string, message: string) => void;
  availableYears: string[];
  selectedYear: string;
  onYearChange: (year: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  commissions, 
  onSelectCommission, 
  statistics, 
  onUpdateCommission,
  onMarkCommissionAsSent,
  onNavigateToAdmin,
  onGenerateCommissions,
  onShowInfoModal,
  availableYears,
  selectedYear,
  onYearChange
}) => {
  return (
    <div className="space-y-8">
      <Header 
        onNavigateToAdmin={onNavigateToAdmin} 
        onGenerateCommissions={onGenerateCommissions}
        onShowInfoModal={onShowInfoModal} 
      />
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
        <StatisticsView statistics={statistics} />
      </main>
    </div>
  );
};

export default Dashboard;