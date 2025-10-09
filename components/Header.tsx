
import React from 'react';
import { User } from '../types';
import { AdminIcon, FocusIcon, SunIcon, MoonIcon, LogoutIcon } from './icons/Icons';

interface HeaderProps {
    onNavigateToAdmin: () => void;
    onGenerateCommissions: () => void;
    onToggleFocusMode: () => void;
    theme: 'light' | 'dark';
    toggleTheme: () => void;
    currentUser: User;
    onLogout: () => void;
    isSaving: boolean;
}

const Header: React.FC<HeaderProps> = ({ onNavigateToAdmin, onGenerateCommissions, onToggleFocusMode, theme, toggleTheme, currentUser, onLogout, isSaving }) => {
    return (
        <header className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-lg flex justify-between items-center no-print animate-fade-in">
            <div className="flex items-center">
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600 dark:text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m-1 4h1m5-4h1m-1 4h1m-1-8h1m-5 8h1m-1-4h1m-1-4h1" />
                    </svg>
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Comissió d'Urbanisme</h1>
                    <p className="text-gray-500 dark:text-gray-400">Ajuntament de Tossa de Mar</p>
                </div>
            </div>

            <div className="flex items-center space-x-2">
                 {(currentUser.role === 'admin' || currentUser.role === 'editor') && (
                    <button
                        onClick={onGenerateCommissions}
                        className="p-2 bg-green-500 text-white font-semibold rounded-md shadow-sm hover:bg-green-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        title="Generar comissions per a l'any vinent"
                        disabled={isSaving}
                    >
                        Generar Any Següent
                    </button>
                 )}
                {currentUser.role === 'admin' && (
                    <button onClick={onNavigateToAdmin} title="Administració" className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" disabled={isSaving}>
                        <AdminIcon />
                    </button>
                )}
                <button onClick={onToggleFocusMode} title="Mode Focus" className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                    <FocusIcon />
                </button>
                 <button onClick={toggleTheme} title="Canviar Tema" className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                    {theme === 'light' ? <MoonIcon /> : <SunIcon />}
                </button>
                <div className="flex items-center space-x-2 pl-2 border-l border-gray-200 dark:border-gray-700">
                    <div className="text-right">
                        <p className="font-semibold text-sm text-gray-700 dark:text-gray-200">{currentUser.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{currentUser.role}</p>
                    </div>
                    <button onClick={onLogout} title="Tancar Sessió" className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors" disabled={isSaving}>
                        <LogoutIcon />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
