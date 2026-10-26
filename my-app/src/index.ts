import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";
import { logger } from "hono/logger";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import { idMiddleware, timeMiddleware } from "./middleware/request-tracking.js";
import { todoApp } from "./routes/todo.js";
import { CustomError } from "./shared/exception.js";
import type { AppEnv } from "./type.js";

const app = new Hono<AppEnv>({ strict: false });

const errorMessages: Partial<Record<ContentfulStatusCode, string>> = {
  400: "無効なリクエストです",
  401: "トークンが無効です",
  500: "サーバー側で問題が発生しました",
};

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

app.onError((err, c) => {
  let status: ContentfulStatusCode;
  let message: string;
  const requestId = c.get("requestId");

  if (err instanceof CustomError) {
    status = err.status;
    message = err.message;
  } else if (err instanceof HTTPException) {
    status = err.status;
    message = errorMessages[err.status] ?? "リクエストを処理できませんでした";
  } else {
    status = 500;
    message = "予期せぬエラーが発生しました";
  }

  const isServerError = status >= 500;

  if (isServerError) {
    console.error(requestId, err);
  }

  return c.json(
    {
      requestId: isServerError ? requestId : undefined,
      message,
      errors: [],
    },
    status,
  );

  // if (err instanceof HTTPException && err.status >= 500) {
  //   console.error(requestId, err);
  //   return c.json(
  //     {
  //       requestId,
  //       message: "サーバー側で問題が起きました",
  //       errors: [],
  //     },
  //     err.status,
  //   );
  // }
  // if (err instanceof CustomError) {
  //   return c.json(
  //     {
  //       message: err.message,
  //       errors: [],
  //     },
  //     err.status,
  //   );
  // }
  // if (err instanceof HTTPException) {
  //   const message = errorMessages[err.status] ?? "リクエストを処理できませんでした";
  //   return c.json(
  //     {
  //       message,
  //       errors: [],
  //     },
  //     err.status,
  //   );
  // }
  // console.error(requestId, err);
  // return c.json(
  //   {
  //     requestId,
  //     message: "予期しないエラーが発生しました",
  //     errors: [],
  //   },
  //   500,
  // );
});

app.notFound((c) => {
  return c.json(
    {
      message: "ページが見つかりませんでした",
      errors: [],
    },
    404,
  );
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
