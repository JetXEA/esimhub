import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getSessionUser, updateUser, createTransaction } from "@/lib/redis"

// GET user balance
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

    return NextResponse.json({
      userId: user.id,
      amount: Number.parseFloat(user.balance) || 0,
      updatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error fetching balance:", error)
    return NextResponse.json({ error: "Failed to fetch balance" }, { status: 500 })
  }
}

// POST to add funds to balance
export async function POST(request: Request) {
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

    const { amount } = await request.json()

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
    }

    // Update user balance
    const currentBalance = Number.parseFloat(user.balance) || 0
    const newBalance = currentBalance + amount

    await updateUser(user.id, {
      balance: newBalance,
    })

    // Create transaction record
    await createTransaction({
      userId: user.id,
      amount: amount,
      type: "CREDIT",
      description: "Added funds to account",
    })

    return NextResponse.json({
      userId: user.id,
      amount: newBalance,
      updatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error adding funds:", error)
    return NextResponse.json({ error: "Failed to add funds" }, { status: 500 })
  }
}
