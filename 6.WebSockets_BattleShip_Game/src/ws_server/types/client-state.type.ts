import WebSocket from 'ws';
import { CellState } from './cell-state.type';
import { Ship } from './ws-types/ship.type';

export interface ClientState extends WebSocket {
  playerInfo: {
    name: string;
    index: string;
    roomId: string;
    idGame: string;
    ships: Ship[];
    startPosition: string;
    fieldShips: Array<Array<number | CellState>>;
    isSingleGame: boolean;
    botInfo: BotInfo;
  };
}

export interface BotInfo {
  name: string;
  index: string;
  idGame: string;
}
