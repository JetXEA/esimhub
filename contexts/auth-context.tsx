"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { getClientInstance } from "@/lib/supabase"
import type { User } from "@supabase/supabase-js"
import { isLoggedIn, getCurrentUser, logout, setupSessionCheck, clearSessionCheck } from "@/lib/session"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  error: string | null
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sessionCheckInterval, setSessionCheckInterval] = useState<number | null>(null)
  const supabase = getClientInstance()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // First check local storage for session
        if (isLoggedIn()) {
          const localUser = getCurrentUser()
          if (localUser) {
            setUser(localUser)
            setIsLoading(false)
            return
          }
        }

        // Check if Supabase is properly configured
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

        if (supabaseUrl && supabaseAnonKey) {
          // If Supabase is configured, check for session
          try {
            const sessionResponse = await supabase.auth.getSession()
            // Safely access session data
            if (
              sessionResponse &&
              sessionResponse.data &&
              sessionResponse.data.session &&
              sessionResponse.data.session.user
            ) {
              setUser(sessionResponse.data.session.user)
            } else {
              setUser(null)
            }
          } catch (supabaseError) {
            console.error("Supabase session error:", supabaseError)
            // Continue with null user
            setUser(null)
          }
        } else {
          // If Supabase is not configured, just set user to null
          console.warn("Supabase not configured, skipping auth check")
          setUser(null)
        }
      } catch (error) {
        console.error("Error fetching user:", error)
        setError(error instanceof Error ? error.message : "An error occurred")
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()

    // Set up session check interval
    const intervalId = setupSessionCheck()
    if (intervalId) {
      setSessionCheckInterval(intervalId)
    }

    // Set up auth state change listener only if Supabase is configured
    let subscription: { unsubscribe: () => void } | null = null

    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      try {
        const authStateChange = supabase.auth.onAuthStateChange((_event, session) => {
          // Safely set user
          setUser(session && session.user ? session.user : null)
        })

        // Safely access subscription
        if (
          authStateChange &&
          authStateChange.data &&
          authStateChange.data.subscription &&
          typeof authStateChange.data.subscription.unsubscribe === "function"
        ) {
          subscription = authStateChange.data.subscription
        }
      } catch (error) {
        console.error("Error setting up auth state change listener:", error)
      }
    }

    return () => {
      if (subscription) {
        subscription.unsubscribe()
      }
      // Clear session check interval
      if (sessionCheckInterval) {
        clearSessionCheck(sessionCheckInterval)
      }
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      // Safely check for errors
      if (response && response.error) {
        throw response.error
      }

      // Safely set user
      if (response && response.data && response.data.user) {
        setUser(response.data.user)
      } else {
        throw new Error("No user data returned")
      }
    } catch (error) {
      console.error("Login error:", error)
      setError(error instanceof Error ? error.message : "Failed to log in")
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signUp = async (email: string, password: string, name: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      })

      // Safely check for errors
      if (response && response.error) {
        throw response.error
      }

      // Safely set user
      if (response && response.data && response.data.user) {
        setUser(response.data.user)

        // Create user profile in the database
        try {
          const profileResponse = await supabase.from("users").insert({
            auth_id: response.data.user.id,
            name,
            email,
            balance: 10.0, // Starting balance
          })

          if (profileResponse && profileResponse.error) {
            console.error("Error creating user profile:", profileResponse.error)
          }
        } catch (profileError) {
          console.error("Error creating user profile:", profileError)
        }
      } else {
        throw new Error("No user data returned")
      }
    } catch (error) {
      console.error("Signup error:", error)
      setError(error instanceof Error ? error.message : "Failed to sign up")
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Use our logout utility which handles both client and server-side logout
      await logout()
      setUser(null)
    } catch (error) {
      console.error("Logout error:", error)
      setError(error instanceof Error ? error.message : "Failed to log out")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, error, signIn, signUp, signOut }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
