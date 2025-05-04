"use client"

import { useEffect } from "react"
import { initGlobalErrorTracking } from "@/lib/error-tracker"

export default function ErrorTracker() {
  useEffect(() => {
    // Initialize error tracking
    initGlobalErrorTracking()
  }, [])

  return null // This component doesn't render anything
}
