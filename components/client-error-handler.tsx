"use client"

import { useEffect } from "react"
import { initErrorTracking } from "@/lib/error-handler"

export default function ClientErrorHandler() {
  useEffect(() => {
    // Initialize error tracking on client side
    initErrorTracking()
  }, [])

  return null // This component doesn't render anything
}
