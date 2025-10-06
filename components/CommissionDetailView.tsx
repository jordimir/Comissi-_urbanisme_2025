import React, { useState, useEffect, useMemo } from 'react';
import { CommissionDetail, Expedient, AdminData, SortConfig, SortDirection } from '../types';
import ExpedientTable from './ExpedientTable';
import EmailPreviewModal from './EmailPreviewModal';
import { EmailIcon } from './icons/Icons';

interface CommissionDetailViewProps {
  commissionDetail?: CommissionDetail;
  onBack: () => void;
  onSave: (commissionDetail: CommissionDetail) => void;
  adminData: AdminData;
}

const InfoCard: React.FC<{ label: string; value: string | number; className?: string }> = ({ label, value, className = '' }) => (
    <div className={`bg-gray-100 p-3 rounded-lg info-card ${className}`}>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="font-semibold text-gray-800">{value}</p>
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

const CommissionDetailView: React.FC<CommissionDetailViewProps> = ({ commissionDetail, onBack, onSave, adminData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedDetail, setEditedDetail] = useState<CommissionDetail | undefined>(commissionDetail);
  const [filters, setFilters] = useState(initialFilters);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'tecnic', direction: 'asc' });
  const [isEmailModalOpen, setEmailModalOpen] = useState(false);

  useEffect(() => {
    setEditedDetail(commissionDetail);
    if (commissionDetail && commissionDetail.expedients.length === 0) {
        setIsEditing(true);
    }
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
                
                if (sortConfig.direction === 'asc') {
                    return aValue.localeCompare(bValue);
                } else {
                    // FIX: Corrected descending sort logic.
                    return bValue.localeCompare(aValue);
                }
            });
        }
        return sortableItems;
    }, [filteredExpedients, sortConfig]);


  const formatDateToYYYYMMDD = (dateStr: string): string => {
    if (!dateStr) return '';
    const parts = dateStr.split('/');
    if (parts.length !== 3) return '';
    const [day, month, year] = parts;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  };

  const formatDateToDDMMYYYY = (dateStr: string): string => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return '';
    const [year, month, day] = parts;
    return `${day}/${month}/${year}`;
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

  const handleEditToggle = () => {
    if (isEditing) {
        setEditedDetail(commissionDetail);
    }
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    if (editedDetail) {
      const finalDetail = {
        ...editedDetail,
        expedients: editedDetail.expedients.map(({ isNew, ...rest }) => rest),
        expedientsCount: editedDetail.expedients.length,
      };
      onSave(finalDetail);
      setIsEditing(false);
    }
  };

   const handleHeaderInputChange = (field: keyof CommissionDetail, value: string | number) => {
    setEditedDetail(prev => prev ? { ...prev, [field]: value } : undefined);
  };

  const handleAddExpedient = () => {
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
    setEditedDetail(prev => prev ? { ...prev, expedients: [...prev.expedients, newExpedient] } : undefined);
  };

  const handleDeleteExpedient = (id: string) => {
    setEditedDetail(prev => prev ? { ...prev, expedients: prev.expedients.filter(exp => exp.id !== id) } : undefined);
  };

  const handleExpedientChange = (id: string, field: keyof Expedient, value: string) => {
    setEditedDetail(prev => prev ? {
      ...prev,
      expedients: prev.expedients.map(exp => exp.id === id ? { ...exp, [field]: value } : exp)
    } : undefined);
  };

  const { sessio, dataActual, hora, estat, mitja, numActa } = editedDetail;
  const inputClasses = "w-full p-1 border rounded font-semibold text-gray-800 bg-white border-gray-300 focus:outline-none focus-visible:ring-1 focus-visible:ring-indigo-400";
  const selectClasses = `${inputClasses} appearance-none`;
  const filterInputClasses = "w-full p-2 border rounded-md focus:outline-none focus-visible:ring-1 focus-visible:ring-indigo-400";

  return (
    <>
    <EmailPreviewModal 
        isOpen={isEmailModalOpen}
        onClose={() => setEmailModalOpen(false)}
        commissionDetail={editedDetail}
    />
    <div className="bg-white p-6 rounded-2xl shadow-xl space-y-6 animate-fade-in printable-area">
        <div className="flex justify-between items-start commission-header-print">
            <div>
                 <h1 className="text-3xl font-bold text-gray-800">Comissió Informativa d'Urbanisme</h1>
                 <p className="text-gray-500">Ajuntament de Tossa de Mar</p>
            </div>
            <div className="flex items-center space-x-2 no-print">
                <button onClick={() => setEmailModalOpen(true)} className="bg-teal-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-teal-600 transition-colors flex items-center space-x-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-teal-500">
                    <EmailIcon />
                    <span>Preparar per Email</span>
                </button>
                {isEditing ? (
                    <>
                        <button onClick={handleSave} className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500">Guardar</button>
                        <button onClick={handleEditToggle} className="bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-400">Cancel·lar</button>
                    </>
                ) : (
                    <button onClick={handleEditToggle} className="bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500">Modificar</button>
                )}
                <button
                    onClick={onBack}
                    className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-400"
                >
                    &larr; Tornar
                </button>
            </div>
        </div>
      
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 text-sm">
             <div className="bg-gray-100 p-3 rounded-lg info-card">
                <p className="text-xs text-gray-500">Sessió</p>
                {isEditing ? (
                    <input
                        type="date"
                        value={formatDateToYYYYMMDD(sessio)}
                        onChange={(e) => handleHeaderInputChange('sessio', formatDateToDDMMYYYY(e.target.value))}
                        className={inputClasses}
                    />
                ) : (
                    <p className="font-semibold text-gray-800">{sessio}</p>
                )}
            </div>

            <InfoCard label="Data Actual" value={dataActual} />

            <div className="bg-gray-100 p-3 rounded-lg info-card">
                <p className="text-xs text-gray-500">Hora</p>
                {isEditing ? (
                    <input
                        type="time"
                        step="1"
                        value={hora}
                        onChange={(e) => handleHeaderInputChange('hora', e.target.value)}
                        className={inputClasses}
                    />
                ) : (
                    <p className="font-semibold text-gray-800">{hora}</p>
                )}
            </div>

            <InfoCard label="Estat C.U." value={estat} className={estat === 'Finalitzada' ? 'bg-red-100' : 'bg-green-100'} />

            <div className="bg-gray-100 p-3 rounded-lg info-card">
                <p className="text-xs text-gray-500">Mitjà</p>
                {isEditing ? (
                    <select
                        value={mitja}
                        onChange={(e) => handleHeaderInputChange('mitja', e.target.value)}
                        className={selectClasses}
                    >
                        <option>Via telemàtica</option>
                        <option>Presencial</option>
                        <option>Mixta</option>
                    </select>
                ) : (
                    <p className="font-semibold text-gray-800">{mitja}</p>
                )}
            </div>
            <InfoCard label="Núm" value={numActa} />
            <InfoCard label="Expedients" value={filteredExpedients.length} />
        </div>
        
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-4 no-print">
            <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-700">Filtres</h3>
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
        isEditing={isEditing}
        onDelete={handleDeleteExpedient}
        onChange={handleExpedientChange}
        procediments={adminData.procediments}
        sentitInformes={adminData.sentitInformes}
        tecnics={adminData.tecnics}
        departaments={adminData.departaments}
        sortConfig={sortConfig}
        onSort={handleSort}
      />

      {isEditing && (
          <div className="pt-4 no-print">
              <button onClick={handleAddExpedient} className="bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500">
                  Afegir Registre
              </button>
          </div>
      )}
    </div>
    </>
  );
};

export default CommissionDetailView;