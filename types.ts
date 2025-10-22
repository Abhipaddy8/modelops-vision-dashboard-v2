export interface TimeSeriesData {
  timestamp: number;
  value: number;
}

export interface FeatureDriftData {
  feature: string;
  baseline: number;
  current: number;
}

export interface InferenceLog {
  id: string;
  timestamp: number;
  input: Record<string, any>;
  prediction: number;
  latency: number;
}

export enum AlertLevel {
  Info = 'Info',
  Warning = 'Warning',
  Critical = 'Critical',
}

export interface Alert {
  id: string;
  timestamp: number;
  level: AlertLevel;
  message: string;
  insight?: string; // To cache AI analysis
}

export interface Model {
  id: string;
  name: string;
  type: 'Classification' | 'Regression';
  version: string;
  accuracy: number;
  avgLatency: number;
  requestsPerMinute: number;
  accuracyHistory: TimeSeriesData[];
  latencyHistory: TimeSeriesData[];
  featureDrift: FeatureDriftData[];
  features: string[];
}

export enum ConnectionStatus {
  Connecting = 'Connecting',
  Connected = 'Connected',
  Disconnected = 'Disconnected',
}