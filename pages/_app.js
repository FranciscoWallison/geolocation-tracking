import "@/styles/globals.css";

// _app.js

import { useEffect } from 'react';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', async () => {
        try {
          const registration = await navigator.serviceWorker.register('/service-worker.js');
          console.log('Service Worker registrado com sucesso:', registration);
        } catch (error) {
          console.error('Falha ao registrar o Service Worker:', error);
        }
      });
    }
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;
