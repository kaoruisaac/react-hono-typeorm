import { sign, verify } from "hono/jwt";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import type { Context } from "hono";
import type { Employee } from "server/db/models/Employee";
import JsonEmployee from "~/JsonModels/JsonEmployee";

const {
  ENVIRONMENT = "development",
} = process.env

export const wrapEmployeeTokenInfoCookie = async (c: Context, employee: Employee) => {
  const token = await sign({ ...employee.toJSON() }, process.env.JWT_SECRET);
  setCookie(c, "employee-token", token, {
    secure: ENVIRONMENT === "production",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export const removeEmployeeTokenInfoCookie = (c: Context) => {
  deleteCookie(c, "employee-token");
}

export const verifyEmployeeToken = async (c: Context) => {
  const token = getCookie(c, "employee-token");
  if (!token) {
    return null;
  }
  const decoded = await verify(token, process.env.JWT_SECRET);
  if (!decoded) {
    return null;
  }
  return new JsonEmployee().load(decoded as unknown as JsonEmployee);
}
