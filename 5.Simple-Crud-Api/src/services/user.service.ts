import { IUser } from "../types/user.interface";
import { UserModel } from "../models/user.model";
import { CreateUserDto } from "../dto/create-user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";

export class UserService {
  private users: IUser[] = [];

  getAll(): IUser[] {
    return this.users;
  }

  getById(id: string): IUser | null {
    return this.users.find((user) => user.id === id) || null;
  }

  create(dto: CreateUserDto): IUser {
    const user = new UserModel(dto.username as string, dto.age as number, dto.hobbies as string[]);
    this.users.push(user);
    return user;
  }

  update(id: string, dto: UpdateUserDto): IUser | null {
    const user = this.getById(id);
    if (!user) return null;

    const updates = dto.toPartialUpdate();
    Object.assign(user, updates);

    return user;
  }

  delete(id: string): boolean {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex === -1) return false;

    this.users.splice(userIndex, 1);
    return true;
  }
}
