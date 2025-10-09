import React, { useState } from 'react';
import { AdminData, AdminList, User } from '../types';
import { PencilIcon, TrashIcon, CheckIcon, XIcon, AdminIcon } from './icons/Icons';

type ListKey = keyof Omit<AdminData, 'users'>;

interface EditableListProps<T extends AdminList | User> {
    title: string;
    items: T[];
    onSave: (item: T) => void;
    onDelete: (id: string) => void;
    onAdd: (item: Omit<T, 'id'>) => void;
    fields: (keyof T)[];
    fieldLabels: Record<string, string>;
    itemType: ListKey | 'users';
    isSaving: boolean;
}

const EditableListItem: React.FC<{
    item: any;
    isEditing: boolean;
    onStartEdit: () => void;
    onCancelEdit: () => void;
    onSave: (editedItem: any) => void;
    onDelete: () => void;
    fields: string[];
    fieldLabels: Record<string, string>;
    isSaving: boolean;
}> = ({ item, isEditing, onStartEdit, onCancelEdit, onSave, onDelete, fields, fieldLabels, isSaving }) => {
    const [editedItem, setEditedItem] = useState(item);

    const handleSave = () => {
        onSave(editedItem);
    };

    return (
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
            {isEditing ? (
                <>
                    {fields.map(field => {
                        if (field === 'id') return null;
                        if (field === 'role') {
                            return <select key={field} value={editedItem[field]} onChange={e => setEditedItem({...editedItem, [field]: e.target.value})} className="p-1 border rounded bg-transparent dark:bg-gray-700 dark:border-gray-600">
                                <option value="admin">Admin</option>
                                <option value="editor">Editor</option>
                                <option value="viewer">Viewer</option>
                            </select>
                        }
                         if (field === 'password') {
                            return <input key={field} type="password" placeholder={fieldLabels[field]} value={editedItem[field] || ''} onChange={e => setEditedItem({...editedItem, [field]: e.target.value})} className="p-1 border rounded bg-transparent dark:bg-gray-700 dark:border-gray-600" />
                        }
                        return <input key={field} type="text" placeholder={fieldLabels[field]} value={editedItem[field] || ''} onChange={e => setEditedItem({...editedItem, [field]: e.target.value})} className="p-1 border rounded bg-transparent dark:bg-gray-700 dark:border-gray-600" />
                    })}
                    <div className="flex items-center gap-2">
                        <button onClick={handleSave} className="p-1 text-green-600"><CheckIcon /></button>
                        <button onClick={onCancelEdit} className="p-1 text-red-600"><XIcon /></button>
                    </div>
                </>
            ) : (
                <>
                    <div className="flex-1">
                        <span className="font-semibold">{item.name}</span>
                        {item.email && <span className="text-sm text-gray-500 ml-2">({item.email})</span>}
                        {item.role && <span className="text-sm bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300 px-2 py-0.5 rounded-full ml-2">{item.role}</span>}
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={onStartEdit} className="p-1 text-gray-500 hover:text-indigo-600 disabled:opacity-50" disabled={isSaving}><PencilIcon /></button>
                        {item.id !== 'user-master' && <button onClick={onDelete} className="p-1 text-gray-500 hover:text-red-600 disabled:opacity-50" disabled={isSaving}><TrashIcon /></button>}
                    </div>
                </>
            )}
        </div>
    );
};


const EditableList: React.FC<EditableListProps<any>> = ({ title, items, onSave, onDelete, onAdd, fields, fieldLabels, isSaving }) => {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const newItemBase = fields.reduce((acc, field) => ({ ...acc, [field]: '' }), {});

    const handleSave = (editedItem: any) => {
        onSave(editedItem);
        setEditingId(null);
    };
    
    const handleAdd = (newItem: any) => {
        onAdd(newItem);
        setIsAdding(false);
    };

    const handleDelete = (id: string) => {
        if (window.confirm("Estàs segur que vols eliminar aquest element?")) {
            onDelete(id);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-bold mb-4">{title}</h3>
            <div className="space-y-2">
                {items.map(item => (
                    <EditableListItem
                        key={item.id}
                        item={item}
                        isEditing={editingId === item.id}
                        onStartEdit={() => setEditingId(item.id)}
                        onCancelEdit={() => setEditingId(null)}
                        onSave={handleSave}
                        onDelete={() => handleDelete(item.id)}
                        fields={fields}
                        fieldLabels={fieldLabels}
                        isSaving={isSaving}
                    />
                ))}
                 {isAdding && (
                    <EditableListItem
                        item={newItemBase}
                        isEditing={true}
                        onStartEdit={() => {}}
                        onCancelEdit={() => setIsAdding(false)}
                        onSave={handleAdd}
                        onDelete={() => {}}
                        fields={fields}
                        fieldLabels={fieldLabels}
                        isSaving={isSaving}
                    />
                )}
            </div>
             <button onClick={() => setIsAdding(true)} className="mt-4 text-indigo-600 dark:text-indigo-400 font-semibold text-sm disabled:opacity-50" disabled={isSaving}>+ Afegir Nou</button>
        </div>
    );
};

interface AdminViewProps {
  adminData: AdminData;
  onBack: () => void;
  onAddItem: (list: ListKey) => (item: { name: string, email?: string }) => void;
  onUpdateItem: (list: ListKey) => (item: AdminList) => void;
  onDeleteItem: (list: ListKey) => (id: string) => void;
  onAddUser: (user: Omit<User, 'id'>) => void;
  onUpdateUser: (user: User) => void;
  onDeleteUser: (id: string) => void;
  isSaving: boolean;
}

const AdminView: React.FC<AdminViewProps> = (props) => {
    const { 
        adminData, onBack, 
        onAddItem, onUpdateItem, onDeleteItem,
        onAddUser, onUpdateUser, onDeleteUser,
        isSaving 
    } = props;
    
  return (
    <div className="space-y-6 animate-fade-in">
        <header>
            <button onClick={onBack} className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline mb-2 disabled:opacity-50" disabled={isSaving}>&larr; Tornar al Panell</button>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-3"><AdminIcon/> Administració</h1>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <EditableList title="Procediments" items={adminData.procediments} onSave={onUpdateItem('procediments')} onDelete={onDeleteItem('procediments')} onAdd={onAddItem('procediments')} fields={['name']} fieldLabels={{ name: 'Nom del Procediment' }} itemType="procediments" isSaving={isSaving}/>
            <EditableList title="Sentit dels Informes" items={adminData.sentitInformes} onSave={onUpdateItem('sentitInformes')} onDelete={onDeleteItem('sentitInformes')} onAdd={onAddItem('sentitInformes')} fields={['name']} fieldLabels={{ name: 'Nom del Sentit' }} itemType="sentitInformes" isSaving={isSaving}/>
            <EditableList title="Departaments" items={adminData.departaments} onSave={onUpdateItem('departaments')} onDelete={onDeleteItem('departaments')} onAdd={onAddItem('departaments')} fields={['name']} fieldLabels={{ name: 'Nom del Departament' }} itemType="departaments" isSaving={isSaving}/>
            <EditableList title="Tècnics" items={adminData.tecnics} onSave={onUpdateItem('tecnics')} onDelete={onDeleteItem('tecnics')} onAdd={onAddItem('tecnics')} fields={['name', 'email']} fieldLabels={{ name: 'Nom', email: 'Email' }} itemType="tecnics" isSaving={isSaving}/>
            <EditableList title="Regidors" items={adminData.regidors} onSave={onUpdateItem('regidors')} onDelete={onDeleteItem('regidors')} onAdd={onAddItem('regidors')} fields={['name', 'email']} fieldLabels={{ name: 'Nom', email: 'Email' }} itemType="regidors" isSaving={isSaving}/>
            <EditableList title="Usuaris" items={adminData.users} onSave={onUpdateUser} onDelete={onDeleteUser} onAdd={onAddUser} fields={['name', 'email', 'role', 'password']} fieldLabels={{ name: 'Nom', email: 'Email', role: 'Rol', password: 'Contrasenya (opcional)' }} itemType="users" isSaving={isSaving}/>
        </div>
    </div>
  );
};

export default AdminView;