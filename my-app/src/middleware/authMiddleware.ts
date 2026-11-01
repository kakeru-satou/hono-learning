// import { getCookie } from "hono/cookie";
// import { createMiddleware } from "hono/factory";
// import { type JwtVariables, jwt, verify } from "hono/jwt";
// import type { JWTPayload } from "hono/utils/jwt/types";
import { jwt } from "hono/jwt";
import { secretKey } from "../env.js";
import { ACCESS_TOKEN_COOKIE_NAME } from "../shared/constants.js";
// import { CustomError } from "../shared/exception.js";
// import type { AppEnv } from "../type.js";

// export const authMiddleware = createMiddleware<AppEnv>(async (c, next) => {
//   const token = getCookie(c, ACCESS_TOKEN_COOKIE_NAME);
//   if (!token) {
//     throw new CustomError(401, "認証に失敗しました");
//   }
//   let payload: JWTPayload;
//   try {
//     payload = await verify(token, secretKey, "HS256");
//   } catch {
//     throw new CustomError(401, "認証に失敗しました");
//   }

//   const userId = payload.sub;

//   if (typeof userId !== "string") {
//     throw new CustomError(401, "認証に失敗しました");
//   }

//   c.set("userId", userId);

//   await next();
// });

export const authMiddleware = jwt({
  secret: secretKey,
  alg: "HS256",
  cookie: ACCESS_TOKEN_COOKIE_NAME,
});
