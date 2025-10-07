

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import * as api from './api';
import Dashboard from './components/Dashboard';
import CommissionDetailView from './components/CommissionDetailView';
import AdminView from './components/AdminView';
import Modal from './components/Modal';
import Toast from './components/Toast';
import { CommissionSummary, CommissionDetail, Expedient, AdminData, AdminList, StatisticsData, User, ApplicationData, BackupRecord, TechnicianWorkload, ToastMessage } from './types';
import { adminData as initialAdminData } from './data';

type View = 'dashboard' | 'detail' | 'admin';
type Theme = 'light' | 'dark';

const COLORS = ['#14b8a6', '#f97316', '#ef4444', '#8b5cf6', '#3b82f6', '#f43f5e', '#06b6d4', '#d946ef'];
const BACKUP_STORAGE_KEY = 'urbanisme_backups';

const App: React.FC = () => {
  const [view, setView] = useState<View>('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCommission, setSelectedCommission] = useState<CommissionSummary | null>(null);
  
  const [commissionDetails, setCommissionDetails] = useState<CommissionDetail[]>([]);
  const [commissions, setCommissions] = useState<CommissionSummary[]>([]);
  const [adminData, setAdminData] = useState<AdminData>(initialAdminData);

  const [modalState, setModalState] = useState({ isOpen: false, title: '', message: '', onConfirm: undefined as (() => void) | undefined });
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [backups, setBackups] = useState<BackupRecord[]>([]);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type, id: Date.now() });
  };

  const hideToast = () => {
    setToast(null);
  };

  useEffect(() => {
    try {
        const savedBackups = localStorage.getItem(BACKUP_STORAGE_KEY);
        if (savedBackups) {
            const parsedBackups = JSON.parse(savedBackups);
            parsedBackups.sort((a: BackupRecord, b: BackupRecord) => b.timestamp - a.timestamp);
            setBackups(parsedBackups);
        }
    } catch (error) {
        console.error("Failed to load backups from localStorage", error);
        setBackups([]);
    }

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const data = await api.getApplicationData();
            setCommissions(data.commissions);
            setCommissionDetails(data.commissionDetails);
            setAdminData(data.adminData);
        } catch (error) {
            console.error("Failed to load application data", error);
            showToast('No s\'han pogut carregar les dades de l\'aplicació.', 'error');
        } finally {
            setIsLoading(false);
        }
    };
    fetchData();
  }, []);

  const availableYears = useMemo(() => 
    [...new Set(commissions.map(c => c.dataComissio.split('/')[2]))].sort((a, b) => Number(b) - Number(a))
  , [commissions]);

  const [selectedYear, setSelectedYear] = useState<string>(availableYears[0] || new Date().getFullYear().toString());
  
  useEffect(() => {
      if (availableYears.length > 0 && !availableYears.includes(selectedYear)) {
          setSelectedYear(availableYears[0]);
      }
  }, [availableYears, selectedYear]);


  const handleYearChange = (year: string) => {
    setSelectedYear(year);
  };

  const closeModal = () => {
    setModalState({ isOpen: false, title: '', message: '', onConfirm: undefined });
  };

  const handleGenerateNextYearCommissions = useCallback(async () => {
    const lastYear = Math.max(...commissions.map(c => parseInt(c.dataComissio.split('/')[2], 10)));
    const nextYear = lastYear + 1;
    
    setModalState({
      isOpen: true,
      title: `Generar Comissions per a ${nextYear}`,
      message: `Estàs segur que vols generar automàticament el calendari de comissions per a l'any ${nextYear}?`,
      onConfirm: async () => {
        try {
            const newCommissions = await api.generateNextYearCommissions();
            const fullData = await api.getApplicationData();
            setCommissions(fullData.commissions);
            showToast(`S'han generat ${newCommissions.length} comissions per a l'any ${nextYear}.`);
        } catch (error) {
            console.error('Failed to generate commissions', error);
            showToast('No s\'han pogut generar les comissions.', 'error');
        }
      }
    });
  }, [commissions]);

  const handleSelectCommission = useCallback(async (commission: CommissionSummary) => {
      try {
        const detail = await api.getCommissionDetail(commission.numActa);
        if (detail) {
            setCommissionDetails(prev => {
                const exists = prev.some(d => d.numActa === detail.numActa);
                if (exists) {
                    return prev.map(d => d.numActa === detail.numActa ? detail : d);
                }
                return [...prev, detail];
            });
            setSelectedCommission(commission);
            setView('detail');
        } else {
             showToast(`No s'han trobat detalls per a la comissió ${commission.numActa}.`, 'error');
        }
      } catch (error) {
        console.error("Failed to fetch commission details", error);
        showToast('No s\'han pogut carregar els detalls de la comissió.', 'error');
      }
  }, []);

  const handleBackToDashboard = useCallback(() => {
    setSelectedCommission(null);
    setView('dashboard');
  }, []);

  const handleNavigateToAdmin = useCallback(() => {
    setView('admin');
  }, []);

  const getCommissionDetail = (actaId: number): CommissionDetail | undefined => {
    return commissionDetails.find(detail => detail.numActa === actaId);
  };

  const handleSaveCommissionDetails = async (updatedDetail: CommissionDetail) => {
    try {
        const savedDetail = await api.saveCommissionDetails(updatedDetail);
        
        setCommissionDetails(prevDetails => {
            const newDetails = prevDetails.map(detail =>
                detail.numActa === savedDetail.numActa ? savedDetail : detail
            );
            if (!prevDetails.some(d => d.numActa === savedDetail.numActa)) {
                newDetails.push(savedDetail);
            }
            return newDetails;
        });

         setCommissions(prevSummaries => prevSummaries.map(summary => 
            summary.numActa === savedDetail.numActa ? { 
              ...summary, 
              numTemes: savedDetail.expedients.length,
              dataComissio: savedDetail.sessio,
              estat: savedDetail.estat,
              diaSetmana: api.getDayOfWeekCatalan(savedDetail.sessio),
            } : summary
          ));
        showToast('Els canvis s\'han guardat correctament.');
    } catch (error) {
        console.error("Failed to save commission details", error);
        showToast('No s\'han pogut guardar els canvis.', 'error');
    }
  };

  const handleUpdateCommissionSummary = async (
    numActa: number,
    dataComissio: string,
    field: keyof CommissionSummary,
    value: any
  ) => {
      try {
        await api.updateCommissionSummary(numActa, dataComissio, field, value);
        setCommissions(prev => prev.map(c => {
            if (c.numActa === numActa && c.dataComissio === dataComissio) {
                const updated = { ...c, [field]: value };
                if (field === 'avisEmail' && !value) {
                    updated.dataEmail = null;
                }
                return updated;
            }
            return c;
        }));
        showToast('Comissió actualitzada.');
      } catch(error) {
          console.error("Failed to update commission summary", error);
          showToast('No s\'ha pogut actualitzar la comissió.', 'error');
      }
  };

  const handleMarkCommissionAsSent = useCallback(async (numActa: number, dataComissio: string) => {
    try {
        const updatedCommission = await api.markCommissionAsSent(numActa, dataComissio);
        setCommissions(prev => prev.map(c => c.numActa === numActa && c.dataComissio === dataComissio ? updatedCommission : c));
        showToast("L'email s'ha marcat com a enviat.");
    } catch(error) {
        console.error("Failed to mark commission as sent", error);
        showToast('No s\'ha pogut realitzar l\'acció.', 'error');
    }
  }, []);

  const handleUpdateAdminItem = async (list: keyof AdminData, id: string, name: string, email?: string) => {
    if (list === 'users') return;
    try {
        await api.updateAdminItem(list, id, name, email);
        setAdminData(prev => ({
            ...prev,
            [list]: (prev[list] as AdminList[]).map(item => item.id === id ? { ...item, name, email } : item)
        }));
        showToast('Element actualitzat.');
    } catch(error) {
        console.error(`Failed to update item in ${list}`, error);
        showToast('No s\'ha pogut actualitzar l\'element.', 'error');
    }
  };

  const handleDeleteAdminItem = async (list: keyof AdminData, id: string) => {
    if (list === 'users') return;
     try {
        await api.deleteAdminItem(list, id);
        setAdminData(prev => ({
            ...prev,
            [list]: (prev[list] as AdminList[]).filter(item => item.id !== id)
        }));
        showToast('Element eliminat.');
    } catch(error) {
        console.error(`Failed to delete item from ${list}`, error);
        showToast('No s\'ha pogut eliminar l\'element.', 'error');
    }
  };

  const handleAddAdminItem = async (list: keyof AdminData, name: string, email?: string) => {
    if (list === 'users') return;
    try {
        const newItem = await api.addAdminItem(list, name, email);
        setAdminData(prev => ({
            ...prev,
            [list]: [...(prev[list] as AdminList[]), newItem]
        }));
        showToast('Element afegit.');
    } catch(error) {
        console.error(`Failed to add item to ${list}`, error);
        showToast('No s\'ha pogut afegir l\'element.', 'error');
    }
  };

  const handleUpdateUser = async (id: string, name: string, email: string, password?: string) => {
      try {
        await api.updateUser(id, name, email, password);
        setAdminData(prev => ({
            ...prev,
            users: prev.users.map(user => user.id === id ? { ...user, name, email } : user)
        }));
        showToast('Usuari actualitzat.');
      } catch(error) {
          console.error("Failed to update user", error);
          showToast('No s\'ha pogut actualitzar l\'usuari.', 'error');
      }
  };
  const handleDeleteUser = async (id: string) => {
      try {
          await api.deleteUser(id);
          setAdminData(prev => ({
              ...prev,
              users: prev.users.filter(user => user.id !== id)
          }));
          showToast('Usuari eliminat.');
      } catch(error) {
          console.error("Failed to delete user", error);
          showToast('No s\'ha pogut eliminar l\'usuari.', 'error');
      }
  };
  const handleAddUser = async (name: string, email: string, password?: string) => {
      try {
        const newUser = await api.addUser(name, email, password);
        setAdminData(prev => ({...prev, users: [...prev.users, newUser]}));
        showToast('Usuari afegit.');
      } catch(error) {
          console.error("Failed to add user", error);
          showToast('No s\'ha pogut afegir l\'usuari.', 'error');
      }
  };

  const handleImportUsers = async (importedUsers: User[]) => {
    try {
        const updatedUsers = await api.importUsers(importedUsers);
        setAdminData(prev => ({ ...prev, users: updatedUsers }));
        showToast('La llista d\'usuaris s\'ha actualitzat correctament.');
    } catch(error) {
        console.error("Failed to import users", error);
        showToast('No s\'ha pogut importar els usuaris.', 'error');
    }
  };

  const getCurrentState = (): ApplicationData => ({ commissions, commissionDetails, adminData });
  const loadState = (data: ApplicationData) => {
    setCommissions(data.commissions || []);
    setCommissionDetails(data.commissionDetails || []);
    setAdminData(data.adminData || initialAdminData);
  };

  const handleExportData = () => {
    try {
        const data = getCurrentState();
        const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
        const link = document.createElement("a");
        link.href = jsonString;
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        link.download = `backup_urbanisme_${timestamp}.json`;
        link.click();
        showToast('La còpia de seguretat s\'ha descarregat correctament.');
    } catch (error) {
        console.error("Error exporting data:", error);
        showToast('No s\'ha pogut exportar les dades.', 'error');
    }
  };

  const handleImportData = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== 'string') throw new Error("File content is not readable");
        const data = JSON.parse(text);

        setModalState({
            isOpen: true,
            title: "Confirmar Importació",
            message: "Estàs segur que vols substituir TOTES les dades actuals per les del fitxer? Aquesta acció no es pot desfer.",
            onConfirm: async () => {
                try {
                    const importedData = await api.importData(data);
                    loadState(importedData);
                    showToast('Les dades s\'han importat i carregat correctament.');
                } catch (error) {
                    console.error("Error importing data via API:", error);
                    showToast('No s\'ha pogut desar les dades importades.', 'error');
                }
            }
        });
      } catch (error) {
        console.error("Error parsing imported data:", error);
        showToast('El fitxer seleccionat no és vàlid o està malmès.', 'error');
      }
    };
    reader.onerror = () => {
        showToast('No s\'ha pogut llegir el fitxer seleccionat.', 'error');
    };
    reader.readAsText(file);
  };
  
  const handleCreateBackup = () => {
      const timestamp = Date.now();
      const newBackup: BackupRecord = {
          timestamp,
          description: new Date(timestamp).toLocaleString('ca-ES')
      };
      const currentState = getCurrentState();

      try {
          const newBackups = [newBackup, ...backups];
          localStorage.setItem(BACKUP_STORAGE_KEY, JSON.stringify(newBackups));
          localStorage.setItem(`backup_${timestamp}`, JSON.stringify(currentState));
          setBackups(newBackups);
          showToast(`S'ha creat el punt de restauració: ${newBackup.description}`);
      } catch (error) {
          console.error("Error creating backup:", error);
          showToast('No s\'ha pogut crear el punt de restauració.', 'error');
      }
  };

  const handleRestoreBackup = (timestamp: number) => {
      setModalState({
          isOpen: true,
          title: "Confirmar Restauració",
          message: `Estàs segur que vols restaurar les dades al punt del ${new Date(timestamp).toLocaleString('ca-ES')}? Tots els canvis actuals no desats es perdran.`,
          onConfirm: () => {
              try {
                  const backupDataString = localStorage.getItem(`backup_${timestamp}`);
                  if (!backupDataString) throw new Error("Backup data not found");
                  const backupData = JSON.parse(backupDataString);
                  loadState(backupData);
                  showToast('Les dades s\'han restaurat correctament.');
              } catch (error) {
                  console.error("Error restoring backup:", error);
                  showToast('No s\'ha pogut restaurar la còpia de seguretat.', 'error');
              }
          }
      });
  };

  const handleDeleteBackup = (timestamp: number) => {
       setModalState({
          isOpen: true,
          title: "Confirmar Eliminació",
          message: `Estàs segur que vols eliminar permanentment el punt de restauració del ${new Date(timestamp).toLocaleString('ca-ES')}?`,
          onConfirm: () => {
              try {
                  const newBackups = backups.filter(b => b.timestamp !== timestamp);
                  localStorage.setItem(BACKUP_STORAGE_KEY, JSON.stringify(newBackups));
                  localStorage.removeItem(`backup_${timestamp}`);
                  setBackups(newBackups);
                  showToast('El punt de restauració s\'ha eliminat correctament.');
              } catch (error) {
                  console.error("Error deleting backup:", error);
                  showToast('No s\'ha pogut eliminar la còpia de seguretat.', 'error');
              }
          }
      });
  };

  const filteredCommissions = useMemo(() => 
    commissions.filter(c => c.dataComissio.endsWith(selectedYear))
  , [commissions, selectedYear]);

  const filteredStatistics = useMemo<StatisticsData>(() => {
    const yearCommissions = commissions.filter(c => c.dataComissio.endsWith(selectedYear));
    const yearCommissionActaNumbers = new Set(yearCommissions.map(c => c.numActa));

    const yearCommissionDetails = commissionDetails.filter(d => 
        yearCommissionActaNumbers.has(d.numActa) && d.sessio.endsWith(selectedYear)
    );

    const techCounts: { [key: string]: number } = {};
    const reportStatusCounts: { [key: string]: number } = {};

    yearCommissionDetails.forEach(detail => {
      detail.expedients.forEach(expedient => {
        const technic = expedient.tecnic || 'No assignat';
        techCounts[technic] = (techCounts[technic] || 0) + 1;

        const status = expedient.sentitInforme || 'Sense estat';
        reportStatusCounts[status] = (reportStatusCounts[status] || 0) + 1;
      });
    });

    const technicianDistribution = Object.keys(techCounts).map((key, index) => ({
      name: key,
      value: techCounts[key],
      fill: COLORS[index % COLORS.length],
    }));

    const reportStatusDistribution = Object.keys(reportStatusCounts).map((key, index) => ({
      name: key,
      value: reportStatusCounts[key],
      fill: COLORS[(index + 2) % COLORS.length], // Offset colors
    }));

    const sortedYearCommissions = [...yearCommissions].sort((a, b) => {
        const [dayA, monthA, yearA] = a.dataComissio.split('/').map(Number);
        const [dayB, monthB, yearB] = b.dataComissio.split('/').map(Number);
        const dateA = new Date(yearA, monthA - 1, dayA);
        const dateB = new Date(yearB, monthB - 1, dayB);
        return dateA.getTime() - dateB.getTime();
    });
    
    const workloadOverTime = sortedYearCommissions.map(c => {
        const dateParts = c.dataComissio.split('/');
        return {
            date: `${dateParts[0]}/${dateParts[1]}`,
            'Càrrega': c.numTemes,
        }
    });

    const headers = sortedYearCommissions.map(c => ({
        date: c.dataComissio,
        isFuture: c.estat === 'Oberta'
    }));
    const dateHeaders = headers.map(h => h.date);

    const technicians = adminData.tecnics.map(t => t.name);
    
    const workloadData: Record<string, Record<string, number>> = {};
    technicians.forEach(tech => {
        workloadData[tech] = {};
        dateHeaders.forEach(date => {
            workloadData[tech][date] = 0;
        });
    });

    yearCommissionDetails.forEach(detail => {
        detail.expedients.forEach(expedient => {
            const techName = expedient.tecnic;
            if (workloadData[techName] && workloadData[techName][detail.sessio] !== undefined) {
                workloadData[techName][detail.sessio]++;
            }
        });
    });

    const rowTotals: Record<string, number> = {};
    technicians.forEach(tech => {
        rowTotals[tech] = dateHeaders.reduce((sum, date) => sum + (workloadData[tech]?.[date] || 0), 0);
    });

    const columnTotals: number[] = [];
    dateHeaders.forEach((date, index) => {
        const total = technicians.reduce((sum, tech) => sum + (workloadData[tech]?.[date] || 0), 0);
        columnTotals[index] = total;
    });

    const grandTotal = columnTotals.reduce((sum, total) => sum + total, 0);

    const technicianWorkload: TechnicianWorkload = {
        headers,
        technicians,
        data: workloadData,
        rowTotals,
        columnTotals,
        grandTotal,
    };

    return {
      technicianDistribution,
      workloadOverTime,
      reportStatusDistribution,
      procedureTypeDistribution: [],
      monthlyWorkload: [],
      technicianWorkload,
    };
  }, [selectedYear, commissions, commissionDetails, adminData.tecnics]);

  const toggleFocusMode = () => {
    setIsFocusMode(prev => !prev);
  };

  if (isLoading) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-[#f0e9f4] dark:bg-gray-900">
            <div className="text-xl font-semibold text-gray-700 dark:text-gray-300">Carregant dades...</div>
        </div>
    );
  }

  const renderView = () => {
    switch (view) {
      case 'detail':
        return (
          <CommissionDetailView
            commissionDetail={selectedCommission ? getCommissionDetail(selectedCommission.numActa) : undefined}
            onBack={handleBackToDashboard}
            onSave={handleSaveCommissionDetails}
            adminData={adminData}
          />
        );
      case 'admin':
        return (
            <AdminView 
                adminData={adminData}
                onUpdate={handleUpdateAdminItem}
                onDelete={handleDeleteAdminItem}
                onAdd={handleAddAdminItem}
                onUpdateUser={handleUpdateUser}
                onDeleteUser={handleDeleteUser}
                onAddUser={handleAddUser}
                onImportUsers={handleImportUsers}
                onBack={handleBackToDashboard}
                onExportData={handleExportData}
                onImportData={handleImportData}
                backups={backups}
                onCreateBackup={handleCreateBackup}
                onRestoreBackup={handleRestoreBackup}
                onDeleteBackup={handleDeleteBackup}
            />
        );
      case 'dashboard':
      default:
        return (
          <Dashboard
            commissions={filteredCommissions}
            onSelectCommission={handleSelectCommission}
            statistics={filteredStatistics}
            onUpdateCommission={handleUpdateCommissionSummary}
            onMarkCommissionAsSent={handleMarkCommissionAsSent}
            onNavigateToAdmin={handleNavigateToAdmin}
            onGenerateCommissions={handleGenerateNextYearCommissions}
            availableYears={availableYears}
            selectedYear={selectedYear}
            onYearChange={handleYearChange}
            isFocusMode={isFocusMode}
            onToggleFocusMode={toggleFocusMode}
            theme={theme}
            toggleTheme={toggleTheme}
          />
        );
    }
  };

  return (
    <div className="min-h-screen text-gray-800 dark:text-gray-200 p-4 lg:p-8 app-container">
      {isFocusMode && (
        <button
          onClick={toggleFocusMode}
          className="fixed top-4 right-4 z-50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-800 dark:text-gray-200 font-bold py-2 px-4 rounded-lg hover:bg-white dark:hover:bg-gray-700 shadow-lg transition-all no-print animate-fade-in"
          title="Sortir del Mode Focus"
        >
          &times; Sortir del Mode Focus
        </button>
      )}
      <Toast toast={toast} onClose={hideToast} />
      <Modal 
        isOpen={modalState.isOpen}
        title={modalState.title}
        message={modalState.message}
        onClose={closeModal}
        onConfirm={modalState.onConfirm}
      />
      {renderView()}
    </div>
  );
};

export default App;