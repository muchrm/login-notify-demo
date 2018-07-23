const http = require('http');

class ServerSendEvent {
  constructor(response) {
    if (response instanceof http.OutgoingMessage) {
      this.res = response;
      const header = {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive'
      };
      this.res.writeHead(200, header);
    } else {
      throw Error('Not a http response object');
    }
  }

  send(data) {
    if (typeof data === 'string' || typeof data === 'number') {
      this.res.write(`data: ${data}\n\n`);
    } else if (typeof data === 'object') {
      this.res.write(`data: ${JSON.stringify(data)}\n\n`);
    } else {
      throw Error('Invalid data');
    }
    this.res.flushHeaders();
  }

  disconnect(fn) {
    if (typeof fn === 'function') {
      this.res.on('close', fn);
    } else {
      throw Error('Parameter must be a function');
    }
  }
}

module.exports = ServerSendEvent;
