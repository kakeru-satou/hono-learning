import type { Context } from "hono";
import type { z } from "zod";

type Result =
  | {
      success: true;
    }
  | {
      success: false;
      error: z.core.$ZodError;
    };

export const validationHook = (result: Result, c: Context) => {
  if (!result.success) {
    const formattedErrors = result.error.issues.map((issue) => ({
      message: issue.message,
    }));

    return c.json(
      {
        message: "入力値にエラー",
        errors: formattedErrors,
      },
      400,
    );
  }
};
