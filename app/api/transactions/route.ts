import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getSessionUser, getUserTransactions } from "@/lib/redis"

// GET user transactions
export async function GET() {
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

    // Get user transactions
    const transactions = await getUserTransactions(user.id)

    return NextResponse.json(transactions)
  } catch (error) {
    console.error("Error fetching transactions:", error)
    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 })
  }
}
