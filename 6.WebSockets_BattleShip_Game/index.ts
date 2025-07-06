import 'dotenv/config';
import { WsServer } from './src/ws_server';
import { httpServer } from './src/http_server';

const HTTP_PORT = Number(process.env.HTTP_PORT ?? 8181);
const WS_PORT = Number(process.env.WS_PORT ?? 3000);

httpServer.listen(HTTP_PORT);
new WsServer(WS_PORT);

console.log(`Start http server on ${HTTP_PORT} port!`);
console.log(`Start ws server on ${WS_PORT} port!`);
