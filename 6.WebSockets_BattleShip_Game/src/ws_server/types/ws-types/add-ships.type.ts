import { WS_MESSAGE_TYPES } from '../constants.type';
import { Ship } from './ship.type';

export interface AddShips {
  type: typeof WS_MESSAGE_TYPES.ADD_SHIPS;
  data: {
    gameId: string;
    ships: Ship[];
    indexPlayer: string;
  };
  id: number;
}
