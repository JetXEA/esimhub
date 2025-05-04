"use client"

import { useEffect } from "react"

export default function SuccessPropertyFixer() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      console.log("SuccessPropertyFixer activated")

      // Override fetch to ensure all responses have a success property
      const originalFetch = window.fetch
      window.fetch = async function (...args) {
        const response = await originalFetch.apply(this, args)

        // Create a proxy for the response
        const originalJson = response.json
        response.json = async function () {
          try {
            const data = await originalJson.apply(this)

            // Ensure data has a success property if it's an object
            if (data && typeof data === "object" && !("success" in data)) {
              console.log("Adding missing success property to response data")
              data.success = response.ok
            }

            return data
          } catch (error) {
            console.error("Error parsing JSON in fetch proxy:", error)
            // Return an object with success property as fallback
            return { success: response.ok, error: "Failed to parse JSON response" }
          }
        }

        return response
      }

      // Add global error handler for property access
      window.addEventListener("error", (event) => {
        if (event.error && event.error.message && event.error.message.includes("Cannot read properties of undefined")) {
          console.error("Caught property access error:", event.error.message)

          // Try to extract property name from error message
          const match = event.error.message.match(/reading '(\w+)'/)
          if (match && match[1] === "success") {
            console.error("This is the success property error we are looking for!")

            // Log stack trace for debugging
            console.error("Stack trace:", event.error.stack)
          }
        }
      })
    }
  }, [])

  return null // This component doesn't render anything
}
