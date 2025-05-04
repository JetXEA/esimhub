"use client"

import { useEffect, useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"

export function EnvStatusBanner() {
  const [envStatus, setEnvStatus] = useState<{
    demoMode: boolean
    message: string
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkEnvStatus = async () => {
      try {
        const response = await fetch("/api/debug")
        const data = await response.json()

        setEnvStatus({
          demoMode: data.demoMode,
          message: data.message,
        })
      } catch (error) {
        console.error("Failed to check environment status:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkEnvStatus()
  }, [])

  if (isLoading || !envStatus || !envStatus.demoMode) {
    return null
  }

  return (
    <Alert variant="warning" className="mb-4 bg-yellow-50 border-yellow-200">
      <AlertTriangle className="h-4 w-4 text-yellow-600" />
      <AlertTitle>Demo Mode Active</AlertTitle>
      <AlertDescription>{envStatus.message} Some features may be limited.</AlertDescription>
    </Alert>
  )
}
