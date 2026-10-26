import { HTTPException } from "hono/http-exception";
import type { ContentfulStatusCode } from "hono/utils/http-status";

export class CustomError extends HTTPException {
  constructor(status: ContentfulStatusCode, message: string) {
    super(status, {
      message,
    });
  }
}
