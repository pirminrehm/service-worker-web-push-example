import { urlB64ToUint8Array } from './urlB64ToUint8Array.js';

const serverUrl = `http://${window.location.hostname}:3000`;

export const getPermission = () => {
  Notification.requestPermission(function (status) {
    console.log('Notification permission status:', status);
  });
};

export const getSubscription = async () => {
  const { pubkey } = await fetch(`${serverUrl}/pubkey`).then((res) => res.json());
  console.log('fetched public key:', pubkey);
  const subscription = await navigator.serviceWorker
    .getRegistration() //
    .then((registration) => {
      return registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlB64ToUint8Array(pubkey),
      });
    });
  console.log('created subscription:', subscription);
  // in production we would send it directly to our server and not store it on the window
  window.mySubscription = subscription;
};

export const sendToServer = async () => {
  if (!window.mySubscription) {
    console.log('No subscription yet created');
    return;
  }
  const subscription = JSON.stringify(window.mySubscription.toJSON(), null, 2);

  fetch(`${serverUrl}/subscription`, {
    method: 'POST',
    body: subscription,
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => console.log('successfully send subscription to server'))
    .catch((err) => console.error('error while sending to server', err));
};

export const sendMessageViaServer = async () => {
  const message = document.getElementById('message').value;
  const body = JSON.stringify({ message }, null, 2);

  fetch(`${serverUrl}/send`, {
    method: 'POST',
    body,
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => console.log('successfully send message via server to push service'))
    .catch((err) => console.error('error while sending to server', err));
};

export const displayNotificationDirectly = async () => {
  if (Notification.permission !== 'granted') {
    console.log('notification permission missing');
    return;
  }

  const options = {
    body: 'This notification is send without a server, directly by the browser',
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
        title: 'Close notification',
        icon: 'images/xmark.png',
      },
    ],
  };

  const registration = await navigator.serviceWorker.getRegistration();
  registration.showNotification('Notification without Push API', options);
};
