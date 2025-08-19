import { Hono } from "hono";
import sampleRoute from "./sample";
import authRoute from "./auth";

const apiRoute = new Hono();

apiRoute.route("/sample", sampleRoute);
apiRoute.route("/auth", authRoute);

export default apiRoute;