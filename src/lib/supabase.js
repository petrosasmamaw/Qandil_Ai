import { createClient } from '@supabase/supabase-js'

let supabaseClient = null

export const getSupabaseClient = () => {
  if (!supabaseClient) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      // In production, don't throw error - return null and let components handle it
      if (typeof window !== 'undefined') {
        console.error(`Missing Supabase environment variables. URL: ${!!supabaseUrl}, Key: ${!!supabaseAnonKey}`)
        return null
      }
      throw new Error(`Missing Supabase environment variables. URL: ${!!supabaseUrl}, Key: ${!!supabaseAnonKey}`)
    }

    supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
  }

  return supabaseClient
}

// For backward compatibility, export a proxy that behaves like the client
export const supabase = new Proxy({}, {
  get(target, prop) {
    const client = getSupabaseClient()
    if (!client) {
      // Return a mock object with safe methods for missing environment variables
      return () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } })
    }
    const value = client[prop]
    if (typeof value === 'function') {
      return value.bind(client)
    }
    return value
  }
})