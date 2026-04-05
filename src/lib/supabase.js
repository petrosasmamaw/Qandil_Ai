import { createClient } from '@supabase/supabase-js'

let supabaseClient = null

export const getSupabaseClient = () => {
  if (!supabaseClient) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      // During build time, environment variables might not be available
      // Provide fallback values or delay the error
      if (typeof window === 'undefined') {
        console.warn('Supabase environment variables not available during build')
        return null
      }
      throw new Error('Missing Supabase environment variables')
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
      // Return a no-op function during build time
      return () => Promise.resolve({ data: null, error: null })
    }
    const value = client[prop]
    if (typeof value === 'function') {
      return value.bind(client)
    }
    return value
  }
})