import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getUserByEmail, createUser, createSession } from "@/lib/redis"

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

    const { name, email, password } = requestBody || {}

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required", success: false }, { status: 400 })
    }

    // Check if user already exists in Redis
    try {
      const existingUser = await getUserByEmail(email)
      if (existingUser) {
        return NextResponse.json({ error: "Email already in use", success: false }, { status: 409 })
      }
    } catch (redisError) {
      console.error("Redis error checking existing user:", redisError)
      // Continue with Supabase if Redis fails
    }

    // Try to create user in Supabase if available
    try {
      const supabase = await getSupabaseClient()

      if (supabase) {
        const authResponse = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name },
          },
        })

        // Safely access properties with optional chaining
        const authData = authResponse?.data
        const authError = authResponse?.error

        if (!authError && authData?.user) {
          // Create user profile in Supabase database
          const profileResponse = await supabase.from("users").insert({
            auth_id: authData.user.id,
            name,
            email,
            balance: 10.0, // Starting balance
          })

          const profileError = profileResponse?.error

          if (!profileError) {
            // Set session cookie
            cookies().set({
              name: "session_id",
              value: authData.session?.access_token || "",
              httpOnly: true,
              path: "/",
              secure: process.env.NODE_ENV === "production",
              maxAge: 60 * 60 * 24 * 7, // 1 week
            })

            // Return user without sensitive data
            return NextResponse.json({
              id: authData.user.id,
              name,
              email,
              balance: 10.0,
              createdAt: new Date().toISOString(),
              success: true,
            })
          }
        }
      }
    } catch (supabaseError) {
      console.error("Supabase error:", supabaseError)
      // Continue with Redis fallback
    }

    // Fallback to Redis if Supabase fails
    try {
      // Create user
      // In a real app, you would hash the password
      const user = await createUser({
        name,
        email,
        password, // In production, store hashed password
        balance: 10.0, // Starting balance
      })

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
      console.error("Redis error creating user:", redisError)
      return NextResponse.json({ error: "User registration service unavailable", success: false }, { status: 503 })
    }
  } catch (error) {
    console.error("Error signing up:", error)
    return NextResponse.json({ error: "Failed to sign up", success: false }, { status: 500 })
  }
}
