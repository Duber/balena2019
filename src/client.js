const WebSocket = require('ws');

module.exports = class Client {
  constructor(serverUri) {
    this.serverUri = serverUri;
  }

  connect() {
    this.ws = new WebSocket(this.serverUri);
    return this;
  }

  send(payload) {
    this.checkConnection();
    this.ws.send(JSON.stringify(payload));
    return this;
  }

  onOpen(callback) {
    this.checkConnection();
    this.ws.on('open', () => {
      callback();
    });
    return this;
  }

  onMessage(callback) {
    this.checkConnection();
    this.ws.on('message', (data) => {
      const payload = JSON.parse(data);
      callback(payload);
    });
    return this;
  }

  checkConnection() {
    if (!this.ws) throw new Error('Websocket is not connected');
  }
}