import React from 'react';

interface InsightModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    isLoading: boolean;
    insightText: string;
    errorText: string | null;
}

const LoadingSpinner = () => (
    <div className="flex items-center justify-center space-x-2">
        <div className="w-4 h-4 rounded-full animate-pulse bg-blue-400"></div>
        <div className="w-4 h-4 rounded-full animate-pulse bg-blue-400" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-4 h-4 rounded-full animate-pulse bg-blue-400" style={{ animationDelay: '0.4s' }}></div>
        <span className="text-gray-300">Analyzing data with Gemini...</span>
    </div>
);

const FormattedInsight: React.FC<{ text: string }> = ({ text }) => {
    const parts = text.split(/\*\*(.*?)\*\*/g).filter(part => part);
    return (
        <div className="space-y-4">
            {parts.map((part, index) => {
                if (index % 2 === 0) {
                     return <p key={index} className="text-gray-300 whitespace-pre-wrap">{part.trim()}</p>;
                } else {
                     return <h4 key={index} className="text-md font-semibold text-white mt-4">{part}</h4>;
                }
            })}
        </div>
    );
}

export const InsightModal: React.FC<InsightModalProps> = ({ isOpen, onClose, title, isLoading, insightText, errorText }) => {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 transition-opacity"
            onClick={onClose}
        >
            <div 
                className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl w-full max-w-2xl mx-4 p-6 sm:p-8 transform transition-all"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-white">{title}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="mt-6 min-h-[150px]">
                    {isLoading && <div className="flex items-center justify-center h-full"><LoadingSpinner /></div>}
                    {errorText && <p className="text-red-400 text-center">{errorText}</p>}
                    {!isLoading && insightText && (
                        <FormattedInsight text={insightText} />
                    )}
                </div>
                 <div className="mt-8 text-right">
                    <button onClick={onClose} className="bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-500 transition-colors">
                        Close
                    </button>
                 </div>
            </div>
        </div>
    );
};