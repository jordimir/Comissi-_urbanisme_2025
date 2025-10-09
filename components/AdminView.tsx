
import React, { useState } from 'react';
import { AdminData, AdminList, User, UserRole } from '../types';
import * as api from '../api';
import { PencilIcon, TrashIcon, XIcon, CheckIcon } from './icons/Icons';

interface AdminViewProps {
    adminData: AdminData;
    onBack: () => void;
    isSaving: boolean;
    addToast: (message: string, type: 'success' | 'error', onUndo?: () => void) => void;
    onDataUpdate: () => Promise<void>;
}

type AdminListKey = keyof Omit<AdminData, 'users'>;

const AdminView: React.FC<AdminViewProps> = ({ adminData, onBack, addToast, onDataUpdate }) => {

    const handleUpdate = async (list: AdminListKey, id: string, name: string, email?: string) => {
        try {
            await api.updateAdminItem(list, id, name, email);
            await onDataUpdate();
            addToast("Element actualitzat.", "success");
        } catch (error) {
            addToast("Error en actualitzar l'element.", "error");
        }
    };
    
    const handleDelete = async (list: AdminListKey, id: string) => {
         if (!window.confirm("Segur que vols eliminar aquest element?")) return;
        try {
            const deletedItem = await api.deleteAdminItem(list, id);
            await onDataUpdate();
            const handleUndo = async () => {
                await api.restoreAdminItem(list, deletedItem);
                await onDataUpdate();
                addToast("Element restaurat.", "success");
            }
            addToast("Element eliminat.", "success", handleUndo);
        } catch (error) {
            addToast("Error en eliminar l'element.", "error");
        }
    };
    
    const handleAdd = async (list: AdminListKey, name: string, email?: string) => {
        try {
            await api.addAdminItem(list, name, email);
            await onDataUpdate();
            addToast("Element afegit.", "success");
        } catch (error) {
            addToast("Error en afegir l'element.", "error");
        }
    };

    const handleUpdateUser = async (id: string, name: string, email: string, role: User['role'], password?: string) => {
        try {
            await api.updateUser(id, name, email, role, password);
            await onDataUpdate();
            addToast("Usuari actualitzat.", "success");
        } catch (error) {
            addToast("Error actualitzant l'usuari.", "error");
        }
    };

    const handleDeleteUser = async (id: string) => {
        if (!window.confirm("Segur que vols eliminar aquest usuari?")) return;
        try {
            const deletedUser = await api.deleteUser(id);
            await onDataUpdate();
            const handleUndo = async () => {
                await api.restoreUser(deletedUser);
                await onDataUpdate();
                addToast("Usuari restaurat.", "success");
            }
            addToast("Usuari eliminat.", "success", handleUndo);
        } catch (error) {
             addToast("Error eliminant l'usuari.", "error");
        }
    };

    const handleAddUser = async (name: string, email: string, role: User['role'], password?: string) => {
        try {
            await api.addUser(name, email, role, password);
            await onDataUpdate();
            addToast("Usuari afegit.", "success");
        } catch (error) {
            addToast("Error afegint l'usuari.", "error");
        }
    };

    const listTitles: Record<AdminListKey, string> = {
        procediments: "Procediments",
        sentitInformes: "Sentit dels Informes",
        tecnics: "Tècnics/ques",
        departaments: "Departaments",
        regidors: "Regidors/es",
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-lg">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Administració</h1>
                <button onClick={onBack} className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                    &larr; Tornar al Panell
                </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {Object.keys(listTitles).map(key => (
                    <AdminListEditor
                        key={key}
                        listKey={key as AdminListKey}
                        title={listTitles[key as AdminListKey]}
                        items={adminData[key as AdminListKey]}
                        onAdd={handleAdd}
                        onUpdate={handleUpdate}
                        onDelete={handleDelete}
                    />
                ))}
                 <UserEditor
                    users={adminData.users}
                    onAddUser={handleAddUser}
                    onUpdateUser={handleUpdateUser}
                    onDeleteUser={handleDeleteUser}
                 />
            </div>
        </div>
    );
};

interface AdminListEditorProps {
    listKey: AdminListKey;
    title: string;
    items: AdminList[];
    onAdd: (list: AdminListKey, name: string, email?: string) => void;
    onUpdate: (list: AdminListKey, id: string, name: string, email?: string) => void;
    onDelete: (list: AdminListKey, id: string) => void;
}

const AdminListEditor: React.FC<AdminListEditorProps> = ({listKey, title, items, onAdd, onUpdate, onDelete}) => {
    const [newItemName, setNewItemName] = useState('');
    const [newItemEmail, setNewItemEmail] = useState('');
    const hasEmail = ['tecnics', 'regidors'].includes(listKey);

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if(newItemName.trim()){
            onAdd(listKey, newItemName.trim(), hasEmail ? newItemEmail.trim() : undefined);
            setNewItemName('');
            setNewItemEmail('');
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">{title}</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                {items.map(item => (
                    <EditableListItem key={item.id} item={item} hasEmail={hasEmail} onUpdate={(name, email) => onUpdate(listKey, item.id, name, email)} onDelete={() => onDelete(listKey, item.id)} />
                ))}
            </div>
            <form onSubmit={handleAdd} className="mt-4 flex gap-2 border-t dark:border-gray-700 pt-4">
                <input type="text" value={newItemName} onChange={e => setNewItemName(e.target.value)} placeholder="Nom del nou element" className="flex-grow p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"/>
                {hasEmail && <input type="email" value={newItemEmail} onChange={e => setNewItemEmail(e.target.value)} placeholder="Email (opcional)" className="flex-grow p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"/>}
                <button type="submit" className="bg-indigo-500 text-white font-semibold px-4 rounded-md hover:bg-indigo-600">+ Afegir</button>
            </form>
        </div>
    );
};

const EditableListItem: React.FC<{item: AdminList, hasEmail: boolean, onUpdate: (name: string, email?: string) => void, onDelete: () => void}> = ({item, hasEmail, onUpdate, onDelete}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(item.name);
    const [email, setEmail] = useState(item.email || '');

    const handleSave = () => {
        onUpdate(name, email);
        setIsEditing(false);
    }
    
    if (isEditing) {
        return (
            <div className="flex gap-2 items-center bg-gray-100 dark:bg-gray-700 p-2 rounded-md">
                <input type="text" value={name} onChange={e => setName(e.target.value)} className="flex-grow p-1 border rounded-md dark:bg-gray-600 dark:border-gray-500"/>
                {hasEmail && <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="flex-grow p-1 border rounded-md dark:bg-gray-600 dark:border-gray-500"/>}
                <button onClick={handleSave} className="text-green-500 p-1 hover:bg-green-100 dark:hover:bg-green-900/50 rounded-full"><CheckIcon /></button>
                <button onClick={() => setIsEditing(false)} className="text-red-500 p-1 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full"><XIcon /></button>
            </div>
        )
    }

    return (
        <div className="flex justify-between items-center p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700/50">
            <div>
                <p className="font-medium text-gray-800 dark:text-gray-200">{item.name}</p>
                {hasEmail && item.email && <p className="text-sm text-gray-500 dark:text-gray-400">{item.email}</p>}
            </div>
            <div className="flex gap-2">
                <button onClick={() => setIsEditing(true)} className="text-blue-500 p-1 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-full"><PencilIcon /></button>
                <button onClick={onDelete} className="text-red-500 p-1 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full"><TrashIcon /></button>
            </div>
        </div>
    )
}

const UserEditor: React.FC<{users: User[], onAddUser: (name: string, email: string, role: UserRole, password?: string) => void, onUpdateUser: (id: string, name: string, email: string, role: UserRole, password?: string) => void, onDeleteUser: (id: string) => void}> = ({users, onAddUser, onUpdateUser, onDeleteUser}) => {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg lg:col-span-2">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Gestió d'Usuaris</h3>
            <div className="space-y-2">
                {users.map(user => (
                    <div key={user.id} className="flex justify-between items-center p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <div>
                            <p className="font-medium text-gray-800 dark:text-gray-200">{user.name} ({user.email})</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{user.role}</p>
                        </div>
                        <div className="flex gap-2 items-center">
                            <button className="text-blue-500 p-1 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-full disabled:opacity-50" disabled>
                                <PencilIcon />
                            </button>
                            <button disabled={user.id === 'user-master'} onClick={() => onDeleteUser(user.id)} className="text-red-500 p-1 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full disabled:opacity-50 disabled:cursor-not-allowed">
                                <TrashIcon />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
             <p className="text-sm text-gray-500 mt-4 pt-4 border-t dark:border-gray-700">Funcionalitat d'edició i addició d'usuaris per implementar.</p>
        </div>
    );
}

export default AdminView;
