
import { useState, useEffect, useCallback } from 'react';
import { Model, Alert, InferenceLog, ConnectionStatus } from '../types';
import { webSocketService } from '../services/webSocketService';

export const useModelData = () => {
  const [models, setModels] = useState<Model[]>([]);
  const [activeModelId, setActiveModelId] = useState<string | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [inferenceLogs, setInferenceLogs] = useState<InferenceLog[]>([]);
  const [status, setStatus] = useState<ConnectionStatus>(ConnectionStatus.Connecting);

  useEffect(() => {
    // Define handlers
    const handleStatus = (newStatus: ConnectionStatus) => setStatus(newStatus);
    const handleInitialState = (data: { models: Model[], activeModelId: string }) => {
      setModels(data.models);
      setActiveModelId(data.activeModelId);
    };
    const handleActiveModelChanged = (newModelId: string) => setActiveModelId(newModelId);
    const handleNewAlert = (newAlert: Alert) => {
      setAlerts(prev => [newAlert, ...prev].slice(0, 10));
    };
    const handleNewLog = (newLog: InferenceLog) => {
      setInferenceLogs(prev => [newLog, ...prev].slice(0, 50));
    };
    const handleModelUpdate = (updatedModel: Model) => {
      setModels(prevModels => prevModels.map(m => m.id === updatedModel.id ? updatedModel : m));
    };

    // Subscribe
    webSocketService.on('status', handleStatus);
    webSocketService.on('initial-state', handleInitialState);
    webSocketService.on('active-model-changed', handleActiveModelChanged);
    webSocketService.on('new-alert', handleNewAlert);
    webSocketService.on('new-log', handleNewLog);
    webSocketService.on('model-update', handleModelUpdate);

    // Connect
    webSocketService.connect();

    // Cleanup on unmount
    return () => {
      webSocketService.off('status', handleStatus);
      webSocketService.off('initial-state', handleInitialState);
      webSocketService.off('active-model-changed', handleActiveModelChanged);
      webSocketService.off('new-alert', handleNewAlert);
      webSocketService.off('new-log', handleNewLog);
      webSocketService.off('model-update', handleModelUpdate);
      webSocketService.disconnect();
    };
  }, []);

  const selectModel = useCallback((modelId: string) => {
    webSocketService.setActiveModel(modelId);
  }, []);
  
  const activeModel = models.find(m => m.id === activeModelId) || null;

  return { models, activeModel, selectModel, alerts, inferenceLogs, status };
};
