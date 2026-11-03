import type { JwtVariables } from "hono/jwt";

type AppEnv = { Variables: { requestId: string } } & { Variables: JwtVariables };

export type { AppEnv };
