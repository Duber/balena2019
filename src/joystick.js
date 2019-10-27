var env = require('./environment');

module.exports.createJoystick = () => {
    return env.MODE === 'simulator'?
        new JoystickSimulator() :
        new Joystick();
};

class Joystick {
    constructor() {
        this.onPressListeners = [];
        this.onHoldListeners = [];
    }

    listen() {
        require('node-sense-hat').Joystick.getJoystick()
            .then((js) => {
                this.joystick = js;
                this.joystick.on('press', (direction) => {
                    this.onPressListeners.forEach(listener => listener(direction));
                });

                this.joystick.on('hold', (direction) => {
                    this.onHoldListeners.forEach(listener => listener(direction));
                });
            });

        return this;
    }

    onPress(callback) {
        this.onPressListeners.push(callback);
        return this;
    }

    onHold(callback) {
        this.onHoldListeners.push(callback);
        return this;
    }
}

class JoystickSimulator {
    listen() {
        const readline = require('readline');
        readline.emitKeypressEvents(process.stdin);
        process.stdin.setRawMode && process.stdin.setRawMode(true);
        return this;
    }

    onPress(callback) {
        process.stdin.on('keypress', (str, key) => {
            let name = key.name;
            if (key.ctrl && name === 'c') {
                process.exit();
            } else if (str === '.') { // simulate click with "."
                name = 'click';
            }
            callback(name);
        });
        return this;
    }

    onHold(callback) {
        // not implemented
    }
}