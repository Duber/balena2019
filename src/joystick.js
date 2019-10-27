var env = require('./environment');
const { create } = require('pi-sense-hat');

module.exports.createJoystick = () => {
    return env.MODE === 'simulator'?
        new JoystickSimulator() :
        new Joystick();
};

class Joystick {
    constructor() {
        this.senseHat = create();
        this.messageStates = {
            release: 0,
            press: 1,
            hold: 2
        };
        this.onPressListeners = [];
        this.onHoldListeners = [];
        this.onReleaseListeners = [];
    }

    listen() {
        this.senseHat.on("joystick", (message) => {
            const key = message.key.toLower();
            switch (message.state) {
                case this.messageStates.release:
                    this.onPressListeners.forEach(listener => listener(key));
                    break;
                case this.messageStates.press:
                    this.onPressListeners.forEach(listener => listener(key));
                    break;
                case this.messageStates.hold:
                    this.onHoldListeners.forEach(listener => listener(key));
                    break;
            }
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

    onRelease(callback) {
        this.onReleaseListeners.push(callback);
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
                name = 'enter';
            }
            callback(name);
        });
        return this;
    }

    onHold(callback) {
        // not implemented
    }
    
    onRelease(callback) {
        // not implemented
    }
}