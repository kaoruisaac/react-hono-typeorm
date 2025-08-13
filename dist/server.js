// server/server.ts
import { serve } from "@hono/node-server";
import { Hono } from "hono";
var {
  SERVER_PORT = 3e3
} = process.env;
var app = new Hono();
app.get("/", (c) => c.text("Hello World"));
serve({
  fetch: app.fetch.bind(app),
  port: Number(SERVER_PORT)
}, () => {
  console.log(`Server is running on http://localhost:${SERVER_PORT}`);
});
