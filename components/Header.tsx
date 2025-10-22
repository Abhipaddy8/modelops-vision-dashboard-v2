
import React from 'react';
import { ConnectionStatus } from '../types';

interface HeaderProps {
    status: ConnectionStatus;
}

const BrainIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v2a2 2 0 002 2h2a2 2 0 002-2v-2m-6 0h6" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2m0 16v-2m4-12h2m-16 0H4m14.485 14.485l1.414 1.414M5.101 5.101L3.687 3.687m14.142 0l-1.414 1.414M3.687 20.313l1.414-1.414" />
    </svg>
);

const StatusIndicator: React.FC<{ status: ConnectionStatus }> = ({ status }) => {
    const statusConfig = {
        [ConnectionStatus.Connected]: { color: 'bg-green-500', text: 'Live' },
        [ConnectionStatus.Connecting]: { color: 'bg-yellow-500', text: 'Connecting' },
        [ConnectionStatus.Disconnected]: { color: 'bg-red-500', text: 'Offline' },
    };
    const { color, text } = statusConfig[status];

    return (
        <div className="flex items-center space-x-2">
            {status !== ConnectionStatus.Disconnected && (
                <span className={`relative flex h-3 w-3`}>
                    {status === ConnectionStatus.Connecting && <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${color} opacity-75`}></span>}
                    <span className={`relative inline-flex rounded-full h-3 w-3 ${color}`}></span>
                </span>
            )}
            {status === ConnectionStatus.Disconnected && (
                 <span className={`relative flex h-3 w-3`}>
                    <span className={`relative inline-flex rounded-full h-3 w-3 ${color}`}></span>
                 </span>
            )}
            <span className="text-sm text-gray-300">{text}</span>
        </div>
    );
};

export const Header: React.FC<HeaderProps> = ({ status }) => {
  return (
    <header className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
             <BrainIcon />
            <span className="text-xl font-bold text-white tracking-wider">
              ModelOps Vision
            </span>
          </div>
          <StatusIndicator status={status} />
        </div>
      </div>
    </header>
  );
};
