import React, { useState } from 'react';
import { CommissionDetail, ReportStatus } from '../types';

declare const html2pdf: any;

interface EmailPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  commissionDetail?: CommissionDetail;
}

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
        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${colorClasses}`}>
            {status}
        </span>
    );
};


const EmailPreviewModal: React.FC<EmailPreviewModalProps> = ({ isOpen, onClose, commissionDetail }) => {
  const [copyButtonText, setCopyButtonText] = useState('Copiar al Porta-retalls');

  if (!isOpen || !commissionDetail) {
    return null;
  }

  const handlePrint = () => {
    const element = document.getElementById('email-content');
    if (element && commissionDetail) {
      const opt = {
        margin: [0.5, 0.5, 0.5, 0.5], // top, left, bottom, right in inches
        filename: `Comissio_Urbanisme_${commissionDetail.numActa}_${commissionDetail.sessio.replace(/\//g, '-')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
      };
      html2pdf().set(opt).from(element).save();
    }
  };

  const handleCopyToClipboard = async () => {
    const content = document.getElementById('email-content');
    if (content) {
      try {
        const blob = new Blob([content.innerHTML], { type: 'text/html' });
        // The type cast is needed because the ClipboardItem constructor's type definition can be strict.
        const clipboardItem = new ClipboardItem({ 'text/html': blob } as any);
        await navigator.clipboard.write([clipboardItem]);
        setCopyButtonText('Copiat!');
        setTimeout(() => setCopyButtonText('Copiar al Porta-retalls'), 2000);
      } catch (err) {
        console.error('Failed to copy content: ', err);
        setCopyButtonText('Error en copiar');
        setTimeout(() => setCopyButtonText('Copiar al Porta-retalls'), 2000);
      }
    }
  };

  return (
    <div
        className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 animate-fade-in"
        onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-xl shadow-2xl max-w-4xl w-full m-4 transform transition-all animate-slide-up flex flex-col"
        style={{maxHeight: '90vh'}}
        onClick={e => e.stopPropagation()}
      >
        <div className="no-print">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Previsualització per a l'Enviament</h3>
        </div>
        
        <div id="email-content" className="overflow-y-auto p-4 border rounded-lg bg-gray-50 flex-grow">
            {/* Header Info */}
            <h1 style={{fontSize: '24px', fontWeight: 'bold', color: '#333'}}>Comissió Informativa d'Urbanisme</h1>
            <p style={{fontSize: '16px', color: '#555', marginBottom: '20px'}}>Ajuntament de Tossa de Mar</p>
            
            <table style={{width: '100%', borderCollapse: 'collapse', marginBottom: '20px', fontSize: '14px'}}>
                <tbody>
                    <tr style={{backgroundColor: '#f9f9f9'}}>
                        <td style={{padding: '8px', border: '1px solid #ddd', fontWeight: 'bold'}}>Sessió:</td>
                        <td style={{padding: '8px', border: '1px solid #ddd'}}>{commissionDetail.sessio}</td>
                        <td style={{padding: '8px', border: '1px solid #ddd', fontWeight: 'bold'}}>Hora:</td>
                        <td style={{padding: '8px', border: '1px solid #ddd'}}>{commissionDetail.hora}</td>
                    </tr>
                     <tr>
                        <td style={{padding: '8px', border: '1px solid #ddd', fontWeight: 'bold'}}>Núm. Acta:</td>
                        <td style={{padding: '8px', border: '1px solid #ddd'}}>{commissionDetail.numActa}</td>
                        <td style={{padding: '8px', border: '1px solid #ddd', fontWeight: 'bold'}}>Expedients:</td>
                        <td style={{padding: '8px', border: '1px solid #ddd'}}>{commissionDetail.expedients.length}</td>
                    </tr>
                </tbody>
            </table>

            {/* Expedients Table */}
            <table style={{width: '100%', borderCollapse: 'collapse', fontSize: '12px'}}>
                <thead style={{backgroundColor: '#f2f2f2'}}>
                    <tr>
                        <th style={{padding: '8px', border: '1px solid #ddd', textAlign: 'left'}}>Núm. Expedient</th>
                        <th style={{padding: '8px', border: '1px solid #ddd', textAlign: 'left'}}>Peticionàri/a</th>
                        <th style={{padding: '8px', border: '1px solid #ddd', textAlign: 'left'}}>Descripció</th>
                        <th style={{padding: '8px', border: '1px solid #ddd', textAlign: 'left'}}>Sentit informe</th>
                        <th style={{padding: '8px', border: '1px solid #ddd', textAlign: 'left'}}>Tècnic</th>
                    </tr>
                </thead>
                <tbody>
                    {commissionDetail.expedients.map((exp, index) => (
                        <tr key={exp.id} style={{backgroundColor: index % 2 === 0 ? '#fff' : '#f9f9f9'}}>
                            <td style={{padding: '8px', border: '1px solid #ddd'}}>{exp.id}</td>
                            <td style={{padding: '8px', border: '1px solid #ddd'}}>{exp.peticionari}</td>
                            <td style={{padding: '8px', border: '1px solid #ddd'}}>{exp.descripcio}</td>
                            <td style={{padding: '8px', border: '1px solid #ddd'}}><ReportStatusBadge status={exp.sentitInforme} /></td>
                            <td style={{padding: '8px', border: '1px solid #ddd'}}>{exp.tecnic}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        <div className="flex justify-end space-x-3 pt-4 no-print">
          <button
            onClick={handlePrint}
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Imprimir a PDF
          </button>
           <button
            onClick={handleCopyToClipboard}
            className="bg-purple-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-600 transition-colors"
          >
            {copyButtonText}
          </button>
          <button
            onClick={onClose}
            className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Tancar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailPreviewModal;