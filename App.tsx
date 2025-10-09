
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import * as api from './api';
import { ApplicationData, CommissionDetail, CommissionSummary, User, ToastMessage, DeletedCommissionPayload, TechnicianWorkload } from './types';
import Dashboard from './components/Dashboard';
import CommissionDetailView from './components/CommissionDetailView';
import AdminView from './components/AdminView';
import Login from './components/Login';
import Toast from './components/Toast';
import CommissionModal from './components/CommissionModal';
import { logger } from './logger';

const App: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loginError, setLoginError] = useState('');
    const [applicationData, setApplicationData] = useState<ApplicationData | null>(null);
    const [view, setView] = useState<'dashboard' | 'detail' | 'admin'>('dashboard');
    const [selectedCommissionDetail, setSelectedCommissionDetail] = useState<CommissionDetail | null>(null);
    const [toasts, setToasts] = useState<ToastMessage[]>([]);
    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    });
    const [isFocusMode, setIsFocusMode] = useState(false);
    const [isCommissionModalOpen, setIsCommissionModalOpen] = useState(false);
    const [commissionToEdit, setCommissionToEdit] = useState<CommissionSummary | undefined>(undefined);

    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };

    const addToast = (message: string, type: 'success' | 'error', onUndo?: () => void) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type, onUndo }]);
    };

    const removeToast = (id: number) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [user, data] = await Promise.all([
                api.getCurrentUser(),
                api.getApplicationData(),
            ]);
            setCurrentUser(user);
            setApplicationData(data);
        } catch (error) {
            logger.error("Failed to fetch initial data", { error });
            addToast('Error al carregar les dades.', 'error');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleLogin = async (email: string, password: string) => {
        try {
            setLoginError('');
            const user = await api.login(email, password);
            setCurrentUser(user);
            addToast(`Benvingut/da, ${user.name}!`, 'success');
        } catch (error) {
            logger.error("Login failed", { error });
            setLoginError((error as Error).message);
        }
    };
    
    const handleLogout = async () => {
        await api.logout();
        setCurrentUser(null);
        setView('dashboard');
        addToast("Sessió tancada correctament.", 'success');
    };
    
    const handleSelectCommission = useCallback(async (commission: CommissionSummary) => {
        setIsLoading(true);
        try {
            const detail = await api.getCommissionDetail(commission.numActa, commission.dataComissio);
            if (detail) {
                setSelectedCommissionDetail(detail);
                setView('detail');
            } else {
                addToast("No s'han trobat els detalls de la comissió.", 'error');
            }
        } catch (error) {
            logger.error("Failed to get commission detail", { error });
            addToast("Error en carregar els detalls de la comissió.", 'error');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleSaveCommission = async (detail: CommissionDetail) => {
        setIsSaving(true);
        try {
            const savedDetail = await api.saveCommissionDetails(detail);
            setSelectedCommissionDetail(savedDetail);
            await fetchData();
            addToast("Comissió desada correctament.", 'success');
            setView('dashboard');
        } catch (error) {
            logger.error("Failed to save commission", { error });
            addToast("Error en desar la comissió.", 'error');
        } finally {
            setIsSaving(false);
        }
    };
    
    const handleUpdateCommissionSummary = async (numActa: number, dataComissio: string, field: keyof CommissionSummary, value: any) => {
        if (!applicationData) return;
        setIsSaving(true);
        try {
            const updatedSummary = await api.updateCommissionSummary(numActa, dataComissio, field, value);
            setApplicationData(prev => prev ? {
                ...prev,
                commissions: prev.commissions.map(c => (c.numActa === numActa && c.dataComissio === dataComissio) ? updatedSummary : c)
            } : null);
        } catch (error) {
            logger.error("Failed to update commission summary", { error });
            addToast("Error en actualitzar la comissió.", 'error');
            await fetchData();
        } finally {
            setIsSaving(false);
        }
    };

    const handleMarkCommissionAsSent = async (numActa: number, dataComissio: string) => {
         if (!applicationData) return;
        setIsSaving(true);
        try {
            const updatedSummary = await api.markCommissionAsSent(numActa, dataComissio);
            setApplicationData(prev => prev ? {
                ...prev,
                commissions: prev.commissions.map(c => (c.numActa === numActa && c.dataComissio === dataComissio) ? updatedSummary : c)
            } : null);
            addToast("Comissió marcada com a enviada.", 'success');
        } catch (error) {
            logger.error("Failed to mark commission as sent", { error });
            addToast("Error en marcar la comissió com a enviada.", 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleGenerateCommissions = async () => {
        setIsSaving(true);
        try {
            const newCommissions = await api.generateNextYearCommissions();
            await fetchData();
            addToast(`${newCommissions.length} noves comissions generades.`, 'success');
        } catch (error) {
            logger.error("Failed to generate commissions", { error });
            addToast((error as Error).message, 'error');
        } finally {
            setIsSaving(false);
        }
    };
    
    const availableYears = useMemo(() => {
        if (!applicationData) return [];
        const years = new Set(applicationData.commissions.map(c => c.dataComissio.split('/')[2]));
        return Array.from(years).sort((a, b) => parseInt(b) - parseInt(a));
    }, [applicationData]);

    const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
    
    useEffect(() => {
        if (availableYears.length > 0 && !availableYears.includes(selectedYear)) {
            setSelectedYear(availableYears[0]);
        }
    }, [availableYears, selectedYear]);
    
    const filteredCommissions = useMemo(() => {
        if (!applicationData) return [];
        return applicationData.commissions.filter(c => c.dataComissio.endsWith(`/${selectedYear}`));
    }, [applicationData, selectedYear]);

    const statisticsData = useMemo(() => {
      if (!applicationData) {
          return {
              technicianDistribution: [],
              workloadOverTime: [],
              reportStatusDistribution: [],
              technicianWorkload: { headers: [], technicians: [], data: {}, rowTotals: {}, columnTotals: [], grandTotal: 0 },
              procedureTypeDistribution: [],
              monthlyWorkload: [],
          };
      }

      const commissionsForYearDetails = applicationData.commissionDetails.filter(d => d.sessio.endsWith(`/${selectedYear}`));
      const allExpedients = commissionsForYearDetails.flatMap(d => d.expedients);

      const techCounts: { [key: string]: number } = {};
      allExpedients.forEach(e => {
          techCounts[e.tecnic] = (techCounts[e.tecnic] || 0) + 1;
      });
      const technicianDistribution = Object.entries(techCounts).map(([name, value], i) => ({
          name, value, fill: ['#4ade80', '#facc15', '#60a5fa', '#f87171', '#c084fc', '#fb923c', '#2dd4bf'][i % 7]
      })).sort((a,b) => b.value - a.value);

      const workloadOverTime = applicationData.commissions
          .filter(c => c.dataComissio.endsWith(`/${selectedYear}`))
          .sort((a,b) => new Date(a.dataComissio.split('/').reverse().join('-')).getTime() - new Date(b.dataComissio.split('/').reverse().join('-')).getTime())
          .map(c => ({
              date: `${c.numActa}/${c.dataComissio.split('/')[1]}`,
              'Càrrega': c.numTemes
          }));

      const statusCounts: { [key: string]: number } = {};
      allExpedients.forEach(e => {
        statusCounts[e.sentitInforme] = (statusCounts[e.sentitInforme] || 0) + 1;
      });
      const reportStatusDistribution = Object.entries(statusCounts).map(([name, value], i) => ({
          name, value, fill: ['#4ade80', '#f87171', '#facc15', '#c084fc', '#9ca3af', '#fb923c', '#6b7280'][i % 7]
      })).sort((a,b) => b.value - a.value);
      
      const calculateTechnicianWorkload = (data: ApplicationData, year: string): TechnicianWorkload => {
        const commissionSummariesForYear = data.commissions.filter(c => c.dataComissio.endsWith(`/${year}`));
        const commissionDetailsForYear = data.commissionDetails.filter(d => d.sessio.endsWith(`/${year}`));
        const today = new Date();
        today.setHours(0,0,0,0);
        const headers = commissionSummariesForYear
            .sort((a,b) => new Date(a.dataComissio.split('/').reverse().join('-')).getTime() - new Date(b.dataComissio.split('/').reverse().join('-')).getTime())
            .map(c => {
                const commissionDate = new Date(c.dataComissio.split('/').reverse().join('-'));
                commissionDate.setHours(0,0,0,0);
                return { date: c.dataComissio, isFuture: commissionDate > today };
            });
        const technicians = Array.from(new Set(commissionDetailsForYear.flatMap(d => d.expedients.map(e => e.tecnic)))).sort();
        const workloadData: { [technician: string]: { [date: string]: number } } = {};
        technicians.forEach(tech => workloadData[tech] = {});
        commissionDetailsForYear.forEach(detail => {
            const techCountsForCommission: {[tech: string]: number} = {};
            detail.expedients.forEach(exp => {
                techCountsForCommission[exp.tecnic] = (techCountsForCommission[exp.tecnic] || 0) + 1;
            });
            Object.entries(techCountsForCommission).forEach(([tech, count]) => {
                if(workloadData[tech]) { workloadData[tech][detail.sessio] = count; }
            });
        });
        const rowTotals: { [technician: string]: number } = {};
        technicians.forEach(tech => {
            rowTotals[tech] = Object.values(workloadData[tech]).reduce((sum, count) => sum + count, 0);
        });
        const columnTotals: number[] = headers.map(header => technicians.reduce((sum, tech) => sum + (workloadData[tech]?.[header.date] ?? 0), 0));
        const grandTotal = columnTotals.reduce((sum, total) => sum + total, 0);
        return { headers, technicians, data: workloadData, rowTotals, columnTotals, grandTotal };
      }
      const technicianWorkload = calculateTechnicianWorkload(applicationData, selectedYear);

      return { technicianDistribution, workloadOverTime, reportStatusDistribution, technicianWorkload, procedureTypeDistribution: [], monthlyWorkload: [] };
    }, [applicationData, selectedYear]);

    const handleSaveCommissionFromModal = async (data: { numActa: number, dataComissio: string }) => {
        setIsSaving(true);
        try {
            if (commissionToEdit) {
                await api.updateCommission(commissionToEdit.numActa, commissionToEdit.dataComissio, data);
                addToast("Comissió actualitzada.", "success");
            } else {
                await api.addCommission(data);
                addToast("Comissió afegida.", "success");
            }
            await fetchData();
            setIsCommissionModalOpen(false);
        } catch (error) {
            logger.error("Failed to save commission from modal", { error });
            addToast((error as Error).message, "error");
        } finally {
            setIsSaving(false);
        }
    };
    
    const handleDeleteCommission = async (commission: CommissionSummary) => {
        if (!window.confirm(`Segur que vols eliminar la comissió ${commission.numActa} (${commission.dataComissio})? Aquesta acció eliminarà també els seus expedients.`)) return;
        setIsSaving(true);
        try {
            const deletedPayload = await api.deleteCommission(commission.numActa, commission.dataComissio);
            await fetchData();
            const handleUndo = async () => {
                setIsSaving(true);
                try {
                    await api.restoreCommission(deletedPayload);
                    await fetchData();
                    addToast("Comissió restaurada.", "success");
                } catch(error) {
                     addToast("Error restaurant la comissió.", "error");
                } finally {
                    setIsSaving(false);
                }
            };
            addToast("Comissió eliminada.", "success", handleUndo);
        } catch (error) {
            logger.error("Failed to delete commission", { error });
            addToast((error as Error).message, "error");
        } finally {
            setIsSaving(false);
        }
    };
    
    const handleOpenAddCommissionModal = () => {
        setCommissionToEdit(undefined);
        setIsCommissionModalOpen(true);
    };

    const handleOpenEditCommissionModal = (commission: CommissionSummary) => {
        setCommissionToEdit(commission);
        setIsCommissionModalOpen(true);
    };

    if (isLoading || !applicationData) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900"><div className="text-xl font-bold">Carregant dades de la Comissió d'Urbanisme...</div></div>;
    }

    if (!currentUser) {
        return <Login onLogin={handleLogin} error={loginError} />;
    }

    const renderContent = () => {
        switch (view) {
            case 'detail':
                return selectedCommissionDetail ? (
                    <CommissionDetailView
                        commissionDetail={selectedCommissionDetail}
                        adminData={applicationData.adminData}
                        onBack={() => setView('dashboard')}
                        onSave={handleSaveCommission}
                        isSaving={isSaving}
                        currentUser={currentUser}
                        theme={theme}
                    />
                ) : null;
            case 'admin':
                return (
                    <AdminView
                        adminData={applicationData.adminData}
                        onBack={() => setView('dashboard')}
                        isSaving={isSaving}
                        addToast={addToast}
                        onDataUpdate={fetchData}
                    />
                );
            case 'dashboard':
            default:
                return (
                    <Dashboard
                        commissions={filteredCommissions}
                        onSelectCommission={handleSelectCommission}
                        statistics={statisticsData}
                        onUpdateCommission={handleUpdateCommissionSummary}
                        onMarkCommissionAsSent={handleMarkCommissionAsSent}
                        onNavigateToAdmin={() => setView('admin')}
                        onGenerateCommissions={handleGenerateCommissions}
                        availableYears={availableYears}
                        selectedYear={selectedYear}
                        onYearChange={setSelectedYear}
                        isFocusMode={isFocusMode}
                        onToggleFocusMode={() => setIsFocusMode(prev => !prev)}
                        theme={theme}
                        toggleTheme={toggleTheme}
                        onAddCommission={handleOpenAddCommissionModal}
                        onEditCommission={handleOpenEditCommissionModal}
                        onDeleteCommission={handleDeleteCommission}
                        currentUser={currentUser}
                        onLogout={handleLogout}
                        isSaving={isSaving}
                    />
                );
        }
    };

    return (
        <div className={`bg-gray-50 dark:bg-gray-900 min-h-screen font-sans transition-colors duration-300 ${isFocusMode ? 'p-2' : 'p-4 sm:p-6 lg:p-8'}`}>
            {renderContent()}
            <Toast toasts={toasts} onRemove={removeToast} />
            <CommissionModal
                isOpen={isCommissionModalOpen}
                onClose={() => setIsCommissionModalOpen(false)}
                onSave={handleSaveCommissionFromModal}
                commission={commissionToEdit}
                isSaving={isSaving}
            />
        </div>
    );
};

export default App;
