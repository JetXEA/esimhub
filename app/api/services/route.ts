import { NextResponse } from "next/server"
import { isInDemoMode } from "@/lib/api-server"
import { getCachedApiResponse, cacheApiResponse } from "@/lib/redis"
import { defaultServices } from "@/lib/default-data"

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

// Add a GET function with better error handling:
export async function GET() {
  try {
    // Try to get from cache first
    let cachedServices = null
    try {
      cachedServices = await getCachedApiResponse("services")
    } catch (cacheError) {
      console.error("Cache error:", cacheError)
      // Continue without cache
    }

    if (cachedServices) {
      console.log("Using cached services data")
      return NextResponse.json(cachedServices)
    }

    // Check if we're in demo mode
    if (isInDemoMode()) {
      console.log("API route: Using mock services data (demo mode)")
      // Cache the mock data
      try {
        await cacheApiResponse("services", defaultServices, 3600) // Cache for 1 hour
      } catch (cacheError) {
        console.error("Cache error:", cacheError)
        // Continue without caching
      }
      return NextResponse.json(defaultServices)
    }

    try {
      // Fetch from Supabase
      const supabase = await getSupabaseClient()

      if (!supabase) {
        console.log("Supabase client not available, using default services")
        return NextResponse.json(defaultServices)
      }

      // Check if the services table exists
      const { error: tableCheckError } = await supabase.from("services").select("count").limit(1).single()

      // If the table doesn't exist, use default data
      if (
        tableCheckError &&
        (tableCheckError.message.includes("does not exist") ||
          tableCheckError.message.includes("relation") ||
          tableCheckError.code === "PGRST116")
      ) {
        console.log("Services table doesn't exist, using default services")
        return NextResponse.json(defaultServices)
      }

      const { data: services, error } = await supabase.from("services").select("*").order("name")

      if (error) {
        console.error("Supabase error fetching services:", error)
        // Return default data if there's a Supabase error
        return NextResponse.json(defaultServices)
      }

      // Transform data to include icons
      const servicesWithIcons = services.map((service) => ({
        ...service,
        icon: defaultServices.find((s) => s.name === service.name)?.icon || "📱",
      }))

      // Cache the response
      try {
        await cacheApiResponse("services", servicesWithIcons, 3600) // Cache for 1 hour
      } catch (cacheError) {
        console.error("Cache error:", cacheError)
        // Continue without caching
      }

      return NextResponse.json(servicesWithIcons)
    } catch (supabaseError) {
      console.error("Error with Supabase client:", supabaseError)
      // Return default data if there's an error with Supabase
      return NextResponse.json(defaultServices)
    }
  } catch (error) {
    console.error("Error in services route:", error)
    // Return default data if there's an error
    return NextResponse.json(defaultServices)
  }
}
