self.addEventListener('install', event => {
    console.log('Service Worker instalado.');
  });
  
  self.addEventListener('activate', event => {
    console.log('Service Worker ativado.');
  });
  
  self.addEventListener('push', event => {
    console.log('Evento de push recebido:', event);
    const data = event.data.json();
    const title = data.title || 'Notificação Push';
    const options = {
      body: data.body || 'Esta é uma notificação push.',
      icon: data.icon || '/path/to/icon.png',
      data: { url: data.url || '/' }
    };
    event.waitUntil(self.registration.showNotification(title, options));
  });
  
  self.addEventListener('notificationclick', event => {
    event.notification.close();
    const urlToOpen = event.notification.data.url;
    event.waitUntil(clients.openWindow(urlToOpen));
  });
  