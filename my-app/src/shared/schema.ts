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
