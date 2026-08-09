// service-worker.js

self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Встановлено');
  self.skipWaiting(); // активувати одразу
});

self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Активовано');
  event.waitUntil(clients.claim()); // контролювати всі сторінки одразу
});

// Обробка події push (не обов'язково для локальних сповіщень, але додаємо для сумісності)
self.addEventListener('push', (event) => {
  const data = event.data?.json() || { title: 'Helper', body: 'Нове замовлення' };
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: 'icon.png',   // переконайся, що цей файл є
      requireInteraction: false
    })
  );
});

// Клік по сповіщенню — фокусуємо вікно (якщо треба)
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      for (const client of clientList) {
        if (client.url && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow('/');
    })
  );
});
