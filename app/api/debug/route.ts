import { NextResponse } from "next/server"
import { isInDemoMode } from "@/lib/api-server"
import redis from "@/lib/redis"

export async function GET() {
  try {
    // Check if the API key is set
    const apiKey = process.env.SMS_MAN_API_KEY
    const demoMode = isInDemoMode()

    // Check Redis connection
    let redisStatus = "Unknown"
    let redisMessage = "Could not determine Redis status"

    try {
      // Try a simple Redis operation to check connectivity
      await redis.set("debug_test", "test", { ex: 10 })
      const testValue = await redis.get("debug_test")

      if (testValue === "test") {
        redisStatus = "Connected"
        redisMessage = "Redis connection is working properly"
      } else {
        redisStatus = "Error"
        redisMessage = "Redis test operation failed"
      }
    } catch (redisError) {
      redisStatus = "Error"
      redisMessage = redisError instanceof Error ? redisError.message : "Unknown Redis error"
    }

    // Don't expose the full API key in the response
    const keyStatus = apiKey ? "Set" : "Not set"
    const keyPreview = apiKey ? `${apiKey.substring(0, 3)}...${apiKey.substring(apiKey.length - 3)}` : "N/A"

    // Check Upstash Redis REST URL
    const upstashUrl = process.env.UPSTASH_REDIS_REST_URL
    const upstashUrlStatus = upstashUrl ? (upstashUrl.startsWith("https://") ? "Valid" : "Invalid format") : "Not set"

    return NextResponse.json({
      status: demoMode ? "Demo Mode" : "OK",
      apiKey: {
        status: keyStatus,
        preview: keyPreview,
      },
      redis: {
        status: redisStatus,
        message: redisMessage,
        upstashUrl: upstashUrlStatus,
      },
      connectivity: demoMode ? "Using Mock Data" : "Connected",
      demoMode: demoMode,
      message: demoMode
        ? "Application is running in demo mode with mock data due to API connectivity issues."
        : "Application is connected to the SMS-man API.",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: "Error",
        message: error instanceof Error ? error.message : "Unknown error",
        demoMode: true,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
