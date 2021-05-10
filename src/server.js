const Hapi = require('@hapi/hapi');
const routes = require('./routes');

const server = Hapi.server({
  port: 5000,
  host: 'localhost',
  routes: {
    cors: {
      origin: ['*'],
    },
  },
});

server.route(routes);

/**
 * Menginisialisasi server.
 * @async
 * @requires hapi
 */
const init = async () => {
  await server.start();

  // eslint-disable-next-line no-console
  console.log(`SERVER RUNNING ON: ${server.info.uri}`);
};

init();

module.exports = server;
