import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getUserByEmail, createSession } from "@/lib/redis"

// Safely import Supabase client
const supabaseClient: any = null
const getSupabaseClient = async () => {
  if (typeof window === "undefined") {
    try {
      const { createServerClient } = await import("@/lib/supabase")
      return createServerClient()
    } catch (error) {
      console.error("Failed to initialize Supabase client:", error)
      return null
    }
  }
  return null
}

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Try Supabase authentication first if available
    try {
      const supabase = await getSupabaseClient()

      if (supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (!error && data.user) {
          // Set session cookie
          cookies().set({
            name: "session_id",
            value: data.session?.access_token || "",
            httpOnly: true,
            path: "/",
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 7, // 1 week
          })

          // Get user profile from database
          const { data: userData, error: userError } = await supabase
            .from("users")
            .select("*")
            .eq("auth_id", data.user.id)
            .single()

          if (!userError) {
            // Return user data
            return NextResponse.json({
              id: data.user.id,
              name: userData?.name || data.user.user_metadata?.name || "",
              email: data.user.email,
              balance: userData?.balance || 0,
              createdAt: userData?.created_at || data.user.created_at,
            })
          }
        }
      }
    } catch (supabaseError) {
      console.error("Supabase error:", supabaseError)
      // Continue with Redis fallback
    }

    // Fallback to Redis
    try {
      // Get user by email
      const user = await getUserByEmail(email)

      if (!user) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
      }

      // In a real app, you would hash and compare passwords
      // For demo purposes, we'll just check if the password matches
      if (user.password !== password) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
      }

      // Create session
      const sessionId = await createSession(user.id)

      // Set session cookie
      cookies().set({
        name: "session_id",
        value: sessionId,
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 1 week
      })

      // Return user without password
      const { password: _, ...userWithoutPassword } = user

      return NextResponse.json(userWithoutPassword)
    } catch (redisError) {
      console.error("Redis error:", redisError)
      return NextResponse.json({ error: "Authentication service unavailable" }, { status: 503 })
    }
  } catch (error) {
    console.error("Error logging in:", error)
    return NextResponse.json({ error: "Failed to log in" }, { status: 500 })
  }
}
