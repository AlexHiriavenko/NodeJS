import { ValueOf, WS_MESSAGE_TYPES } from '../index';
import { DataRequest } from './data-request.type';

export interface BasePacket {
  type: ValueOf<typeof WS_MESSAGE_TYPES>;
  data: string | DataRequest;
  id: number;
}
