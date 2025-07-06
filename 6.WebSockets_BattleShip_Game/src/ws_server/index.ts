import { WebSocketServer } from 'ws';
import { WsHandler } from './handlers/ws-handler';
import { ClientState } from './types/client-state.type';

export class WsServer {
  private server: WebSocketServer;

  constructor(private port: number) {
    this.server = new WebSocketServer({ port });
    this.runListeners();
  }

  private runListeners(): void {
    this.server.on('connection', (client: ClientState) => {
      console.log('[WS] ✅ New client connected');
      new WsHandler(this.server).clientConnection(client);
    });

    this.server.on('close', this.handleClose);
  }

  private handleClose = (): void => {
    console.log('[WS] 🔌 Server closed');
  };
}
