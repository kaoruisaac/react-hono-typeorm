import { Hono } from "hono";
import apiRoute from "./api";
import authRoute from "./auth";

const routes = new Hono();

routes.get("/health-check", (c) => c.json({ status: "ok" }));
routes.route("/api", apiRoute);
routes.route("/auth", authRoute);

export default routes;