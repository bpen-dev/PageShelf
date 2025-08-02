import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient(p0: string, p1: string) {
  const cookieStore = cookies()

  // Supabaseクライアントを作成して返す
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          return (await cookieStore).get(name)?.value
        },
        async set(name: string, value: string, options: CookieOptions) {
          try {
            (await cookieStore).set({ name, value, ...options })
          } catch (error) {
            // Server Componentからsetが呼ばれた場合のエラー。
            // middlewareでセッションを更新していれば無視してOK。
          }
        },
        async remove(name: string, options: CookieOptions) {
          try {
            (await cookieStore).set({ name, value: '', ...options })
          } catch (error) {
            // Server Componentからdeleteが呼ばれた場合のエラー。
            // middlewareでセッションを更新していれば無視してOK。
          }
        },
      },
    }
  )
}