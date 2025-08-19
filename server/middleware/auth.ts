import type { Context } from "hono";
import { verifyEmployeeToken } from "server/services/authToken";

const authMiddleware = async (c: Context, next: () => Promise<void>) => {
    const employee = await verifyEmployeeToken(c);
    c.set("employee", employee);
    return next();
}

export default authMiddleware;