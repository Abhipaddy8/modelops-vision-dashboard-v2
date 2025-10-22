# ModelOps Vision: Real-Time ML Model Monitoring Dashboard

**Live Demo:** [**https://your-deployment-url-here.vercel.app**](https://your-deployment-url-here.vercel.app) _(Replace with your Vercel URL after deployment)_

![ModelOps Vision Screenshot](URL_TO_YOUR_SCREENSHOT_OR_GIF_HERE)

ModelOps Vision is a sophisticated, real-time dashboard for monitoring machine learning models in production. It provides an at-a-glance view of model health, performance, and data drift, empowering MLOps engineers to detect and diagnose issues before they impact users.

The dashboard features a live data stream simulation and integrates with the **Google Gemini API** to provide two intelligent features: an AI-powered configuration generator and on-demand anomaly analysis.

### ✨ Key Features

*   **Real-Time Metrics:** Live monitoring of model accuracy, latency, and request throughput with historical trend charts.
*   **Feature Drift Detection:** Visualizes distribution drift between baseline and current data for all model features.
*   **Live Inference Logging:** A real-time log of incoming prediction requests and their associated latency.
*   **Dynamic Alerting:** A dedicated panel for critical, warning, and informational alerts triggered by performance degradation or data drift.
*   **🤖 AI-Powered Anomaly Insights:** Users can click on an alert to get an instant, data-driven analysis from the Gemini API, explaining the potential root cause and recommending next steps.
*   **🤖 AI YAML Generator:** Automatically generates a complete YAML monitoring configuration file for the selected model, tailored to platforms like MLflow and EvidentlyAI.
*   **Multi-Model Support:** Seamlessly switch between monitoring multiple models via a simple dropdown.

### 🛠️ Tech Stack

*   **Frontend:** React, TypeScript, Tailwind CSS
*   **Charting:** Recharts
*   **AI Integration:** Google Gemini API (`gemini-2.5-flash`)
*   **Real-Time Simulation:** A custom-built mock WebSocket service to mimic a live production data stream.

### 🚀 Running Locally

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/your-repo-name.git
    cd your-repo-name
    ```

2.  **Install dependencies:**
    *(This project uses an `importmap`, so a traditional `npm install` for packages like React is not required if running in a compatible environment like AI Studio. If setting up locally with a build tool like Vite, you would run `npm install` here.)*

3.  **Set up environment variables:**
    *   Create a file named `.env` in the root of the project by copying the example file: `cp .env.example .env`
    *   Add your Google AI Studio API key to the new `.env` file:
        ```
        API_KEY="YOUR_GOOGLE_AI_STUDIO_API_KEY_HERE"
        ```

4.  **Start the development server:**
    *(This depends on your local setup. If you've configured a project with Vite or Create React App, you would typically run:)*
    ```bash
    npm run dev 
    ```
    or
    ```bash
    npm start
    ```
