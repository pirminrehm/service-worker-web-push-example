import * as util from './util.js';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((registration) => {
        console.log(`ServiceWorker registration successful with scope: ${registration.scope}`);
        return registration.update();
      })
      .then((registration) => console.log(`ServiceWorker updated`))
      .catch((err) => console.log('ServiceWorker registration failed: ', err));
  });
}

['getPermission', 'getSubscription', 'sendToServer', 'sendMessageViaServer', 'displayNotificationDirectly'].forEach(
  (func) => {
    document.getElementById(`btn-${func}`).addEventListener('click', () => {
      util[func]();
    });
  }
);
