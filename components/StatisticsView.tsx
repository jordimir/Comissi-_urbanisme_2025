
import React from 'react';
import TechnicianDonutChart from './TechnicianDonutChart';
import WorkloadLineChart from './WorkloadLineChart';
import TechnicianStatsTable from './TechnicianStatsTable';
import { StatisticsData, CommissionSummary, CommissionDetail } from '../types';

interface StatisticsViewProps {
    statistics: StatisticsData;
    commissions: CommissionSummary[];
    commissionDetails: CommissionDetail[];
    selectedYear: string;
}

const StatisticsView: React.FC<StatisticsViewProps> = ({
    statistics,
    commissions,
    commissionDetails,
    selectedYear
}) => {
    return (
        <div className="mt-8 space-y-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Estadístiques Anuals</h2>

            <div className="bg-white p-6 rounded-xl shadow-lg">
                <TechnicianStatsTable
                    commissions={commissions}
                    commissionDetails={commissionDetails}
                    selectedYear={selectedYear}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg">
                    <h3 className="font-bold text-lg text-gray-700 mb-4">Expedients Aportats pels Tècnics Municipals</h3>
                    <TechnicianDonutChart data={statistics.technicianDistribution} />
                </div>
                <div className="lg:col-span-3 bg-white p-6 rounded-xl shadow-lg">
                    <h3 className="font-bold text-lg text-gray-700 mb-4">Càrrega d'expedients per la CCUU</h3>
                    <WorkloadLineChart data={statistics.workloadOverTime} />
                </div>
            </div>
        </div>
    );
};

export default StatisticsView;
