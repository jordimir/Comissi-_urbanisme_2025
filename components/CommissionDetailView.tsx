
import React, { useState, useEffect, useMemo } from 'react';
import { CommissionDetail, Expedient, AdminData, SortConfig, SortDirection, User } from '../types';
import ExpedientTable from './ExpedientTable';
import { ClockIcon, WarningIcon, FocusIcon } from './icons/Icons';
import EmailPreviewModal from './EmailPreviewModal';
import { GoogleGenAI } from "@google/genai";

interface CommissionDetailViewProps {
    commissionDetail: CommissionDetail;
    onBack: () => void;
    onSave: (detail: CommissionDetail) => void;
    adminData: AdminData;
    currentUser: User;
    isFocusMode: boolean;
    onToggleFocusMode: () => void;
}

const CommissionDetailView: React.FC<CommissionDetailViewProps> = (props) => {
    const { commissionDetail, onBack, onSave, adminData, currentUser, isFocusMode, onToggleFocusMode } = props;
    
    const [editedDetail, setEditedDetail] = useState<CommissionDetail>(JSON.parse(JSON.stringify(commissionDetail)));
    const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
    const [editingExpedientId, setEditingExpedientId] = useState<string | null>(null);
    const [editedExpedientData, setEditedExpedientData] = useState<Expedient | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isEmailPreviewOpen, setIsEmailPreviewOpen] = useState(false);
    const [aiSummary, setAiSummary] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);

    useEffect(() => {
        setEditedDetail(JSON.parse(JSON.stringify(commissionDetail)));
    }, [commissionDetail]);

    const canEdit = useMemo(() => currentUser.role === 'admin' || currentUser.role === 'editor', [currentUser.role]);
    const hasChanges = useMemo(() => JSON.stringify(commissionDetail) !== JSON.stringify(editedDetail), [commissionDetail, editedDetail]);

    const sortedAndFilteredExpedients = useMemo(() => {
        let expedients = [...editedDetail.expedients];
        
        if (searchTerm) {
            const lowercasedTerm = searchTerm.toLowerCase();
            expedients = expedients.filter(exp => 
                Object.values(exp).some(value => 
                    String(value).toLowerCase().includes(lowercasedTerm)
                )
            );
        }

        if (sortConfig !== null) {
            expedients.sort((a, b) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];

                if (aValue === undefined || aValue === null) return 1;
                if (bValue === undefined || bValue === null) return -1;
                
                if (aValue < bValue) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return expedients;
    }, [editedDetail.expedients, sortConfig, searchTerm]);

    const handleSort = (key: keyof Expedient) => {
        let direction: SortDirection = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const handleAddExpedient = () => {
        const newExpedient: Expedient = {
            id: `new-${Date.now()}`,
            peticionari: '',
            procediment: '',
            descripcio: '',
            indret: '',
            sentitInforme: '',
            departament: 'Urbanisme',
            tecnic: '',
            isNew: true
        };
        setEditedDetail(prev => ({ ...prev, expedients: [newExpedient, ...prev.expedients] }));
        setEditingExpedientId(newExpedient.id);
        setEditedExpedientData(newExpedient);
    };

    const handleStartEdit = (expedient: Expedient) => {
        setEditingExpedientId(expedient.id);
        setEditedExpedientData({ ...expedient });
    };

    const handleCancelEdit = () => {
        if (editedExpedientData?.isNew) {
            setEditedDetail(prev => ({ ...prev, expedients: prev.expedients.filter(e => e.id !== editingExpedientId) }));
        }
        setEditingExpedientId(null);
        setEditedExpedientData(null);
    };

    const handleSaveEdit = (id: string) => {
        if (!editedExpedientData || !editedExpedientData.id.trim() || editedExpedientData.id.startsWith('new-')) {
            alert("El número d'expedient és obligatori i no pot ser temporal.");
            return;
        }

        const isDuplicateId = editedDetail.expedients.some(exp => exp.id === editedExpedientData.id && exp.id !== id);
        if (isDuplicateId) {
            alert("Ja existeix un expedient amb aquest número.");
            return;
        }

        setEditedDetail(prev => ({
            ...prev,
            expedients: prev.expedients.map(exp => exp.id === id ? { ...editedExpedientData, isNew: false } : exp)
        }));
        setEditingExpedientId(null);
        setEditedExpedientData(null);
    };

    const handleEditChange = (field: keyof Expedient, value: string) => {
        setEditedExpedientData(prev => prev ? { ...prev, [field]: value } : null);
    };

    const handleDelete = (id: string) => {
        setEditedDetail(prev => ({
            ...prev,
            expedients: prev.expedients.filter(exp => exp.id !== id)
        }));
    };
    
    const handleDeleteSelected = () => {
        setEditedDetail(prev => ({
            ...prev,
            expedients: prev.expedients.filter(exp => !selectedIds.includes(exp.id))
        }));
        setSelectedIds([]);
    };

    const handleDuplicate = (id: string) => {
        const expedientToDuplicate = editedDetail.expedients.find(exp => exp.id === id);
        if (expedientToDuplicate) {
            const newExpedient: Expedient = {
                ...expedientToDuplicate,
                id: `new-${Date.now()}`,
                isNew: true,
            };
            setEditedDetail(prev => ({ ...prev, expedients: [newExpedient, ...prev.expedients] }));
            handleStartEdit(newExpedient);
        }
    };
    
    const handleSave = () => {
        const finalDetail = { ...editedDetail, expedientsCount: editedDetail.expedients.length };
        onSave(finalDetail);
    };

    const handleGenerateAISummary = async () => {
        // Fix: Use process.env.API_KEY as per guidelines
        if (!process.env.API_KEY) {
            setAiSummary("La clau API de Gemini no està configurada.");
            return;
        }
        setIsAiLoading(true);
        setAiSummary('');

        try {
            // Fix: Use new GoogleGenAI({apiKey: ...}) as per guidelines
            const ai = new GoogleGenAI({apiKey: process.env.API_KEY});

            const expedientsText = editedDetail.expedients.map(e => 
                `- ${e.procediment}: ${e.descripcio} a ${e.indret}. Informe: ${e.sentitInforme}. Tècnic: ${e.tecnic}.`
            ).join('\n');
            
            const prompt = `Ets un assistent administratiu expert en urbanisme per a l'ajuntament de Tossa de Mar. Analitza la següent llista d'expedients de la comissió del dia ${editedDetail.sessio} i genera un resum concís en català. El resum ha de ser un paràgraf breu que destaqui els punts més importants, com ara el nombre total d'expedients, els tipus de procediments més comuns, la proporció d'informes favorables i desfavorables, i qualsevol projecte de gran rellevància si n'hi ha. No facis una llista, sinó un text cohesionat. Expedeints:\n${expedientsText}`;
            
            // Fix: Use ai.models.generateContent and correct model name as per guidelines
            const response = await ai.models.generateContent({
              model: 'gemini-2.5-flash',
              contents: prompt,
            });
            
            // Fix: Use response.text to get the output as per guidelines
            const text = response.text;
            setAiSummary(text);

        } catch (error) {
            console.error("Error generating AI summary:", error);
            setAiSummary("S'ha produït un error en generar el resum. Si us plau, intenta-ho de nou.");
        } finally {
            setIsAiLoading(false);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
             {!isFocusMode && (
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <button onClick={onBack} className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline mb-2">&larr; Tornar al Panell</button>
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Comissió d'Urbanisme - Acta {editedDetail.numActa}</h1>
                        <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400 mt-2">
                            <span className="flex items-center gap-2"><ClockIcon /> Sessió: {editedDetail.sessio}</span>
                            <span>{editedDetail.expedients.length} Expedients</span>
                        </div>
                    </div>
                     <div className="flex items-center gap-2">
                        <button
                          onClick={onToggleFocusMode}
                          title="Mode Focus"
                          className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-full transition-transform transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-400"
                        >
                            <FocusIcon />
                        </button>
                        {canEdit && (
                            <button
                                onClick={handleSave}
                                disabled={!hasChanges}
                                className="bg-indigo-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-indigo-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {hasChanges ? 'Desar Canvis' : 'Desat'}
                            </button>
                        )}
                    </div>
                </header>
             )}
            
            {hasChanges && !isFocusMode && (
                <div className="bg-yellow-100 dark:bg-yellow-900/50 border-l-4 border-yellow-500 text-yellow-800 dark:text-yellow-200 p-4 rounded-md flex items-center gap-3">
                    <WarningIcon />
                    <span>Tens canvis sense desar. Recorda desar-los abans de sortir.</span>
                </div>
            )}
            
            <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-2xl shadow-xl">
                 <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
                     <input 
                        type="text"
                        placeholder="Cerca a la taula..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="p-2 border rounded-md shadow-sm w-full sm:w-1/3 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                    <div className="flex items-center gap-2">
                         {canEdit && selectedIds.length > 0 && (
                             <button onClick={handleDeleteSelected} className="bg-red-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-red-600">
                                Eliminar ({selectedIds.length})
                            </button>
                         )}
                         <button onClick={() => setIsEmailPreviewOpen(true)} className="bg-teal-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-teal-600">
                            Previsualitzar Enviament
                        </button>
                        {canEdit && (
                            <button onClick={handleAddExpedient} className="bg-green-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-green-600">
                                + Afegir Expedient
                            </button>
                        )}
                    </div>
                 </div>

                <ExpedientTable
                    expedients={sortedAndFilteredExpedients}
                    adminData={adminData}
                    sortConfig={sortConfig}
                    onSort={handleSort}
                    editingExpedientId={editingExpedientId}
                    editedExpedientData={editedExpedientData}
                    onStartEdit={handleStartEdit}
                    onCancelEdit={handleCancelEdit}
                    onSaveEdit={handleSaveEdit}
                    onEditChange={handleEditChange}
                    onDelete={handleDelete}
                    onDuplicate={handleDuplicate}
                    selectedIds={selectedIds}
                    onSelectionChange={setSelectedIds}
                    canEdit={canEdit}
                />
            </div>
            
             <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-2xl shadow-xl">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Resum amb Intel·ligència Artificial</h2>
                    <button 
                        onClick={handleGenerateAISummary}
                        disabled={isAiLoading}
                        className="bg-purple-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-purple-600 disabled:bg-gray-400"
                    >
                        {isAiLoading ? 'Generant...' : 'Generar Resum'}
                    </button>
                </div>
                {isAiLoading && <p>Carregant resum...</p>}
                {aiSummary && <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{aiSummary}</p>}
             </div>

            <EmailPreviewModal
                isOpen={isEmailPreviewOpen}
                onClose={() => setIsEmailPreviewOpen(false)}
                commissionDetail={editedDetail}
            />
        </div>
    );
};

export default CommissionDetailView;
