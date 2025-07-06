import path from "path";
import { bindAllMethods } from "../utils/bindAllMethods.js";
import { NavigationService } from "../services/NavigationService.js";
import { FileService } from "../services/FileService.js";
import ZipService from "../services/ZipService.js";
import HashService from "../services/HashService.js";
import OsService from "../services/OsService.js";

class CommandController {
  constructor(fileManager) {
    this.fileManager = fileManager;
    this.navigationService = new NavigationService();
    this.fileService = new FileService();
    this.zipService = new ZipService();
    this.hashService = new HashService();
    this.osService = new OsService();

    bindAllMethods(this);

    this.commands = {
      up: this.up,
      cd: this.cd,
      ls: this.ls,
      cat: this.cat,
      add: this.add,
      mkdir: this.mkdir,
      rn: this.rn,
      cp: this.cp,
      mv: this.mv,
      rm: this.rm,
      compress: this.compress,
      decompress: this.decompress,
      hash: this.hash,
      os: this.os,
      help: this.help,
      ".exit": () => this.fileManager.exit(),
    };
  }

  up() {
    this.navigationService.goUp();
  }

  async cd(pathArg) {
    await this.navigationService.changeDirectory(pathArg);
  }

  async ls() {
    const data = await this.navigationService.getDirLs();
    this.fileManager.printTable(data);
  }

  async cat(filePath) {
    const data = await this.fileService.readFile(filePath);

    if (data instanceof Buffer) {
      const fistBytesLimit = 50;
      const hexPreview = data.subarray(0, fistBytesLimit).toString("hex");
      const preview = hexPreview.match(/.{1,2}/g)?.join(" ");
      this.fileManager.printMessage(
        `This is a binary file (Buffer). File Preview: ${preview}`,
        "yellow"
      );
    } else {
      this.fileManager.printMessage(data, "cyan");
    }
  }

  async add(fileName) {
    await this.fileService.createEmptyFile(fileName);
    this.fileManager.printMessage(`Created file: ${fileName}`, "cyan");
  }

  async mkdir(dirName) {
    await this.fileService.createDirectory(dirName);
    this.fileManager.printMessage(`Created directory: ${dirName}`, "cyan");
  }

  async rn(filePath, newFileName) {
    await this.fileService.renameFile(filePath, newFileName);
    this.fileManager.printMessage(`Renamed file: ${filePath} to ${newFileName}`, "cyan");
  }

  async cp(sourcePath, targetPath) {
    await this.fileService.copyFile(sourcePath, targetPath);
    this.fileManager.printMessage(`Copied file: ${sourcePath} to ${targetPath}`, "cyan");
  }

  async mv(sourcePath, targetPath) {
    await this.fileService.moveFile(sourcePath, targetPath);
    this.fileManager.printMessage(`Moved file from ${sourcePath} to ${targetPath}`, "cyan");
  }

  async rm(filePath) {
    await this.fileService.deleteFile(filePath);
    this.fileManager.printMessage(`Deleted file: ${filePath}`, "cyan");
  }

  async compress(sourcePath, destinationPath) {
    const finalPath = await this.zipService.compress(sourcePath, destinationPath);
    this.fileManager.printMessage(`Compressed file: ${sourcePath} to ${finalPath}`, "cyan");
  }

  async decompress(sourcePath, destinationPath) {
    const finalPath = await this.zipService.decompress(sourcePath, destinationPath);
    this.fileManager.printMessage(`Decompressed file: ${sourcePath} to ${finalPath}`, "cyan");
  }

  async hash(filePath) {
    const hash = await this.hashService.calculateHash(filePath);
    this.fileManager.printMessage(`SHA256: ${hash}`, "cyan");
  }

  async os(option) {
    if (!option) {
      throw new Error("os command requires a flag, e.g., --EOL, --cpus");
    }

    switch (option) {
      case "--EOL": {
        const eol = this.osService.getEOL();
        this.fileManager.printMessage(`EOL: ${eol}`, "cyan");
        break;
      }
      case "--cpus": {
        const { count, details } = this.osService.getCPUs();
        this.fileManager.printMessage(`Total CPUs: ${count}`, "cyan");
        this.fileManager.printTable(details);
        break;
      }
      case "--homedir": {
        const home = this.osService.getHomeDir();
        this.fileManager.printMessage(`Home Directory: ${home}`, "cyan");
        break;
      }
      case "--username": {
        const username = this.osService.getUsername();
        this.fileManager.printMessage(`System User: ${username}`, "cyan");
        break;
      }
      case "--architecture": {
        const arch = this.osService.getArchitecture();
        this.fileManager.printMessage(`Architecture: ${arch}`, "cyan");
        break;
      }
      default:
        throw new Error("Unknown OS option");
    }
  }

  help() {
    const commandsList = Object.keys(this.commands).join(", ");
    this.fileManager.printMessage(`Available commands: ${commandsList}`, "cyan");
  }

  async runCommand(input) {
    const args = await this.#parseArguments(input);
    const [command, ...commandArgs] = args;

    const currentCommand = this.commands[command];
    if (!currentCommand) {
      throw new Error("Invalid command");
    }

    await currentCommand(...commandArgs);
  }

  async #parseArguments(input) {
    const splitArgs = input.match(/(?:[^\s"]+|"[^"]*")+/g) || [];

    return splitArgs.map((arg) => {
      const cleaned = arg.replace(/^"|"$/g, "").replace(/\\/g, "/");
      return path.normalize(cleaned);
    });
  }
}

export default CommandController;
