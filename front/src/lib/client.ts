import { hc } from "hono/client";
import type { AppType } from "../../../my-app/src/app";

export const client = hc<AppType>("http://localhost:4000", {
  init: {
    credentials: "include",
  },
});
