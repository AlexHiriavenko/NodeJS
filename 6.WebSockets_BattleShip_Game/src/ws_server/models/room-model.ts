import { User } from '../types/user.type';

export interface Room {
  roomId: string;
  roomUsers: User[];
}

export const rooms: Room[] = [];
