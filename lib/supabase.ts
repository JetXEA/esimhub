import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Create a mock Supabase client that doesn't throw errors
const createMockClient = () => {
  // Return a mock client with all the methods we use
  return {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      signInWithPassword: () => Promise.resolve({ data: { user: null, session: null }, error: null }),
      signUp: () => Promise.resolve({ data: { user: null, session: null }, error: null }),
      signOut: () => Promise.resolve({ error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ data: null, error: null }),
          limit: () => Promise.resolve({ data: [], error: null }),
          order: () => Promise.resolve({ data: [], error: null }),
        }),
        order: () => Promise.resolve({ data: [], error: null }),
        limit: () => Promise.resolve({ data: [], error: null }),
      }),
      insert: () => Promise.resolve({ data: null, error: null }),
      update: () => ({
        eq: () => Promise.resolve({ data: null, error: null }),
        match: () => Promise.resolve({ data: null, error: null }),
      }),
      upsert: () => Promise.resolve({ data: null, error: null }),
      delete: () => ({
        eq: () => Promise.resolve({ data: null, error: null }),
      }),
    }),
    rpc: () => Promise.resolve({ data: null, error: null }),
  }
}

// Create a client-side Supabase client
export const createClientClient = () => {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn("Missing Supabase environment variables, using mock client")
      return createMockClient() as any
    }

    return createClient<Database>(supabaseUrl, supabaseAnonKey)
  } catch (error) {
    console.error("Error creating Supabase client:", error)
    return createMockClient() as any
  }
}

// Server-side Supabase client (with admin permissions)
export const createServerClient = () => {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      console.warn("Missing Supabase environment variables for server client, using mock client")
      return createMockClient() as any
    }

    return createClient<Database>(supabaseUrl, supabaseServiceKey)
  } catch (error) {
    console.error("Error creating Supabase server client:", error)
    return createMockClient() as any
  }
}

// Singleton pattern for client-side
let clientInstance: ReturnType<typeof createClientClient> | null = null

export const getClientInstance = () => {
  if (typeof window === "undefined") {
    return createClientClient()
  }

  if (!clientInstance) {
    try {
      clientInstance = createClientClient()
    } catch (error) {
      console.error("Error creating Supabase client:", error)
      clientInstance = createMockClient() as any
    }
  }
  return clientInstance
}
