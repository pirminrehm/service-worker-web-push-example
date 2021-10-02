self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('push', (e) => {
  const body = e.data.text() || 'Push message has no payload';

  const options = {
    body,
    icon: 'images/checkmark.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
    actions: [
      {
        action: 'explore',
        title: 'Explore this new world',
        icon: 'images/checkmark.png',
      },
      {
        action: 'close',
        title: "I don't want any of this",
        icon: 'images/xmark.png',
      },
    ],
  };
  e.waitUntil(self.registration.showNotification('Notification via Server and Push API', options));
});

self.addEventListener('notificationclick', (event) => {
  const eventAction = event.action;
  console.log('message event fired! event action is:', `'${eventAction}'`);

  if (eventAction !== 'explore') {
    return;
  }

  const url = 'https://developer.mozilla.org/en-US/docs/Web/API/Push_API';
  event.notification.close(); // Android needs explicit close.
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((windowClients) => {
      // Check if there is already a window/tab open with the target URL
      for (var i = 0; i < windowClients.length; i++) {
        var client = windowClients[i];
        // If so, just focus it.
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      // If not, then open the target URL in a new window/tab.
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});
