const env = require('./src/environment');
const Client = require('./src/client');
const { actionTypes } = require('./src/actions');

var runMessage = {
    type: actionTypes.BALL_EXIT,
    origin: "S",
    destination: "N",
    ball: {
        "color": [0, 255, 0],
        "x": 2,
        "y": 2
    }
};

const client = new Client(env.SERVER_URI);
let waitingSend = true;
client.connect()
    .onOpen(() => {
        client.send(runMessage);
        waitingSend = false;
    })
    .onMessage((message) => {
        console.log('Received message\n', message);
        if (!waitingSend) {
            process.exit(0);
        }
    });