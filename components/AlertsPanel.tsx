import React from 'react';
import { Alert, AlertLevel } from '../types';

const AlertIcon: React.FC<{ level: AlertLevel }> = ({ level }) => {
  const baseClasses = "h-5 w-5 mr-3 flex-shrink-0";
  if (level === AlertLevel.Critical) return <svg xmlns="http://www.w3.org/2000/svg" className={`${baseClasses} text-red-400`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
  if (level === AlertLevel.Warning) return <svg xmlns="http://www.w3.org/2000/svg" className={`${baseClasses} text-yellow-400`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>;
  return <svg xmlns="http://www.w3.org/2000/svg" className={`${baseClasses} text-blue-400`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
};

const getLevelColor = (level: AlertLevel) => {
    switch (level) {
        case AlertLevel.Critical: return 'border-l-4 border-red-500 bg-red-900/20';
        case AlertLevel.Warning: return 'border-l-4 border-yellow-500 bg-yellow-900/20';
        default: return 'border-l-4 border-blue-500 bg-blue-900/20';
    }
}

interface AlertsPanelProps {
    alerts: Alert[];
    onGetInsight: (alertId: string) => void;
}

export const AlertsPanel: React.FC<AlertsPanelProps> = ({ alerts, onGetInsight }) => {
  return (
    <div className="bg-gray-800/50 p-4 sm:p-6 rounded-lg shadow-lg border border-gray-700 h-96 flex flex-col">
      <h3 className="text-lg font-semibold text-gray-200 mb-4">Recent Alerts</h3>
      <div className="overflow-y-auto space-y-3 pr-2 flex-grow">
        {alerts.length > 0 ? alerts.map(alert => (
          <div key={alert.id} className={`p-3 rounded-md flex items-start ${getLevelColor(alert.level)}`}>
            <AlertIcon level={alert.level} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-200 break-words">{alert.message}</p>
              <p className="text-xs text-gray-400 mt-1">{new Date(alert.timestamp).toLocaleString()}</p>
              {(alert.level === AlertLevel.Warning || alert.level === AlertLevel.Critical) && (
                 <button 
                    onClick={() => onGetInsight(alert.id)}
                    className="mt-2 text-xs font-semibold text-blue-300 hover:text-blue-200 bg-blue-900/50 hover:bg-blue-800/50 px-2 py-1 rounded transition-colors"
                >
                    ✨ Get AI Insights
                 </button>
              )}
            </div>
          </div>
        )) : <p className="text-gray-400 text-center pt-10">No recent alerts.</p>}
      </div>
    </div>
  );
};