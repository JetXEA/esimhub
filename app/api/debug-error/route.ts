import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Test case 1: Object with success property
    const withSuccess = { success: true, message: "This has a success property" }

    // Test case 2: Object without success property
    const withoutSuccess = { message: "This does not have a success property" }

    // Test case 3: Undefined value
    let undefinedValue: any

    // Test case 4: Null value
    const nullValue = null

    // Collect environment variables (only public ones)
    const envVars: Record<string, string> = {}
    Object.keys(process.env).forEach((key) => {
      if (key.startsWith("NEXT_PUBLIC_")) {
        envVars[key] = process.env[key] || ""
      }
    })

    return NextResponse.json({
      message: "Debug information",
      withSuccess,
      withoutSuccess,
      undefinedValueCheck: undefinedValue === undefined,
      nullValueCheck: nullValue === null,
      envVars,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
