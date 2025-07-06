import { WS_MESSAGE_TYPES } from '../constants.type';

export interface RandomAttack {
  type: typeof WS_MESSAGE_TYPES.RANDOM_ATTACK;
  data: {
    gameId: string;
    indexPlayer: string;
  };
  id: number;
}
