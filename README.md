Balena Barcelona hackathon 2019
===============================

## Run server
This app uses a web socket server to broadcast each client message to all clients.

1. Create .env file with .env.serversample content.
2. Run `npm run server` command.

## Run simulator
You can run locally this application in console to allow easy debugging.

1. Create .env file with .env.simulatorsample content.
2. Run `npm run simulator [DEVICE]` command. You can run the 4 devices needed in a simulator:
```
npm run simulator N
npm run simulator S
npm run simulator E
npm run simulator W
```
3. Move pixel with keys. Use '.' key to simulate click.

## Send test messages to websocket server
If you want to simulate other devices sending messages, use run-messaje.js file.

1. Run `npm run message` command to send the hardcoded message on file.

## Run on device
Finally, deploy this image on balena and use joystick to move the pixel on the display.

1. Don't forget to create Environment Variables. See .env.clientsample to see which ones to create.
2. Deploy on balena