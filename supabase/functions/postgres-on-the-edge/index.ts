import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

console.log(`Function "postgres-on-the-edge" up and running!`);

// const databaseUrl = Deno.env.get("DATABASE_URL")!; // 这个连接不上，不知道为什么
// const databaseUrl = "postgresql://postgres:MABcWlohQrn2vGoQ@db.ugihqxcaquwzqqugbqvu.supabase.co:5432/postgres"
const databaseUrl = "postgresql://postgres:postgres@172.25.19.33:54322/postgres"
console.log(databaseUrl);

serve(async (_req) => {



  try {
    // Create a Supabase client with the Auth context of the logged in user.
    const supabaseClient = createClient(
      "http://172.25.19.33:54321",
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0',
      // Create client with Auth context of the user that called the function.
      // This way your row-level-security (RLS) policies are applied.
      { global: { headers: { Authorization: _req.headers.get('Authorization')! } } }
    )

    const { data, error } = await supabaseClient.from('abstract').select("id")
    if (error) throw error

    
    // prints out the contents of the file
    // console.log(data.data)

    return new Response(JSON.stringify({ data }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  } 
  catch (err) {
    console.error(err)
    return new Response(String(err?.message ?? err), { status: 500 })
  }
})