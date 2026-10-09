import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { SettingsProvider } from './context/SettingsContext.jsx';

if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

// Offline refresh support: the service worker caches the app shell, so a
// reload with no connection boots the custom offline screen instead of the
// browser's default offline page. Production only — never in dev.
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  // The first visit's bundles usually load before the worker takes control,
  // which would leave a cached shell pointing at uncached files (blank page
  // offline). Priming stores this page's own scripts/styles explicitly.
  const primeCache = () => {
    if (!navigator.onLine || !('caches' in window)) return;
    const urls = new Set();
    document
      .querySelectorAll('script[src], link[rel="stylesheet"][href]')
      .forEach((el) => {
        const u = el.src || el.href;
        if (u.startsWith(window.location.origin)) urls.add(u);
      });
    if (urls.size === 0) return;
    caches
      .open('aayush-portfolio-v1')
      .then((cache) => cache.addAll([...urls]).catch(() => {}))
      .catch(() => {});
  };
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register(`${import.meta.env.BASE_URL}sw.js`)
      .then(primeCache)
      .catch(() => {});
    navigator.serviceWorker.addEventListener('controllerchange', primeCache);
  });
}

const rootEl = document.getElementById('root');
if (rootEl) {
  ReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
      <SettingsProvider>
        <App />
      </SettingsProvider>
    </React.StrictMode>
  );
}
