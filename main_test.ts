import { assertEquals } from "https://deno.land/std@0.220.0/assert/mod.ts";
import app from "./main.ts"; // Asegúrate de que tu main.ts exporte 'app' como default

// 1. Prueba Endpoint Raíz
Deno.test("GET / - Debería responder con mensaje de servicio corriendo", async () => {
  const res = await app.request("/");
  assertEquals(res.status, 200);
  const body = await res.json();
  assertEquals(body, { status: "ok", message: "Task Manager Service is running" });
});

// 2. Prueba Endpoint Versión
Deno.test("GET /version - Debería responder con puerto y entorno", async () => {
  const res = await app.request("/version");
  assertEquals(res.status, 200);
  const body = await res.json();
  // Verificamos propiedad por propiedad o el objeto entero
  assertEquals(body.port, 8000);
  // Validamos que exista la llave environment (será UNKNOWN por defecto en test)
  assertEquals(typeof body.environment, "string");
});

// 3. Prueba Endpoint Summary
Deno.test("GET /tasks/summary - Debería responder con el resumen de tareas", async () => {
  const res = await app.request("/tasks/summary");
  assertEquals(res.status, 200);
  const body = await res.json();
  assertEquals(body, {
    totalTasks: 42,
    completedTasks: 27,
    pendingTasks: 15,
  });
});

// 4. Prueba Endpoint Status (NUEVO)
Deno.test("GET /tasks/status - Debería responder con conteo por estado", async () => {
  const res = await app.request("/tasks/status");
  assertEquals(res.status, 200);
  const body = await res.json();
  assertEquals(body, {
    "To Do": 15,
    "In Progress": 10,
    "Completed": 17,
  });
});

// 5. Prueba Endpoint User (NUEVO)
Deno.test("GET /tasks/user - Debería responder con tareas por usuario", async () => {
  const res = await app.request("/tasks/user");
  assertEquals(res.status, 200);
  const body = await res.json();
  assertEquals(body, {
    "Alice": 12,
    "Bob": 15,
    "Charlie": 10,
    "Diana": 5,
  });
});