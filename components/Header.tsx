
import React from 'react';
import { CalendarIcon, AdminIcon, FocusIcon, SunIcon, MoonIcon } from './icons/Icons';

interface HeaderProps {
    onNavigateToAdmin?: () => void;
    onGenerateCommissions?: () => void;
    onToggleFocusMode?: () => void;
    theme: 'light' | 'dark';
    toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigateToAdmin, onGenerateCommissions, onToggleFocusMode, theme, toggleTheme }) => {
  return (
    <header className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl shadow-md">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg flex items-center justify-center">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m-1 4h1m5-4h1m-1 4h1m-1-8h1m-5 8h1m-1-4h1m-1-4h1" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl md:text-4xl font-bold text-gray-800 dark:text-gray-100">COMISSIÓ D'URBANISME</h1>
            <p className="text-indigo-600 dark:text-indigo-400 font-semibold text-lg">ESTADÍSTIQUES</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleTheme}
            title={theme === 'light' ? 'Activar mode fosc' : 'Activar mode clar'}
            className="hidden md:inline-flex p-3 bg-gray-200 dark:bg-gray-700 rounded-full transition-transform transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-400"
          >
            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
          </button>
          <button
            onClick={onToggleFocusMode}
            title="Mode Focus"
            className="hidden md:inline-flex p-3 bg-blue-100 dark:bg-blue-900/50 rounded-full transition-transform transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-400"
          >
            <FocusIcon />
          </button>
          <button
            onClick={onGenerateCommissions}
            title="Generar comissions del proper any"
            className="hidden md:inline-flex p-3 bg-yellow-100 dark:bg-yellow-900/50 rounded-full transition-transform transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-yellow-400"
          >
            <CalendarIcon />
          </button>
          {onNavigateToAdmin && (
             <button
               onClick={onNavigateToAdmin}
               title="Administració"
               className="hidden md:inline-flex p-3 bg-gray-200 dark:bg-gray-700 rounded-full transition-transform transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-400"
             >
               <AdminIcon />
             </button>
           )}
        </div>
      </div>
    </header>
  );
};

export default Header;