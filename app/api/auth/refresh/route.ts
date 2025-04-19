import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getSessionUser } from "@/lib/redis"

export async function POST() {
  try {
    // Get session cookie
    const cookieStore = cookies()
    const sessionId = cookieStore.get("session_id")?.value

    if (!sessionId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Get user from session
    const user = await getSessionUser(sessionId)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Refresh session by setting a new cookie with extended expiration
    cookies().set({
      name: "session_id",
      value: sessionId,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    })

    return NextResponse.json({ success: true, message: "Session refreshed" })
  } catch (error) {
    console.error("Error refreshing session:", error)
    return NextResponse.json({ error: "Failed to refresh session" }, { status: 500 })
  }
}
