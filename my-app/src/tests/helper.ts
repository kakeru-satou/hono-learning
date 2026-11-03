import { sign } from "hono/jwt";
import { secretKey } from "../env.js";
import { ACCESS_TOKEN_COOKIE_NAME } from "../shared/constants.js";

export async function createTestToken(id: number, tokenMaxAgeSeconds: number): Promise<string> {
  const payload = {
    sub: String(id),
    exp: Math.floor(Date.now() / 1000) + tokenMaxAgeSeconds,
  };

  const token = await sign(payload, secretKey);

  return token;
}

export function createTestCookieHeader(token: string): string {
  const headerText = `${ACCESS_TOKEN_COOKIE_NAME}=${token}`;

  return headerText;
}

export function getCookieFromSetCookie(setCookie: string): string {
  const cookie = setCookie.split(";")[0];
  return cookie;
}
