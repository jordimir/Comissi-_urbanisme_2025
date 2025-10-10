
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { CommissionSummary, CommissionDetail, ChatMessage } from '../types';
import Modal from './Modal';
import { SparklesIcon, SendIcon } from './icons/Icons';

interface AIAssistantModalProps {
    isOpen: boolean;
    onClose: () => void;
    commissions: CommissionSummary[];
    details: CommissionDetail[];
}

const AIAssistantModal: React.FC<AIAssistantModalProps> = ({ isOpen, onClose, commissions, details }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            setMessages([
                { role: 'model', text: "Hola! Sóc l'assistent virtual de la Comissió d'Urbanisme. Fes-me una pregunta sobre les dades de l'any seleccionat." }
            ]);
            setInput('');
        }
    }, [isOpen]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
    
    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: ChatMessage = { role: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
            
            const contextData = {
                resums_comissions: commissions,
                detalls_expedients: details,
            };

            const prompt = `Ets un assistent expert en dades de comissions d'urbanisme de l'Ajuntament de Tossa de Mar. La teva tasca és respondre preguntes basant-te exclusivament en les dades JSON que et proporciono. Les dades estan en català i has de respondre sempre en català. Sigues concís i directe. No inventis informació que no estigui a les dades. Si la resposta no es troba a les dades, indica-ho clarament.

Dades JSON:
${JSON.stringify(contextData, null, 2)}

Pregunta de l'usuari:
"${userMessage.text}"`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });

            const modelMessage: ChatMessage = { role: 'model', text: response.text };
            setMessages(prev => [...prev, modelMessage]);

        } catch (error) {
            console.error("Error calling Gemini API", error);
            const errorMessage: ChatMessage = { role: 'error', text: "Hi ha hagut un error en contactar l'assistent. Si us plau, intenta-ho de nou." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Assistent IA">
            <div className="flex flex-col h-[60vh]">
                <div className="flex-grow overflow-y-auto p-4 bg-gray-100 dark:bg-gray-900 rounded-lg space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.role === 'model' && <div className="flex-shrink-0 w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white"><SparklesIcon /></div>}
                            <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl ${
                                msg.role === 'user' ? 'bg-indigo-500 text-white rounded-br-none' : 
                                msg.role === 'error' ? 'bg-red-500 text-white rounded-bl-none' : 
                                'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'
                            }`}>
                                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                         <div className="flex items-end gap-2 justify-start">
                            <div className="flex-shrink-0 w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white"><SparklesIcon /></div>
                            <div className="max-w-xs px-4 py-2 rounded-2xl bg-gray-200 dark:bg-gray-700 rounded-bl-none">
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </div>
                <div className="mt-4 flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Escriu la teva pregunta..."
                        disabled={isLoading}
                        className="flex-grow p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <button onClick={handleSend} disabled={isLoading || !input.trim()} className="p-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 disabled:bg-gray-400">
                        <SendIcon />
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default AIAssistantModal;
