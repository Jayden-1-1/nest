import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { LanguageProvider } from './locales';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { HomeProvider } from './context/HomeContext';
import { TaskProvider } from './context/TaskContext';
import { ToastProvider } from './context/ToastContext';
import { CouponProvider } from './context/CouponContext';

// Register PWA service worker with auto-update
if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
  window.addEventListener('load', () => {
    const basePath = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : import.meta.env.BASE_URL + '/';
    const swUrl = `${basePath}sw.js`;
    navigator.serviceWorker.register(swUrl).then((reg) => {
      reg.update();
    }).catch((err) => {
      console.warn('SW registration fallback:', err);
    });
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LanguageProvider>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <HomeProvider>
              <TaskProvider>
                <CouponProvider>
                  <App />
                </CouponProvider>
              </TaskProvider>
            </HomeProvider>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </LanguageProvider>
  </React.StrictMode>
);
