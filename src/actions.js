const env = require('./environment');

const actionTypes = {
    BALL_EXIT: 'BALL_EXIT'
};

module.exports.ballExitAction = function(dest, ball) {
    return {
        type: actionTypes.BALL_EXIT,
        origin: env.DEVICE,
        destination: dest,
        ball: ball
    };
}

module.exports.actionTypes = actionTypes;