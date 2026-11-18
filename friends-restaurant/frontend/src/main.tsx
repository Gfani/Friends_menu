import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Automatically handle Vite new-deployment bundle chunk mismatches
window.addEventListener('vite:preloadError', (event) => {
  console.warn('New app version detected, reloading to load fresh bundle...', event);
  window.location.reload();
});

// Mount React Root
const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

// Register Progressive Web App Service Worker with auto-update
if ('serviceWorker' in navigator && (import.meta.env.PROD || (typeof process !== 'undefined' && process.env?.NODE_ENV === 'production'))) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        // Check for service worker updates immediately
        registration.update().catch(() => {});
      })
      .catch((err) => {
        console.warn('SW registration skipped:', err);
      });
  });
}
