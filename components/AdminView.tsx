import React, { useState, useRef } from 'react';
import { AdminData, AdminList, User } from '../types';
import { AdminIcon } from './icons/Icons';

interface AdminListManagerProps {
  title: string;
  items: AdminList[];
  onUpdate: (id: string, name: string, email?: string) => void;
  onDelete: (id: string) => void;
  onAdd: (name: string, email?: string) => void;
  hasEmailField?: boolean;
}

const AdminListManager: React.FC<AdminListManagerProps> = ({ title, items, onUpdate, onDelete, onAdd, hasEmailField = false }) => {
  const [newItemName, setNewItemName] = useState('');
  const [newItemEmail, setNewItemEmail] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [editingEmail, setEditingEmail] = useState('');

  const handleAdd = () => {
    if (newItemName.trim()) {
      onAdd(newItemName.trim(), newItemEmail.trim());
      setNewItemName('');
      setNewItemEmail('');
    }
  };

  const startEditing = (item: AdminList) => {
    setEditingId(item.id);
    setEditingName(item.name);
    setEditingEmail(item.email || '');
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingName('');
    setEditingEmail('');
  };

  const saveEdit = (id: string) => {
    if (editingName.trim()) {
      onUpdate(id, editingName.trim(), editingEmail.trim());
      cancelEditing();
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
      <h3 className="font-bold text-lg text-gray-700 dark:text-gray-200 mb-4">{title}</h3>
      <div className="space-y-2">
        {items.map(item => (
          <div key={item.id} className="p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">
            {editingId === item.id ? (
              <div className="space-y-2">
                 <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="w-full p-1 border rounded bg-yellow-50 dark:bg-gray-600 dark:border-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    placeholder="Nom"
                />
                {hasEmailField && (
                    <input
                        type="email"
                        value={editingEmail}
                        onChange={(e) => setEditingEmail(e.target.value)}
                        className="w-full p-1 border rounded bg-yellow-50 dark:bg-gray-600 dark:border-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        placeholder="Correu electrònic"
                    />
                )}
                <div className="flex items-center space-x-2">
                    <button onClick={() => saveEdit(item.id)} className="py-1 px-3 text-sm bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-green-500">Guardar</button>
                    <button onClick={cancelEditing} className="py-1 px-3 text-sm bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-gray-400">Cancel·lar</button>
                </div>
              </div>
            ) : (
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-gray-800 dark:text-gray-200 font-medium">{item.name}</p>
                        {hasEmailField && item.email && <p className="text-xs text-gray-500 dark:text-gray-400">{item.email}</p>}
                    </div>
                    <div className="flex items-center space-x-2 flex-shrink-0">
                        <button onClick={() => startEditing(item)} className="py-1 px-3 text-sm bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-semibold rounded-md hover:bg-blue-200 dark:hover:bg-blue-800/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-blue-500">Editar</button>
                        <button onClick={() => onDelete(item.id)} className="py-1 px-3 text-sm bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 font-semibold rounded-md hover:bg-red-200 dark:hover:bg-red-800/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-red-500">Eliminar</button>
                    </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t dark:border-gray-700 space-y-2">
        <input
          type="text"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          placeholder="Nom del nou element"
          className="w-full p-2 border rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 dark:bg-gray-700 dark:border-gray-600"
        />
        {hasEmailField && (
            <input
                type="email"
                value={newItemEmail}
                onChange={(e) => setNewItemEmail(e.target.value)}
                placeholder="Correu electrònic (opcional)"
                className="w-full p-2 border rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 dark:bg-gray-700 dark:border-gray-600"
            />
        )}
        <button onClick={handleAdd} className="w-full bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500">Afegir</button>
      </div>
    </div>
  );
};

interface UserAdminManagerProps {
  title: string;
  items: User[];
  onUpdate: (id: string, name: string, email: string, role: User['role'], password?: string) => void;
  onDelete: (id: string) => void;
  onAdd: (name: string, email: string, role: User['role'], password?: string) => void;
  onImport: (users: User[]) => void;
}

const UserAdminManager: React.FC<UserAdminManagerProps> = ({ title, items, onUpdate, onDelete, onAdd, onImport }) => {
  const [newItemName, setNewItemName] = useState('');
  const [newItemEmail, setNewItemEmail] = useState('');
  const [newItemPassword, setNewItemPassword] = useState('');
  const [newItemRole, setNewItemRole] = useState<User['role']>('viewer');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [editingEmail, setEditingEmail] = useState('');
  const [editingPassword, setEditingPassword] = useState('');
  const [editingRole, setEditingRole] = useState<User['role']>('viewer');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAdd = () => {
    if (newItemName.trim() && newItemEmail.trim() && newItemPassword.trim()) {
      onAdd(newItemName.trim(), newItemEmail.trim(), newItemRole, newItemPassword.trim());
      setNewItemName('');
      setNewItemEmail('');
      setNewItemPassword('');
      setNewItemRole('viewer');
    }
  };

  const startEditing = (item: User) => {
    setEditingId(item.id);
    setEditingName(item.name);
    setEditingEmail(item.email);
    setEditingRole(item.role);
    setEditingPassword('');
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingName('');
    setEditingEmail('');
    setEditingPassword('');
    setEditingRole('viewer');
  };

  const saveEdit = (id: string) => {
    if (editingName.trim() && editingEmail.trim()) {
      onUpdate(id, editingName.trim(), editingEmail.trim(), editingRole, editingPassword.trim() || undefined);
      cancelEditing();
    }
  };

  const handleExport = () => {
    const usersToExport = items.filter(user => user.id !== 'user-master');
    const header = "id,name,email,role\n";
    const csvContent = usersToExport.map(user => `${user.id},${user.name},${user.email},${user.role}`).join("\n");
    const blob = new Blob([header + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "usuaris.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result as string;
            const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
            if (lines.length < 1) {
                alert("El fitxer CSV està buit o té un format incorrecte.");
                return;
            }

            const header = lines[0].split(',').map(h => h.trim());
            const idIndex = header.indexOf('id');
            const nameIndex = header.indexOf('name');
            const emailIndex = header.indexOf('email');
            const roleIndex = header.indexOf('role');

            if (idIndex === -1 || nameIndex === -1 || emailIndex === -1) {
                alert("El fitxer CSV ha de contenir les columnes 'id', 'name', i 'email'. La columna 'role' és opcional.");
                return;
            }
            
            const importedUsers: User[] = lines.slice(1).map(line => {
                const data = line.split(',');
                const role = data[roleIndex]?.trim();
                return {
                    id: data[idIndex]?.trim(),
                    name: data[nameIndex]?.trim(),
                    email: data[emailIndex]?.trim(),
                    // Fix: Add type assertion to correctly type the role after validation.
                    role: (role === 'admin' || role === 'editor' || role === 'viewer') ? role as User['role'] : 'viewer',
                };
            }).filter(u => u.id && u.name && u.email); // Basic validation
            
            onImport(importedUsers);
        };
        reader.readAsText(file);
    }
     if(event.target) event.target.value = '';
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg text-gray-700 dark:text-gray-200">{title}</h3>
        <div className="flex space-x-2">
            <button onClick={handleImportClick} className="text-sm bg-blue-500 text-white font-semibold py-1 px-3 rounded-md hover:bg-blue-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-blue-500">Importar CSV</button>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".csv" className="hidden" />
            <button onClick={handleExport} className="text-sm bg-green-500 text-white font-semibold py-1 px-3 rounded-md hover:bg-green-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-green-500">Exportar CSV</button>
        </div>
      </div>
      <div className="space-y-2">
        {items.map(item => (
          <div key={item.id} className="p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">
            {editingId === item.id ? (
              <div className="space-y-2">
                 <input type="text" value={editingName} onChange={(e) => setEditingName(e.target.value)} className="w-full p-1 border rounded bg-yellow-50 dark:bg-gray-600 dark:border-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400" placeholder="Nom" />
                 <input type="email" value={editingEmail} onChange={(e) => setEditingEmail(e.target.value)} className="w-full p-1 border rounded bg-yellow-50 dark:bg-gray-600 dark:border-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400" placeholder="Correu electrònic" />
                 <select value={editingRole} onChange={e => setEditingRole(e.target.value as User['role'])} disabled={item.id === 'user-master'} className="w-full p-1 border rounded bg-yellow-50 dark:bg-gray-600 dark:border-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-50">
                    <option value="viewer">Visualitzador</option>
                    <option value="editor">Editor</option>
                    <option value="admin">Administrador</option>
                 </select>
                 <input type="password" value={editingPassword} onChange={(e) => setEditingPassword(e.target.value)} className="w-full p-1 border rounded bg-yellow-50 dark:bg-gray-600 dark:border-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400" placeholder="Nova contrasenya (deixar en blanc per no canviar)" />
                <div className="flex items-center space-x-2">
                    <button onClick={() => saveEdit(item.id)} className="py-1 px-3 text-sm bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-green-500">Guardar</button>
                    <button onClick={cancelEditing} className="py-1 px-3 text-sm bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-gray-400">Cancel·lar</button>
                </div>
              </div>
            ) : (
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-gray-800 dark:text-gray-200 font-medium">{item.name} <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">({item.role})</span></p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{item.email}</p>
                    </div>
                    <div className="flex items-center space-x-2 flex-shrink-0">
                        <button onClick={() => startEditing(item)} className="py-1 px-3 text-sm bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-semibold rounded-md hover:bg-blue-200 dark:hover:bg-blue-800/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-blue-500">Editar</button>
                        {item.id !== 'user-master' && <button onClick={() => onDelete(item.id)} className="py-1 px-3 text-sm bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 font-semibold rounded-md hover:bg-red-200 dark:hover:bg-red-800/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-red-500">Eliminar</button>}
                    </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t dark:border-gray-700 space-y-2">
        <h4 className="font-semibold text-gray-600 dark:text-gray-300">Afegir Nou Usuari</h4>
        <input type="text" value={newItemName} onChange={(e) => setNewItemName(e.target.value)} placeholder="Nom del nou usuari" className="w-full p-2 border rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 dark:bg-gray-700 dark:border-gray-600" />
        <input type="email" value={newItemEmail} onChange={(e) => setNewItemEmail(e.target.value)} placeholder="Correu electrònic" className="w-full p-2 border rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 dark:bg-gray-700 dark:border-gray-600" />
        <select value={newItemRole} onChange={(e) => setNewItemRole(e.target.value as User['role'])} className="w-full p-2 border rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 dark:bg-gray-700 dark:border-gray-600">
            <option value="viewer">Visualitzador</option>
            <option value="editor">Editor</option>
            <option value="admin">Administrador</option>
        </select>
        <input type="password" value={newItemPassword} onChange={(e) => setNewItemPassword(e.target.value)} placeholder="Contrasenya" className="w-full p-2 border rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 dark:bg-gray-700 dark:border-gray-600" />
        <button onClick={handleAdd} className="w-full bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500">Afegir Usuari</button>
      </div>
    </div>
  );
};

interface AdminViewProps {
  adminData: AdminData;
  onUpdate: (list: keyof AdminData, id: string, name: string, email?: string) => void;
  onDelete: (list: keyof AdminData, id: string) => void;
  onAdd: (list: keyof AdminData, name: string, email?: string) => void;
  onUpdateUser: (id: string, name: string, email: string, role: User['role'], password?: string) => void;
  onDeleteUser: (id: string) => void;
  onAddUser: (name: string, email: string, role: User['role'], password?: string) => void;
  onImportUsers: (users: User[]) => void;
  onBack: () => void;
}

const AdminView: React.FC<AdminViewProps> = (props) => {
  const { adminData, onUpdate, onDelete, onAdd, onUpdateUser, onDeleteUser, onAddUser, onImportUsers, onBack } = props;
  
  return (
    <div className="space-y-8 animate-fade-in">
        <header className="flex justify-between items-center">
             <div className="flex items-center space-x-3">
                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <AdminIcon />
                </div>
                 <div>
                    <h1 className="text-2xl md:text-4xl font-bold text-gray-800 dark:text-gray-100">Panell d'Administració</h1>
                    <p className="text-gray-600 dark:text-gray-400 font-semibold text-lg">Gestionar dades de l'aplicació</p>
                </div>
            </div>
             <button
                onClick={onBack}
                className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-400"
            >
                &larr; Tornar al dashboard
            </button>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AdminListManager 
                title="Procediments"
                items={adminData.procediments}
                onUpdate={(id, name) => onUpdate('procediments', id, name)}
                onDelete={(id) => onDelete('procediments', id)}
                onAdd={(name) => onAdd('procediments', name)}
            />
             <AdminListManager 
                title="Sentit de l'Informe"
                items={adminData.sentitInformes}
                onUpdate={(id, name) => onUpdate('sentitInformes', id, name)}
                onDelete={(id) => onDelete('sentitInformes', id)}
                onAdd={(name) => onAdd('sentitInformes', name)}
            />
            <AdminListManager 
                title="Departaments"
                items={adminData.departaments}
                onUpdate={(id, name) => onUpdate('departaments', id, name)}
                onDelete={(id) => onDelete('departaments', id)}
                onAdd={(name) => onAdd('departaments', name)}
            />
            <AdminListManager 
                title="Tècnics"
                items={adminData.tecnics}
                onUpdate={(id, name, email) => onUpdate('tecnics', id, name, email)}
                onDelete={(id) => onDelete('tecnics', id)}
                onAdd={(name, email) => onAdd('tecnics', name, email)}
                hasEmailField={true}
            />
             <AdminListManager 
                title="Regidors"
                items={adminData.regidors}
                onUpdate={(id, name, email) => onUpdate('regidors', id, name, email)}
                onDelete={(id) => onDelete('regidors', id)}
                onAdd={(name, email) => onAdd('regidors', name, email)}
                hasEmailField={true}
            />
            <UserAdminManager
                title="Usuaris"
                items={adminData.users}
                onUpdate={onUpdateUser}
                onDelete={onDeleteUser}
                onAdd={onAddUser}
                onImport={onImportUsers}
            />
        </main>
    </div>
  );
};

export default AdminView;