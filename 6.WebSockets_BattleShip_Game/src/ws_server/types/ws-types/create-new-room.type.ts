import { WS_MESSAGE_TYPES } from '../constants.type';

export interface CreateNewRoom {
  type: typeof WS_MESSAGE_TYPES.CREATE_ROOM;
  data: string;
  id: number;
}
