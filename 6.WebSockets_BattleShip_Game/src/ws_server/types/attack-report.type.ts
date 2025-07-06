import { Position } from './position.type';

export interface AttackReport {
  currentPlayer: string;
  killedPositions: Position[];
  aroundPositions: Position[];
}
