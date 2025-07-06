import readline from "readline";
import os from "os";
import CommandController from "../controllers/CommandController.js";

export class FileManager {
  #user;
  #userName;
  #rl;
  #messageColors;
  #commandController;

  constructor(user) {
    this.#user = user;
    this.#userName = this.#user.getUserName();

    this.#messageColors = {
      red: "\x1b[31m",
      green: "\x1b[32m",
      blue: "\x1b[34m",
      yellow: "\x1b[33m",
      cyan: "\x1b[36m",
    };

    this.#commandController = new CommandController(this);
  }

  start() {
    process.chdir(os.homedir());
    this.greeting();
    this.printCurrentDirectory();

    this.#rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    this.#promptUser();

    this.#rl.on("SIGINT", () => {
      this.exit();
    });
  }

  exit() {
    this.printMessage(`\nThank you for using File Manager, ${this.#userName}, goodbye!`);
    process.exit(0);
  }

  #promptUser() {
    this.#rl.question("> ", (input) => {
      this.runCommand(input.trim());
    });
  }

  async runCommand(input) {
    try {
      await this.#commandController.runCommand(input);
    } catch (err) {
      this.printMessage(err.message, "red");
    }

    this.printCurrentDirectory();
    this.#promptUser();
  }

  printMessage(message = "", color = "green") {
    const colorCode = this.#messageColors[color] || this.#messageColors.green;
    console.log(`${colorCode}${message}\x1b[0m`);
  }

  printTable(data) {
    if (Array.isArray(data) && data.length > 0) {
      console.table(data);
    } else {
      this.printMessage("Directory is empty", "yellow");
    }
  }

  greeting() {
    const greetingMessage = `Welcome to File Manager, ${this.#userName}!`;
    const helpMessage = `Type 'help' to see the list of available commands.`;
    this.printMessage(greetingMessage);
    this.printMessage(helpMessage, "yellow");
  }

  printCurrentDirectory() {
    const message = `You are currently in: ${process.cwd()}`;
    this.printMessage(message);
  }
}
