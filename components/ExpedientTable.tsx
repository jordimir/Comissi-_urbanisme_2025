

import React from 'react';
import { Expedient, ReportStatus, AdminData, SortConfig } from '../types';
import { SortUpIcon, SortDownIcon, SortIcon, PencilIcon, DuplicateIcon, TrashIcon, CheckIcon, XIcon } from './icons/Icons';


const ReportStatusBadge: React.FC<{ status: ReportStatus | string }> = ({ status }) => {
    let colorClasses = 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    switch (status) {
        case 'Favorable':
            colorClasses = 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
            break;
        case 'Desfavorable':
            colorClasses = 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
            break;
        case 'Favorable condicionat (mixte)':
            colorClasses = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
            break;
        case 'Posar en consideració':
             colorClasses = 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300';
             break;
        case 'Caducat/Arxivat':
            colorClasses = 'bg-gray-400 text-white dark:bg-gray-600';
            break;
        case 'Requeriment':
            colorClasses = 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300';
            break;
    }
    return (
        <span className={`px-3 py-1 text-xs font-medium rounded-full ${colorClasses}`}>
            {status}
        </span>
    );
};

interface ExpedientTableProps {
    expedients: Expedient[];
    adminData: AdminData;
    sortConfig: SortConfig | null;
    onSort: (key: keyof Expedient) => void;
    editingExpedientId: string | null;
    editedExpedientData: Expedient | null;
    onStartEdit: (expedient: Expedient) => void;
    onCancelEdit: () => void;
    onSaveEdit: (id: string) => void;
    onEditChange: (field: keyof Expedient, value: string) => void;
    onDelete: (id: string) => void;
    onDuplicate: (id: string) => void;
    selectedIds: string[];
    onSelectionChange: (ids: string[]) => void;
}

const ExpedientTable: React.FC<ExpedientTableProps> = (props) => {
    const { 
        expedients, adminData, sortConfig, onSort, editingExpedientId, editedExpedientData, 
        onStartEdit, onCancelEdit, onSaveEdit, onEditChange, onDelete, onDuplicate,
        selectedIds, onSelectionChange
    } = props;
    
    const inputClass = "w-full p-2 border rounded bg-yellow-50 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-400";
    
    const renderSortIcon = (key: keyof Expedient) => {
        if (!sortConfig || sortConfig.key !== key) {
            return <SortIcon />;
        }
        return sortConfig.direction === 'asc' ? <SortUpIcon /> : <SortDownIcon />;
    };

    const headerClass = "px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/80 group transition-colors";

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            onSelectionChange(expedients.map(exp => exp.id));
        } else {
            onSelectionChange([]);
        }
    };
    
    const handleSelectRow = (id: string, isSelected: boolean) => {
        if (isSelected) {
            onSelectionChange([...selectedIds, id]);
        } else {
            onSelectionChange(selectedIds.filter(selectedId => selectedId !== id));
        }
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white dark:bg-gray-800 border-collapse">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                    <tr>
                        <th className="p-4">
                            <input 
                                type="checkbox" 
                                className="h-5 w-5 rounded border-gray-300 dark:border-gray-500 text-indigo-600 focus:ring-indigo-500"
                                checked={selectedIds.length === expedients.length && expedients.length > 0}
                                onChange={handleSelectAll}
                                aria-label="Seleccionar tots els expedients"
                            />
                        </th>
                        <th className={headerClass} onClick={() => onSort('id')}>Núm. Expedient {renderSortIcon('id')}</th>
                        <th className={headerClass} onClick={() => onSort('peticionari')}>Peticionàri/a {renderSortIcon('peticionari')}</th>
                        <th className={headerClass} onClick={() => onSort('procediment')}>Procediment {renderSortIcon('procediment')}</th>
                        <th className={headerClass} onClick={() => onSort('descripcio')}>Descripció {renderSortIcon('descripcio')}</th>
                        <th className={headerClass} onClick={() => onSort('indret')}>Indret/Lloc/Situació {renderSortIcon('indret')}</th>
                        <th className={headerClass} onClick={() => onSort('sentitInforme')}>Sentit informe {renderSortIcon('sentitInforme')}</th>
                        <th className={headerClass} onClick={() => onSort('departament')}>Dpt. / Àrea {renderSortIcon('departament')}</th>
                        <th className={headerClass} onClick={() => onSort('tecnic')}>Tècnic que informa {renderSortIcon('tecnic')}</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Accions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {expedients.map((expedient) => {
                        const isEditing = editingExpedientId === expedient.id;
                        const data = isEditing ? editedExpedientData : expedient;

                        if (!data) return null;

                        return (
                        <tr key={expedient.id} className={`${isEditing ? 'bg-yellow-50 dark:bg-yellow-900/20' : ''} hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors`}>
                           <td className="p-4">
                                <input 
                                    type="checkbox" 
                                    className="h-5 w-5 rounded border-gray-300 dark:border-gray-500 text-indigo-600 focus:ring-indigo-500"
                                    checked={selectedIds.includes(expedient.id)}
                                    onChange={(e) => handleSelectRow(expedient.id, e.target.checked)}
                                    aria-label={`Seleccionar expedient ${expedient.id}`}
                                />
                            </td>
                           {isEditing ? (
                                <>
                                    <td className="px-2 py-3 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap"><input type="text" value={data.id.startsWith('new-') ? '' : data.id} onChange={e => onEditChange('id', e.target.value)} className={inputClass} placeholder="Ex: 1234/2025" /></td>
                                    <td className="px-2 py-3 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap"><input type="text" value={data.peticionari} onChange={e => onEditChange('peticionari', e.target.value)} className={inputClass} /></td>
                                    <td className="px-2 py-3 text-sm text-gray-700 dark:text-gray-300">
                                         <select value={data.procediment} onChange={e => onEditChange('procediment', e.target.value)} className={inputClass}>
                                            <option value="">Selecciona...</option>
                                            {adminData.procediments.map(proc => <option key={proc.id} value={proc.name}>{proc.name}</option>)}
                                        </select>
                                    </td>
                                    <td className="px-2 py-3 text-sm text-gray-700 dark:text-gray-300"><input type="text" value={data.descripcio} onChange={e => onEditChange('descripcio', e.target.value)} className={inputClass} /></td>
                                    <td className="px-2 py-3 text-sm text-gray-700 dark:text-gray-300"><input type="text" value={data.indret} onChange={e => onEditChange('indret', e.target.value)} className={inputClass} /></td>
                                    <td className="px-2 py-3 text-sm text-gray-700 dark:text-gray-300">
                                        <select value={data.sentitInforme} onChange={e => onEditChange('sentitInforme', e.target.value)} className={inputClass}>
                                            <option value="">Selecciona...</option>
                                            {adminData.sentitInformes.map(status => <option key={status.id} value={status.name}>{status.name}</option>)}
                                        </select>
                                    </td>
                                    <td className="px-2 py-3 text-sm text-gray-700 dark:text-gray-300">
                                        <select value={data.departament} onChange={e => onEditChange('departament', e.target.value)} className={inputClass}>
                                            <option value="">Selecciona...</option>
                                            {adminData.departaments.map(dept => <option key={dept.id} value={dept.name}>{dept.name}</option>)}
                                        </select>
                                    </td>
                                    <td className="px-2 py-3 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                                        <select value={data.tecnic} onChange={e => onEditChange('tecnic', e.target.value)} className={inputClass}>
                                             <option value="">Selecciona...</option>
                                            {adminData.tecnics.map(tec => <option key={tec.id} value={tec.name}>{tec.name}</option>)}
                                        </select>
                                    </td>
                                </>
                           ) : (
                                <>
                                    <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">{expedient.id}</td>
                                    <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">{expedient.peticionari}</td>
                                    <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300">{expedient.procediment}</td>
                                    <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300">{expedient.descripcio}</td>
                                    <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300">{expedient.indret}</td>
                                    <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300"><ReportStatusBadge status={expedient.sentitInforme} /></td>
                                    <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300">{expedient.departament}</td>
                                    <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">{expedient.tecnic}</td>
                                </>
                           )}
                           <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                                <div className="flex items-center space-x-1">
                                {isEditing ? (
                                    <>
                                        <button onClick={() => onSaveEdit(expedient.id)} className="p-2 text-green-600 hover:text-green-800 rounded-full hover:bg-green-100 dark:hover:bg-green-900/50" title="Guardar"><CheckIcon/></button>
                                        <button onClick={onCancelEdit} className="p-2 text-red-600 hover:text-red-800 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50" title="Cancel·lar"><XIcon/></button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => onStartEdit(expedient)} title="Editar" className="p-2 text-gray-500 hover:text-indigo-600 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"><PencilIcon/></button>
                                        <button onClick={() => onDuplicate(expedient.id)} title="Duplicar" className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"><DuplicateIcon/></button>
                                        <button onClick={() => onDelete(expedient.id)} title="Eliminar" className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"><TrashIcon/></button>
                                    </>
                                )}
                                </div>
                            </td>
                        </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default ExpedientTable;
