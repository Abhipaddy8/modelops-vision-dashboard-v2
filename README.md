# ModelOps Vision: Real-Time ML Model Monitoring Dashboard

**🔴 Live Demo: [https://modelops-vision-688040324061.us-west1.run.app/](https://modelops-vision-688040324061.us-west1.run.app/)**

![ModelOps Vision Screenshot](https://storage.googleapis.com/aistudio-marketplace-public/v1/model_builder_1720630718559/assets/dashboard_demo.gif)

ModelOps Vision is a sophisticated, real-time dashboard for monitoring machine learning models in production. It provides an at-a-glance view of model health, performance, and data drift, empowering MLOps engineers to detect and diagnose issues before they impact users.

The dashboard features a live data stream simulation and integrates with the **Google Gemini API** to provide two intelligent features: an AI-powered configuration generator and on-demand anomaly analysis.

## Why This Matters: The Business Impact

In a production environment, models can fail silently due to changes in data patterns (drift) or infrastructure issues. This can lead to poor business decisions, financial loss, and a degraded user experience.

**ModelOps Vision helps prevent these failures by providing:**
*   **Proactive Issue Detection:** Identify performance degradation and data drift early, before it affects downstream business metrics.
*   **Reduced Downtime:** The AI-powered insights rapidly accelerate root cause analysis, reducing the mean time to resolution (MTTR) for model-related incidents.
*   **Increased Team Efficiency:** Automates the generation of complex monitoring configurations, freeing up MLOps engineers to focus on higher-value tasks.

## ✨ Key Features

*   **Real-Time Metrics:** Live monitoring of model accuracy, latency, and request throughput with historical trend charts.
*   **Feature Drift Detection:** Visualizes distribution drift between baseline and current data for all model features.
*   **Live Inference Logging:** A real-time log of incoming prediction requests and their associated latency.
*   **Dynamic Alerting:** A dedicated panel for critical, warning, and informational alerts triggered by performance degradation or data drift.
*   **🤖 AI-Powered Anomaly Insights:** Users can click an alert to get an instant, data-driven analysis from the Gemini API, explaining the potential root cause and recommending next steps.
*   **🤖 AI YAML Generator:** Automatically generates a complete YAML monitoring configuration for the selected model, tailored for platforms like MLflow and EvidentlyAI.
*   **Multi-Model Support:** Seamlessly switch between monitoring multiple models via a simple dropdown.

## 🛠️ Tech Stack & Skills Demonstrated

This project showcases end-to-end development of a real-time monitoring solution.

*   **Frontend Development:** React, TypeScript, Tailwind CSS
*   **Data Visualization:** Recharts for interactive and responsive charts.
*   **Real-Time Systems:** Custom WebSocket service implementation for live data streaming.
*   **MLOps Concepts:** Deep understanding of model monitoring, accuracy drift, latency tracking, and feature drift.
*   **AI Integration:** Leveraging the Google Gemini API for intelligent automation (insights, config generation).
*   **UI/UX Design:** Creating an intuitive, data-dense, and highly functional dashboard interface.

## 🏛️ Architecture & Data Flow

This project is a frontend application designed to connect to a real-time data source. For this demo, it includes a sophisticated mock backend that simulates a live production environment.

**Data Flow:**
`Mock Backend Service` -> `WebSocket Stream` -> `React Frontend` -> `Live Dashboard UI`

1.  **Mock Backend (`services/webSocketService.ts`)**: This is the core of the data simulation. It acts as a fake production environment, periodically generating new metrics, triggering alerts based on predefined rules, and pushing these updates into a WebSocket-like event stream.
2.  **React Frontend (`hooks/useModelData.ts`, `components/`)**: The UI is built with React. A central hook, `useModelData`, subscribes to the WebSocket stream and manages all application state. The state is then passed down to reusable components that render the charts, logs, and alerts.
3.  **AI Service (`services/geminiService.ts`)**: This module is completely decoupled. When a user requests an insight or a YAML configuration, the frontend calls this service, which communicates directly with the Google Gemini API.

## 📂 Project Structure

The codebase is organized for clarity and scalability:

```
/
├── components/     # Reusable React components (charts, cards, panels)
├── hooks/          # Custom React hooks for state management (useModelData)
├── services/       # External service integrations (Gemini API, WebSocket simulation)
├── types.ts        # Centralized TypeScript type definitions for the application
├── App.tsx         # Main application component
└── index.tsx       # Entry point for the React application
```

## 🚀 Getting Started & Repurposing

Follow these steps to run the project locally and adapt it for your own MLOps pipeline.

### 1. Local Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/modelops-vision-dashboard.git
    cd modelops-vision-dashboard
    ```

2.  **Set Up Environment Variables:**
    *   Create a file named `.env` in the project root. You can copy the example: `cp .env.example .env`
    *   Add your Google AI Studio API key to the `.env` file. This is required for the "AI Insights" and "YAML Generator" features.
        ```
        # .env file
        API_KEY="YOUR_GOOGLE_AI_STUDIO_API_KEY_HERE"
        ```

3.  **Run the project:**
    *   **In AI Studio:** The project runs out-of-the-box with no further setup.
    *   **For Standalone Development:** This project is configured to use an `importmap`. To run it locally, you would need a build tool like Vite. After initializing a Vite project, you would move the source files here and install the dependencies (`react`, `react-dom`, `recharts`, `@google/genai`) via `npm install`.

### 2. Connecting to Your **Real** Backend

To use this dashboard with your actual production models, you only need to replace one file: `services/webSocketService.ts`. The frontend is decoupled from the mock service and expects a specific event-based interface.

Your new service (e.g., using a real `WebSocket` or a library like `Socket.IO`) must emit the following events:

| Event Name             | Payload Type                               | Description                                                                 |
| ---------------------- | ------------------------------------------ | --------------------------------------------------------------------------- |
| `status`               | `ConnectionStatus`                         | Emits the connection status (`Connecting`, `Connected`, `Disconnected`).    |
| `initial-state`        | `{ models: Model[], activeModelId: string }` | Sent on connection, providing the list of models and the active one.        |
| `active-model-changed` | `string` (modelId)                         | Informs the UI that the active model has changed.                           |
| `new-alert`            | `Alert`                                    | Pushes a new alert object to the UI.                                        |
| `new-log`              | `InferenceLog`                             | Pushes a new inference log entry to the UI.                                 |
| `model-update`         | `Model`                                    | Pushes a complete, updated model object with new metrics.                   |

### 3. Customizing Monitored Models (in Mock Service)

To test the UI with your own model definitions, simply edit the `INITIAL_MODELS` constant at the top of `services/webSocketService.ts`.

## 🔮 Future Roadmap & Production-Ready Enhancements

This project provides a strong foundation. The next steps to make it fully production-ready would include:

*   **Real Data Integration:** Replace the mock service with a real WebSocket client connected to a production data stream from sources like Kafka, Kinesis, or Google Pub/Sub.
*   **Advanced Alerting:** Integrate with real alerting systems like PagerDuty or Slack Webhooks to notify on-call engineers.
*   **Historical Analysis:** Add features to query and visualize model performance over longer time ranges (e.g., weeks or months) instead of just a live window.
*   **Authentication & Authorization:** Implement user login and role-based access control (RBAC) to restrict access to specific models or features.
*   **Model Retraining Trigger:** Add functionality to trigger a model retraining pipeline directly from the dashboard when significant drift is detected.
