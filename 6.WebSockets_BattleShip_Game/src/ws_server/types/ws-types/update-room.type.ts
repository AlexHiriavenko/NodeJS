import { WS_MESSAGE_TYPES } from '../constants.type';

export interface UpdateWinners {
  type: typeof WS_MESSAGE_TYPES.UPDATE_ROOM;
  data: [
    {
      roomId: number;
      roomUsers: [
        {
          name: string;
          index: number;
        },
      ];
    },
  ];
  id: number;
}
