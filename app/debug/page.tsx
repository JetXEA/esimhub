"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw, AlertTriangle, CheckCircle, XCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function DebugPage() {
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDebugInfo = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/debug")

      if (!response.ok) {
        throw new Error(`Failed to fetch debug info: ${response.status}`)
      }

      const data = await response.json()
      setDebugInfo(data)
    } catch (error) {
      console.error("Error fetching debug info:", error)
      setError(error instanceof Error ? error.message : "Unknown error")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDebugInfo()
  }, [])

  return (
    <div className="container py-10">
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">API Debug</h1>
            <p className="text-muted-foreground">Check the status of the SMS-man API connection</p>
          </div>
          <Button variant="outline" onClick={fetchDebugInfo} disabled={isLoading}>
            {isLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Checking...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </>
            )}
          </Button>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-500 rounded-md">
            <p>Error: {error}</p>
          </div>
        )}

        {debugInfo && debugInfo.demoMode && (
          <Alert variant="warning" className="bg-yellow-50 border-yellow-200">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertTitle className="text-yellow-800">Demo Mode Active</AlertTitle>
            <AlertDescription className="text-yellow-700">
              {debugInfo.message || "The application is running in demo mode with mock data."}
            </AlertDescription>
          </Alert>
        )}

        {debugInfo && (
          <Card>
            <CardHeader>
              <CardTitle>API Status</CardTitle>
              <CardDescription>Last checked: {new Date(debugInfo.timestamp).toLocaleString()}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium">API Key Status</h3>
                  <p>{debugInfo.apiKey?.status || "Unknown"}</p>
                  {debugInfo.apiKey?.preview && (
                    <p className="text-sm text-muted-foreground">Preview: {debugInfo.apiKey.preview}</p>
                  )}
                </div>

                {debugInfo.redis && (
                  <div>
                    <h3 className="text-sm font-medium">Redis Status</h3>
                    <div className="flex items-center gap-2">
                      {debugInfo.redis.status === "Connected" ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                      <p className={debugInfo.redis.status === "Connected" ? "text-green-500" : "text-red-500"}>
                        {debugInfo.redis.status}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground">{debugInfo.redis.message}</p>
                    {debugInfo.redis.upstashUrl && (
                      <p className="text-sm text-muted-foreground mt-1">Upstash URL: {debugInfo.redis.upstashUrl}</p>
                    )}
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-medium">Connectivity</h3>
                  <p className={debugInfo.demoMode ? "text-yellow-600" : "text-green-500"}>
                    {debugInfo.connectivity || "Unknown"}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium">Mode</h3>
                  <p className={debugInfo.demoMode ? "text-yellow-600 font-medium" : "text-green-500 font-medium"}>
                    {debugInfo.demoMode ? "Demo Mode" : "Live Mode"}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium">Overall Status</h3>
                  <p className={debugInfo.status === "OK" ? "text-green-500" : "text-yellow-600"}>
                    {debugInfo.status || "Unknown"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>API Endpoints</CardTitle>
            <CardDescription>These are the endpoints we would use in live mode</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="p-2 bg-muted rounded-md">
                <p className="font-mono text-sm">GET https://api.sms-man.com/control/getBalance?token=***</p>
                <p className="text-xs text-muted-foreground mt-1">Check balance and API key validity</p>
              </div>
              <div className="p-2 bg-muted rounded-md">
                <p className="font-mono text-sm">GET https://api.sms-man.com/control/services?token=***</p>
                <p className="text-xs text-muted-foreground mt-1">Get available services</p>
              </div>
              <div className="p-2 bg-muted rounded-md">
                <p className="font-mono text-sm">GET https://api.sms-man.com/control/countries?token=***</p>
                <p className="text-xs text-muted-foreground mt-1">Get available countries</p>
              </div>
              <div className="p-2 bg-muted rounded-md">
                <p className="font-mono text-sm">
                  GET https://api.sms-man.com/control/get-number?token=***&service=1&country=1
                </p>
                <p className="text-xs text-muted-foreground mt-1">Get a phone number for verification</p>
              </div>
              <div className="p-2 bg-muted rounded-md">
                <p className="font-mono text-sm">
                  GET https://api.sms-man.com/control/get-sms?token=***&request_id=123
                </p>
                <p className="text-xs text-muted-foreground mt-1">Get SMS code for a request</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Environment Variables</CardTitle>
            <CardDescription>Status of critical environment variables (values are not shown)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="p-2 bg-muted rounded-md">
                <p className="font-mono text-sm">SMS_MAN_API_KEY</p>
                <p className="text-xs text-muted-foreground mt-1">Status: {debugInfo?.apiKey?.status || "Unknown"}</p>
              </div>
              <div className="p-2 bg-muted rounded-md">
                <p className="font-mono text-sm">UPSTASH_REDIS_REST_URL</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Status: {debugInfo?.redis?.upstashUrl || "Unknown"}
                </p>
              </div>
              <div className="p-2 bg-muted rounded-md">
                <p className="font-mono text-sm">UPSTASH_REDIS_REST_TOKEN</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Status: {process.env.UPSTASH_REDIS_REST_TOKEN ? "Set" : "Not set"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
