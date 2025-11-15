import { Hono } from "https://deno.land/x/hono@v4.2.2/mod.ts";

const app = new Hono( );

let tasks = [
  { id: 1, title: "Configurar Dockerfile", completed: true },
  { id: 2, title: "Implementar script deploy.sh", completed: false },
  { id: 3, title: "Generar guía de configuración", completed: false },
];

app.use("*", async (c, next) => {
  console.log(`[${new Date().toISOString()}] ${c.req.method} ${c.req.url}`);
  await next();
});

app.get("/", (c) => {
  return c.json({ status: "ok", message: "Task Manager Service is running" });
});

app.get("/tasks", (c) => {
  return c.json(tasks);
});

app.get("/tasks/:id", (c) => {
  const id = parseInt(c.req.param("id"));
  const task = tasks.find((t) => t.id === id);
  if (task) {
    return c.json(task);
  }
  return c.json({ error: "Task not found" }, 404);
});


app.post("/tasks", async (c) => {
  const { title } = await c.req.json();
  if (!title) {
    return c.json({ error: "Title is required" }, 400);
  }
  const newId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
  const newTask = { id: newId, title, completed: false };
  tasks.push(newTask);
  return c.json(newTask, 201);
});

app.put("/tasks/:id", (c) => {
  const id = parseInt(c.req.param("id"));
  const taskIndex = tasks.findIndex((t) => t.id === id);

  if (taskIndex !== -1) {
    tasks[taskIndex].completed = true;
    return c.json(tasks[taskIndex]);
  }
  return c.json({ error: "Task not found" }, 404);
});

app.delete("/tasks/:id", (c) => {
  const id = parseInt(c.req.param("id"));
  const initialLength = tasks.length;
  tasks = tasks.filter((t) => t.id !== id);

  if (tasks.length < initialLength) {
    return c.json({ message: "Task deleted" });
  }
  return c.json({ error: "Task not found" }, 404);
});

Deno.serve({ port: 8000 }, app.fetch);
console.log("Server running on http://localhost:8000" );
