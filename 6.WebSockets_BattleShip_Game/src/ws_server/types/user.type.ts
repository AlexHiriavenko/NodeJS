import { CellState } from './cell-state.type';

export interface User {
  name: string;
  index: string;
  fieldShips: Array<Array<number | CellState>>;
  shipsAlive: number;
}
