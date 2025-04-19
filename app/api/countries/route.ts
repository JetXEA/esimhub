import { NextResponse } from "next/server"
import { isInDemoMode } from "@/lib/api-server"
import { getCachedApiResponse, cacheApiResponse } from "@/lib/redis"
import { defaultCountries } from "@/lib/default-data"

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

// GET all countries
export async function GET() {
  try {
    // Try to get from cache first
    let cachedCountries = null
    try {
      cachedCountries = await getCachedApiResponse("countries")
    } catch (cacheError) {
      console.error("Cache error:", cacheError)
      // Continue without cache
    }

    if (cachedCountries) {
      console.log("Using cached countries data")
      return NextResponse.json(cachedCountries)
    }

    // Check if we're in demo mode
    if (isInDemoMode()) {
      console.log("API route: Using mock countries data (demo mode)")
      // Cache the mock data
      try {
        await cacheApiResponse("countries", defaultCountries, 3600) // Cache for 1 hour
      } catch (cacheError) {
        console.error("Cache error:", cacheError)
        // Continue without caching
      }
      return NextResponse.json(defaultCountries)
    }

    try {
      // Fetch from Supabase
      const supabase = await getSupabaseClient()

      if (!supabase) {
        console.log("Supabase client not available, using default countries")
        return NextResponse.json(defaultCountries)
      }

      // Check if the countries table exists
      const { error: tableCheckError } = await supabase.from("countries").select("count").limit(1).single()

      // If the table doesn't exist, use default data
      if (
        tableCheckError &&
        (tableCheckError.message.includes("does not exist") ||
          tableCheckError.message.includes("relation") ||
          tableCheckError.code === "PGRST116")
      ) {
        console.log("Countries table doesn't exist, using default countries")
        return NextResponse.json(defaultCountries)
      }

      // If we get here, the table exists, so fetch the data
      const { data: countries, error } = await supabase.from("countries").select("*").order("name")

      if (error) {
        console.error("Supabase error fetching countries:", error)
        // Return default data if there's a Supabase error
        return NextResponse.json(defaultCountries)
      }

      // Transform data to include flags
      const countriesWithFlags = countries.map((country) => ({
        ...country,
        flag: defaultCountries.find((c) => c.iso === country.iso)?.flag || `🏳️`,
      }))

      // Cache the response
      try {
        await cacheApiResponse("countries", countriesWithFlags, 3600) // Cache for 1 hour
      } catch (cacheError) {
        console.error("Cache error:", cacheError)
        // Continue without caching
      }

      return NextResponse.json(countriesWithFlags)
    } catch (supabaseError) {
      console.error("Error with Supabase client:", supabaseError)
      // Return default data if there's an error with Supabase
      return NextResponse.json(defaultCountries)
    }
  } catch (error) {
    console.error("Error in countries route:", error)
    // Return default data if there's an error
    return NextResponse.json(defaultCountries)
  }
}

// PATCH to update country availability
export async function PATCH(request: Request) {
  try {
    const { id, available } = await request.json()

    if (id === undefined || available === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Update in Supabase
    const supabase = await getSupabaseClient()

    if (!supabase) {
      return NextResponse.json({ error: "Database connection unavailable" }, { status: 503 })
    }

    // Check if the countries table exists
    const { error: tableCheckError } = await supabase.from("countries").select("count").limit(1).single()

    // If the table doesn't exist, return an error
    if (
      tableCheckError &&
      (tableCheckError.message.includes("does not exist") ||
        tableCheckError.message.includes("relation") ||
        tableCheckError.code === "PGRST116")
    ) {
      return NextResponse.json({ error: "Countries table doesn't exist" }, { status: 503 })
    }

    const { data, error } = await supabase.from("countries").update({ available }).eq("id", id).select().single()

    if (error) {
      throw new Error(`Error updating country: ${error.message}`)
    }

    // Invalidate cache
    try {
      await cacheApiResponse("countries", null, 0)
    } catch (cacheError) {
      console.error("Cache error:", cacheError)
      // Continue without cache invalidation
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error updating country:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}
