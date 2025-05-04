import { NextResponse } from "next/server"
import redis from "@/lib/redis"
import { isDemoMode, isRedisConfigured, isSupabaseConfigured, getRedisUrl, getSmsApiKey } from "@/lib/env"

export async function GET() {
  try {
    // Check environment variables
    const apiKey = getSmsApiKey()
    const demoMode = isDemoMode()
    const redisConfigured = isRedisConfigured()
    const supabaseConfigured = isSupabaseConfigured()

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
    const keyStatus = apiKey && apiKey !== "demo_key" ? "Set" : "Not set"
    const keyPreview =
      apiKey && apiKey !== "demo_key" ? `${apiKey.substring(0, 3)}...${apiKey.substring(apiKey.length - 3)}` : "N/A"

    // Check Upstash Redis REST URL
    const upstashUrl = getRedisUrl()
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
        configured: redisConfigured,
      },
      supabase: {
        configured: supabaseConfigured,
      },
      connectivity: demoMode ? "Using Mock Data" : "Connected",
      demoMode: demoMode,
      message: demoMode
        ? "Application is running in demo mode with mock data due to missing environment variables."
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
