
import React from 'react';
import { ResponsiveContainer, LineChart, Line } from 'recharts';
import { TimeSeriesData } from '../types';

interface MetricCardProps {
  title: string;
  value: string;
  unit: string;
  trend?: TimeSeriesData[];
}

export const MetricCard: React.FC<MetricCardProps> = ({ title, value, unit, trend }) => {
  const trendData = trend?.map(d => ({ value: d.value })) || [];
  const lastValue = trendData[trendData.length - 1]?.value || 0;
  const secondLastValue = trendData[trendData.length - 2]?.value || 0;
  const isUp = lastValue >= secondLastValue;
  
  const strokeColor = title === "Model Accuracy" 
    ? (isUp ? '#48BB78' : '#F56565') 
    : (isUp ? '#F56565' : '#48BB78');

  return (
    <div className="bg-gray-800/50 p-4 sm:p-6 rounded-lg shadow-lg flex justify-between items-center border border-gray-700">
      <div>
        <h4 className="text-sm font-medium text-gray-400">{title}</h4>
        <p className="text-3xl font-bold text-white">
          {value} <span className="text-lg font-medium text-gray-400">{unit}</span>
        </p>
      </div>
      {trendData.length > 0 && (
        <div className="w-24 h-12">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                    <Line type="monotone" dataKey="value" stroke={strokeColor} strokeWidth={2.5} dot={false} />
                </LineChart>
            </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};
