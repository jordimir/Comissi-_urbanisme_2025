

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  commissions as initialCommissions,
  commissionDetails as initialCommissionDetails,
  adminData as initialAdminData
} from './data';
import Dashboard from './components/Dashboard';
import CommissionDetailView from './components/CommissionDetailView';
import AdminView from './components/AdminView';
import Login from './components/Login';
import Modal from './components/Modal';
import { CommissionSummary, CommissionDetail, Expedient, AdminData, AdminList, StatisticsData, User, ApplicationData, BackupRecord } from './types';

type View = 'dashboard' | 'detail' | 'admin';

const COLORS = ['#14b8a6', '#f97316', '#ef4444', '#8b5cf6', '#3b82f6', '#f43f5e', '#06b6d4', '#d946ef'];
const BACKUP_STORAGE_KEY = 'urbanisme_backups';

const getDayOfWeekCatalan = (dateString: string): string => {
    const parts = dateString.split('/');
    if (parts.length !== 3) return '';
    
    const [day, month, year] = parts.map(Number);
    if (isNaN(day) || isNaN(month) || isNaN(year)) {
        return ''; 
    }
    const date = new Date(year, month - 1, day);
    const days = ['diumenge', 'dilluns', 'dimarts', 'dimecres', 'dijous', 'divendres', 'dissabte'];
    return days[date.getDay()];
};

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [view, setView] = useState<View>('dashboard');
  const [selectedCommission, setSelectedCommission] = useState<CommissionSummary | null>(null);
  const [commissionDetails, setCommissionDetails] = useState<CommissionDetail[]>(initialCommissionDetails);
  const [commissions, setCommissions] = useState<CommissionSummary[]>(initialCommissions);
  const [adminData, setAdminData] = useState<AdminData>(initialAdminData);
  const [modalState, setModalState] = useState({ isOpen: false, title: '', message: '', onConfirm: undefined as (() => void) | undefined });
  const [backups, setBackups] = useState<BackupRecord[]>([]);

  useEffect(() => {
    try {
        const savedBackups = localStorage.getItem(BACKUP_STORAGE_KEY);
        if (savedBackups) {
            const parsedBackups = JSON.parse(savedBackups);
            // Sort by timestamp descending
            parsedBackups.sort((a: BackupRecord, b: BackupRecord) => b.timestamp - a.timestamp);
            setBackups(parsedBackups);
        }
    } catch (error) {
        console.error("Failed to load backups from localStorage", error);
        setBackups([]);
    }
  }, []);

  const availableYears = useMemo(() => 
    [...new Set(commissions.map(c => c.dataComissio.split('/')[2]))].sort((a, b) => Number(b) - Number(a))
  , [commissions]);

  const [selectedYear, setSelectedYear] = useState<string>(availableYears[0] || new Date().getFullYear().toString());

  const handleLogin = (email: string, password: string): void => {
    const user = adminData.users.find(u => u.email === email && u.password === password);
    if (user) {
        setIsAuthenticated(true);
        setLoginError('');
    } else {
        setLoginError('Credencials incorrectes. Si us plau, torna-ho a provar.');
    }
  };

  const handleLogout = (): void => {
      setIsAuthenticated(false);
  };

  const handleYearChange = (year: string) => {
    setSelectedYear(year);
  };

  const showInfoModal = (title: string, message: string) => {
    setModalState({ isOpen: true, title, message, onConfirm: undefined });
  };
  
  const closeModal = () => {
    setModalState({ isOpen: false, title: '', message: '', onConfirm: undefined });
  };

  const handleGenerateNextYearCommissions = useCallback(() => {
    const lastYear = Math.max(...commissions.map(c => parseInt(c.dataComissio.split('/')[2], 10)));
    const nextYear = lastYear + 1;
    
    setModalState({
      isOpen: true,
      title: `Generar Comissions per a ${nextYear}`,
      message: `Estàs segur que vols generar automàticament el calendari de comissions per a l'any ${nextYear}?`,
      onConfirm: () => {
        const newCommissions: CommissionSummary[] = [];
        let lastActaNum = Math.max(...commissions.map(c => c.numActa));
        
        const date = new Date(nextYear, 0, 1);
        while (date.getDay() !== 3) {
          date.setDate(date.getDate() + 1);
        }
        
        while (date.getFullYear() === nextYear) {
          lastActaNum++;
          const newCommission: CommissionSummary = {
            numActa: lastActaNum,
            numTemes: 0,
            diaSetmana: 'dimecres',
            dataComissio: date.toLocaleDateString('ca-ES', { day: 'numeric', month: 'numeric', year: 'numeric'}),
            avisEmail: false,
            dataEmail: null,
            estat: 'Oberta'
          };
          newCommissions.push(newCommission);
          date.setDate(date.getDate() + 14);
        }
        
        setCommissions(prev => [...prev, ...newCommissions]);
        showInfoModal('Èxit', `S'han generat ${newCommissions.length} comissions per a l'any ${nextYear}.`);
      }
    });
  }, [commissions]);

  const handleSelectCommission = useCallback((commission: CommissionSummary) => {
    setSelectedCommission(commission);
    setView('detail');
  }, []);

  const handleBackToDashboard = useCallback(() => {
    setSelectedCommission(null);
    setView('dashboard');
  }, []);

  const handleNavigateToAdmin = useCallback(() => {
    setView('admin');
  }, []);

  const getCommissionDetail = (actaId: number): CommissionDetail | undefined => {
    const detail = commissionDetails.find(detail => detail.numActa === actaId);
    if (detail) {
        return detail;
    }
    const commissionSummary = commissions.find(c => c.numActa === actaId);
    if (commissionSummary && commissionSummary.estat === 'Oberta') {
        const newDetail: CommissionDetail = {
            numActa: actaId,
            sessio: commissionSummary.dataComissio,
            dataActual: new Date().toLocaleDateString('ca-ES'),
            hora: '9:00:00',
            estat: 'Oberta',
            mitja: 'Via telemàtica',
            expedientsCount: 0,
            expedients: [],
        };
        setCommissionDetails(prevDetails => [...prevDetails, newDetail]);
        return newDetail;
    }
    return undefined;
  };

  const handleSaveCommissionDetails = (updatedDetail: CommissionDetail) => {
    setCommissionDetails(prevDetails => {
        const newDetails = prevDetails.map(detail =>
            detail.numActa === updatedDetail.numActa ? updatedDetail : detail
        );
        if (!prevDetails.some(d => d.numActa === updatedDetail.numActa)) {
            newDetails.push(updatedDetail);
        }
        return newDetails;
    });
     setCommissions(prevSummaries => prevSummaries.map(summary => 
        summary.numActa === updatedDetail.numActa ? { 
          ...summary, 
          numTemes: updatedDetail.expedients.length,
          dataComissio: updatedDetail.sessio,
          estat: updatedDetail.estat,
          diaSetmana: getDayOfWeekCatalan(updatedDetail.sessio),
        } : summary
      ));
  };

  const handleUpdateCommissionSummary = (
    numActa: number,
    dataComissio: string,
    field: keyof CommissionSummary,
    value: any
  ) => {
    setCommissions(prevCommissions =>
      prevCommissions.map(c => {
        if (c.numActa === numActa && c.dataComissio === dataComissio) {
          const updatedCommission = { ...c, [field]: value };
          if (field === 'avisEmail' && !value) {
            updatedCommission.dataEmail = null;
          }
          return updatedCommission;
        }
        return c;
      })
    );
  };

  const handleMarkCommissionAsSent = useCallback((numActa: number, dataComissio: string) => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString('ca-ES', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric'
    });

    setCommissions(prevCommissions =>
        prevCommissions.map(c => {
            if (c.numActa === numActa && c.dataComissio === dataComissio) {
                return { ...c, avisEmail: true, dataEmail: formattedDate };
            }
            return c;
        })
    );
  }, []);

  const handleUpdateAdminItem = (list: keyof AdminData, id: string, name: string, email?: string) => {
    setAdminData((prev: AdminData) => {
      if (list === 'users') {
        return prev;
      }
      
      const updatedList = (prev[list] as AdminList[]).map(item => 
        item.id === id ? { ...item, name, email } : item
      );

      return {
        ...prev,
        [list]: updatedList
      };
    });
  };

  const handleDeleteAdminItem = (list: keyof AdminData, id: string) => {
    setAdminData((prev: AdminData) => {
      if (list === 'users') {
        return prev;
      }
      return {
        ...prev,
        [list]: (prev[list] as AdminList[]).filter(item => item.id !== id),
      };
    });
  };

  const handleAddAdminItem = (list: keyof AdminData, name: string, email?: string) => {
    setAdminData((prev: AdminData) => {
      if (list === 'users') {
        return prev;
      }
      const newItem: AdminList = {
        id: `new-${Date.now()}`,
        name,
        email: email || '',
      };
      return {
        ...prev,
        [list]: [...(prev[list] as AdminList[]), newItem],
      };
    });
  };

  const handleUpdateUser = (id: string, name: string, email: string, password?: string) => {
      setAdminData(prev => ({
          ...prev,
          users: prev.users.map(user => {
              if (user.id === id) {
                  const updatedUser = { ...user, name, email };
                  if (password) {
                      (updatedUser as User).password = password;
                  }
                  return updatedUser;
              }
              return user;
          })
      }));
  };
  const handleDeleteUser = (id: string) => {
      setAdminData(prev => ({
          ...prev,
          users: prev.users.filter(user => user.id !== id)
      }));
  };
  const handleAddUser = (name: string, email: string, password?: string) => {
      const newUser: User = {
          id: `user-${Date.now()}`,
          name,
          email,
          password,
      };
      setAdminData(prev => ({
          ...prev,
          users: [...prev.users, newUser]
      }));
  };

  const handleImportUsers = (importedUsers: User[]) => {
    setAdminData((prev: AdminData) => {
        const usersMap = new Map(prev.users.map(u => [u.id, u]));
        let hasChanges = false;
        
        importedUsers.forEach((importedUser: User) => {
            if (importedUser.id === 'user-master') return;

            const existingUser = usersMap.get(importedUser.id);
            if (existingUser) {
                if (existingUser.name !== importedUser.name || existingUser.email !== importedUser.email) {
                    usersMap.set(importedUser.id, { ...existingUser, name: importedUser.name, email: importedUser.email });
                    hasChanges = true;
                }
            } else {
                usersMap.set(importedUser.id, {
                    ...importedUser,
                    password: 'changeme123'
                });
                hasChanges = true;
            }
        });

        if (!hasChanges) {
          return prev;
        }

        return { ...prev, users: Array.from(usersMap.values()) };
    });
    showInfoModal('Importació completada', 'La llista d\'usuaris s\'ha actualitzat correctament.');
  };

  // --- Data Management Handlers ---
  const getCurrentState = (): ApplicationData => ({
    commissions,
    commissionDetails,
    adminData,
  });

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
        showInfoModal('Exportació Correcta', 'La còpia de seguretat s\'ha descarregat correctament.');
    } catch (error) {
        console.error("Error exporting data:", error);
        showInfoModal('Error', 'No s\'ha pogut exportar les dades.');
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
            onConfirm: () => {
                loadState(data);
                showInfoModal('Importació Correcta', 'Les dades s\'han importat i carregat correctament.');
            }
        });
      } catch (error) {
        console.error("Error importing data:", error);
        showInfoModal('Error d\'Importació', 'El fitxer seleccionat no és vàlid o està malmès.');
      }
    };
    reader.onerror = () => {
        showInfoModal('Error de Lectura', 'No s\'ha pogut llegir el fitxer seleccionat.');
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
          showInfoModal('Èxit', `S'ha creat el punt de restauració: ${newBackup.description}`);
      } catch (error) {
          console.error("Error creating backup:", error);
          showInfoModal('Error', 'No s\'ha pogut crear el punt de restauració. És possible que l\'emmagatzematge local estigui ple.');
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
                  showInfoModal('Èxit', 'Les dades s\'han restaurat correctament.');
              } catch (error) {
                  console.error("Error restoring backup:", error);
                  showInfoModal('Error', 'No s\'ha pogut restaurar la còpia de seguretat.');
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
                  showInfoModal('Eliminat', 'El punt de restauració s\'ha eliminat correctament.');
              } catch (error) {
                  console.error("Error deleting backup:", error);
                  showInfoModal('Error', 'No s\'ha pogut eliminar la còpia de seguretat.');
              }
          }
      });
  };

  const filteredCommissions = useMemo(() => 
    commissions.filter(c => c.dataComissio.endsWith(selectedYear))
  , [commissions, selectedYear]);

  const filteredStatistics = useMemo<StatisticsData>(() => {
    const yearCommissions = commissions.filter(c => c.dataComissio.endsWith(selectedYear));
    const yearCommissionActaNumbers = yearCommissions.map(c => c.numActa);

    const yearCommissionDetails = commissionDetails.filter(d => 
        yearCommissionActaNumbers.includes(d.numActa) && d.sessio.endsWith(selectedYear)
    );

    const techCounts: { [key: string]: number } = {};
    yearCommissionDetails.forEach(detail => {
      detail.expedients.forEach(expedient => {
        const technic = expedient.tecnic || 'No assignat';
        techCounts[technic] = (techCounts[technic] || 0) + 1;
      });
    });

    const technicianDistribution = Object.keys(techCounts).map((key, index) => ({
      name: key,
      value: techCounts[key],
      fill: COLORS[index % COLORS.length],
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

    return {
      technicianDistribution,
      workloadOverTime,
      reportStatusDistribution: [],
      procedureTypeDistribution: [],
      monthlyWorkload: [],
    };
  }, [selectedYear, commissions, commissionDetails]);


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
            onShowInfoModal={showInfoModal}
            availableYears={availableYears}
            selectedYear={selectedYear}
            onYearChange={handleYearChange}
            onLogout={handleLogout}
          />
        );
    }
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} error={loginError} />;
  }

  return (
    <div className="min-h-screen text-gray-800 p-4 lg:p-8 app-container">
      <Modal 
        isOpen={modalState.isOpen}
        title={modalState.title}
        message={modalState.message}
        onClose={closeModal}
        onConfirm={modalState.onConfirm}
      />
      {renderView()}
      <footer className="text-center text-xs text-gray-500 pt-8 no-print">
        <span>03/10/2025 9:44:12</span>
      </footer>
    </div>
  );
};

export default App;
