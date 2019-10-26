
SenseHat = require('node-sense-hat');
serverUri = require('./environment').SERVER_URI;
device = require('./environment').DEVICE;
ballColorR = require('./environment').BALL_COLOR_R;
ballColorG = require('./environment').BALL_COLOR_G;
ballColorB = require('./environment').BALL_COLOR_B;
ballX = require('./environment').BALL_X;
ballY = require('./environment').BALL_Y;
var WebSocket = require('ws');


JoystickLib = SenseHat.Joystick;
matrix = SenseHat.Leds;
config = {
	xmax: 7,
	ymax: 7 
};

function initialBalls(){
	return [
		{
			color: [+ballColorR, +ballColorG, +ballColorB ],
			x: +ballX,
			y: +ballY
		} 
	]
}

balls = initialBalls();

function reset(){
	balls = initialBalls();
}

function drawBall() {
	matrix.clear();

	balls.forEach(function(ball){
		matrix.setPixel(ball.x, ball.y, ball.color);
	});
}

interval = 50;
setInterval(drawBall, interval);

function eastExit(ball) {
	return ball.x < 0;
}

function westExit(ball) {
	return ball.x > config.xmax;
}

function northExit(ball) {
	return ball.y < 0;
}

function southExit(ball) {
	return ball.y > config.ymax;
}

function receiveFromNorth(ball){
	switch(device){
		case "S":
			if (northExit(ball))
				ball.y = 0;
			else
				ball.y = 7;
			return;
		case "E":
			ball.x = 0;
			return;
		case "W":
			ball.x = 7;
			return;
	}
	balls.push(ball);
}

function receiveFromSouth(ball){
	switch(device){
		case "N":
			if (northExit(ball))
				ball.y = 0
			else
				ball.y = 7;
			return;
		case "E":
			ball.x = 7;
			return;
		case "W":
			ball.x = 0;
			return;
	}
	balls.push(ball);
}

function receiveFromEast(ball){
	switch(device){
		case "N":
			ball.x = 7;
			return;
		case "S":
			ball.x = 0;
			return;
		case "W":
			if (northExit(ball))
				ball.y = 0;
			else
				ball.y = 7;
			return;
	}
	balls.push(ball);
}

function receiveFromWest(ball){
	switch(device){
		case "N":
			ball.x = 0;
			return;
		case "S":
			ball.x = 7;
			return;
		case "E":
			if (northExit(ball))
				ball.y = 0;
			else
				ball.y = 7;
			return;
	}	
	balls.push(ball);
}

const ws = new WebSocket(serverUri);


ws.on('message', function incoming(data) {
  console.log('Received message', data);
  msg = JSON.parse(data)
	if (msg.destination != device){
		return;
	}
	switch(msg.origin){
		case "N":
			receiveFromNorth(msg.ball)
			return;
		case "S":
			receiveFromSouth(msg.ball)
			return;
		case "E":
			receiveFromEast(msg.ball)
			return;
		case "W":
			receiveFromWest(msg.ball)
			return;
	}
});

ws.on('open', function open() {
	function send(dest, ball){
		ws.send(JSON.stringify({
			origin: device,
			destination: dest,
			ball: ball
		}));
	}
	
	function sendNorth(ball){
		send('N', ball);
	}
	
	function sendSouth(ball){
		send('S', ball);
	}
	
	function sendEast(ball){
		send('E', ball);
	}
	
	function sendWest(ball){
		send('W', ball);
	}
	
	JoystickLib.getJoystick()
	.then(function(joystick) {
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
				if (southExit(ball)){
					switch(device){
						case "N":
							sendSouth(ball);
							break;
						case "S":
							sendNorth(ball);
							break;
						case "E":
							sendWest(ball);
							break;
						case "W":
							sendEast(ball);
							break;
					}
				}
				else if (northExit(ball)){
					switch(device){
						case "N":
							sendSouth(ball);
							break;
						case "S":
							sendNorth(ball);
							break;
						case "E":
							sendWest(ball);
							break;
						case "W":
							sendEast(ball);
							break;
					}
				}
				else if (westExit(ball)){
					switch(device){
						case "N":
							sendEast(ball);
							break;
						case "S":
							sendWest(ball);
							break;
						case "E":
							sendSouth(ball);
							break;
						case "W":
							sendNorth(ball);
							break;
					}
				}
				else if (eastExit(ball)){
					switch(device){
						case "N":
							sendWest(ball);
							break;
						case "S":
							sendEast(ball);
							break;
						case "E":
							sendNorth(ball);
							break;
						case "W":
							sendSouth(ball);
							break;
					}
				}
				else 
					newBalls.push(ball);
			});
			balls = newBalls;
		}

		joystick.on('press', function(direction) {
			console.log('The joystick was pressed ' + direction);		
			processMovement(direction);
		});
	
		joystick.on('hold', function(direction) {
			console.log('The joystick is being held ' + direction);
			processMovement(direction);
		});
	});	
});