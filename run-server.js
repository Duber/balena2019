process.env['MODE'] = 'server';
const env = require('./src/environment');
const server = require('./src/server');

server.run(env.SERVER_PORT);