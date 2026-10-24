import { createMiddleware } from "hono/factory";
import type { AppEnv } from "../type.js";

export const timeMiddleware = createMiddleware(async (c, next) => {
  const start = Date.now();

  await next();

  const ms = Date.now() - start;
  c.header("X-Response-Time", `${ms}ms`);
});

export const idMiddleware = createMiddleware<AppEnv>(async (c, next) => {
  const requestID = crypto.randomUUID();

  c.set("requestId", requestID);

  await next();
});
