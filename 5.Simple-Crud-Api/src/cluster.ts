import cluster from "node:cluster";
import os from "node:os";
import http from "node:http";
import { fork } from "node:child_process";
import { config } from "dotenv";
import { request as proxyRequest } from "http";

config();

const PORT = Number(process.env.PORT) || 4000;
const CPUS = os.availableParallelism ? os.availableParallelism() : os.cpus().length;
const WORKER_COUNT = Math.max(1, CPUS - 1);
let currentWorker = 0;

if (cluster.isPrimary) {
  console.log(`Master process started. Spawning ${WORKER_COUNT} workers...`);

  // Fork workers
  for (let i = 0; i < WORKER_COUNT; i++) {
    const port = PORT + 1 + i;
    cluster.fork({ WORKER_PORT: port });
  }

  // Load balancer server
  const server = http.createServer((req, res) => {
    const workerPort = PORT + 1 + (currentWorker % WORKER_COUNT);
    currentWorker++;

    const proxy = proxyRequest(
      {
        hostname: "localhost",
        port: workerPort,
        path: req.url,
        method: req.method,
        headers: req.headers,
      },
      (proxyRes) => {
        res.writeHead(proxyRes.statusCode || 500, proxyRes.headers);
        proxyRes.pipe(res, { end: true });
      }
    );

    req.pipe(proxy, { end: true });

    proxy.on("error", (err) => {
      res.writeHead(500);
      res.end("Internal Proxy Error");
    });
  });

  server.listen(PORT, () => {
    console.log(`Load balancer running on port ${PORT}`);
  });
} else {
  const childPort = Number(process.env.WORKER_PORT);
  console.log(`Worker ${process.pid} listening on port ${childPort}`);

  fork("./dist/app.js", [], {
    env: { ...process.env, PORT: String(childPort) },
  });
}
