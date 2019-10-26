module.exports.get = () => {
    var env = require('./environment');
    if (env.MODE === 'simulator') {
        return Promise.resolve(new JoystickSimulator());
    } else if (env.MODE === 'client') {
        return require('node-sense-hat').Joystick.getJoystick();
    }
}

class JoystickSimulator {
    on(eventName, callback) {
        if (eventName === 'press') {
            const readline = require('readline');
            readline.emitKeypressEvents(process.stdin);
            process.stdin.setRawMode(true);

            process.stdin.on('keypress', (str, key) => {
                let name = key.name;
                if (key.ctrl && name === 'c') {
                    process.exit();
                } else if (str === '.') { // simulate click with "."
                    name = 'click';
                }
                callback(name);
            });
        }
    }
}