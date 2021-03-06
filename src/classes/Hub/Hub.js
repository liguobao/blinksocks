import net from 'net';
import log4js from 'log4js';
import {Config} from '../Config';
import {Socket} from '../Socket';

const Logger = log4js.getLogger('Hub');

const nextId = (function () {
  let i = 0;
  return () => ++i;
})();

export class Hub {

  _hub = null; // instance of class net.Server

  _sockets = []; // instances of class Socket

  constructor(config) {
    try {
      Config.init(config);
    } catch (err) {
      Logger.fatal(err);
      process.exit(-1);
    }
    Logger.setLevel(Config.log_level);
    this._hub = net.createServer();
    this._hub.on('error', this.onError.bind(this));
    this._hub.on('close', this.onClose.bind(this));
    this._hub.on('connection', this.onConnect.bind(this));
  }

  onError(err) {
    Logger.error(err);
  }

  onClose() {
    Logger.info('server shutdown');
    this.cleanUp();
  }

  onConnect(socket) {
    const _socket = new Socket({id: nextId(), socket});
    this._sockets.push(_socket);
  }

  cleanUp() {
    for (const socket of this._sockets) {
      if (!socket.destroy && typeof socket.end === 'function') {
        socket.end();
      }
    }
  }

  run() {
    const [host, port] = [Config.host, Config.port];
    const options = {
      host,
      port,
      backlog: 511
    };
    this._hub.listen(options, () => {
      Logger.info('opened hub on:', this._hub.address());
    });
  }

  stop() {
    return new Promise((resolve) => {
      this._hub.close(resolve);
    });
  }

}
