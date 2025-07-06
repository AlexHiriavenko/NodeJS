# Battleship game backend using WebSocket

> Backend server for battleship game using WebSocket and in-memory data.
> Includes static HTTP server for serving frontend.  
> By default, WebSocket client connects to `ws://localhost:3000`.

**Note**: replace `npm` with `yarn` in `package.json` if you use Yarn.

---

## Installation

1. Clone/download this repository
2. Run `npm install` to install dependencies

---

## Usage

### Development

| Command | Description |
|--------|-------------|
| `npm run start:dev` | Run development server with `nodemon` and auto-restart on changes (runs via `ts-node`) |
| `npm run start`     | Run development server once with `ts-node` (no watching) |

> Server runs on: `http://localhost:8181`  
> WebSocket expected at: `ws://localhost:3000`

---

### Production

| Command | Description |
|--------|-------------|
| `npm run build`      | Compile TypeScript into JavaScript using `tsc` into `./dist` |
| `npm run start:prod` | Run production build: auto-fix lint errors, build project, run compiled code via Node.js |

---

### Code Quality

| Command | Description |
|--------|-------------|
| `npm run lint`      | Run ESLint to check code for issues |
| `npm run lint:fix`  | Run ESLint and auto-fix fixable issues |

---