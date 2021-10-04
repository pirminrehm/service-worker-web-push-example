# Web Push API Example including Service Worker and minimalistic Application Server

This is an out of the box working example for Web Push Notifications.
It consists of a client with a Service Worker to register for push messages and a simple application server, which is using the [web-push](https://www.npmjs.com/package/web-push) lib and [VAPID](https://blog.mozilla.org/services/2016/08/23/sending-vapid-identified-webpush-notifications-via-mozillas-push-service/) to send the notification.

## Getting Started

- clone the repo and install dependencies
- run 'npm run serve` for the client
- run 'npm run start` for the server in parallel
- go to http://localhost:8080 and read on there

## Prerequisites

- Node.js 14 or higher
- some latest browsers
