import webpush from 'web-push';
import fastifyCors from 'fastify-cors';
import Fastify from 'fastify';

const fastify = Fastify({
  logger: true,
});
fastify.register(fastifyCors, {});

// domo only! keys should be stored in a secure way outside of the code
const pubkey = 'BH19JAvACS1b2J9qa2kLXq0bEmP9NNfAqJMJyzlMtVef36wvt3HX_1KGSdzRmfhqXPj460ZP7WzBKRk1Fl6O6pc';
const privatekey = 'FHAee6f4Af0KzE81At2UmHxY5eM3gaj-dU715KfKvQQ';

webpush.setVapidDetails(
  // used in case the push service notice a problem with your feed and need to contact you
  'mailto:you@example.com',
  pubkey,
  privatekey
);

let pushSubscription;

fastify.get('/pubkey', async (request, reply) => {
  return { pubkey };
});

fastify.post('/subscription', async (request, reply) => {
  pushSubscription = request.body;
  reply.send();
});

fastify.post('/send', async (request, reply) => {
  const message = request.body.message;
  if (!pushSubscription) {
    return reply.status(400).send('Error: missing subscription');
  }
  await webpush.sendNotification(pushSubscription, message);
  reply.send();
});

fastify.listen(3000, '0.0.0.0').catch((error) => fastify.log.error(error));
