import { Position, ValueOf, SHIP_TYPES } from './index';

export interface CellState {
  type: ValueOf<typeof SHIP_TYPES>;
  length: number;
  health: number;
  shots: Position[];
  startPosition: Position;
  missAroundPosition: Position[];
  status: Status;
}
type Status = 'alive' | 'killed';
