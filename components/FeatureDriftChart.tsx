
import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { FeatureDriftData } from '../types';

interface FeatureDriftChartProps {
    data: FeatureDriftData[];
}

export const FeatureDriftChart: React.FC<FeatureDriftChartProps> = ({ data }) => {
  return (
    <div className="bg-gray-800/50 p-4 sm:p-6 rounded-lg shadow-lg border border-gray-700 h-96 flex flex-col">
      <h3 className="text-lg font-semibold text-gray-200 mb-4">Feature Distribution Drift</h3>
      <div className="flex-grow">
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                <XAxis type="number" stroke="#A0AEC0" tick={{ fontSize: 12 }} />
                <YAxis type="category" dataKey="feature" stroke="#A0AEC0" width={100} tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: '#1A202C', border: '1px solid #4A5568' }} />
                <Legend />
                <Bar dataKey="baseline" fill="#4A5568" name="Baseline" />
                <Bar dataKey="current" fill="#4299E1" name="Current" />
            </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
