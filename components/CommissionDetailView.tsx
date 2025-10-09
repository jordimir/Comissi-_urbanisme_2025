
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { CommissionDetail, Expedient, AdminData, SortConfig, SortDirection, ReportStatus, User } from './types';
import ExpedientTable from './ExpedientTable';
import EmailPreviewModal from './EmailPreviewModal';
import { EmailIcon, TrashIcon } from './icons/Icons';

interface CommissionDetailViewProps {
  commissionDetail?: CommissionDetail;
  onBack: () => void;
  onSave: (commissionDetail: CommissionDetail) => void;
  adminData: AdminData;
  showToast: (message: string, type?: 'success' | 'error', onUndo?: () => void) => void;
  currentUser: User;
}

const InfoCard: React.FC<{ label: string; value: string | number; className?: string }> = ({ label, value, className = '' }) => (
    <div className={`bg-gray-100 dark:bg-gray-800 p-3 rounded-lg info-card ${className}`}>
        <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
        <p className="font-semibold text-gray-800 dark:text-gray-200">{value}</p>
    </div>
);

const initialFilters = {
    peticionari: '',
    procediment: '',
    descripcio: '',
    indret: '',
    sentitInforme: '',
    departament: '',
    tecnic: '',
};

const CommissionDetailView: React.FC<CommissionDetailViewProps> = ({ commissionDetail, onBack, onSave, adminData, showToast, currentUser }) => {
  const [editedDetail, setEditedDetail] = useState<CommissionDetail | undefined>(commissionDetail);
  const [filters, setFilters] = useState(initialFilters);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'tecnic', direction: 'asc' });
  const [isEmailModalOpen, setEmailModalOpen] = useState(false);
  
  const [editingExpedientId, setEditingExpedientId] = useState<string | null>(null);
  const [editedExpedientData, setEditedExpedientData] = useState<Expedient | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [lastDeleted, setLastDeleted] = useState<{ expedient: Expedient, index: number } | null>(null);

  const canEdit = useMemo(() => currentUser.role === 'admin' || currentUser.role === 'editor', [currentUser.role]);


  useEffect(() => {
    setEditedDetail(commissionDetail);
    setEditingExpedientId(null);
    setSelectedIds([]);
  }, [commissionDetail]);

  const handleFilterChange = (field: keyof typeof filters, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const clearFilters = () => {
    setFilters(initialFilters);
  };

  const filteredExpedients = useMemo(() => {
    if (!editedDetail) return [];
    return editedDetail.expedients.filter(exp => {
      return (
        exp.peticionari.toLowerCase().includes(filters.peticionari.toLowerCase()) &&
        (filters.procediment === '' || exp.procediment === filters.procediment) &&
        exp.descripcio.toLowerCase().includes(filters.descripcio.toLowerCase()) &&
        exp.indret.toLowerCase().includes(filters.indret.toLowerCase()) &&
        (filters.sentitInforme === '' || exp.sentitInforme === filters.sentitInforme) &&
        (filters.departament === '' || exp.departament === filters.departament) &&
        (filters.tecnic === '' || exp.tecnic === filters.tecnic)
      );
    });
  }, [editedDetail, filters]);

    const handleSort = (key: keyof Expedient) => {
        let direction: SortDirection = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedExpedients = useMemo(() => {
        const sortableItems = [...filteredExpedients];
        if (sortConfig) {
            sortableItems.sort((a, b) => {
                const aValue = String(a[sortConfig.key] ?? '').toLowerCase();
                const bValue = String(b[sortConfig.key] ?? '').toLowerCase();
                if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return sortableItems;
    }, [filteredExpedients, sortConfig]);

  const handleSaveAll = () => {
    if (!canEdit) return;
    if (editedDetail) {
      if (editingExpedientId) {
         handleSaveEdit(editingExpedientId);
      }
      const finalDetail = {
        ...editedDetail,
        expedients: editedDetail.expedients.map(({ isNew, ...rest }) => rest),
        expedientsCount: editedDetail.expedients.length,
      };
      onSave(finalDetail);
    }
  };
  
  const handleAddExpedient = () => {
    if (!canEdit) return;
    const newExpedient: Expedient = {
      id: `new-${Date.now()}`,
      peticionari: '',
      procediment: adminData.procediments[0]?.name || '',
      descripcio: '',
      indret: '',
      sentitInforme: adminData.sentitInformes[0]?.name || 'Favorable',
      departament: adminData.departaments[0]?.name || 'Urbanisme',
      tecnic: adminData.tecnics[0]?.name || '',
      isNew: true,
    };
    setEditedDetail(prev => {
        if (!prev) return undefined;
        const newExpedients = [...prev.expedients, newExpedient];
        return { ...prev, expedients: newExpedients };
    });
    handleStartEdit(newExpedient);
  };

  const handleStartEdit = (expedient: Expedient) => {
    if (!canEdit) return;
    setEditingExpedientId(expedient.id);
    setEditedExpedientData(expedient);
  };

  const handleCancelEdit = () => {
    if (editedExpedientData?.isNew) {
        setEditedDetail(prev => prev ? { ...prev, expedients: prev.expedients.filter(e => e.id !== editedExpedientData.id) } : undefined);
    }
    setEditingExpedientId(null);
    setEditedExpedientData(null);
  };
  
  const handleSaveEdit = (id: string) => {
    if (editedExpedientData) {
        setEditedDetail(prev => prev ? { ...prev, expedients: prev.expedients.map(e => e.id === id ? { ...editedExpedientData, isNew: false } : e) } : undefined);
    }
    setEditingExpedientId(null);
    setEditedExpedientData(null);
  };

  const handleEditChange = (field: keyof Expedient, value: string) => {
    setEditedExpedientData(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handleDuplicateExpedient = (id: string) => {
    if (!canEdit) return;
    const expedientToDuplicate = editedDetail?.expedients.find(e => e.id === id);
    if(expedientToDuplicate && editedDetail) {
        const newExpedient = { ...expedientToDuplicate, id: `new-${Date.now()}`, isNew: true };
        setEditedDetail(prev => prev ? { ...prev, expedients: [...prev.expedients, newExpedient] } : undefined);
        showToast('Expedient duplicat.');
    }
  };

  const handleDeleteExpedient = (id: string) => {
    if (!canEdit) return;
    const index = editedDetail?.expedients.findIndex(e => e.id === id);
    if (editedDetail && index !== undefined && index > -1) {
        const expedientToDelete = editedDetail.expedients[index];
        setLastDeleted({ expedient: expedientToDelete, index });
        setEditedDetail(prev => prev ? { ...prev, expedients: prev.expedients.filter(e => e.id !== id) } : undefined);
        showToast('Expedient eliminat', 'success', handleUndoDelete);
    }
  };

  const handleUndoDelete = () => {
    if (lastDeleted) {
        setEditedDetail(prev => {
            if (!prev) return undefined;
            const newExpedients = [...prev.expedients];
            newExpedients.splice(lastDeleted.index, 0, lastDeleted.expedient);
            return { ...prev, expedients: newExpedients };
        });
        showToast('Eliminació desfeta.');
        setLastDeleted(null);
    }
  };

  const handleBulkDelete = () => {
    if(!canEdit) return;
    if(window.confirm(`Estàs segur que vols eliminar ${selectedIds.length} expedients?`)) {
      setEditedDetail(prev => prev ? { ...prev, expedients: prev.expedients.filter(e => !selectedIds.includes(e.id)) } : undefined);
      showToast(`${selectedIds.length} expedients eliminats.`);
      setSelectedIds([]);
    }
  };

  const handleBulkChange = (field: keyof Expedient, value: string) => {
    if (!canEdit || !value) return;
    setEditedDetail(prev => prev ? {
        ...prev,
        expedients: prev.expedients.map(e => selectedIds.includes(e.id) ? { ...e, [field]: value } : e)
    } : undefined);
    showToast(`${selectedIds.length} expedients actualitzats.`);
    setSelectedIds([]);
  };

  if (!editedDetail) {
    return (
      <div className="text-center p-10 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
        <p className="text-gray-600 mb-6">No s'han trobat detalls per a aquesta comissió.</p>
        <button
          onClick={onBack}
          className="bg-indigo-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-indigo-600 transition-colors no-print"
        >
          Tornar al dashboard
        </button>
      </div>
    );
  }

  const { sessio, dataActual, hora, estat, mitja, numActa } = editedDetail;
  const filterInputClasses = "w-full p-2 border rounded-md focus:outline-none focus-visible:ring-1 focus-visible:ring-indigo-400 dark:bg-gray-700 dark:border-gray-600";

  return (
    <>
    <EmailPreviewModal 
        isOpen={isEmailModalOpen}
        onClose={() => setEmailModalOpen(false)}
        commissionDetail={editedDetail}
    />
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl space-y-6 animate-fade-in printable-area">
        <div className="flex justify-between items-start commission-header-print">
            <div>
                 <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Comissió Informativa d'Urbanisme</h1>
                 <p className="text-gray-500 dark:text-gray-400">Ajuntament de Tossa de Mar</p>
            </div>
            <div className="flex items-center space-x-2 no-print">
                <button onClick={() => setEmailModalOpen(true)} className="bg-teal-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-teal-600 transition-colors flex items-center space-x-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-teal-500">
                    <EmailIcon />
                    <span>Preparar per Email</span>
                </button>
                {canEdit && <button onClick={handleSaveAll} className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500">Guardar Canvis</button>}
                <button
                    onClick={onBack}
                    className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-400"
                >
                    &larr; Tornar
                </button>
            </div>
        </div>
      
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 text-sm">
            <InfoCard label="Sessió" value={sessio} />
            <InfoCard label="Data Actual" value={dataActual} />
            <InfoCard label="Hora" value={hora} />
            <InfoCard label="Estat C.U." value={estat} className={estat === 'Finalitzada' ? 'bg-red-100 dark:bg-red-900/50' : 'bg-green-100 dark:bg-green-900/50'} />
            <InfoCard label="Mitjà" value={mitja} />
            <InfoCard label="Núm" value={numActa} />
            <InfoCard label="Expedients" value={editedDetail.expedients.length} />
        </div>
        
        {canEdit && selectedIds.length > 0 && (
            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg flex items-center flex-wrap gap-4 animate-fade-in no-print">
                <span className="font-semibold text-indigo-800 dark:text-indigo-200">{selectedIds.length} seleccionats</span>
                <select onChange={(e) => handleBulkChange('tecnic', e.target.value)} className="p-2 border rounded-md shadow-sm text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-indigo-500 focus:border-indigo-500" defaultValue="">
                    <option value="" disabled>Assignar Tècnic...</option>
                    {adminData.tecnics.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
                </select>
                <select onChange={(e) => handleBulkChange('sentitInforme', e.target.value)} className="p-2 border rounded-md shadow-sm text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-indigo-500 focus:border-indigo-500" defaultValue="">
                    <option value="" disabled>Canviar Sentit...</option>
                    {adminData.sentitInformes.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                </select>
                <button onClick={handleBulkDelete} className="p-2 text-red-600 hover:text-red-800 flex items-center gap-1 font-semibold ml-auto"><TrashIcon/> Eliminar Selecció</button>
            </div>
        )}
        
        <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border dark:border-gray-700 space-y-4 no-print">
            <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-700 dark:text-gray-300">Filtres</h3>
                <button onClick={clearFilters} className="text-sm text-red-600 hover:underline font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded">Netejar Filtres</button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <input type="text" placeholder="Filtrar per Peticionari/a..." value={filters.peticionari} onChange={e => handleFilterChange('peticionari', e.target.value)} className={filterInputClasses} />
                <select value={filters.procediment} onChange={e => handleFilterChange('procediment', e.target.value)} className={filterInputClasses}>
                    <option value="">Tots els Procediments</option>
                    {adminData.procediments.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                </select>
                <input type="text" placeholder="Filtrar per Descripció..." value={filters.descripcio} onChange={e => handleFilterChange('descripcio', e.target.value)} className={filterInputClasses} />
                <input type="text" placeholder="Filtrar per Indret..." value={filters.indret} onChange={e => handleFilterChange('indret', e.target.value)} className={filterInputClasses} />
                <select value={filters.sentitInforme} onChange={e => handleFilterChange('sentitInforme', e.target.value)} className={filterInputClasses}>
                    <option value="">Tots els Sentits</option>
                    {adminData.sentitInformes.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                </select>
                <select value={filters.departament} onChange={e => handleFilterChange('departament', e.target.value)} className={filterInputClasses}>
                    <option value="">Tots els Departaments</option>
                    {adminData.departaments.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                </select>
                <select value={filters.tecnic} onChange={e => handleFilterChange('tecnic', e.target.value)} className={filterInputClasses}>
                    <option value="">Tots els Tècnics</option>
                    {adminData.tecnics.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
                </select>
            </div>
        </div>

      <ExpedientTable 
        expedients={sortedExpedients}
        adminData={adminData}
        sortConfig={sortConfig}
        onSort={handleSort}
        editingExpedientId={editingExpedientId}
        editedExpedientData={editedExpedientData}
        onStartEdit={handleStartEdit}
        onCancelEdit={handleCancelEdit}
        onSaveEdit={handleSaveEdit}
        onEditChange={handleEditChange}
        onDelete={handleDeleteExpedient}
        onDuplicate={handleDuplicateExpedient}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        canEdit={canEdit}
      />
    {canEdit && (
        <div className="pt-4 no-print">
            <button onClick={handleAddExpedient} className="bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500">
                + Afegir Expedient
            </button>
        </div>
    )}
    </div>
    </>
  );
};

export default CommissionDetailView;