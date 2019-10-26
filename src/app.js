
SenseHat = require('node-sense-hat');
serverUri = require('./environment').SERVER_URI;
serverPort = require('./environment').SERVER_PORT;
JoystickLib = SenseHat.Joystick;
matrix = SenseHat.Leds;
config = {
	xmax: 7,
	ymax: 7 
};


oscClient = new osc.WebSocketPort({
    url: `ws://${serverUri}:${serverPort}`, // URL to your Web Socket server.
    metadata: true
});
oscClient.open();
oscClient.on("message", function (ball) {
    recieveFromNorth(ball);
});

function initialBalls(){
	return [
		{
			color: [ 255, 0, 0 ],
			x: 0,
			y: 0
		} 
	]
}

balls = initialBalls();

function reset(){
	balls = initialBalls();
}

function sendNorth(ball){
	oscClient.send(ball);
}

function sendSouth(ball){
	oscClient.send(ball);
}

function sendEast(ball){
	oscClient.send(ball);
}

function sendWest(ball){
	oscClient.send(ball);
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
