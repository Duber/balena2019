
SenseHat = require('node-sense-hat');
serverUri = require('./environment').SERVER_URI;
device = require('./environment').DEVICE;
ballColorR = require('./environment').BALL_COLOR_R;
ballColorG = require('./environment').BALL_COLOR_G;
ballColorB = require('./environment').BALL_COLOR_B;
ballX = require('./environment').BALL_X;
ballY = require('./environment').BALL_Y;
osc = require('osc');
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

const oscPort = new osc.WebSocketPort({
	url: serverUri, // URL to your Web Socket server.
	metadata: true
  });
oscPort.open();

oscPort.on('message', function(oscMsg) {
	msg = JSON.parse(oscMsg.args[0].value)
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
   
oscPort.on('ready', function() {
	function send(dest, ball){
		oscPort.send({
			address: '/patata',
			args: [
				{
					type: 's',
					value: JSON.stringify({
						origin: device,
						destination: dest,
						ball: ball
					})
				}
			]
		});
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
							return;
						case "S":
							sendNorth(ball);
							return;
						case "E":
							sendWest(ball);
							return;
						case "W":
							sendEast(ball);
							return;
					}
				}
				else if (northExit(ball)){
					switch(device){
						case "N":
							sendSouth(ball);
							return;
						case "S":
							sendNorth(ball);
							return;
						case "E":
							sendWest(ball);
							return;
						case "W":
							sendEast(ball);
							return;
					}
				}
				else if (westExit(ball)){
					switch(device){
						case "N":
							sendEast(ball);
							return;
						case "S":
							sendWest(ball);
							return;
						case "E":
							sendSouth(ball);
							return;
						case "W":
							sendNorth(ball);
							return;
					}
				}
				else if (eastExit(ball)){
					switch(device){
						case "N":
							sendWest(ball);
							return;
						case "S":
							sendEast(ball);
							return;
						case "E":
							sendNorth(ball);
							return;
						case "W":
							sendSouth(ball);
							return;
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