// This file is meant to be used as a starting point for a sense-hat application
// using node-sense-hat. It first sets up a ball to be drawn, at a specific
// position with a specific color.
// A function to draw the said ball is then created, and also setup to be called
// once every 50ms.
// We then register for events on the joystick, and use the information passed
// into the event handlers to move the ball in the same direction that the
// joystick is pressed.

// For more information about the APIs, see:
//  * https://github.com/resin-io-playground/node-sense-hat
//  * https://github.com/aonghusonia/sense-hat-led
//  * https://github.com/resin-io-playground/sense-joystick
SenseHat = require('node-sense-hat');

config = {
	xmax: 7,
	ymax: 7 
};

// Let's pull out the joystick library
JoystickLib = SenseHat.Joystick;

// And the handle to the LED matrix
matrix = SenseHat.Leds;

initialBall = {
	color: [ 255, 0, 0 ],
	x: 0,
	y: 0
}

balls = [ initialBall ];

function reset(){
	balls = [ initialBall ];
}

function sendNorth(ball){

}

function sendSouth(ball){
	
}

function sendEast(ball){
	
}

function sendWest(ball){
	
}

function recieveFromNorth(ball){
	ball.x = 0;
	balls.push(ball);
}

function recieveFromSouth(ball){
	ball.x = 7;
	balls.push(ball);
}

function recieveFromEast(ball){
	ball.y = 0;
	balls.push(ball);
}

function recieveFromWest(ball){
	ball.y = 7;
	balls.push(ball);
}

function drawBall() {
	matrix.clear();

	balls.forEach(function(ball){
		matrix.setPixel(ball.x, ball.y, ball.color);
	});
}

// We want the ball to be constantly redrawn, it will be changing
// location after all!

// Call our drawing function every 50ms
interval = 50;
setInterval(drawBall, interval);

// Now that we have setup our drawing function, let's get a "handle" to the
// joystick on the sense-hat, which is a way to receive events when the
// joystick is used
JoystickLib.getJoystick()
.then(function(joystick) {
	// The joystick handle is defined inside of this function

	// Given a direction, return the vector of change that this direction
	// corresponds to
	function directionToVector(direction) {
		switch(direction) {
			case 'up':
				return { x: 0, y: -1 };
			case 'down':
				return { x: 0, y: 1 };
			case 'left':
				return { x: -1, y: 0 };
			case 'right':
				return { x: 1, y: 0 };
		}
	}

	function processMovement(direction){
		if (direction == 'click'){
			return reset();
		}
		vector = directionToVector(direction);
		newBalls = [];
		balls.forEach(function(ball){
			ball.x += vector.x;
			ball.y += vector.y;
			if (ball.x > config.xmax){
				sendNorth(ball);
			}
			else if (ball.x < 0){
				sendSouth(ball);
			}
			else if (ball.y > config.ymax){
				sendEast(ball);
			}
			else if (ball.y < 0){
				sendWest(ball);
			}
			else 
				newBalls.push(ball);
		});
		balls = newBalls;
	}

	// Let's register for some events

	// When the joystick is pressed, the below function will execute,
	// with the direction variable being one of 'up', 'down', 'left' or 'right'
	joystick.on('press', function(direction) {
		console.log('The joystick was pressed ' + direction);		
		processMovement(direction);
	});

	// When the joystick is held, the below function will execute,
	// with the direction variable being one of 'up', 'down', 'left' or 'right'
	joystick.on('hold', function(direction) {
		console.log('The joystick is being held ' + direction);
		processMovement(direction);
	});
});
