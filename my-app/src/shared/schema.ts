import { z } from "zod";

export const todoSchema = z.object({
  id: z.number(),
  name: z
    .string()
    .trim()
    .min(1, "タスク名は1文字以上で入力してください")
    .max(50, "タスク名は50文字以下で入力してください"),
});

export const createTodoSchema = todoSchema.pick({
  name: true,
});

export const getTodoSchema = z.object({
  id: z
    .string()
    .regex(/^[0-9]+$/, "数字のみを入力してください")
    .transform((value) => Number(value)),
});

export const getTodosSchema = z.object({
  name: z.string().min(1, "検索するタスク名は1文字以上で入力してください").optional(),
});

export const userSchema = z.object({
  id: z.number(),
  name: z
    .string()
    .trim()
    .min(1, "ユーザー名は1文字以上で入力してください")
    .max(30, "ユーザー名は30文字以下で入力してください"),
  email: z.email({ message: "有効なメールアドレスを入力してください" }).toLowerCase(),
  password: z
    .string()
    .min(8, "パスワードは8文字以上で入力してください")
    .refine((value) => new TextEncoder().encode(value).length <= 72, {
      message: "パスワードは72バイト以内にしてください",
    }),
});

export const createUserSchema = userSchema.pick({
  name: true,
  email: true,
  password: true,
});

export const loginUserSchema = z.object({
  email: z.email({ message: "有効なメールアドレスを入力してください" }).toLowerCase(),
  password: z.string().refine((value) => new TextEncoder().encode(value).length <= 72, {
    message: "パスワードは72バイト以内にしてください",
  }),
});
