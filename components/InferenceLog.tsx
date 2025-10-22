
import React from 'react';
import { InferenceLog as Log } from '../types';

export const InferenceLog: React.FC<{ logs: Log[] }> = ({ logs }) => {
  return (
    <div className="bg-gray-800/50 p-4 sm:p-6 rounded-lg shadow-lg border border-gray-700 h-[28rem] flex flex-col">
      <h3 className="text-lg font-semibold text-gray-200 mb-4">Live Inference Log</h3>
      <div className="overflow-y-auto font-mono text-xs flex-grow pr-2">
        {logs.map(log => (
          <div key={log.id} className="flex justify-between items-center border-b border-gray-700/50 py-1.5 hover:bg-gray-700/30 px-1 rounded">
            <span className="text-gray-400">{new Date(log.timestamp).toLocaleTimeString()}</span>
            <span className="text-blue-300">PRED: {log.prediction.toFixed(5)}</span>
            <span className={log.latency > 200 ? 'text-red-400' : 'text-green-400'}>LAT: {log.latency.toFixed(0)}ms</span>
          </div>
        ))}
        {logs.length === 0 && <p className="text-gray-400 text-center pt-10">Waiting for inference data...</p>}
      </div>
    </div>
  );
};
