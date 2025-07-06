import { WS_MESSAGE_TYPES } from '../constants.type';

export interface AddUserToRoom {
  type: typeof WS_MESSAGE_TYPES.ADD_USER_TO_ROOM;
  data: {
    indexRoom: string;
  };
  id: number;
}
