import webpush from 'web-push';
import fastifyCors from 'fastify-cors';
import fastifyStatic from 'fastify-static';
import Fastify from 'fastify';
import path from 'path';

const fastify = Fastify({
  logger: true,
});
fastify.register(fastifyCors, {});

fastify.register(fastifyStatic, {
  root: path.join(path.resolve(), 'client'),
});

// demo only! keys should be stored in a secure way outside of the code
const pubkey = 'BH19JAvACS1b2J9qa2kLXq0bEmP9NNfAqJMJyzlMtVef36wvt3HX_1KGSdzRmfhqXPj460ZP7WzBKRk1Fl6O6pc';
const privatekey = 'FHAee6f4Af0KzE81At2UmHxY5eM3gaj-dU715KfKvQQ';

webpush.setVapidDetails(
  // used in case the push service notice a problem with your feed and need to contact you
  'mailto:you@example.com',
  pubkey,
  privatekey
);

let pushSubscriptions = [];

fastify.get('/pubkey', async (request, reply) => {
  return { pubkey };
});

fastify.post('/subscription', async (request, reply) => {
  if (pushSubscriptions.find((subscription) => request.body.endpoint === subscription.endpoint)) {
    reply.status(400).send('Error: Subscription already registered');
    return;
  }

  if (pushSubscriptions.length > 50) {
    request.log.info(`Unregister Subscription`);
    pushSubscriptions.shift();
  }

  pushSubscriptions.push(request.body);
  request.log.info(`Register Subscription Nr. ${pushSubscriptions.length}`);
  reply.send();
});

fastify.post('/send', async (request, reply) => {
  const message = request.body.message;
  if (!pushSubscriptions.length) {
    return reply.status(400).send('Error: missing subscriptions');
  }
  const sendMessages = pushSubscriptions.map((pushSubscription) => {
    webpush.sendNotification(pushSubscription, message);
  });
  await Promise.all(sendMessages);
  reply.send();
});

fastify.listen(8080, '0.0.0.0').catch((error) => fastify.log.error(error));
