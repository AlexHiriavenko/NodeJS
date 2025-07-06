import { v4 as uuidv4 } from "uuid";
import { IUser } from "../types/user.interface";

export class UserModel implements IUser {
  id: string;
  username: string;
  age: number;
  hobbies: string[];

  constructor(username: string, age: number, hobbies: string[]) {
    this.id = uuidv4();
    this.username = username;
    this.age = age;
    this.hobbies = hobbies;
  }
}
