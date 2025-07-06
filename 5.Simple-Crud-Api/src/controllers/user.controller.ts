import http from "http";
import { parse } from "url";
import { validate as isUuid } from "uuid";
import { UserService } from "../services/user.service";
import { CreateUserDto } from "../dto/create-user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";

const userService = new UserService();

export class UserController {
  async handle(req: http.IncomingMessage, res: http.ServerResponse): Promise<void> {
    const parsedUrl = parse(req.url || "", true);
    const method = req.method;
    if (!method) {
      this.sendError(res, 400, "Missing HTTP method");
      return;
    }

    const pathname = parsedUrl.pathname || "";
    const normalizedPath = pathname.replace(/\/+$/, "") || "/";
    const idMatch = normalizedPath.match(/^\/api\/users\/([a-zA-Z0-9-]+)$/);

    const getBody = async (): Promise<any> =>
      new Promise((resolve) => {
        let body = "";
        req.on("data", (chunk) => (body += chunk));
        req.on("end", () => {
          try {
            resolve(JSON.parse(body));
          } catch {
            resolve({});
          }
        });
      });

    try {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type");

      const routes = {
        options: method === "OPTIONS",
        getUsers: method === "GET" && normalizedPath === "/api/users",
        getUser: method === "GET" && idMatch,
        createUser: method === "POST" && normalizedPath === "/api/users",
        updateUser: method === "PUT" && idMatch,
        deleteUser: method === "DELETE" && idMatch,
      };

      if (routes.options) {
        res.writeHead(204);
        res.end();
        return;
      }

      if (routes.getUsers) {
        const users = userService.getAll();
        return this.sendJson(res, 200, users);
      }

      if (routes.getUser) {
        const id = idMatch![1];
        if (!isUuid(id)) {
          return this.sendError(res, 400, "Invalid userId: must be a valid UUID");
        }

        const user = userService.getById(id);
        if (!user) {
          return this.sendError(res, 404, `User with ID ${id} not found`);
        }

        return this.sendJson(res, 200, user);
      }

      if (routes.createUser) {
        const body = await getBody();
        const dto = new CreateUserDto(body);
        const validation = dto.isValid();

        if (!validation.valid) {
          return this.sendError(res, 400, `Invalid request body: ${validation.message}`);
        }

        const user = userService.create(dto);
        return this.sendJson(res, 201, user);
      }

      if (routes.updateUser) {
        const id = idMatch![1];
        if (!isUuid(id)) {
          return this.sendError(res, 400, "Invalid userId: must be a valid UUID");
        }

        const body = await getBody();
        const dto = new UpdateUserDto(body);
        const validation = dto.isValid();

        if (!validation.valid) {
          return this.sendError(res, 400, `Invalid request body: ${validation.message}`);
        }

        const updated = userService.update(id, dto);
        if (!updated) {
          return this.sendError(res, 404, `User with ID ${id} not found`);
        }

        return this.sendJson(res, 200, updated);
      }

      if (routes.deleteUser) {
        const id = idMatch![1];
        if (!isUuid(id)) {
          return this.sendError(res, 400, "Invalid userId: must be a valid UUID");
        }

        const deleted = userService.delete(id);
        if (!deleted) {
          return this.sendError(res, 404, `User with ID ${id} not found`);
        }

        res.writeHead(204);
        res.end();
        return;
      }

      return this.sendError(res, 404, "Route not found");
    } catch (err) {
      return this.sendError(res, 500, "Internal Server Error");
    }
  }

  private sendJson(res: http.ServerResponse, code: number, data: any) {
    res.writeHead(code, { "Content-Type": "application/json" });
    res.end(JSON.stringify(data));
  }

  private sendError(res: http.ServerResponse, code: number, message: string) {
    res.writeHead(code, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ statusCode: code, message }));
  }
}
