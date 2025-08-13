import "reflect-metadata";
import "dotenv/config";
import { initializeDB } from "./db";
import { createHonoServer } from "react-router-hono-server/node";
import type { Context } from "hono";
import routes from "./routes";
import { encrypt } from "./service/bcrypt";

const {
  PORT = 3000,
} = process.env;

// 宣告你要給各 route loader/action 用的 context 形狀
declare module "react-router" {
  interface AppLoadContext {
    ua: string;
  }
}

export default createHonoServer({
  // 自訂 Hono middleware（選用）
  configure(app) {
    app.use("*", async (c, next) => {
      await initializeDB();
      await next();
    });
    app.route("/", routes);
  },
  // 傳給 loader/action 的 context
  getLoadContext(c: Context) {
    return { ua: c.req.header("user-agent") ?? "" };
  },
  port: Number(PORT),
});