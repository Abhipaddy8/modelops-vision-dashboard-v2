import { GoogleGenAI } from "@google/genai";
import { Model, Alert } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const callGemini = async (prompt: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to get response from Gemini API.");
    }
};

export const getAnomalyInsight = async (alert: Alert, model: Model): Promise<string> => {
    // Helper to get top drifting features
    const getTopDrift = () => {
        return model.featureDrift
            .map(f => ({ ...f, drift: Math.abs(f.current - f.baseline) / f.baseline }))
            .sort((a, b) => b.drift - a.drift)
            .slice(0, 2)
            .map(f => `- ${f.feature}: ${(f.drift * 100).toFixed(1)}% drift`)
            .join('\n');
    };

    const prompt = `
You are an expert MLOps analyst. An alert was triggered for a machine learning model. Your task is to provide a concise, data-driven analysis of the potential root cause and suggest a next step.

**Alert Details:**
- **Severity:** ${alert.level}
- **Message:** "${alert.message}"

**Current Model State:**
- **Model Name:** ${model.name}
- **Current Accuracy:** ${model.accuracy.toFixed(4)}
- **Average Latency:** ${model.avgLatency.toFixed(0)}ms
- **Recent Accuracy (last 3 points):** ${model.accuracyHistory.slice(-3).map(p => p.value.toFixed(4)).join(', ')}
- **Recent Latency (last 3 points):** ${model.latencyHistory.slice(-3).map(p => p.value.toFixed(0) + 'ms').join(', ')}
- **Top Feature Drifts:**
${getTopDrift()}

**Analysis Task:**
1.  **Root Cause Analysis:** Based on the provided data, what is the most likely cause of this alert? Correlate the alert with other metrics (e.g., "did the accuracy drop coincide with a spike in latency or significant feature drift?"). Be specific.
2.  **Recommended Action:** What is the single most important next step an engineer should take to investigate or resolve this?

Format your response as plain text, using "**Analysis:**" and "**Recommendation:**" as headers. Do not use markdown formatting like \`\`\`.
`;

    return callGemini(prompt);
};


export const generateYamlConfig = async (model: Model): Promise<string> => {
  const prompt = `
You are an expert MLOps engineer specializing in model monitoring configurations. 
Generate a complete and valid YAML configuration file for monitoring a machine learning model.
The configuration should be for a hypothetical monitoring system that uses concepts from MLflow for tracking, EvidentlyAI for drift detection, and Slack for alerting.

The configuration should be for the following model:
- Model Name: ${model.name}
- Model Type: ${model.type}
- Model Version: ${model.version}

The monitoring setup must track the following:
- Performance Metrics: Track accuracy, and for classification models, also track precision and recall.
- Data Drift: Monitor for drift on the following features: [${model.features.join(', ')}]. Use a baseline dataset located at '/data/baseline.csv'.
- Latency: Monitor the average inference time.

The alerting rules should be as follows:
- Trigger a CRITICAL alert to the '#ml-alerts-critical' Slack channel if 'accuracy' drops below 0.88.
- Trigger a WARNING alert to the '#ml-alerts-warning' Slack channel if data drift is detected on more than 2 features.
- Trigger a WARNING alert to the '#ml-alerts-warning' Slack channel if 'avg_latency_ms' exceeds ${Math.round(model.avgLatency * 1.5)}ms.

Produce only the YAML code in a single YAML block. Do not add any explanation, introductory text, or markdown formatting like \`\`\`yaml before or after the code block.
  `;

  return callGemini(prompt);
};