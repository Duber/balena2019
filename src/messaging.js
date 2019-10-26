var device = require('./environment').DEVICE;
var messageTypes = {
    INIT: 'INIT'
};

module.exports.initAction = function() {
    return {
        type: messageTypes.INIT,
        device: device
    };
}

module.exports.messageTypes = messageTypes;