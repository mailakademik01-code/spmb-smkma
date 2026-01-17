
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

// Shim dasar untuk mencegah crash ReferenceError: process is not defined di browser
if (typeof window !== 'undefined' && !(window as any).process) {
  (window as any).process = { env: { API_KEY: '' } };
}

const mountApp = () => {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    console.error("Target container 'root' not found");
    return;
  }

  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error("Failed to render the app:", error);
  }
};

mountApp();
