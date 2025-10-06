import React from 'react';
import { ClockIcon, WarningIcon, CalendarIcon, AdminIcon } from './icons/Icons';

interface HeaderProps {
    onNavigateToAdmin?: () => void;
    onGenerateCommissions?: () => void;
    onShowInfoModal?: (title: string, message: string) => void;
    onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigateToAdmin, onGenerateCommissions, onShowInfoModal, onLogout }) => {
  return (
    <header className="bg-white/50 backdrop-blur-sm p-4 rounded-xl shadow-md">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-16 h-16 bg-indigo-100 rounded-lg flex items-center justify-center">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m-1 4h1m5-4h1m-1 4h1m-1-8h1m-5 8h1m-1-4h1m-1-4h1" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl md:text-4xl font-bold text-gray-800">COMISSIÓ D'URBANISME</h1>
            <p className="text-indigo-600 font-semibold text-lg">ESTADÍSTIQUES</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
           <button
            onClick={() => onShowInfoModal?.('Accés 24/7', 'Aquesta plataforma està dissenyada per ser accessible les 24 hores del dia, els 7 dies de la setmana.')}
            title="Accés 24/7"
            className="hidden md:inline-flex p-3 bg-gray-200 rounded-full transition-transform transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-400"
          >
            <ClockIcon />
          </button>
          <button
            onClick={() => onShowInfoModal?.('Avisos Importants', 'Aquí trobareu notificacions i avisos rellevants sobre les comissions d\'urbanisme.')}
            title="Avisos"
            className="hidden md:inline-flex p-3 bg-red-200 rounded-full transition-transform transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-400"
          >
            <WarningIcon />
          </button>
          <button
            onClick={onGenerateCommissions}
            title="Generar comissions del proper any"
            className="hidden md:inline-flex p-3 bg-yellow-200 rounded-full transition-transform transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-yellow-400"
          >
            <CalendarIcon />
          </button>
          {onNavigateToAdmin && (
             <button
               onClick={onNavigateToAdmin}
               title="Administració"
               className="hidden md:inline-flex p-3 bg-gray-200 rounded-full transition-transform transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-400"
             >
               <AdminIcon />
             </button>
           )}
           {onLogout && (
             <button
                onClick={onLogout}
                title="Tancar Sessió"
                className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500"
             >
                Tancar Sessió
             </button>
           )}
        </div>
      </div>
    </header>
  );
};

export default Header;