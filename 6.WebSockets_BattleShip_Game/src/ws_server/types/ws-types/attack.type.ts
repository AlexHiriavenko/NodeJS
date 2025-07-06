import { ValueOf, HIT_RESULTS, WS_MESSAGE_TYPES } from '../index';

export interface RequestAttack {
  type: typeof WS_MESSAGE_TYPES.ATTACK;
  data: {
    gameId: string;
    x: number;
    y: number;
    indexPlayer: string;
  };
  id: number;
}

export interface ResponseReg {
  type: typeof WS_MESSAGE_TYPES.ATTACK;
  data: {
    position: {
      x: number;
      y: number;
    };
    currentPlayer: number;
    status: ValueOf<typeof HIT_RESULTS>;
  };
  id: number;
}
