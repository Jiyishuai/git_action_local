import * as postgres from "postgres";
import { serve } from "https://deno.land/std@0.114.0/http/server.ts";
import { Pool } from "https://deno.land/x/postgres@v0.17.0/mod.ts";

console.log(`Function "postgres-on-the-edge" up and running!`);

// Get the connection string from the environment variable "DATABASE_URL"
// const databaseUrl = Deno.env.get("DATABASE_URL")!; // 这个连接不上，不知道为什么
// const databaseUrl = "postgresql://postgres:MABcWlohQrn2vGoQ@db.ugihqxcaquwzqqugbqvu.supabase.co:5432/postgres"
const databaseUrl = "postgresql://postgres:postgres@172.25.19.33:54322/postgres"
// Create a database pool with three connections that are lazily established
const pool = new postgres.Pool(databaseUrl, 3, true);
console.log(`databaseUrl`);

serve(async (_req) => {
  try {
    // Grab a connection from the pool
    const connection = await pool.connect()

    try {
      // Run a query
      const result = await connection.queryObject`SELECT id FROM abstract`
      const todos = result.rows // [{ id: 1, name: "Lion" }, ...]
      console.log(todos)

      // Encode the result as pretty printed JSON
      const body = JSON.stringify(
        todos,
        (key, value) => (typeof value === 'bigint' ? value.toString() : value),
        2
      )

      // Return the response with the correct content type header
      return new Response(body, {
        status: 200,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
      })
    } finally {
      // Release the connection back into the pool
      connection.release()
    }
  } catch (err) {
    console.error(err)
    return new Response(String(err?.message ?? err), { status: 500 })
  }
})