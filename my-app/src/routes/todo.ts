import { Hono } from "hono";

const todoApp = new Hono();

type TodoType = {
  id: number;
  name: string;
};

function createAutoIncrement(start: number = 1) {
  let current = start;
  return () => current++;
}

const todos: TodoType[] = [];
const getNextID = createAutoIncrement();

todoApp.get("/:id", (c) => {
  const id = Number(c.req.param("id"));
  if (Number.isNaN(id)) {
    return c.json({}, 400);
  }
  const foundTodo = todos.find((t) => t.id === id);
  if (foundTodo === undefined) {
    return c.json({}, 404);
  }
  return c.json(foundTodo);
});

todoApp.get("/", (c) => {
  const name = c.req.query("name");
  if (name === undefined) {
    return c.json(todos);
  }
  const foundTodos = todos.filter((value) => value.name.includes(name));
  return c.json(foundTodos);
});

todoApp.post("/", async (c) => {
  const { name } = await c.req.json<{ name: string }>();
  const createdTodo: TodoType = { id: getNextID(), name };

  todos.push(createdTodo);

  return c.json(createdTodo, 201);
});

export { todoApp };
