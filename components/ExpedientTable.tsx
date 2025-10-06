

import React from 'react';
import { Expedient, ReportStatus, AdminList, SortConfig } from '../types';
import { SortUpIcon, SortDownIcon, SortIcon } from './icons/Icons';


const ReportStatusBadge: React.FC<{ status: ReportStatus | string }> = ({ status }) => {
    let colorClasses = 'bg-gray-200 text-gray-800';
    switch (status) {
        case 'Favorable':
            colorClasses = 'bg-green-100 text-green-800';
            break;
        case 'Desfavorable':
            colorClasses = 'bg-red-100 text-red-800';
            break;
        case 'Favorable condicionat (mixte)':
            colorClasses = 'bg-yellow-100 text-yellow-800';
            break;
        case 'Posar en consideració':
             colorClasses = 'bg-purple-100 text-purple-800';
             break;
        case 'Caducat/Arxivat':
            colorClasses = 'bg-gray-400 text-white';
            break;
        case 'Requeriment':
            colorClasses = 'bg-orange-100 text-orange-800';
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
    isEditing: boolean;
    onChange: (id: string, field: keyof Expedient, value: string) => void;
    onDelete: (id: string) => void;
    procediments: AdminList[];
    sentitInformes: AdminList[];
    tecnics: AdminList[];
    departaments: AdminList[];
    sortConfig: SortConfig | null;
    onSort: (key: keyof Expedient) => void;
}

const ExpedientTable: React.FC<ExpedientTableProps> = ({ expedients, isEditing, onChange, onDelete, procediments, sentitInformes, tecnics, departaments, sortConfig, onSort }) => {
    const inputClass = "w-full p-1 border rounded bg-yellow-50 focus:outline-none focus:ring-2 focus:ring-indigo-400";
    
    const renderSortIcon = (key: keyof Expedient) => {
        if (!sortConfig || sortConfig.key !== key) {
            return <SortIcon />;
        }
        return sortConfig.direction === 'asc' ? <SortUpIcon /> : <SortDownIcon />;
    };

    const headerClass = (key: keyof Expedient) => isEditing 
        ? "px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
        : "px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 group";


    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className={headerClass('id')} onClick={() => !isEditing && onSort('id')}>Núm. Expedient {!isEditing && renderSortIcon('id')}</th>
                        <th className={headerClass('peticionari')} onClick={() => !isEditing && onSort('peticionari')}>Peticionàri/a {!isEditing && renderSortIcon('peticionari')}</th>
                        <th className={headerClass('procediment')} onClick={() => !isEditing && onSort('procediment')}>Procediment {!isEditing && renderSortIcon('procediment')}</th>
                        <th className={headerClass('descripcio')} onClick={() => !isEditing && onSort('descripcio')}>Descripció {!isEditing && renderSortIcon('descripcio')}</th>
                        <th className={headerClass('indret')} onClick={() => !isEditing && onSort('indret')}>Indret/Lloc/Situació {!isEditing && renderSortIcon('indret')}</th>
                        <th className={headerClass('sentitInforme')} onClick={() => !isEditing && onSort('sentitInforme')}>Sentit informe {!isEditing && renderSortIcon('sentitInforme')}</th>
                        <th className={headerClass('departament')} onClick={() => !isEditing && onSort('departament')}>Dpt. / Àrea {!isEditing && renderSortIcon('departament')}</th>
                        <th className={headerClass('tecnic')} onClick={() => !isEditing && onSort('tecnic')}>Tècnic que informa {!isEditing && renderSortIcon('tecnic')}</th>
                        {isEditing && <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Accions</th>}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {expedients.map((expedient) => (
                        <tr key={expedient.id} className={`${expedient.isNew ? 'bg-yellow-50' : ''} hover:bg-gray-50`}>
                           {isEditing ? (
                                <>
                                    <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap"><input type="text" value={expedient.id.startsWith('new-') ? '' : expedient.id} onChange={e => onChange(expedient.id, 'id', e.target.value)} className={inputClass} placeholder="Ex: 1234/2025" /></td>
                                    <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap"><input type="text" value={expedient.peticionari} onChange={e => onChange(expedient.id, 'peticionari', e.target.value)} className={inputClass} /></td>
                                    <td className="px-4 py-3 text-sm text-gray-700">
                                         <select value={expedient.procediment} onChange={e => onChange(expedient.id, 'procediment', e.target.value)} className={inputClass}>
                                            <option value="">Selecciona...</option>
                                            {procediments.map(proc => <option key={proc.id} value={proc.name}>{proc.name}</option>)}
                                        </select>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-700"><input type="text" value={expedient.descripcio} onChange={e => onChange(expedient.id, 'descripcio', e.target.value)} className={inputClass} /></td>
                                    <td className="px-4 py-3 text-sm text-gray-700"><input type="text" value={expedient.indret} onChange={e => onChange(expedient.id, 'indret', e.target.value)} className={inputClass} /></td>
                                    <td className="px-4 py-3 text-sm text-gray-700">
                                        <select value={expedient.sentitInforme} onChange={e => onChange(expedient.id, 'sentitInforme', e.target.value)} className={inputClass}>
                                            <option value="">Selecciona...</option>
                                            {sentitInformes.map(status => <option key={status.id} value={status.name}>{status.name}</option>)}
                                        </select>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-700">
                                        <select value={expedient.departament} onChange={e => onChange(expedient.id, 'departament', e.target.value)} className={inputClass}>
                                            <option value="">Selecciona...</option>
                                            {departaments.map(dept => <option key={dept.id} value={dept.name}>{dept.name}</option>)}
                                        </select>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                                        <select value={expedient.tecnic} onChange={e => onChange(expedient.id, 'tecnic', e.target.value)} className={inputClass}>
                                             <option value="">Selecciona...</option>
                                            {tecnics.map(tec => <option key={tec.id} value={tec.name}>{tec.name}</option>)}
                                        </select>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                                        <button onClick={() => onDelete(expedient.id)} className="text-red-600 hover:text-red-800 font-semibold">Eliminar</button>
                                    </td>
                                </>
                           ) : (
                                <>
                                    <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">{expedient.id}</td>
                                    <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">{expedient.peticionari}</td>
                                    <td className="px-4 py-3 text-sm text-gray-700">{expedient.procediment}</td>
                                    <td className="px-4 py-3 text-sm text-gray-700">{expedient.descripcio}</td>
                                    <td className="px-4 py-3 text-sm text-gray-700">{expedient.indret}</td>
                                    <td className="px-4 py-3 text-sm text-gray-700"><ReportStatusBadge status={expedient.sentitInforme} /></td>
                                    <td className="px-4 py-3 text-sm text-gray-700">{expedient.departament}</td>
                                    <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">{expedient.tecnic}</td>
                                </>
                           )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ExpedientTable;