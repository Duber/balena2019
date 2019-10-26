
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
			color: [ 255, 0, 0 ],
			x: ballX,
			y: ballY
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

function receiveFromNorth(ball){
	ball.x = 0;
	balls.push(ball);
}

function receiveFromSouth(ball){
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
					if (device == 'S')
						sendNorth(ball);
					else
						sendSouth(ball);
				}
				else if (northExit(ball)){
					if (device == 'N')
						sendSouth(ball);
					else
						sendNorth(ball);
				}
				else if (westExit(ball)){
					if (device == 'W')
						sendEast(ball);
					else
						sendWest(ball);
				}
				else if (eastExit(ball)){
					if (device == 'E')
						sendWest(ball);
					else
						sendEast(ball);
				}
				else 
					newBalls.push(ball);
			});
			balls = newBalls;

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