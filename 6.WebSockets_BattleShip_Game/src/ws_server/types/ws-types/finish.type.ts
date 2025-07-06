import { WS_MESSAGE_TYPES } from '../constants.type';

export interface UpdateWinners {
  type: typeof WS_MESSAGE_TYPES.FINISH;
  data: {
    winPlayer: string;
  };
  id: number;
}
