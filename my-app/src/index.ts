import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { todoApp } from "./routes/todo.js";

const app = new Hono({ strict: false });

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
