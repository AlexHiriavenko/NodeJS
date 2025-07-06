import { User } from "./src/core/User.js";
import { FileManager } from "./src/core/FileManager.js";

const user = new User();
const fileManager = new FileManager(user);
fileManager.start();
