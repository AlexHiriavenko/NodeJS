import { WS_MESSAGE_TYPES } from '../constants.type';

export interface CreateGame {
  type: typeof WS_MESSAGE_TYPES.CREATE_GAME;
  data: {
    idGame: string;
    idPlayer: string;
  };
  id: number;
}
