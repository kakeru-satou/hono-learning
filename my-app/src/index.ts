import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { idMiddleware, timeMiddleware } from "./middleware/request-tracking.js";
import { todoApp } from "./routes/todo.js";
import type { AppEnv } from "./type.js";

const app = new Hono<AppEnv>({ strict: false });

app.use(logger());

app.use(idMiddleware);
app.use(timeMiddleware);

app.use(
  "/api/*",
  cors({
    origin: "http://localhost:3000",
  }),
);

app.route("/api/todos", todoApp);

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

serve(
  {
    fetch: app.fetch,
    hostname: "127.0.0.1",
    port: 4000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
