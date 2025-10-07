
import React from 'react';
import TechnicianDonutChart from './TechnicianDonutChart';
import WorkloadLineChart from './WorkloadLineChart';
import ReportStatusChart from './ReportStatusChart';
import { StatisticsData } from '../types';

interface StatisticsViewProps {
    statistics: StatisticsData;
    onTechnicianSelect: (technicianName: string | null) => void;
    theme: 'light' | 'dark';
}

const StatisticsView: React.FC<StatisticsViewProps> = ({ statistics, onTechnicianSelect, theme }) => {
    return (
        <div className="mt-8 animate-fade-in">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Estadístiques Anuals</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                    <h3 className="font-bold text-lg text-gray-700 dark:text-gray-200 mb-4">Expedients per Tècnic</h3>
                    <TechnicianDonutChart data={statistics.technicianDistribution} onTechnicianSelect={onTechnicianSelect} />
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                    <h3 className="font-bold text-lg text-gray-700 dark:text-gray-200 mb-4">Distribució d'Informes</h3>
                    <ReportStatusChart data={statistics.reportStatusDistribution} theme={theme} />
                </div>
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                    <h3 className="font-bold text-lg text-gray-700 dark:text-gray-200 mb-4">Càrrega d'Expedients per Comissió</h3>
                    <WorkloadLineChart data={statistics.workloadOverTime} theme={theme} />
                </div>
            </div>
        </div>
    );
};

export default StatisticsView;