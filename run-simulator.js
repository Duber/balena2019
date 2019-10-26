process.env['MODE'] = 'simulator';
const env = require('./src/environment');
console.log(`Server uri is ${env.SERVER_URI}`);
console.log(`Running as ${env.MODE}`);

const App = require('./src/app');
const app = new App();
app.start();