const env = require('./environment');
const { create } = require('pi-sense-hat');

module.exports.createDisplay = () => {
    return env.MODE === 'simulator'?
        new ConsoleDisplay() :
        new Display();
};

class Display {
    constructor() {
        this.senseHat = create();
    }

    clear() {
        this.senseHat.setPixelColour('*', '*', 'off');
    }

    setPixel(x, y, color) {
        this.senseHat.setPixelColour(x, y, color);
    }
}

class ConsoleDisplay {
    constructor() {
        this.clear();
        this.lastRender = null;
    }

    clear() {
        this.display = [
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0]
        ];
        this.render();
    }

    setPixel(x, y, color) {
        // simplify colors to 1 or 0
        const value = color !== 'off' ? 1 : 0;
        this.display[y][x] = this.display[y][x] + value;
        this.render();
    }

    render() {
        const textRender = this.display.map(row => {
            return row.join(' ');
        }).join('\n');
        if (textRender !== this.lastRender) {
            process.stdout.write('\n\n\n\n\n\n\n');
            console.log(textRender);
            this.lastRender = textRender;
        }
    }
}