import { User } from '../types';

export interface Game {
  stage: string;
  idGame: string;
  currentPlayer: string;
  gameUsers: User[];
  gameWinner: string;
}

export const games: Game[] = [];
export const singleGames: Game[] = [];
