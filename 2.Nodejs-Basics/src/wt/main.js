import { Worker } from "worker_threads";
import path from "path";
import { availableParallelism } from "os";
import { getDirName } from "../utils/getDirName.js";

function createWorker(workerPath, workerData) {
  return new Promise((resolve) => {
    const worker = new Worker(workerPath, { workerData });

    worker.on("message", (data) => {
      resolve({ status: "resolved", data });
    });

    worker.on("error", () => {
      resolve({ status: "error", data: null });
    });

    worker.on("exit", (code) => {
      if (code !== 0) {
        resolve({ status: "error", data: null });
      }
    });
  });
}

const performCalculations = async () => {
  const dirName = getDirName(import.meta.url);
  const workerPath = path.join(dirName, "worker.js");
  const numCores = availableParallelism();

  const workers = [];

  for (let i = 0; i < numCores; i++) {
    const n = 10 + i;
    const workerPromise = createWorker(workerPath, { n });

    workers.push(workerPromise);
  }

  const results = await Promise.all(workers);

  console.log(results);
};

await performCalculations();
