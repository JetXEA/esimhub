"use client"

import { useState, useEffect } from "react"
import { AlertCircle, X } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function ApiStatusBanner() {
  const [isVisible, setIsVisible] = useState(true)
  const [isDemoMode, setIsDemoMode] = useState(true)

  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const response = await fetch("/api/debug")
        const data = await response.json()

        // Check if we're in demo mode
        setIsDemoMode(data.demoMode === true)

        // Always show the banner in demo mode
        setIsVisible(data.demoMode === true)
      } catch (error) {
        console.error("Error checking API status:", error)
        setIsDemoMode(true)
        setIsVisible(true)
      }
    }

    checkApiStatus()
  }, [])

  if (!isVisible) {
    return null
  }

  return (
    <Alert variant="warning" className="relative bg-yellow-50 border-yellow-200 mb-4">
      <AlertCircle className="h-4 w-4 text-yellow-600" />
      <AlertTitle className="text-yellow-800">Demo Mode Active</AlertTitle>
      <AlertDescription className="text-yellow-700">
        The application is running in demo mode with mock data. SMS-man API connectivity is not available.
      </AlertDescription>
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-2 right-2 p-1 rounded-full hover:bg-yellow-100 transition-colors"
        aria-label="Close"
      >
        <X className="h-4 w-4 text-yellow-600" />
      </button>
    </Alert>
  )
}
