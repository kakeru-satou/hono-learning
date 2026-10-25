import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import type { z } from "zod";
import {
  createTodoSchema,
  getTodoSchema,
  getTodosSchema,
  type todoSchema,
} from "../shared/schema.js";
import { validationHook } from "../shared/validation.js";
import type { AppEnv } from "../type.js";

export const todoApp = new Hono<AppEnv>();

type TodoType = z.infer<typeof todoSchema>;

function createAutoIncrement(start: number = 1) {
  let current = start;
  return () => current++;
}

const todos: TodoType[] = [];
const getNextID = createAutoIncrement();

todoApp.get("/:id", zValidator("param", getTodoSchema, validationHook), (c) => {
  const { id } = c.req.valid("param");
  const requestID = c.get("requestId");
  console.log(requestID);
  const foundTodo = todos.find((t) => t.id === id);
  if (foundTodo === undefined) {
    return c.json({}, 404);
  }
  return c.json(foundTodo);
});

todoApp.get("/", zValidator("query", getTodosSchema, validationHook), (c) => {
  const { name } = c.req.valid("query");
  if (name === undefined) {
    return c.json(todos);
  }
  const foundTodos = todos.filter((value) => value.name.includes(name));
  return c.json(foundTodos);
});

todoApp.post("/", zValidator("json", createTodoSchema, validationHook), (c) => {
  const { name } = c.req.valid("json");
  const createdTodo: TodoType = { id: getNextID(), name };

  todos.push(createdTodo);

  return c.json(createdTodo, 201);
});
