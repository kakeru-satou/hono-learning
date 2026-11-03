import { beforeEach, describe, expect, test } from "vitest";
import { createApp } from "../app.js";
import { ACCESS_TOKEN_COOKIE_NAME } from "../shared/constants.js";
import { createTestCookieHeader, createTestToken, getCookieFromSetCookie } from "./helper.js";

const tokenMaxAgeSeconds = 60 * 60;
const hashCost = 4;

let app: ReturnType<typeof createApp>;

beforeEach(() => {
  app = createApp(hashCost);
});

describe("Hello Hono", () => {
  test("GET /", async () => {
    const res = await app.request("/");
    expect(res.status).toBe(200);
    expect(await res.text()).toBe("Hello Hono!");
  });
});

describe("Todo Get", () => {
  test("GET /api/todos without Cookie", async () => {
    const res = await app.request("/api/todos");
    expect(res.status).toBe(401);
  });

  test("GET /api/todos with Cookie", async () => {
    const token = await createTestToken(1, tokenMaxAgeSeconds);
    const res = await app.request("/api/todos", {
      headers: new Headers({ Cookie: createTestCookieHeader(token) }),
    });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual([]);
  });

  test("GET /api/todos with expired Cookie", async () => {
    const expiredTokenSeconds = -1000;
    const token = await createTestToken(1, expiredTokenSeconds);
    const res = await app.request("/api/todos", {
      headers: new Headers({ Cookie: createTestCookieHeader(token) }),
    });
    expect(res.status).toBe(401);
  });
});

describe("Todo Post", () => {
  test("POST /api/todos without Cookie", async () => {
    const res = await app.request("/api/todos", {
      method: "POST",
      body: JSON.stringify({ name: "test" }),
      headers: new Headers({ "Content-Type": "application/json" }),
    });
    expect(res.status).toBe(401);
  });

  test("POST /api/todos with Cookie", async () => {
    const token = await createTestToken(1, tokenMaxAgeSeconds);
    const res = await app.request("/api/todos", {
      method: "POST",
      body: JSON.stringify({ name: "test" }),
      headers: new Headers({
        "Content-Type": "application/json",
        Cookie: createTestCookieHeader(token),
      }),
    });
    expect(res.status).toBe(201);

    const getRes = await app.request("/api/todos", {
      headers: new Headers({ Cookie: createTestCookieHeader(token) }),
    });
    expect(await getRes.json()).toEqual([{ id: 1, name: "test" }]);
  });

  test("POST /api/todos without todo name", async () => {
    const token = await createTestToken(1, tokenMaxAgeSeconds);
    const res = await app.request("/api/todos", {
      method: "POST",
      body: JSON.stringify({ name: "" }),
      headers: new Headers({
        "Content-Type": "application/json",
        Cookie: createTestCookieHeader(token),
      }),
    });
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({
      message: "入力値にエラー",
      errors: [{ message: "タスク名は1文字以上で入力してください" }],
    });

    const getRes = await app.request("/api/todos", {
      headers: new Headers({ Cookie: createTestCookieHeader(token) }),
    });
    expect(await getRes.json()).toEqual([]);
  });
});

describe("User Post", () => {
  test("POST /api/auth/register", async () => {
    const res = await app.request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ name: "test", email: "test@example.com", password: "testtest" }),
      headers: new Headers({ "Content-Type": "application/json" }),
    });
    expect(res.status).toBe(201);
    const cookie = res.headers.get("set-cookie");
    expect(cookie).toContain(ACCESS_TOKEN_COOKIE_NAME);
    expect(cookie).toContain("HttpOnly");
  });

  test("POST /api/auth/register same email", async () => {
    const res = await app.request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ name: "test", email: "test@example.com", password: "testtest" }),
      headers: new Headers({ "Content-Type": "application/json" }),
    });
    expect(res.status).toBe(201);

    const secondRes = await app.request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ name: "test", email: "test@example.com", password: "testtest" }),
      headers: new Headers({ "Content-Type": "application/json" }),
    });
    expect(secondRes.status).toBe(409);
  });

  test("POST /api/auth/login", async () => {
    const registerRes = await app.request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ name: "test", email: "test@example.com", password: "testtest" }),
      headers: new Headers({ "Content-Type": "application/json" }),
    });
    expect(registerRes.status).toBe(201);

    const res = await app.request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: "test@example.com", password: "testtest" }),
      headers: new Headers({ "Content-Type": "application/json" }),
    });
    expect(res.status).toBe(200);

    const setCookie = res.headers.get("set-cookie");
    if (!setCookie) {
      throw new Error("Cookieがありません");
    }
    const cookie = getCookieFromSetCookie(setCookie);

    const getRes = await app.request("/api/todos", {
      headers: new Headers({ Cookie: cookie }),
    });
    expect(getRes.status).toBe(200);
  });
});
