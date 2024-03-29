const env = require('./environment');

module.exports.createDisplay = () => {
    return env.MODE === 'simulator'?
        new ConsoleDisplay() :
        new Display();
};

class Display {
    constructor() {
        this.matrix = require('node-sense-hat').Leds;
    }

    clear() {
        this.matrix.clear();
    }

    setPixel(x, y, color) {
        this.matrix.setPixel(x, y, color);
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
        const value = color !== color.reduce((a,b) => a+b) > 0 ? 1 : 0;
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