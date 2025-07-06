import WebSocket, { WebSocketServer } from 'ws';
import {
  AddShips,
  AddUserToRoom,
  BasePacket,
  CreateNewRoom,
  DataRequest,
  RandomAttack,
  RequestAttack,
  RequestReg,
  ResponseValidPlayer,
} from '../types/ws-types';
import { ClientState, WS_MESSAGE_TYPES } from '../types';

import { WsResponseService } from './ws-response-service';

export class WsMessageController {
  public clientState: ClientState;
  protected wsResponseService: WsResponseService;
  protected wsServer: WebSocketServer;

  constructor(wsClient: ClientState, wsServer: WebSocketServer) {
    this.clientState = wsClient;
    this.wsServer = wsServer;
    this.wsResponseService = new WsResponseService(wsClient);
  }
  public wsDataHandler = (requestData: BasePacket): string | void => {
    switch (requestData.type) {
      case WS_MESSAGE_TYPES.REG: {
        const wsData: DataRequest =
          typeof requestData.data === 'string' ? JSON.parse(requestData.data) : requestData.data;

        const responseData = this.wsResponseService.registrationPlayerHandler(
          this.isValidData<RequestReg['data']>(wsData),
        );

        this.clientState.send(responseData);

        if (responseData.includes(`false`)) {
          const rooms = this.wsResponseService.updateRoomHandler();
          this.clientState.send(rooms);
          this.clientState.send(this.wsResponseService.updateWinnersHandler());
        }

        return;
      }

      case WS_MESSAGE_TYPES.CREATE_ROOM: {
        const wsData = requestData.data;
        const clients = this.wsServer.clients as Set<ClientState>;
        const validData = this.isValidData<CreateNewRoom['data']>(wsData);

        const error = this.wsResponseService.createRoomHandler(validData);
        if (error) {
          return JSON.stringify({
            ...error,
            type: WS_MESSAGE_TYPES.ADD_USER_TO_ROOM,
          });
        }

        for (const client of clients) {
          if (client.readyState === WebSocket.OPEN && client.playerInfo) {
            const rooms = this.wsResponseService.updateRoomHandler();
            client.send(rooms);
          }
        }
        return;
      }

      case WS_MESSAGE_TYPES.ADD_USER_TO_ROOM: {
        const wsData: DataRequest =
          typeof requestData.data === 'string' ? JSON.parse(requestData.data) : requestData.data;

        const validDataOrError = this.isValidData<AddUserToRoom['data']>(wsData);
        if ('error' in validDataOrError) {
          return JSON.stringify({
            ...this.wsResponseService.createErrorObject(validDataOrError),
            type: WS_MESSAGE_TYPES.ADD_USER_TO_ROOM,
          });
        }

        const isComplete = this.wsResponseService.createGameHandler(validDataOrError);

        if (!isComplete) {
          return JSON.stringify({
            type: WS_MESSAGE_TYPES.ADD_USER_TO_ROOM,
            error: true,
            errorText: "Can't add user to room, please wait opponent",
          });
        }

        if (isComplete === 'exist') {
          return JSON.stringify({
            type: WS_MESSAGE_TYPES.ADD_USER_TO_ROOM,
            error: true,
            errorText: 'Room with user already exists',
          });
        }

        const clients = this.wsServer.clients as Set<ClientState>;
        const rooms = this.wsResponseService.updateRoomHandler();

        for (const client of clients) {
          if (
            client.readyState === WebSocket.OPEN &&
            client.playerInfo &&
            client.playerInfo.roomId === this.clientState.playerInfo.roomId
          ) {
            client.playerInfo.idGame = this.clientState.playerInfo.idGame;
            const gameResponse = this.wsResponseService.createGameResponse(client);
            client.send(rooms);
            client.send(gameResponse);
          } else if (client.readyState === WebSocket.OPEN && client.playerInfo) {
            client.send(rooms);
          }
        }

        return;
      }

      case WS_MESSAGE_TYPES.ADD_SHIPS: {
        const wsData: DataRequest =
          typeof requestData.data === 'string' ? JSON.parse(requestData.data) : requestData.data;

        const validDataOrError = this.isValidData<AddShips['data']>(wsData);
        if ('error' in validDataOrError) {
          return JSON.stringify({
            ...this.wsResponseService.createErrorObject(validDataOrError),
            type: WS_MESSAGE_TYPES.ADD_SHIPS,
          });
        }

        const shipResponse = this.wsResponseService.addShipsHandler(validDataOrError);

        if (!shipResponse) {
          return JSON.stringify({
            type: WS_MESSAGE_TYPES.ADD_SHIPS,
            error: true,
            errorText: 'Invalid data',
          });
        }

        if (shipResponse === 'not ready') {
          return;
        } else if (shipResponse) {
          const clients = this.wsServer.clients as Set<ClientState>;

          for (const client of clients) {
            if (
              client.readyState === WebSocket.OPEN &&
              client.playerInfo &&
              client.playerInfo.idGame === this.clientState.playerInfo.idGame
            ) {
              client.send(client.playerInfo.startPosition);
              const gameId = client.playerInfo.idGame;
              const currentPlayerResponse =
                this.wsResponseService.updateCurrentPlayerHandler(gameId);
              client.send(currentPlayerResponse);
            }
          }
        }

        return;
      }

      case WS_MESSAGE_TYPES.RANDOM_ATTACK:
      case WS_MESSAGE_TYPES.ATTACK: {
        const clients = this.wsServer.clients as Set<ClientState>;
        const wsData: DataRequest =
          typeof requestData.data === 'string' ? JSON.parse(requestData.data) : requestData.data;

        let validDataOrError: RandomAttack['data'] | RequestAttack['data'] | ResponseValidPlayer;
        validDataOrError =
          requestData.type === WS_MESSAGE_TYPES.RANDOM_ATTACK
            ? this.isValidData<RandomAttack['data']>(wsData)
            : this.isValidData<RequestAttack['data']>(wsData);

        if ('error' in validDataOrError) {
          return JSON.stringify({
            ...this.wsResponseService.createErrorObject(validDataOrError),
            type:
              requestData.type === WS_MESSAGE_TYPES.RANDOM_ATTACK
                ? WS_MESSAGE_TYPES.RANDOM_ATTACK
                : WS_MESSAGE_TYPES.ATTACK,
          });
        }

        const attack =
          requestData.type === WS_MESSAGE_TYPES.RANDOM_ATTACK
            ? this.wsResponseService.randomAttackHandler(validDataOrError as RandomAttack['data'])
            : this.wsResponseService.attackHandler(validDataOrError as RequestAttack['data']);

        if (typeof attack === 'object' && Object.hasOwn(attack, 'error')) {
          return JSON.stringify({
            ...attack,
            type:
              requestData.type === WS_MESSAGE_TYPES.RANDOM_ATTACK
                ? WS_MESSAGE_TYPES.RANDOM_ATTACK
                : WS_MESSAGE_TYPES.ATTACK,
          });
        }

        let count = 1;
        for (const client of clients) {
          if (
            client.readyState === WebSocket.OPEN &&
            client.playerInfo &&
            client.playerInfo.idGame === this.clientState.playerInfo.idGame
          ) {
            if (typeof attack === 'string') {
              client.send(attack);
            } else if (typeof attack === 'object' && 'currentPlayer' in attack) {
              const { aroundPositions, killedPositions, currentPlayer } = attack;
              for (const position of killedPositions) {
                const killedResponse = this.wsResponseService.createAttackResponse(
                  currentPlayer,
                  'killed',
                  position,
                );
                client.send(killedResponse);
              }
              for (const position of aroundPositions) {
                const missResponse = this.wsResponseService.createAttackResponse(
                  currentPlayer,
                  'miss',
                  position,
                );
                client.send(missResponse);
              }
            }
            const gameId = client.playerInfo.idGame;
            const finish = this.wsResponseService.checkFinishGame(gameId);
            const currentPlayerResponse = this.wsResponseService.updateCurrentPlayerHandler(gameId);
            client.send(currentPlayerResponse);

            if (finish) {
              client.send(finish);
              const rooms = this.wsResponseService.updateRoomHandler();
              client.send(rooms);
              if (count === 2) {
                count = 1;
                this.updateWinners();
              } else {
                if (client.playerInfo.isSingleGame) {
                  client.playerInfo.isSingleGame = false;
                  this.updateWinners();
                  continue;
                }
                count++;
              }
            }

            if (client.playerInfo.isSingleGame) {
              const { index, idGame } = client.playerInfo.botInfo;

              const botRandomAttackData = {
                gameId: idGame,
                indexPlayer: index,
              };

              setTimeout(() => {
                const attack = this.wsResponseService.randomAttackHandler(botRandomAttackData);

                if (typeof attack === 'string') {
                  client.send(attack);
                } else if (typeof attack === 'object' && 'currentPlayer' in attack) {
                  const { aroundPositions, killedPositions, currentPlayer } = attack;
                  for (const position of killedPositions) {
                    const killedResponse = this.wsResponseService.createAttackResponse(
                      currentPlayer,
                      'killed',
                      position,
                    );

                    client.send(killedResponse);
                  }
                  for (const position of aroundPositions) {
                    const missResponse = this.wsResponseService.createAttackResponse(
                      currentPlayer,
                      'miss',
                      position,
                    );

                    client.send(missResponse);
                  }
                }
                const gameId = client.playerInfo.idGame;
                const finish = this.wsResponseService.checkFinishGame(gameId);
                const currentPlayerResponse =
                  this.wsResponseService.updateCurrentPlayerHandler(gameId);

                client.send(currentPlayerResponse);

                if (finish) {
                  client.send(finish);

                  client.playerInfo.isSingleGame = false;
                  const rooms = this.wsResponseService.updateRoomHandler();

                  client.send(rooms);
                }
              }, 1000);
            }
          }
        }
        return;
      }

      case WS_MESSAGE_TYPES.SINGLE_PLAY: {
        if (this.clientState.readyState === WebSocket.OPEN && this.clientState.playerInfo) {
          const gameResponse = this.wsResponseService.createSingleGameResponse(this.clientState);

          this.clientState.send(gameResponse);
        }
        return;
      }

      default: {
        break;
      }
    }
    return;
  };

  protected updateWinners(): void {
    const clients = this.wsServer.clients as Set<ClientState>;

    for (const client of clients) {
      if (client.readyState === WebSocket.OPEN && client.playerInfo) {
        client.send(this.wsResponseService.updateWinnersHandler());
      }
    }
  }

  public disconnectHandler = (index: string, roomId: string, idGame: string): string => {
    if (roomId) {
      const roomsResponse = this.wsResponseService.updateRoomHandler(roomId);
      const clients = this.wsServer.clients as Set<ClientState>;

      for (const client of clients) {
        if (client.readyState === WebSocket.OPEN && client.playerInfo) {
          client.send(roomsResponse);
        }
      }
    }

    if (idGame && index) {
      const finishResponse = this.wsResponseService.finishGame(idGame, index);
      const clients = this.wsServer.clients as Set<ClientState>;

      if (finishResponse) {
        for (const client of clients) {
          if (
            client.readyState === WebSocket.OPEN &&
            client.playerInfo &&
            client.playerInfo.idGame === idGame
          ) {
            client.send(finishResponse);
          }

          const rooms = this.wsResponseService.updateRoomHandler();
          client.send(rooms);

          this.updateWinners();
        }
      }
    }

    return '';
  };

  protected isValidData = <T extends DataRequest>(wsData: DataRequest): T | ResponseValidPlayer => {
    const data = wsData;

    if (
      data &&
      typeof data === 'object' &&
      'gameId' in data &&
      typeof data.gameId === 'string' &&
      'indexPlayer' in data &&
      typeof data.indexPlayer === 'string'
    ) {
      if ('ships' in data && Array.isArray(data.ships)) {
        return wsData as T;
      }

      if ('x' in data && typeof data.x === 'number' && 'y' in data && typeof data.y === 'number') {
        return wsData as T;
      }
    }

    if (
      data &&
      typeof data === 'object' &&
      'name' in data &&
      typeof data.name === 'string' &&
      data.name.length >= 5 &&
      'password' in data &&
      typeof data.password === 'string' &&
      data.password.length >= 5
    ) {
      return wsData as T;
    }

    if (typeof data === 'string') {
      return wsData as T;
    }

    if (data && typeof data === 'object' && 'indexRoom' in data) {
      return wsData as T;
    }

    if (
      data &&
      typeof data === 'object' &&
      'gameId' in data &&
      typeof data.gameId === 'string' &&
      'indexPlayer' in data &&
      typeof data.indexPlayer === 'string'
    ) {
      return wsData as T;
    }

    return { error: true, errorText: 'Invalid data' };
  };
}
