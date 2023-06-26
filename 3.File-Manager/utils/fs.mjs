import fs from "fs";
import path from "path";
import { pipeline } from "stream";

const cat = (input, currentPath, showInvalidInputMessage, showFailMessage) => {
    const inputPath = input.split(" ")[1];
    if (!inputPath) {
        showInvalidInputMessage();
        return;
    }
    const resolvedPath = path.resolve(currentPath, inputPath);
    if (fs.existsSync(resolvedPath)) {
        const readStream = fs.createReadStream(resolvedPath);
        readStream.on("data", (chunk) => {
            process.stdout.write(`${chunk.toString()}\n`);
        });
        readStream.on("error", showFailMessage);
    } else {
        showFailMessage();
    }
};

const add = (input, currentPath, showInvalidInputMessage, showFailMessage) => {
    const inputPath = input.split(" ")[1];
    if (!inputPath) {
        showInvalidInputMessage();
        return;
    }
    const resolvedPath = path.resolve(currentPath, inputPath);
    if (fs.existsSync(resolvedPath)) {
        showFailMessage();
    } else {
        fs.writeFile(resolvedPath, "", (err) => {
            if (err) showFailMessage();
        });
    }
};

const rn = (input, currentPath, showInvalidInputMessage, showFailMessage) => {
    const oldPath = input.split(" ")[1];
    const newFileName = input.split(" ")[2];
    const resolvedPath = path.resolve(currentPath, oldPath);
    if (!oldPath || !newFileName) {
        showInvalidInputMessage();
        return;
    } else if (!fs.existsSync(resolvedPath)) {
        showFailMessage();
        return;
    } else {
        fs.rename(
            resolvedPath,
            path.resolve(path.parse(resolvedPath).dir, newFileName),
            (err) => {
                if (err) showFailMessage();
            }
        );
    }
};

const cp = async ({
    input,
    currentPath,
    showInvalidInputMessage,
    showFailMessage,
}) => {
    const [oldPath, newPath] = input.split(" ");
    const resolvedOldPath = path.resolve(currentPath, oldPath);
    const resolvedNewPath = path.resolve(currentPath, newPath);
    const fileName = path.parse(resolvedOldPath).base;
    const resolvedFullNewPath = path.resolve(resolvedNewPath, fileName);

    if (
        !oldPath ||
        !newPath ||
        (fs.existsSync(resolvedNewPath) &&
            !fs.lstatSync(resolvedNewPath)?.isDirectory())
    ) {
        showInvalidInputMessage();
        return;
    } else if (
        !fs.existsSync(resolvedOldPath) ||
        !fs.existsSync(resolvedNewPath) ||
        fs.existsSync(resolvedFullNewPath)
    ) {
        showFailMessage();
        return;
    } else {
        await pipeline(
            fs.createReadStream(resolvedOldPath),
            fs.createWriteStream(resolvedFullNewPath),
            (err) => {
                if (err) showFailMessage();
            }
        );
        return true;
    }
};

const rm = ({
    input,
    currentPath,
    showInvalidInputMessage,
    showFailMessage,
}) => {
    const inputPath = input.split(" ")[1];
    const resolvedInputPath = path.resolve(currentPath, inputPath);
    if (!inputPath) {
        showInvalidInputMessage();
        return;
    } else if (fs.existsSync(resolvedInputPath)) {
        fs.unlink(resolvedInputPath, (err) => {
            if (err) showFailMessage();
        });
    } else {
        showFailMessage();
    }
};

const mv = async (args) => {
    const flag = await cp(args);
    if (flag) rm(args);
};

export { cat, add, rn, cp, mv, rm };
