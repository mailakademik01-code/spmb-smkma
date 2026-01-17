
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

// Pastikan process.env tersedia di browser tanpa merusak variabel yang sudah ada
if (typeof window !== 'undefined') {
  const win = window as any;
  if (!win.process) win.process = { env: {} };
  if (!win.process.env) win.process.env = {};
  // Jangan menimpa jika sudah ada nilainya dari Vercel/hosting
  if (win.process.env.API_KEY === undefined) {
    win.process.env.API_KEY = '';
  }
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
    // Tampilkan pesan eror visual jika terjadi kegagalan fatal
    rootElement.innerHTML = `
      <div style="padding: 20px; font-family: sans-serif; text-align: center;">
        <h1 style="color: #e11d48;">Terjadi Kesalahan Aplikasi</h1>
        <p>Gagal memuat sistem SPMB. Silakan refresh halaman atau hubungi tim IT kami.</p>
        <code style="background: #f1f5f9; padding: 10px; display: block; border-radius: 8px;">${error}</code>
      </div>
    `;
  }
};

mountApp();
