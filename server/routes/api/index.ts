import { Hono } from "hono";
import sampleRoute from "./sample";

const apiRoute = new Hono();

apiRoute.route("/sample", sampleRoute);

export default apiRoute;