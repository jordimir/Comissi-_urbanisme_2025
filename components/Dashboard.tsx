
import React, { useState, useMemo } from 'react';
import Header from './Header';
import CommissionOverviewTable from './CommissionOverviewTable';
import StatisticsView from './StatisticsView';
import TechnicianWorkloadTable from './TechnicianWorkloadTable';
import { CommissionSummary, StatisticsData, CommissionStatus, User } from '../types';
import { RightArrowIcon } from './icons/Icons';

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
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  onAddCommission: () => void;
  onEditCommission: (commission: CommissionSummary) => void;
  onDeleteCommission: (commission: CommissionSummary) => void;
  currentUser: User;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = (props) => {
  const { 
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
    onToggleFocusMode,
    theme,
    toggleTheme,
    onAddCommission,
    onEditCommission,
    onDeleteCommission,
    currentUser,
    onLogout,
  } = props;
  
  const [isWorkloadTableVisible, setIsWorkloadTableVisible] = useState(false);
  const [isStatisticsVisible, setIsStatisticsVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<CommissionStatus | 'all'>('all');
  const [selectedTechnician, setSelectedTechnician] = useState<string | null>(null);

  const canEdit = useMemo(() => currentUser.role === 'admin' || currentUser.role === 'editor', [currentUser.role]);

  const filteredAndSearchedCommissions = useMemo(() => {
    return commissions
      .filter(c => statusFilter === 'all' || c.estat === statusFilter)
      .filter(c => 
        c.numActa.toString().includes(searchTerm) || 
        c.dataComissio.includes(searchTerm)
      );
  }, [commissions, searchTerm, statusFilter]);

  const pendingCommissions = useMemo(() => {
    return commissions
      .filter(c => c.estat === 'Oberta')
      .sort((a, b) => {
        const dateA = new Date(a.dataComissio.split('/').reverse().join('-'));
        const dateB = new Date(b.dataComissio.split('/').reverse().join('-'));
        return dateA.getTime() - dateB.getTime();
      })
      .slice(0, 4);
  }, [commissions]);

  const handleTechnicianSelect = (technicianName: string | null) => {
    setSelectedTechnician(technicianName);
    if(technicianName && !isWorkloadTableVisible) {
        setIsWorkloadTableVisible(true);
    }
  };

  return (
    <div className="space-y-8">
      {!isFocusMode && (
        <Header 
          onNavigateToAdmin={onNavigateToAdmin} 
          onGenerateCommissions={onGenerateCommissions}
          onToggleFocusMode={onToggleFocusMode}
          theme={theme}
          toggleTheme={toggleTheme}
          currentUser={currentUser}
          onLogout={onLogout}
        />
      )}
      <main>
        {pendingCommissions.length > 0 && !isFocusMode && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg mb-8 animate-fade-in">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">Properes Comissions / Accions Pendents</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {pendingCommissions.map(c => (
                <div key={`${c.numActa}-${c.dataComissio}`} 
                  className="bg-yellow-50 dark:bg-yellow-900/50 border-l-4 border-yellow-400 p-4 rounded-lg cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => onSelectCommission(c)}
                >
                  <div className="flex justify-between items-center">
                    <p className="font-bold text-yellow-800 dark:text-yellow-300">Acta {c.numActa}</p>
                    <span className="text-xs font-semibold bg-yellow-200 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100 px-2 py-1 rounded-full">{c.estat}</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 font-medium">{c.dataComissio}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{c.diaSetmana}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="my-4 flex flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
          <div className="flex-grow w-full sm:w-auto">
            <input 
              type="text"
              placeholder="Cerca per núm. d'acta o data..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-2 border rounded-md shadow-sm w-full focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="p-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="all">Tots els estats</option>
              <option value="Oberta">Oberta</option>
              <option value="Finalitzada">Finalitzada</option>
            </select>
            <select
              id="year-select"
              value={selectedYear}
              onChange={(e) => onYearChange(e.target.value)}
              className="p-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              {availableYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
             {canEdit && (
                <button
                    onClick={onAddCommission}
                    className="p-2 bg-indigo-500 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500"
                    title="Afegir nova comissió"
                >
                    + Afegir
                </button>
             )}
          </div>
        </div>

        <CommissionOverviewTable
          commissions={filteredAndSearchedCommissions}
          onSelectCommission={onSelectCommission}
          onUpdateCommission={onUpdateCommission}
          onMarkCommissionAsSent={onMarkCommissionAsSent}
          onEditCommission={onEditCommission}
          onDeleteCommission={onDeleteCommission}
          currentUser={currentUser}
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

        {isWorkloadTableVisible && <TechnicianWorkloadTable data={statistics.technicianWorkload} selectedTechnician={selectedTechnician} onClearSelection={() => handleTechnicianSelect(null)} />}

        {isStatisticsVisible && <StatisticsView statistics={statistics} onTechnicianSelect={handleTechnicianSelect} theme={theme}/>}
      </main>
    </div>
  );
};

export default Dashboard;