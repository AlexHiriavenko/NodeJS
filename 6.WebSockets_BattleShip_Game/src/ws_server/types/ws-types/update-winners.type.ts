import { WS_MESSAGE_TYPES } from '../constants.type';

export interface UpdateWinners {
  type: typeof WS_MESSAGE_TYPES.UPDATE_WINNERS;
  data: [
    {
      name: string;
      wins: number;
    },
  ];
  id: number;
}
