
import React from 'react';
import { Dashboard } from './components/Dashboard';
import { Header } from './components/Header';
import { useModelData } from './hooks/useModelData';
import { ConnectionStatus } from './types';

function App() {
  const { models, activeModel, selectModel, alerts, inferenceLogs, status } = useModelData();

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200">
      <Header status={status} />
      <main className="p-4 sm:p-6 lg:p-8">
        {status !== ConnectionStatus.Connected || !activeModel ? (
          <div className="flex items-center justify-center" style={{ height: 'calc(100vh - 8rem)'}}>
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <h3 className="mt-2 text-xl font-semibold text-white">
                {status === ConnectionStatus.Connecting ? 'Connecting to Model Stream...' : 'Connection Lost'}
              </h3>
              <p className="mt-1 text-sm text-gray-400">
                {status === ConnectionStatus.Connecting ? 'Establishing real-time data connection.' : 'Please check your connection and refresh.'}
              </p>
            </div>
          </div>
        ) : (
           <Dashboard 
             models={models}
             activeModel={activeModel}
             onSelectModel={selectModel}
             alerts={alerts}
             inferenceLogs={inferenceLogs}
           />
        )}
      </main>
    </div>
  );
}

export default App;
