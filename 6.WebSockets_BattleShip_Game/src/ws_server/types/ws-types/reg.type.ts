import { WS_MESSAGE_TYPES } from '../constants.type';

export interface RequestReg {
  type: typeof WS_MESSAGE_TYPES.REG;
  data: {
    name: string;
    password: string;
  };
  id: number;
}

export interface ResponseReg {
  type: typeof WS_MESSAGE_TYPES.REG;
  data: {
    name: string;
    index: string;
    error: boolean;
    errorText: string;
  };
  id: number;
}
