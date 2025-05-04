import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getUserByEmail, createSession } from "@/lib/redis"

// Safely import Supabase client
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
    let requestBody
    try {
      requestBody = await request.json()
    } catch (error) {
      console.error("Error parsing JSON:", error)
      return NextResponse.json({ error: "Invalid JSON request body", success: false }, { status: 400 })
    }

    const { email, password } = requestBody || {}

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required", success: false }, { status: 400 })
    }

    // Try Supabase authentication first if available
    try {
      const supabase = await getSupabaseClient()

      if (supabase) {
        const authResponse = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        // Safely access properties with optional chaining
        const data = authResponse?.data
        const error = authResponse?.error

        if (!error && data?.user) {
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
          const userResponse = await supabase.from("users").select("*").eq("auth_id", data.user.id).single()

          const userData = userResponse?.data
          const userError = userResponse?.error

          if (!userError && userData) {
            // Return user data
            return NextResponse.json({
              id: data.user.id,
              name: userData?.name || data.user.user_metadata?.name || "",
              email: data.user.email,
              balance: userData?.balance || 0,
              createdAt: userData?.created_at || data.user.created_at,
              success: true,
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
        return NextResponse.json({ error: "Invalid credentials", success: false }, { status: 401 })
      }

      // In a real app, you would hash and compare passwords
      // For demo purposes, we'll just check if the password matches
      if (user.password !== password) {
        return NextResponse.json({ error: "Invalid credentials", success: false }, { status: 401 })
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

      return NextResponse.json({ ...userWithoutPassword, success: true })
    } catch (redisError) {
      console.error("Redis error:", redisError)
      return NextResponse.json({ error: "Authentication service unavailable", success: false }, { status: 503 })
    }
  } catch (error) {
    console.error("Error logging in:", error)
    return NextResponse.json({ error: "Failed to log in", success: false }, { status: 500 })
  }
}
