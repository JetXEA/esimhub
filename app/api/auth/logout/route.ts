import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { deleteSession } from "@/lib/redis"

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

export async function POST() {
  try {
    // Get session cookie
    const cookieStore = cookies()
    const sessionId = cookieStore.get("session_id")?.value

    // Try to sign out from Supabase if available
    try {
      const supabase = await getSupabaseClient()
      if (supabase) {
        await supabase.auth.signOut()
      }
    } catch (supabaseError) {
      console.error("Supabase signout error:", supabaseError)
      // Continue with Redis fallback
    }

    // Delete Redis session if exists
    if (sessionId) {
      try {
        await deleteSession(sessionId)
      } catch (redisError) {
        console.error("Redis session deletion error:", redisError)
      }
    }

    // Clear session cookie
    cookies().set({
      name: "session_id",
      value: "",
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 0,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error logging out:", error)
    return NextResponse.json({ error: "Failed to log out" }, { status: 500 })
  }
}
