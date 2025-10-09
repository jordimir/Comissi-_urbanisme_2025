
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Dashboard from './components/Dashboard';
import CommissionDetailView from './components/CommissionDetailView';
import AdminView from './components/AdminView';
import Login from './components/Login';
import Toast from './components/Toast';
import Modal from './components/Modal';
import CommissionModal from './components/CommissionModal';
import { 
  ApplicationData, 
  CommissionSummary, 
  CommissionDetail, 
  StatisticsData,
  ToastMessage,
  User,
  TechnicianWorkload,
  CommissionStatus,
  AdminList,
  DeletedCommissionPayload
} from './types';
import * as api from './api';
import { SunIcon, MoonIcon } from './components/icons/Icons';

type View = 'dashboard' | 'detail' | 'admin';
type ListKey = keyof Omit<ApplicationData['adminData'], 'users'>;

const App: React.FC = () => {
  const [data, setData] = useState<ApplicationData | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [loginError, setLoginError] = useState('');

  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedCommission, setSelectedCommission] = useState<CommissionSummary | null>(null);
  const [commissionDetail, setCommissionDetail] = useState<CommissionDetail | null>(null);
  
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
        const storedTheme = window.localStorage.getItem('theme');
        if (storedTheme === 'dark' || (!storedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            return 'dark';
        }
    }
    return 'light';
  });

  const [isFocusMode, setIsFocusMode] = useState(false);
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());

  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [modal, setModal] = useState<{ title: string; message: string; onConfirm?: () => void } | null>(null);

  const [isCommissionModalOpen, setIsCommissionModalOpen] = useState(false);
  const [commissionToEdit, setCommissionToEdit] = useState<CommissionSummary | null>(null);

  // --- Effects ---

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await api.getCurrentUser();
        setCurrentUser(user);
        if (user) {
          fetchData();
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, []);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const appData = await api.getApplicationData();
      setData(appData);
    } catch (error) {
      showToast('Error en carregar les dades', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  // --- Memoized Data ---

  const availableYears = useMemo(() => {
    if (!data?.commissions) return [new Date().getFullYear().toString()];
    const years = new Set(data.commissions.map(c => c.dataComissio.split('/')[2]));
    return Array.from(years).sort((a, b) => parseInt(b) - parseInt(a));
  }, [data?.commissions]);
  
  const filteredCommissions = useMemo(() => {
    if (!data?.commissions) return [];
    return data.commissions.filter(c => c.dataComissio.endsWith(`/${selectedYear}`));
  }, [data?.commissions, selectedYear]);

  const statistics = useMemo((): StatisticsData => {
    const stats: StatisticsData = {
      technicianDistribution: [],
      workloadOverTime: [],
      reportStatusDistribution: [],
      procedureTypeDistribution: [],
      monthlyWorkload: [],
      technicianWorkload: { headers: [], technicians: [], data: {}, rowTotals: {}, columnTotals: [], grandTotal: 0 },
    };
    
    if (!data || !filteredCommissions.length) return stats;

    const detailsForYear = data.commissionDetails.filter(d => d.sessio.endsWith(`/${selectedYear}`));
    const allExpedientsForYear = detailsForYear.flatMap(d => d.expedients);

    // Technician Distribution
    const techCounts: Record<string, number> = {};
    allExpedientsForYear.forEach(exp => {
      techCounts[exp.tecnic] = (techCounts[exp.tecnic] || 0) + 1;
    });
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF4560', '#775DD0'];
    stats.technicianDistribution = Object.entries(techCounts)
        .map(([name, value], index) => ({ name, value, fill: COLORS[index % COLORS.length] }))
        .sort((a, b) => b.value - a.value);

    // Workload Over Time
    stats.workloadOverTime = filteredCommissions
        .filter(c => c.estat === 'Finalitzada')
        .sort((a,b) => a.numActa - b.numActa)
        .map(c => ({
            date: `Acta ${c.numActa}`,
            'Càrrega': c.numTemes
        }));

    // Report Status Distribution
    const statusCounts: Record<string, number> = {};
    allExpedientsForYear.forEach(exp => {
        statusCounts[exp.sentitInforme] = (statusCounts[exp.sentitInforme] || 0) + 1;
    });
    const STATUS_COLORS: Record<string, string> = {
        'Favorable': '#22c55e', 'Desfavorable': '#ef4444', 'Favorable condicionat (mixte)': '#eab308',
        'Requeriment': '#f97316', 'Caducat/Arxivat': '#6b7280', 'Posar en consideració': '#a855f7'
    };
    stats.reportStatusDistribution = Object.entries(statusCounts)
        .map(([name, value]) => ({ name, value, fill: STATUS_COLORS[name] || '#9ca3af' }))
        .sort((a,b) => b.value - a.value);
    
    // Technician Workload
    const technicianWorkload: TechnicianWorkload = {
      headers: [], technicians: [], data: {}, rowTotals: {}, columnTotals: [], grandTotal: 0
    };
    // Fix: Explicitly type 'technicians' as string[] to prevent TypeScript from inferring it as 'unknown[]' in strict mode, which was causing multiple downstream index-related type errors.
    const technicians: string[] = Array.from(new Set(allExpedientsForYear.map(e => e.tecnic))).sort();
    technicianWorkload.technicians = technicians;
    technicians.forEach(t => {
        technicianWorkload.data[t] = {};
        technicianWorkload.rowTotals[t] = 0;
    });

    const sortedCommissions = [...filteredCommissions].sort((a, b) => {
        const dateA = new Date(a.dataComissio.split('/').reverse().join('-'));
        const dateB = new Date(b.dataComissio.split('/').reverse().join('-'));
        return dateA.getTime() - dateB.getTime();
    });

    technicianWorkload.headers = sortedCommissions.map(c => ({
        date: c.dataComissio,
        isFuture: c.estat === 'Oberta'
    }));
    technicianWorkload.columnTotals = new Array(technicianWorkload.headers.length).fill(0);

    sortedCommissions.forEach((c, colIndex) => {
        const detail = detailsForYear.find(d => d.numActa === c.numActa);
        if (detail) {
            detail.expedients.forEach(exp => {
                if (technicians.includes(exp.tecnic)) {
                    technicianWorkload.data[exp.tecnic][c.dataComissio] = (technicianWorkload.data[exp.tecnic][c.dataComissio] || 0) + 1;
                }
            });
        }
    });

    technicians.forEach(tech => {
        let rowTotal = 0;
        technicianWorkload.headers.forEach((h, colIndex) => {
            const val = technicianWorkload.data[tech][h.date] || 0;
            rowTotal += val;
            technicianWorkload.columnTotals[colIndex] += val;
        });
        technicianWorkload.rowTotals[tech] = rowTotal;
    });
    technicianWorkload.grandTotal = technicianWorkload.columnTotals.reduce((sum, total) => sum + total, 0);
    stats.technicianWorkload = technicianWorkload;

    return stats;

  }, [data, filteredCommissions, selectedYear]);

  // --- Handlers ---

  const showToast = (message: string, type: 'success' | 'error' = 'success', onUndo?: () => void) => {
    setToast({ id: Date.now(), message, type, onUndo });
  };
  
  const handleLogin = async (email: string, password: string) => {
    try {
      setLoginError('');
      const user = await api.login(email, password);
      setCurrentUser(user);
      await fetchData();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error d'inici de sessió";
      setLoginError(errorMessage);
    }
  };
  
  const handleLogout = () => {
    setModal({
      title: 'Tancar Sessió',
      message: 'Estàs segur que vols tancar la sessió?',
      onConfirm: async () => {
        await api.logout();
        setCurrentUser(null);
        setData(null);
        setCurrentView('dashboard');
      }
    });
  };

  const handleSelectCommission = async (commission: CommissionSummary) => {
    setLoading(true);
    try {
      const detail = await api.getCommissionDetail(commission.numActa, commission.dataComissio);
      if (detail) {
        setCommissionDetail(detail);
        setSelectedCommission(commission);
        setCurrentView('detail');
      } else {
        showToast(`No s'han trobat detalls per a l'acta ${commission.numActa}`, 'error');
      }
    } catch (error) {
      showToast("Error en carregar els detalls de la comissió", 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCommission = async (numActa: number, dataComissio: string, field: keyof CommissionSummary, value: any) => {
    setIsSaving(true);
    try {
      const updatedCommission = await api.updateCommissionSummary(numActa, dataComissio, field, value);
      setData(prevData => {
        if (!prevData) return null;
        return {
          ...prevData,
          commissions: prevData.commissions.map(c => 
            (c.numActa === numActa && c.dataComissio === dataComissio) ? updatedCommission : c
          )
        };
      });
    } catch (error) {
      showToast("Error en actualitzar la comissió", 'error');
    } finally {
        setIsSaving(false);
    }
  };

  const handleMarkCommissionAsSent = async (numActa: number, dataComissio: string) => {
    setIsSaving(true);
    try {
      const updatedCommission = await api.markCommissionAsSent(numActa, dataComissio);
      setData(prevData => {
        if (!prevData) return null;
        return {
          ...prevData,
          commissions: prevData.commissions.map(c => 
            (c.numActa === numActa && c.dataComissio === dataComissio) ? updatedCommission : c
          )
        };
      });
      showToast("Comissió marcada com a enviada.");
    } catch (error) {
      showToast("Error en marcar la comissió", 'error');
    } finally {
        setIsSaving(false);
    }
  };
  
  const handleSaveCommissionDetails = async (detail: CommissionDetail) => {
    setIsSaving(true);
    try {
      const savedDetail = await api.saveCommissionDetails(detail);
      setData(prevData => {
        if (!prevData) return null;
        let found = false;
        const updatedDetails = prevData.commissionDetails.map(d => {
            if (d.numActa === savedDetail.numActa && d.sessio.endsWith(`/${selectedYear}`)) {
                found = true;
                return savedDetail;
            }
            return d;
        });
        if (!found) {
            updatedDetails.push(savedDetail);
        }
        
        const updatedCommissions = prevData.commissions.map(summary => 
            (summary.numActa === savedDetail.numActa && summary.dataComissio.endsWith(`/${selectedYear}`)) ? { 
              ...summary, 
              numTemes: savedDetail.expedients.length,
              estat: savedDetail.estat as CommissionStatus,
            } : summary
          );

        return { ...prevData, commissionDetails: updatedDetails, commissions: updatedCommissions };
      });
      setCommissionDetail(savedDetail);
      showToast("Canvis desats correctament.");
      setCurrentView('dashboard');
    } catch (error) {
      showToast("Error en desar els canvis", 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerateCommissions = () => {
    setModal({
      title: 'Generar Comissions',
      message: 'Estàs segur que vols generar les comissions per al proper any? Aquesta acció no es pot desfer.',
      onConfirm: async () => {
        setIsSaving(true);
        try {
          const newCommissions = await api.generateNextYearCommissions();
          setData(prevData => prevData ? { ...prevData, commissions: [...prevData.commissions, ...newCommissions] } : null);
          await fetchData();
          showToast(`S'han generat ${newCommissions.length} comissions.`, 'success');
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Error desconegut";
          showToast(errorMessage, 'error');
        } finally {
            setIsSaving(false);
        }
      }
    });
  };

  const handleAddCommission = () => {
    setCommissionToEdit(null);
    setIsCommissionModalOpen(true);
  };

  const handleEditCommission = (commission: CommissionSummary) => {
    setCommissionToEdit(commission);
    setIsCommissionModalOpen(true);
  };

  const handleRestoreCommission = async (payload: DeletedCommissionPayload) => {
    setIsSaving(true);
    try {
        await api.restoreCommission(payload);
        await fetchData();
        showToast("S'ha desfet l'eliminació.", 'success');
    } catch (error) {
        showToast("Error en desfer l'eliminació", 'error');
    } finally {
        setIsSaving(false);
    }
  };

  const handleDeleteCommission = (commission: CommissionSummary) => {
    setModal({
        title: 'Eliminar Comissió',
        message: `Estàs segur que vols eliminar la comissió ${commission.numActa}/${commission.dataComissio.split('/')[2]}? Aquesta acció eliminarà també tots els seus expedients.`,
        onConfirm: async () => {
            setIsSaving(true);
            try {
                const deletedPayload = await api.deleteCommission(commission.numActa, commission.dataComissio);
                await fetchData();
                showToast('Comissió eliminada correctament.', 'success', () => {
                    handleRestoreCommission(deletedPayload);
                });
            } catch (error) {
                showToast('Error en eliminar la comissió', 'error');
            } finally {
                setIsSaving(false);
            }
        }
    });
  };
  
  const handleSaveCommission = async (data: {numActa: number, dataComissio: string}) => {
    setIsSaving(true);
    try {
        if (commissionToEdit) {
            await api.updateCommission(commissionToEdit.numActa, commissionToEdit.dataComissio, data);
            showToast('Comissió actualitzada correctament.');
        } else {
            await api.addCommission(data);
            showToast('Comissió afegida correctament.');
        }
        await fetchData();
        setIsCommissionModalOpen(false);
        setCommissionToEdit(null);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "S'ha produït un error";
        showToast(errorMessage, 'error');
    } finally {
        setIsSaving(false);
    }
  };
  
  // --- Admin Handlers ---

  const handleAdminUpdate = async (action: () => Promise<any>) => {
    setIsSaving(true);
    try {
        await action();
        await fetchData();
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Ha ocorregut un error';
        showToast(message, 'error');
    } finally {
        setIsSaving(false);
    }
  };
  
  const handleRestoreAdminItem = async (list: ListKey, item: AdminList) => {
    await handleAdminUpdate(() => api.restoreAdminItem(list, item));
    showToast("S'ha desfet l'eliminació.", 'success');
  };

  const handleDeleteAdminItem = (list: ListKey) => async (id: string) => {
    setIsSaving(true);
    try {
        const deletedItem = await api.deleteAdminItem(list, id);
        await fetchData();
        showToast('Element eliminat.', 'success', () => handleRestoreAdminItem(list, deletedItem));
    } catch (error) {
        showToast("Error en eliminar l'element", 'error');
    } finally {
        setIsSaving(false);
    }
  };
  
  const handleRestoreUser = async (user: User) => {
    await handleAdminUpdate(() => api.restoreUser(user));
    showToast("S'ha desfet l'eliminació de l'usuari.", 'success');
  };

  const handleDeleteUser = async (id: string) => {
    setIsSaving(true);
    try {
        const deletedUser = await api.deleteUser(id);
        await fetchData();
        showToast('Usuari eliminat.', 'success', () => handleRestoreUser(deletedUser));
    } catch (error) {
        showToast("Error en eliminar l'usuari", 'error');
    } finally {
        setIsSaving(false);
    }
  };

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  // --- Render logic ---

  if (loading && !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-xl font-semibold text-gray-700 dark:text-gray-300">Carregant...</div>
      </div>
    );
  }

  if (!currentUser) {
    return <Login onLogin={handleLogin} error={loginError} />;
  }

  return (
    <div className={`min-h-screen font-sans bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 ${isFocusMode ? 'focus-mode' : ''}`}>
        <div className="p-4 md:p-8 max-w-screen-2xl mx-auto">
            {!isFocusMode && (
                <button 
                    onClick={toggleTheme} 
                    className="fixed bottom-4 left-4 z-50 p-3 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-full shadow-lg md:hidden"
                >
                    {theme === 'light' ? <MoonIcon/> : <SunIcon/>}
                </button>
            )}

            {currentView === 'dashboard' && data && (
                <Dashboard
                    commissions={filteredCommissions}
                    onSelectCommission={handleSelectCommission}
                    statistics={statistics}
                    onUpdateCommission={handleUpdateCommission}
                    onMarkCommissionAsSent={handleMarkCommissionAsSent}
                    onNavigateToAdmin={() => setCurrentView('admin')}
                    onGenerateCommissions={handleGenerateCommissions}
                    availableYears={availableYears}
                    selectedYear={selectedYear}
                    onYearChange={setSelectedYear}
                    isFocusMode={isFocusMode}
                    onToggleFocusMode={() => setIsFocusMode(!isFocusMode)}
                    theme={theme}
                    toggleTheme={toggleTheme}
                    onAddCommission={handleAddCommission}
                    onEditCommission={handleEditCommission}
                    onDeleteCommission={handleDeleteCommission}
                    currentUser={currentUser}
                    onLogout={handleLogout}
                    isSaving={isSaving}
                />
            )}
            {currentView === 'detail' && commissionDetail && data && (
                <CommissionDetailView
                    commissionDetail={commissionDetail}
                    onBack={() => { setCurrentView('dashboard'); setCommissionDetail(null); }}
                    onSave={handleSaveCommissionDetails}
                    adminData={data.adminData}
                    currentUser={currentUser}
                    isFocusMode={isFocusMode}
                    onToggleFocusMode={() => setIsFocusMode(!isFocusMode)}
                    isSaving={isSaving}
                />
            )}
            {currentView === 'admin' && data && (
                <AdminView
                    adminData={data.adminData}
                    onBack={() => setCurrentView('dashboard')}
                    onAddItem={(list) => (item) => handleAdminUpdate(() => api.addAdminItem(list, item.name, item.email))}
                    onUpdateItem={(list) => (item) => handleAdminUpdate(() => api.updateAdminItem(list, item.id, item.name, item.email))}
                    onDeleteItem={handleDeleteAdminItem}
                    onAddUser={(user) => handleAdminUpdate(() => api.addUser(user.name, user.email, user.role, user.password))}
                    onUpdateUser={(user) => handleAdminUpdate(() => api.updateUser(user.id, user.name, user.email, user.role, user.password))}
                    onDeleteUser={handleDeleteUser}
                    isSaving={isSaving}
                />
            )}

            <Toast toast={toast} onClose={() => setToast(null)} />
            {modal && (
                <Modal
                    isOpen={!!modal}
                    title={modal.title}
                    message={modal.message}
                    onClose={() => setModal(null)}
                    onConfirm={modal.onConfirm}
                />
            )}
            <CommissionModal 
                isOpen={isCommissionModalOpen}
                onClose={() => setIsCommissionModalOpen(false)}
                onSave={handleSaveCommission}
                commissionToEdit={commissionToEdit}
                existingCommissions={data?.commissions || []}
                isSaving={isSaving}
            />
        </div>
    </div>
  );
};

export default App;
