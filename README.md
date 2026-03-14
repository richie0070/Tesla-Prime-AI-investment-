
# Tesla Prime AI Investment Broker

Tesla Prime AI is a sophisticated AI-driven trading platform simulation featuring high-frequency algorithmic execution visualization. This project demonstrates a modern fintech interface with real-time data simulation and AI integration using Google's Gemini API.

## Features

- **AI-Powered Analysis**: Utilizes Google Gemini to provide market analysis and support chat.
- **Real-time Simulation**: Simulates market data feeds, trading activities, and portfolio performance.
- **Institutional Design**: High-end, dark-mode UI inspired by professional trading terminals.
- **Admin & User Roles**: Includes an admin dashboard for managing users and system configurations.

## Setup & Installation

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Environment Configuration**
    Create a `.env` file in the root directory and add your Google Gemini API key:
    ```env
    API_KEY=your_actual_api_key_here
    ```
    *Note: The application requires a valid API key to function correctly.*

3.  **Run Development Server**
    ```bash
    npm run dev
    ```

4.  **Build for Production**
    ```bash
    npm run build
    ```

## Deployment on Netlify (Recommended)

1.  Push your code to a GitHub repository.
2.  Import the repository in [Netlify](https://www.netlify.com/).
3.  The build settings should automatically populate from `netlify.toml`:
    - **Build Command**: `npm run build`
    - **Publish directory**: `dist`
4.  Go to **Site Settings > Build & Deploy > Environment variables**.
5.  Add your Google Gemini API Key:
    - **Key**: `API_KEY`
    - **Value**: `Your_Gemini_API_Key_Here`
6.  Click **Deploy Site**.

## Deployment on Vercel

1.  Push your code to a GitHub repository.
2.  Import the repository in [Vercel](https://vercel.com).
3.  In the Project Settings during import, expand **Environment Variables**.
4.  Add your Google Gemini API Key:
    - **Key**: `API_KEY`
    - **Value**: `Your_Gemini_API_Key_Here`
5.  Click **Deploy**.

## Technologies

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Recharts
- Google GenAI SDK

## Disclaimer

This application is a **simulation** and proof-of-concept. No real financial trades are executed.