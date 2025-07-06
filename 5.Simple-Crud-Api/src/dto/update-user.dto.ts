import { UserValidator } from "../validators/user.validator";

export class UpdateUserDto {
  username?: unknown;
  age?: unknown;
  hobbies?: unknown;

  constructor(body: any) {
    this.username = body?.username;
    this.age = body?.age;
    this.hobbies = body?.hobbies;
  }

  isValid(): { valid: boolean; message?: string } {
    if (this.username !== undefined && !UserValidator.validateUsername(this.username)) {
      return { valid: false, message: "Invalid username" };
    }

    if (this.age !== undefined && !UserValidator.validateAge(this.age)) {
      return { valid: false, message: "Invalid age" };
    }

    if (this.hobbies !== undefined && !UserValidator.validateHobbies(this.hobbies)) {
      return { valid: false, message: "Invalid hobbies" };
    }

    return { valid: true };
  }

  toPartialUpdate(): Partial<{ username: string; age: number; hobbies: string[] }> {
    const update: any = {};
    if (this.username !== undefined) update.username = this.username;
    if (this.age !== undefined) update.age = this.age;
    if (this.hobbies !== undefined) update.hobbies = this.hobbies;
    return update;
  }
}
