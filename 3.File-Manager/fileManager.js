import { homedir } from "os";
import path from "path";
import fs from "fs";
import { cat, add, rn, cp, mv, rm } from "./utils/fs.mjs";
import osHandler from "./utils/os.mjs";
import hash from "./utils/hash.mjs";
import { compress, decompress } from "./utils/zip.mjs";
import { up, cd, ls } from "./utils/nav.mjs";

const userName =
    process.argv
        .find((item) => item.startsWith("--username="))
        ?.replace(/^--username=/, "") || "Unknown User";
const root = path.parse(process.cwd()).root;
let currentPath = homedir();
const helloMessage = `Welcome to the File Manager, ${userName}!\n`;
const goodbyeMessage = `\nThank you for using File Manager, ${userName}, goodbye!\n`;
const invalidInputMessage = `Invalid input`;
const failMessage = `Operation failed`;

const colorize = (color, output) => {
    return [`\x1b[${color}m%s\x1b[0m`, output];
};

const goodbyeHandler = () => {
    console.log(...colorize("36", goodbyeMessage));
    process.exit();
};
const showCurrentPath = (path) => {
    console.log(...colorize("33", `You are currently in ${path}`));
};
const showInvalidInputMessage = () => {
    console.log(...colorize("31", invalidInputMessage));
};
const showFailMessage = () => {
    console.log(...colorize("31", failMessage));
};
console.log(...colorize("32", helloMessage));
showCurrentPath(currentPath);

process.stdin.on("data", (data) => {
    const input = data.toString().slice(0, -2);
    if (input === ".exit") {
        goodbyeHandler();
        return;
    }
    const args = {
        input,
        currentPath,
        showInvalidInputMessage,
        showFailMessage,
    };
    if (input === "up") {
        currentPath = up(args);
    } else if (input.startsWith("cd ")) {
        currentPath = cd(args);
    } else if (input === "ls") {
        ls(args);
    } else if (input.startsWith("cat ")) {
        cat(args);
    } else if (input.startsWith("add ")) {
        add(args);
    } else if (input.startsWith("rn ")) {
        rn(args);
    } else if (input.startsWith("cp ")) {
        cp(args);
    } else if (input.startsWith("mv ")) {
        mv(args);
    } else if (input.startsWith("rm ")) {
        rm(args);
    } else if (input.startsWith("os ")) {
        osHandler(args);
    } else if (input.startsWith("hash ")) {
        hash(args);
    } else if (input.startsWith("compress ")) {
        compress(args);
    } else if (input.startsWith("decompress ")) {
        decompress(args);
    } else {
        showInvalidInputMessage();
    }

    showCurrentPath(currentPath);
});

process.on("SIGINT", goodbyeHandler);
