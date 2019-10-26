const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    DEVICE: process.env.DEVICE,
    MODE: process.env.MODE,
    SERVER_PORT: process.env.SERVER_PORT || 8080,
    SERVER_URI: process.env.SERVER_URI,
    RATE: process.env.RATE || 50,
    BALL_COLOR_R: process.env.BALL_COLOR_R || 255,
    BALL_COLOR_G: process.env.BALL_COLOR_G || 0,
    BALL_COLOR_B: process.env.BALL_COLOR_B || 0,
    BALL_X: process.env.BALL_X || 0,
    BALL_Y: process.env.BALL_Y || 0
};