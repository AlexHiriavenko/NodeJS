import { RawData, WebSocketServer } from 'ws';
import { REQUIRED_WS_KEYS } from '../types/constants.type';
import { ClientState } from '../types/client-state.type';
import { WsMessageController } from './ws-message-controller';

export class WsHandler {
  public wsClient: ClientState;
  public wsServer: WebSocketServer;
  private wsMessageController: WsMessageController;

  constructor(wsServer: WebSocketServer) {
    this.wsServer = wsServer;
  }

  public clientConnection(wsClient: ClientState): void {
    this.wsClient = wsClient;
    this.wsMessageController = new WsMessageController(wsClient, this.wsServer);

    wsClient.on('error', console.error);
    wsClient.on('message', this.handleMessage);
    wsClient.on('close', this.disconnect);
  }

  private handleMessage = (webSocketData: RawData): void => {
    const requestData = JSON.parse(webSocketData.toString());

    const isValidData = this.validateWsData(requestData);

    if (isValidData) {
      const responseData = this.wsMessageController.wsDataHandler(requestData);

      if (responseData) {
        this.wsClient.send(responseData);
      }
    }
  };

  private disconnect = (): void => {
    console.log('[WS] ❌ Client disconnected');

    if (Object.hasOwn(this.wsClient, 'playerInfo')) {
      const { index, roomId, idGame } = (this.wsClient as ClientState).playerInfo;
      const responseData = this.wsMessageController.disconnectHandler(index, roomId, idGame);

      if (responseData) {
        this.wsClient.send(responseData);
      }
    }
  };
  private validateWsData = (data: unknown): boolean => {
    const requiredKeys = Object.values(REQUIRED_WS_KEYS).sort();

    if (typeof data === 'object' && data !== null) {
      const incomingKeys = Object.keys(data).sort();

      return JSON.stringify(incomingKeys) === JSON.stringify(requiredKeys);
    }

    return false;
  };
}
