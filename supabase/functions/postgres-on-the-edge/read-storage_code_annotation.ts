// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from 'https://deno.land/std@0.114.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.4.0'

// 定义 CORS 头部，允许跨域访问.CORS 头部是指跨域资源共享（Cross-Origin Resource Sharing）的 HTTP 头部字段
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey',
}

// 下面这是一个使用 Deno 标准库中的 serve 函数创建的 HTTP 服务器。
// async (req) => {}是一个回调函数，用于处理传入的请求。
serve(async (req) => {
  // read a text file from storage and print its contents
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create a Supabase client with the Auth context of the logged in user.
    const supabaseClient = createClient(
      // Supabase API URL - env var exported by default.
      Deno.env.get('_SUPABASE_URL') ?? '',
      // Supabase API ANON KEY - env var exported by default.
      Deno.env.get('_SUPABASE_ANON_KEY') ?? '',
      // Create client with Auth context of the user that called the function.
      // This way your row-level-security (RLS) policies are applied.
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )
    
    // 将下载的结果分别存储在 data 和 error 变量中。data 变量将保存下载的文件内容，error 变量将保存任何可能的错误。
    const { data, error } = await supabaseClient.storage.from('my-bucket').download('sample.txt')
    // await 是一个用于异步操作的关键字, await 只能在异步函数中使用。异步函数可以通过在函数声明前面加上 async 关键字来创建
    if (error) throw error // 在下载完成后，如果 error 变量不为空，即下载过程中发生了错误，那么使用 throw error 将这个错误抛出，以便在代码中的异常处理部分处理它。

    // file contents are returned as a blob, we can convert it to utf-8 text by calling text() method.
    const contents = await data.text()

    // prints out the contents of the file
    console.log(contents)
    
    // return new Response创建了一个 HTTP 响应,将内容发送回客户端.
    // JSON.stringify({ contents })：将一个 JavaScript 对象（contents）转换为 JSON 字符串。
    // 逗号表示分开两个对象字面量（字典的意思）
    // ...corsHeaders 是使用 JavaScript 扩展语法，将 corsHeaders 对象中的所有属性添加到这个新的对象中。
    return new Response(JSON.stringify({ contents }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error(error)
    // 捕获可能在之前代码块中抛出的错误，并将错误信息打印到控制台

    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})