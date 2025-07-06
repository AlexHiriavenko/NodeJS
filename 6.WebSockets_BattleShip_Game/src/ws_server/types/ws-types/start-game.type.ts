import { WS_MESSAGE_TYPES } from '../constants.type';
import { Ship } from './ship.type';

export interface UpdateWinners {
  type: typeof WS_MESSAGE_TYPES.START_GAME;
  data: {
    ships: Ship[];
    currentPlayerIndex: number;
  };
  id: number;
}
