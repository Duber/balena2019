const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    DEVICE: process.env.DEVICE,
    MODE: process.env.MODE,
    SERVER_PORT: process.env.SERVER_PORT || 8080,
    SERVER_URI: process.env.SERVER_URI,
    RATE: +(process.env.RATE || 50),
    BALL_COLOR: (process.env.BALL_COLOR || '255,0,0').split(',').map(i => +i),
    BALL_X: +(process.env.BALL_X || 0),
    BALL_Y: +(process.env.BALL_Y || 0)
};