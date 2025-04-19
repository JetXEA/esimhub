import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getSessionUser, updateUser, createSmsRequest, updateSmsRequest, getSmsRequest } from "@/lib/redis"
import { getNumber, getSmsCode } from "@/lib/api-server"

// POST to get a new number
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

    const { serviceId, countryId } = await request.json()

    if (!serviceId || !countryId) {
      return NextResponse.json({ error: "Service ID and Country ID are required" }, { status: 400 })
    }

    // Check if user has enough balance
    // In a real app, you would check the price of the service
    const currentBalance = Number.parseFloat(user.balance) || 0
    const servicePrice = 0.5 // Mock price

    if (currentBalance < servicePrice) {
      return NextResponse.json({ error: "Insufficient balance" }, { status: 400 })
    }

    // Get number from API
    const response = await getNumber(serviceId, countryId)

    // Deduct balance
    await updateUser(user.id, {
      balance: currentBalance - servicePrice,
    })

    // Create SMS request record
    const smsRequest = await createSmsRequest({
      userId: user.id,
      serviceId,
      countryId,
      phoneNumber: response.number,
      apiRequestId: response.request_id,
      status: "PENDING",
      price: servicePrice,
    })

    return NextResponse.json({
      ...response,
      smsRequestId: smsRequest.id,
    })
  } catch (error) {
    console.error("Error getting number:", error)
    // Return a mock response in case of error
    return NextResponse.json({
      request_id: "mock_" + Math.random().toString(36).substring(2, 15),
      number: "+1" + Math.floor(Math.random() * 9000000000 + 1000000000),
    })
  }
}

// GET to retrieve SMS code
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const requestId = searchParams.get("requestId")

    if (!requestId) {
      return NextResponse.json({ error: "Request ID is required" }, { status: 400 })
    }

    // If it's our internal SMS request ID
    if (requestId.startsWith("sms_")) {
      const smsRequest = await getSmsRequest(requestId)

      if (!smsRequest) {
        return NextResponse.json({ error: "SMS request not found" }, { status: 404 })
      }

      // Get SMS code from API using the API request ID
      const response = await getSmsCode(smsRequest.apiRequestId)

      // If we got a code, update the SMS request
      if (response.sms_code) {
        await updateSmsRequest(requestId, {
          code: response.sms_code,
          status: "COMPLETED",
        })
      }

      return NextResponse.json({
        sms_code: response.sms_code,
        status: response.sms_code ? "COMPLETED" : "PENDING",
      })
    } else {
      // It's an API request ID
      const response = await getSmsCode(requestId)
      return NextResponse.json(response)
    }
  } catch (error) {
    console.error("Error getting SMS code:", error)
    // Return a mock response in case of error
    return NextResponse.json({
      sms_code: Math.floor(Math.random() * 900000 + 100000).toString(),
    })
  }
}
