import { ValueOf, Position, SHIP_TYPES } from '../index';

export interface Ship {
  position: Position;
  direction: boolean;
  length: number;
  type: ValueOf<typeof SHIP_TYPES>;
}
