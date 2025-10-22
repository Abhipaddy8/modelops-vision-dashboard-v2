import { Model, Alert, AlertLevel, InferenceLog, ConnectionStatus } from '../types';

const INITIAL_MODELS: Model[] = [
  {
    id: 'fraud-detection-v2',
    name: 'Fraud Detection v2.1',
    type: 'Classification',
    version: '2.1.3',
    accuracy: 0.98,
    avgLatency: 120,
    requestsPerMinute: 580,
    features: ['transaction_amount', 'user_age', 'login_frequency', 'purchase_category'],
    accuracyHistory: Array.from({ length: 30 }, (_, i) => ({ timestamp: Date.now() - (30 - i) * 60000, value: 0.98 + (Math.random() - 0.5) * 0.01 })),
    latencyHistory: Array.from({ length: 30 }, (_, i) => ({ timestamp: Date.now() - (30 - i) * 60000, value: 120 + (Math.random() - 0.5) * 15 })),
    featureDrift: [
      { feature: 'transaction_amount', baseline: 100, current: 102 },
      { feature: 'user_age', baseline: 35, current: 35.5 },
      { feature: 'login_frequency', baseline: 5, current: 5.1 },
      { feature: 'purchase_category', baseline: 3, current: 3.8 },
    ],
  },
  {
    id: 'churn-prediction-v1',
    name: 'Churn Prediction v1.4',
    type: 'Classification',
    version: '1.4.0',
    accuracy: 0.92,
    avgLatency: 250,
    requestsPerMinute: 210,
    features: ['session_duration', 'items_in_cart', 'account_age', 'support_tickets'],
    accuracyHistory: Array.from({ length: 30 }, (_, i) => ({ timestamp: Date.now() - (30 - i) * 60000, value: 0.92 + (Math.random() - 0.5) * 0.02 })),
    latencyHistory: Array.from({ length: 30 }, (_, i) => ({ timestamp: Date.now() - (30 - i) * 60000, value: 250 + (Math.random() - 0.5) * 20 })),
    featureDrift: [
      { feature: 'session_duration', baseline: 15, current: 14.8 },
      { feature: 'items_in_cart', baseline: 2.1, current: 2.2 },
      { feature: 'account_age', baseline: 180, current: 182 },
      { feature: 'support_tickets', baseline: 0.2, current: 0.25 },
    ],
  },
];

type EventCallback = (data: any) => void;

class MockWebSocketService {
  private models: Model[];
  private activeModelId: string;
  // Fix: Use `number` for interval ID in a browser environment. `setInterval` returns a number, and NodeJS types are not available.
  private intervalId: number | null = null;
  private listeners: Map<string, EventCallback[]> = new Map();

  constructor() {
    this.models = JSON.parse(JSON.stringify(INITIAL_MODELS));
    this.activeModelId = this.models[0].id;
  }

  connect() {
    this.emit('status', ConnectionStatus.Connecting);
    setTimeout(() => {
      this.emit('status', ConnectionStatus.Connected);
      this.emit('initial-state', { models: this.models, activeModelId: this.activeModelId });
      this.startDataStream();
    }, 1500);
  }

  disconnect() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.listeners.clear();
    console.log('Mock WebSocket disconnected.');
  }

  on(event: string, callback: EventCallback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  off(event: string, callback: EventCallback) {
    if (this.listeners.has(event)) {
      const filteredListeners = this.listeners.get(event)!.filter(cb => cb !== callback);
      this.listeners.set(event, filteredListeners);
    }
  }
  
  setActiveModel(modelId: string) {
    if (this.models.find(m => m.id === modelId)) {
        this.activeModelId = modelId;
        this.emit('active-model-changed', modelId);
    }
  }

  private emit(event: string, data: any) {
    if (this.listeners.has(event)) {
      this.listeners.get(event)!.forEach(cb => cb(data));
    }
  }

  private addAlert(level: AlertLevel, message: string) {
    const newAlert: Alert = {
      id: `alert-${Date.now()}`,
      timestamp: Date.now(),
      level,
      message,
    };
    this.emit('new-alert', newAlert);
  }

  private startDataStream() {
    if (this.intervalId) clearInterval(this.intervalId);

    this.intervalId = setInterval(() => {
        let updatedModel: Model | undefined;
        this.models = this.models.map(model => {
          if (model.id === this.activeModelId) {
            const accuracyChange = (Math.random() - 0.5) * 0.005;
            let newAccuracy = model.accuracy + accuracyChange;
            if (newAccuracy < 0.85 && model.accuracy >= 0.85) {
              this.addAlert(AlertLevel.Critical, `Model '${model.name}' accuracy dropped critically to ${newAccuracy.toFixed(3)}!`);
            } else if (newAccuracy < 0.90 && model.accuracy >= 0.90) {
              this.addAlert(AlertLevel.Warning, `Model '${model.name}' accuracy dropped to ${newAccuracy.toFixed(3)}.`);
            }
            newAccuracy = Math.max(0.7, Math.min(1, newAccuracy));

            const latencyChange = (Math.random() - 0.4) * 10;
            let newAvgLatency = model.avgLatency + latencyChange;
            if (newAvgLatency > model.avgLatency * 1.5 && model.avgLatency <= model.avgLatency * 1.5) {
                 this.addAlert(AlertLevel.Warning, `High latency detected for '${model.name}': ${newAvgLatency.toFixed(0)}ms.`);
            }
            newAvgLatency = Math.max(50, newAvgLatency);
            
            const newFeatureDrift = model.featureDrift.map(fd => {
                 const driftChange = (Math.random() - 0.5) * (fd.baseline * 0.02);
                 const newCurrent = fd.current + driftChange;
                 if (Math.abs(newCurrent - fd.baseline) / fd.baseline > 0.15 && Math.abs(fd.current - fd.baseline) / fd.baseline <= 0.15) {
                     this.addAlert(AlertLevel.Info, `Feature drift detected for '${fd.feature}' in model '${model.name}'.`);
                 }
                 return { ...fd, current: newCurrent };
            });
            
            updatedModel = {
                ...model,
                accuracy: newAccuracy,
                avgLatency: newAvgLatency,
                requestsPerMinute: Math.max(10, model.requestsPerMinute + (Math.random() - 0.5) * 10),
                accuracyHistory: [...model.accuracyHistory.slice(1), { timestamp: Date.now(), value: newAccuracy }],
                latencyHistory: [...model.latencyHistory.slice(1), { timestamp: Date.now(), value: newAvgLatency }],
                featureDrift: newFeatureDrift
            };
            return updatedModel;
          }
          return model;
        });

      if (updatedModel) {
        this.emit('model-update', updatedModel);

        const newLog: InferenceLog = {
          id: `log-${Date.now()}`,
          timestamp: Date.now(),
          input: { [updatedModel.features[0]]: Math.random() * 100 },
          prediction: Math.random(),
          latency: Math.max(50, updatedModel.avgLatency + (Math.random() - 0.5) * 30),
        };
        this.emit('new-log', newLog);
      }
    }, 2000);
  }
}

export const webSocketService = new MockWebSocketService();