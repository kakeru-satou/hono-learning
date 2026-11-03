import { serve } from "@hono/node-server";
import { createApp } from "./app.js";

const app = createApp();

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
