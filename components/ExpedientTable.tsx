
import React, { useState, useMemo } from 'react';
import { Expedient, AdminData, SortConfig, SortDirection } from '../types';
import { SortUpIcon, SortDownIcon, SortIcon, TrashIcon } from './icons/Icons';

interface ExpedientTableProps {
    expedients: Expedient[];
    onExpedientsChange: (expedients: Expedient[]) => void;
    adminData: AdminData;
    canEdit: boolean;
}

const ExpedientTable: React.FC<ExpedientTableProps> = ({ expedients, onExpedientsChange, adminData, canEdit }) => {
    const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

    const sortedExpedients = useMemo(() => {
        let sortableItems = [...expedients];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                const valA = a[sortConfig.key] || '';
                const valB = b[sortConfig.key] || '';
                if (valA < valB) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (valA > valB) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [expedients, sortConfig]);

    const requestSort = (key: keyof Expedient) => {
        let direction: SortDirection = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getSortIcon = (key: keyof Expedient) => {
        if (!sortConfig || sortConfig.key !== key) {
            return <SortIcon />;
        }
        return sortConfig.direction === 'asc' ? <SortUpIcon /> : <SortDownIcon />;
    };

    const handleFieldChange = (index: number, field: keyof Expedient, value: any) => {
        const updatedExpedients = expedients.map((exp, i) =>
            i === index ? { ...exp, [field]: value } : exp
        );
        onExpedientsChange(updatedExpedients);
    };

    const handleAddExpedient = () => {
        const newExpedient: Expedient = {
            id: `NOU-${Date.now()}`,
            peticionari: '',
            procediment: adminData.procediments[0]?.name || '',
            descripcio: '',
            indret: '',
            sentitInforme: adminData.sentitInformes[0]?.name || '',
            departament: adminData.departaments[0]?.name || '',
            tecnic: adminData.tecnics[0]?.name || '',
            isNew: true,
        };
        onExpedientsChange([...expedients, newExpedient]);
    };

    const handleDeleteExpedient = (index: number) => {
        if (window.confirm("Segur que vols eliminar aquest expedient?")) {
            const updatedExpedients = expedients.filter((_, i) => i !== index);
            onExpedientsChange(updatedExpedients);
        }
    };
    
    const renderCell = (exp: Expedient, index: number, field: keyof Expedient) => {
        if (!canEdit) {
            return <td className="px-3 py-2 whitespace-nowrap text-gray-700 dark:text-gray-300">{exp[field]}</td>
        }
        
        const commonInputClass = "w-full p-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500";
        
        switch(field) {
            case 'procediment':
                return (
                    <td className="px-1 py-1">
                        <select value={exp.procediment} onChange={(e) => handleFieldChange(index, field, e.target.value)} className={commonInputClass}>
                            <option value="">Selecciona...</option>
                            {adminData.procediments.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                        </select>
                    </td>
                );
            case 'sentitInforme':
                return (
                    <td className="px-1 py-1">
                        <select value={exp.sentitInforme} onChange={(e) => handleFieldChange(index, field, e.target.value)} className={commonInputClass}>
                             <option value="">Selecciona...</option>
                            {adminData.sentitInformes.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                        </select>
                    </td>
                );
            case 'departament':
                 return (
                    <td className="px-1 py-1">
                        <select value={exp.departament} onChange={(e) => handleFieldChange(index, field, e.target.value)} className={commonInputClass}>
                            <option value="">Selecciona...</option>
                            {adminData.departaments.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                        </select>
                    </td>
                );
            case 'tecnic':
                 return (
                    <td className="px-1 py-1">
                        <select value={exp.tecnic} onChange={(e) => handleFieldChange(index, field, e.target.value)} className={commonInputClass}>
                            <option value="">Selecciona...</option>
                            {adminData.tecnics.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
                        </select>
                    </td>
                );
            default:
                return (
                    <td className="px-1 py-1">
                        <input type="text" value={exp[field as keyof Omit<Expedient, 'isNew'>] as string} onChange={(e) => handleFieldChange(index, field, e.target.value)} className={commonInputClass} />
                    </td>
                );
        }
    }


    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
            <div className="flex justify-between items-center mb-4">
                 <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Llista d'Expedients</h2>
                 {canEdit && (
                     <button
                        onClick={handleAddExpedient}
                        className="bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-600 transition-colors"
                     >
                        + Afegir expedient
                     </button>
                 )}
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            {[
                                { key: 'id', label: 'Nº Expedient' },
                                { key: 'peticionari', label: 'Peticionari/a' },
                                { key: 'procediment', label: 'Procediment' },
                                { key: 'descripcio', label: 'Descripció' },
                                { key: 'indret', label: 'Indret' },
                                { key: 'sentitInforme', label: 'Sentit Informe' },
                                { key: 'departament', label: 'Departament' },
                                { key: 'tecnic', label: 'Tècnic/a' },
                            ].map(({ key, label }) => (
                                <th key={key} scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    <button onClick={() => requestSort(key as keyof Expedient)} className="group inline-flex items-center">
                                        {label}
                                        {getSortIcon(key as keyof Expedient)}
                                    </button>
                                </th>
                            ))}
                            {canEdit && <th scope="col" className="relative px-3 py-3"><span className="sr-only">Eliminar</span></th>}
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {sortedExpedients.map((exp, index) => (
                            <tr key={exp.id} className={`${exp.isNew ? 'bg-yellow-50 dark:bg-yellow-900/50' : ''} hover:bg-gray-50 dark:hover:bg-gray-700/50`}>
                                {renderCell(exp, index, 'id')}
                                {renderCell(exp, index, 'peticionari')}
                                {renderCell(exp, index, 'procediment')}
                                {renderCell(exp, index, 'descripcio')}
                                {renderCell(exp, index, 'indret')}
                                {renderCell(exp, index, 'sentitInforme')}
                                {renderCell(exp, index, 'departament')}
                                {renderCell(exp, index, 'tecnic')}
                                {canEdit && (
                                    <td className="px-3 py-2 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => handleDeleteExpedient(index)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50">
                                            <TrashIcon />
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
             {expedients.length === 0 && (
                <p className="text-center py-8 text-gray-500">No hi ha expedients en aquesta comissió.</p>
            )}
        </div>
    );
};

export default ExpedientTable;
