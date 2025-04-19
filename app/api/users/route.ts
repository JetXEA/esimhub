import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { updateUser } from "@/lib/redis"

// GET user profile
export async function GET(request: Request) {
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

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 })
  }
}

// PATCH to update user profile
export async function PATCH(request: Request) {
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

    const { name, email } = await request.json()

    // Update user
    const updatedUser = await updateUser(user.id, {
      name: name || user.name,
      email: email || user.email,
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
  }
}

// Import the missing function
import { getSessionUser } from "@/lib/redis"
