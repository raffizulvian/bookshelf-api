const hapi = require('@hapi/hapi');
const routes = require('./routes');

/**
 * Menginisialisasi server.
 * @async
 * @requires hapi
 */
const init = async () => {
  const server = hapi.server({
    port: 5000,
    host: 'localhost',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  server.route(routes);

  await server.start();

  // eslint-disable-next-line no-console
  console.log(`SERVER RUNNING ON: ${server.info.uri}`);
};

init();
