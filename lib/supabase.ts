import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"
import { getSupabaseUrl, getSupabaseAnonKey, getSupabaseServiceKey, isSupabaseConfigured } from "./env"

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
    if (!isSupabaseConfigured()) {
      console.warn("Missing Supabase environment variables, using mock client")
      return createMockClient() as any
    }

    return createClient<Database>(getSupabaseUrl(), getSupabaseAnonKey())
  } catch (error) {
    console.error("Error creating Supabase client:", error)
    return createMockClient() as any
  }
}

// Server-side Supabase client (with admin permissions)
export const createServerClient = () => {
  try {
    if (!isSupabaseConfigured() || !getSupabaseServiceKey()) {
      console.warn("Missing Supabase environment variables for server client, using mock client")
      return createMockClient() as any
    }

    return createClient<Database>(getSupabaseUrl(), getSupabaseServiceKey())
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
