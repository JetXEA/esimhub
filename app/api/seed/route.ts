import { NextResponse } from "next/server"
import { mockCountries, mockServices } from "@/lib/api-server"
import { cacheApiResponse } from "@/lib/redis"

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

export async function POST(request: Request) {
  try {
    // Only allow this in development or with a special key
    const { searchParams } = new URL(request.url)
    const key = searchParams.get("key")

    if (process.env.NODE_ENV !== "development" && key !== process.env.SEED_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await getSupabaseClient()

    if (!supabase) {
      return NextResponse.json({ error: "Supabase client not available" }, { status: 503 })
    }

    // Create tables if they don't exist
    try {
      // Check if countries table exists
      const { error: countriesCheckError } = await supabase.from("countries").select("count").limit(1).single()

      if (
        countriesCheckError &&
        (countriesCheckError.message.includes("does not exist") ||
          countriesCheckError.message.includes("relation") ||
          countriesCheckError.code === "PGRST116")
      ) {
        // Create countries table
        const { error: createCountriesError } = await supabase.rpc("create_countries_table")

        if (createCountriesError && !createCountriesError.message.includes("already exists")) {
          console.error("Error creating countries table:", createCountriesError)
          // Continue anyway, we'll try to insert data
        }
      }

      // Check if services table exists
      const { error: servicesCheckError } = await supabase.from("services").select("count").limit(1).single()

      if (
        servicesCheckError &&
        (servicesCheckError.message.includes("does not exist") ||
          servicesCheckError.message.includes("relation") ||
          servicesCheckError.code === "PGRST116")
      ) {
        // Create services table
        const { error: createServicesError } = await supabase.rpc("create_services_table")

        if (createServicesError && !createServicesError.message.includes("already exists")) {
          console.error("Error creating services table:", createServicesError)
          // Continue anyway, we'll try to insert data
        }
      }
    } catch (tableError) {
      console.error("Error checking/creating tables:", tableError)
      // Continue anyway, we'll try to insert data
    }

    // Seed countries
    const { error: countriesError } = await supabase.from("countries").upsert(
      mockCountries.map((country) => ({
        id: country.id,
        name: country.name,
        iso: country.iso,
        available: country.available,
      })),
      { onConflict: "id" },
    )

    if (countriesError) {
      console.error("Error seeding countries:", countriesError)
      return NextResponse.json({ error: `Error seeding countries: ${countriesError.message}` }, { status: 500 })
    }

    // Seed services
    const { error: servicesError } = await supabase.from("services").upsert(
      mockServices.map((service) => ({
        id: service.id,
        name: service.name,
        description: service.description,
        price: service.price,
        available: service.available,
      })),
      { onConflict: "id" },
    )

    if (servicesError) {
      console.error("Error seeding services:", servicesError)
      return NextResponse.json({ error: `Error seeding services: ${servicesError.message}` }, { status: 500 })
    }

    // Clear cache
    try {
      await cacheApiResponse("countries", null, 0)
      await cacheApiResponse("services", null, 0)
    } catch (cacheError) {
      console.error("Error clearing cache:", cacheError)
      // Continue without cache clearing
    }

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully",
      countriesCount: mockCountries.length,
      servicesCount: mockServices.length,
    })
  } catch (error) {
    console.error("Error seeding database:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}
