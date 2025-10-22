import React, { useState, useCallback } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { ModelSelector } from './ModelSelector';
import { MetricCard } from './MetricCard';
import { AlertsPanel } from './AlertsPanel';
import { InferenceLog } from './InferenceLog';
import { YamlGenerator } from './YamlGenerator';
import { FeatureDriftChart } from './FeatureDriftChart';
import { InsightModal } from './InsightModal';
import { getAnomalyInsight } from '../services/geminiService';
import { Model, Alert, InferenceLog as Log } from '../types';

const ChartCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-gray-800/50 p-4 sm:p-6 rounded-lg shadow-lg border border-gray-700 h-80 flex flex-col">
    <h3 className="text-lg font-semibold text-gray-200 mb-4">{title}</h3>
    <div className="flex-grow">{children}</div>
  </div>
);

interface DashboardProps {
    models: Model[];
    activeModel: Model;
    onSelectModel: (modelId: string) => void;
    alerts: Alert[];
    inferenceLogs: Log[];
}

export const Dashboard: React.FC<DashboardProps> = ({ models, activeModel, onSelectModel, alerts, inferenceLogs }) => {
  const [isInsightModalOpen, setIsInsightModalOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [insightText, setInsightText] = useState<string>('');
  const [isInsightLoading, setIsInsightLoading] = useState<boolean>(false);
  const [insightError, setInsightError] = useState<string | null>(null);
    
  const accuracyData = activeModel.accuracyHistory.map(d => ({ name: new Date(d.timestamp).toLocaleTimeString(), value: d.value }));
  const latencyData = activeModel.latencyHistory.map(d => ({ name: new Date(d.timestamp).toLocaleTimeString(), value: d.value }));

  const handleGetInsight = useCallback(async (alertId: string) => {
    const alert = alerts.find(a => a.id === alertId);
    if (!alert || !activeModel) return;

    setSelectedAlert(alert);
    setIsInsightModalOpen(true);
    setIsInsightLoading(true);
    setInsightText('');
    setInsightError(null);

    try {
      const insight = await getAnomalyInsight(alert, activeModel);
      setInsightText(insight);
    } catch (error) {
      setInsightError("Failed to retrieve AI insights. Please check the console for more details.");
    } finally {
      setIsInsightLoading(false);
    }
  }, [alerts, activeModel]);
  
  const closeInsightModal = () => {
    setIsInsightModalOpen(false);
    setSelectedAlert(null);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Monitoring Dashboard</h2>
          <ModelSelector models={models} activeModelId={activeModel.id} onSelectModel={onSelectModel} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <MetricCard title="Model Accuracy" value={activeModel.accuracy.toFixed(4)} unit="" trend={activeModel.accuracyHistory} />
          <MetricCard title="Avg. Latency" value={activeModel.avgLatency.toFixed(0)} unit="ms" trend={activeModel.latencyHistory} />
          <MetricCard title="Requests / min" value={activeModel.requestsPerMinute.toFixed(0)} unit="" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="Accuracy Drift">
              <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={accuracyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                      <XAxis dataKey="name" stroke="#A0AEC0" tick={{ fontSize: 12 }} />
                      <YAxis stroke="#A0AEC0" domain={[0.8, 1]} tick={{ fontSize: 12 }} />
                      <Tooltip contentStyle={{ backgroundColor: '#1A202C', border: '1px solid #4A5568' }} />
                      <Legend />
                      <Line type="monotone" dataKey="value" name="Accuracy" stroke="#48BB78" strokeWidth={2} dot={false} />
                  </LineChart>
              </ResponsiveContainer>
          </ChartCard>
          <ChartCard title="Latency (ms)">
              <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={latencyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                      <XAxis dataKey="name" stroke="#A0AEC0" tick={{ fontSize: 12 }} />
                      <YAxis stroke="#A0AEC0" tick={{ fontSize: 12 }} />
                      <Tooltip contentStyle={{ backgroundColor: '#1A202C', border: '1px solid #4A5568' }} />
                      <Legend />
                      <Line type="monotone" dataKey="value" name="Latency" stroke="#F6E05E" strokeWidth={2} dot={false} />
                  </LineChart>
              </ResponsiveContainer>
          </ChartCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
              <FeatureDriftChart data={activeModel.featureDrift} />
          </div>
          <AlertsPanel alerts={alerts} onGetInsight={handleGetInsight}/>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3">
              <InferenceLog logs={inferenceLogs} />
          </div>
          <div className="lg:col-span-2">
              <YamlGenerator model={activeModel} />
          </div>
        </div>
      </div>
      <InsightModal
        isOpen={isInsightModalOpen}
        onClose={closeInsightModal}
        title={`AI Analysis for Alert #${selectedAlert?.id.slice(-6)}`}
        isLoading={isInsightLoading}
        insightText={insightText}
        errorText={insightError}
      />
    </>
  );
};