import http from "http";
import { config } from "dotenv";
import { UserController } from "./controllers/user.controller";

// Загрузка переменных из .env
config();

const PORT = Number(process.env.PORT) || 4000;
const NODE_ENV = process.env.NODE_ENV || "development";
const controller = new UserController();

const server = http.createServer((req, res) => controller.handle(req, res));

server.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT} in ${NODE_ENV} mode`);
});
