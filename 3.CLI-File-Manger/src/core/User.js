import os from "os";

export class User {
  #userName;

  constructor() {
    const argvUser = process.argv.find((arg) => arg.startsWith("--username="))?.split("=")[1];
    const envUser = process.env.npm_config_username;
    const fallbackUser = os.userInfo().username;

    this.#userName = argvUser || envUser || fallbackUser;
  }

  getUserName() {
    return this.#userName;
  }
}
