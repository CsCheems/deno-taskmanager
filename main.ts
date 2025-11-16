import { Hono } from "https://deno.land/x/hono@v4.2.2/mod.ts";

const app = new Hono( );

const APP_ENV = Deno.env.get("APP_ENV") ?? "UNKNOWN";

app.use("*", async (c, next) => {
  console.log(`[${new Date().toISOString()}] ${c.req.method} ${c.req.url}`);
  await next();
});

app.get("/", (c) => {
  return c.json({ status: "ok", message: "Task Manager Service is running" });
});

app.get("/version", (c) => {
  return c.json({
    environment: APP_ENV,
    port: 8000,
  });
});


Deno.serve({ port: 8000 }, app.fetch);
console.log("Server running on http://localhost:8000" );
