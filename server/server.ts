import type { Context } from "hono";
import { createHonoServer } from "react-router-hono-server/node";
import { serveStatic } from "@hono/node-server/serve-static";
import type JsonEmployee from "~/JsonModels/JsonEmployee";
import "reflect-metadata";
import "dotenv/config";
import { initializeDB } from "./db";
import { i18nInstance } from "./services/i18n";
import routes from "./routes";
import authMiddleware from "./middleware/auth";
import RequestError from "~/shared/RequestError";

const {
  PORT = 3000,
} = process.env;

// 宣告你要給各 route loader/action 用的 context 形狀
declare module "react-router" {
  interface AppLoadContext {
    employee?: JsonEmployee;
  }
}

declare module "hono" {
  interface ContextVariableMap  {
    employee?: JsonEmployee;
  }
}

export default createHonoServer({
  // 自訂 Hono middleware（選用
  configure(app) {
    app.use("*", async (c, next) => {
      await initializeDB();
      await i18nInstance;
      await next();
    });
    app.use("*", authMiddleware);
    app.route("/", routes);
    app.onError((err, c) => {
      const requestError = new RequestError(err as any);
      return c.json(requestError, requestError.status as any);
    });
  },
  // 傳給 loader/action 的 context
  getLoadContext(c: Context) {
    return { employee: c.get("employee") };
  },
  port: Number(PORT),
});