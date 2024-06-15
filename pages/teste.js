// Seu componente ou página Next.js

import { useEffect } from 'react';

function PageComponent() {
  useEffect(() => {
    async function askNotificationPermission() {
      if (Notification.permission === 'default') {
        const permission = await Notification.requestPermission();
        return permission;
      }
      return Notification.permission;
    }

    askNotificationPermission().then(permission => {
      if (permission === 'granted') {
        console.log('Permissão para notificações concedida.');
        // Agora você pode enviar notificações
        sendNotification();
      } else {
        console.warn('Permissão para notificações não foi concedida.');
      }
    });
  }, []);

  function sendNotification() {
    // Exemplo de envio de notificação
    if ('serviceWorker' in navigator && Notification.permission === 'granted') {
      navigator.serviceWorker.ready.then(registration => {
        registration.showNotification('Nova mensagem recebida', {
          body: 'Você tem uma nova mensagem para ler.',
          icon: '/path/to/icon.png',
          data: { url: '/inbox' }
        });
      });
    }
  }

  return (
    <div>
      <h1>Exemplo de Notificação Push no Next.js</h1>
      <button onClick={sendNotification}>Enviar Notificação</button>
    </div>
  );
}

export default PageComponent;
