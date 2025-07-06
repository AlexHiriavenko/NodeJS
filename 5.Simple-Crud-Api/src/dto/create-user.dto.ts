import { UserValidator } from "../validators/user.validator";

export class CreateUserDto {
  username: unknown;
  age: unknown;
  hobbies: unknown;

  constructor(body: any) {
    this.username = body?.username;
    this.age = body?.age;
    this.hobbies = body?.hobbies;
  }

  isValid(): { valid: boolean; message?: string } {
    if (!UserValidator.validateUsername(this.username)) {
      return { valid: false, message: "Invalid or missing username" };
    }

    if (!UserValidator.validateAge(this.age)) {
      return { valid: false, message: "Invalid or missing age" };
    }

    if (!UserValidator.validateHobbies(this.hobbies)) {
      return { valid: false, message: "Invalid or missing hobbies" };
    }

    return { valid: true };
  }
}
