import { randomBytes } from "node:crypto";
import { zValidator } from "@hono/zod-validator";
import bcrypt from "bcryptjs";
import type { Context } from "hono";
import { Hono } from "hono";
import { deleteCookie, setCookie } from "hono/cookie";
import { sign } from "hono/jwt";
import type { z } from "zod";
import { secretKey } from "../env.js";
import { ACCESS_TOKEN_COOKIE_NAME } from "../shared/constants.js";
import { CustomError } from "../shared/exception.js";
import { createUserSchema, loginUserSchema, type userSchema } from "../shared/schema.js";
import { validationHook } from "../shared/validation.js";
import type { AppEnv } from "../type.js";

type UserType = z.infer<typeof userSchema>;
type ResponseUserType = {
  id: number;
  name: string;
};

export const authApp = new Hono<AppEnv>();
const users: UserType[] = [];
const getNextID = createAutoIncrement();
const saltRounds = 10;
const tokenMaxAgeSeconds = 60 * 60;

function createAutoIncrement(start: number = 1) {
  let current = start;
  return () => current++;
}

async function createToken(id: number): Promise<string> {
  const payload = {
    sub: String(id),
    exp: Math.floor(Date.now() / 1000) + tokenMaxAgeSeconds,
  };

  const token = await sign(payload, secretKey);

  return token;
}

function setAuthCookie(c: Context, token: string) {
  setCookie(c, ACCESS_TOKEN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: "Lax",
    path: "/",
    maxAge: tokenMaxAgeSeconds,
  });
}

async function dummyHash(): Promise<string> {
  const random = randomBytes(16).toString("hex");
  const dummy = await bcrypt.hash(random, saltRounds);
  return dummy;
}

const dummy = await dummyHash();

authApp.post("/register", zValidator("json", createUserSchema, validationHook), async (c) => {
  const { name, email, password } = c.req.valid("json");
  const foundUser = users.find((u) => u.email === email);
  if (foundUser !== undefined) {
    throw new CustomError(409, "このメールアドレスは既に使用されています");
  }
  const hashPassword = await bcrypt.hash(password, saltRounds);
  const createdUser: UserType = { id: getNextID(), name, email, password: hashPassword };

  const token = await createToken(createdUser.id);
  setAuthCookie(c, token);

  users.push(createdUser);

  const responseUser: ResponseUserType = {
    id: createdUser.id,
    name: createdUser.name,
  };

  return c.json(responseUser, 201);
});

authApp.post("/login", zValidator("json", loginUserSchema, validationHook), async (c) => {
  const { email, password } = c.req.valid("json");
  const foundUser = users.find((u) => u.email === email);

  const isMatch = await bcrypt.compare(password, foundUser?.password ?? dummy);
  if (!isMatch || foundUser === undefined) {
    throw new CustomError(401, "メールアドレス、またはパスワードが違います");
  }

  const token = await createToken(foundUser.id);
  setAuthCookie(c, token);

  const responseUser: ResponseUserType = {
    id: foundUser.id,
    name: foundUser.name,
  };

  return c.json(responseUser, 200);
});

authApp.post("/logout", (c) => {
  deleteCookie(c, ACCESS_TOKEN_COOKIE_NAME, {
    path: "/",
  });

  return c.json({ message: "ログアウトされました" }, 200);
});
