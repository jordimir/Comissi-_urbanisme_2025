import React, { useState } from 'react';
import { AdminData, AdminList, User } from '../types';
import * as api from '../api';
import { PencilIcon, TrashIcon, CheckIcon, XIcon, AdminIcon } from './icons/Icons';

type ListKey = keyof Omit<AdminData, 'users'>;

interface EditableListProps<T extends AdminList | User> {
    title: string;
    items: T[];
    onSave: (item: T) => void;
    onDelete: (id: string) => void;
    onAdd: (item: Omit<T, 'id'>) => void;
    fields: (keyof T)[];
    fieldLabels: Record<keyof T, string>;
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


const EditableList: React.FC<EditableListProps<any>> = ({ title, items, onSave, onDelete, onAdd, fields, fieldLabels, itemType, isSaving }) => {
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
  onAdminAction: (action: () => Promise<any>) => void;
  isSaving: boolean;
}

const AdminView: React.FC<AdminViewProps> = ({ adminData, onBack, onAdminAction, isSaving }) => {

    const handleSaveItem = (list: ListKey) => (item: AdminList) => {
        onAdminAction(() => api.updateAdminItem(list, item.id, item.name, item.email));
    };
    const handleDeleteItem = (list: ListKey) => (id: string) => {
        onAdminAction(() => api.deleteAdminItem(list, id));
    };
    const handleAddItem = (list: ListKey) => (item: { name: string, email?: string }) => {
        onAdminAction(() => api.addAdminItem(list, item.name, item.email));
    };

    const handleSaveUser = (user: User) => {
        onAdminAction(() => api.updateUser(user.id, user.name, user.email, user.role, user.password));
    };
     const handleDeleteUser = (id: string) => {
        onAdminAction(() => api.deleteUser(id));
    };
    const handleAddUser = (user: Omit<User, 'id'>) => {
        onAdminAction(() => api.addUser(user.name, user.email, user.role, user.password));
    };
    
  return (
    <div className="space-y-6 animate-fade-in">
        <header>
            <button onClick={onBack} className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline mb-2 disabled:opacity-50" disabled={isSaving}>&larr; Tornar al Panell</button>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-3"><AdminIcon/> Administració</h1>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <EditableList title="Procediments" items={adminData.procediments} onSave={handleSaveItem('procediments')} onDelete={handleDeleteItem('procediments')} onAdd={handleAddItem('procediments')} fields={['name']} fieldLabels={{ name: 'Nom del Procediment' }} itemType="procediments" isSaving={isSaving}/>
            <EditableList title="Sentit dels Informes" items={adminData.sentitInformes} onSave={handleSaveItem('sentitInformes')} onDelete={handleDeleteItem('sentitInformes')} onAdd={handleAddItem('sentitInformes')} fields={['name']} fieldLabels={{ name: 'Nom del Sentit' }} itemType="sentitInformes" isSaving={isSaving}/>
            <EditableList title="Departaments" items={adminData.departaments} onSave={handleSaveItem('departaments')} onDelete={handleDeleteItem('departaments')} onAdd={handleAddItem('departaments')} fields={['name']} fieldLabels={{ name: 'Nom del Departament' }} itemType="departaments" isSaving={isSaving}/>
            <EditableList title="Tècnics" items={adminData.tecnics} onSave={handleSaveItem('tecnics')} onDelete={handleDeleteItem('tecnics')} onAdd={handleAddItem('tecnics')} fields={['name', 'email']} fieldLabels={{ name: 'Nom', email: 'Email' }} itemType="tecnics" isSaving={isSaving}/>
            <EditableList title="Regidors" items={adminData.regidors} onSave={handleSaveItem('regidors')} onDelete={handleDeleteItem('regidors')} onAdd={handleAddItem('regidors')} fields={['name', 'email']} fieldLabels={{ name: 'Nom', email: 'Email' }} itemType="regidors" isSaving={isSaving}/>
            <EditableList title="Usuaris" items={adminData.users} onSave={handleSaveUser} onDelete={handleDeleteUser} onAdd={handleAddUser} fields={['name', 'email', 'role', 'password']} fieldLabels={{ name: 'Nom', email: 'Email', role: 'Rol', password: 'Contrasenya (opcional)' }} itemType="users" isSaving={isSaving}/>
        </div>
    </div>
  );
};

export default AdminView;