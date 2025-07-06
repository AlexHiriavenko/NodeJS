import { WS_MESSAGE_TYPES } from '../constants.type';

export interface UpdateWinners {
  type: typeof WS_MESSAGE_TYPES.TURN;
  data: {
    winPlayer: number;
  };
  id: number;
}
