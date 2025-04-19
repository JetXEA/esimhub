"use client"

import { useState } from "react"
import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { RefreshCw, Check, AlertTriangle } from "lucide-react"

export default function AdminPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success?: boolean; message?: string; error?: string } | null>(null)

  const handleSeedDatabase = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/seed", {
        method: "POST",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to seed database")
      }

      setResult({
        success: true,
        message: data.message || "Database seeded successfully",
      })
    } catch (error) {
      console.error("Error seeding database:", error)
      setResult({
        success: false,
        error: error instanceof Error ? error.message : "An unknown error occurred",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Layout>
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your application settings</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Database Management</CardTitle>
            <CardDescription>Seed your database with initial data</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              This will populate your Supabase database with countries and services data. This is useful for initial
              setup or if you need to reset your data.
            </p>

            {result && (
              <Alert
                variant={result.success ? "default" : "destructive"}
                className={result.success ? "bg-green-50 border-green-200" : undefined}
              >
                {result.success ? <Check className="h-4 w-4 text-green-600" /> : <AlertTriangle className="h-4 w-4" />}
                <AlertTitle>{result.success ? "Success" : "Error"}</AlertTitle>
                <AlertDescription>{result.message || result.error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={handleSeedDatabase} disabled={isLoading} className="gradient-button">
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Seeding Database...
                </>
              ) : (
                "Seed Database"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  )
}
