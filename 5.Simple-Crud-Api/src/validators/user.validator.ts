export class UserValidator {
  static validateUsername(value: unknown): boolean {
    return typeof value === "string" && value.trim() !== "";
  }

  static validateAge(value: unknown): boolean {
    return typeof value === "number" && Number.isInteger(value) && value >= 0;
  }

  static validateHobbies(value: unknown): boolean {
    return Array.isArray(value) && value.every((hobby) => typeof hobby === "string");
  }
}
