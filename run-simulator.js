process.env['MODE'] = 'simulator';
// when argument is provided, override DEVICE
if (process.argv[2]) {
    process.env['DEVICE'] = process.argv[2];
}

const env = require('./src/environment');
console.log(`Server uri is ${env.SERVER_URI}`);
console.log(`Running as ${env.MODE}. Device ${env.DEVICE}`);

const App = require('./src/app');
const app = new App();
app.start();