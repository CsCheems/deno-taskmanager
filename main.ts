import { Hono } from "https://deno.land/x/hono@v4.2.2/mod.ts";

const app = new Hono();

// --- TUS DATOS ---
const taskSumary = {
  totalTasks: 42,
  completedTasks: 27,
  pendingTasks: 15,
};

const taskStatus = {
  "To Do": 15,
  "In Progress": 10,
  "Completed": 17,
};

const taskUser = {
  "Alice": 12,
  "Bob": 15,
  "Charlie": 10,
  "Diana": 5,
}

const APP_ENV = Deno.env.get("APP_ENV") ?? "UNKNOWN";

// --- MIDDLEWARES ---
app.use("*", async (c, next) => {
  console.log(`[${new Date().toISOString()}] ${c.req.method} ${c.req.url}`);
  await next();
});

// --- RUTAS ---
app.get("/", (c) => {
  return c.json({ status: "ok", message: "Tasks Manager Service is running" });
});

app.get("/version", (c) => {
  return c.json({
    environment: APP_ENV,
    port: 8000,
  });
});

app.get("/tasks/summary", (c) => {
  return c.json(taskSumary);
});

app.get("/tasks/status", (c) => {
  return c.json(taskStatus);
});

app.get("/tasks/user", (c) => {
  return c.json(taskUser);
});


// --- CONFIGURACIÓN PARA TESTING Y SERVIDOR ---

// 1. Exportamos la instancia 'app' para poder importarla en 'main_test.ts'
export default app;

// 2. Usamos 'import.meta.main'. 
// Esto significa: "Solo inicia el servidor si ejecuto este archivo directamente"
// Si el archivo es importado por el test, este bloque NO se ejecuta.
if (import.meta.main) {
  Deno.serve({ port: 8000 }, app.fetch);
  console.log("Server running on http://localhost:8000");
}
