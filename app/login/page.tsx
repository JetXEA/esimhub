"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Add debugging info on mount
  useEffect(() => {
    console.log("Login page mounted")

    // Check if window.__detectPropertyError exists
    if (typeof window !== "undefined") {
      if (window.__detectPropertyError) {
        console.log("Error detection is active")
      } else {
        console.error("Error detection is NOT active")
      }
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      // Wrap the fetch call with our error detector
      if (typeof window !== "undefined" && window.__detectPropertyError) {
        await window.__detectPropertyError(async () => {
          const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          })

          console.log("Login response status:", response.status)

          // Simple approach: if response is ok, consider it successful
          if (response.ok) {
            // Try to parse the response, but don't depend on its structure
            try {
              const text = await response.text()
              console.log("Raw response text:", text.substring(0, 100))

              if (text) {
                try {
                  const data = JSON.parse(text)
                  console.log("Parsed response data:", data)

                  // Store user data if available
                  if (data && typeof data === "object") {
                    localStorage.setItem("user", JSON.stringify(data))
                  }
                } catch (parseError) {
                  console.error("Error parsing JSON response:", parseError)
                  // Continue anyway since the response was OK
                }
              }
            } catch (textError) {
              console.error("Error getting response text:", textError)
              // Continue anyway since the response was OK
            }

            // Set login state regardless of response parsing
            localStorage.setItem("isLoggedIn", "true")
            localStorage.setItem("loginTime", new Date().toISOString())

            // Redirect to dashboard
            router.push("/dashboard")
          } else {
            // Handle error response
            let errorMessage = `Login failed (${response.status})`

            try {
              const text = await response.text()
              console.log("Error response text:", text)

              if (text) {
                try {
                  const errorData = JSON.parse(text)
                  console.log("Parsed error data:", errorData)

                  if (errorData && errorData.error) {
                    errorMessage = errorData.error
                  }
                } catch (parseError) {
                  console.error("Error parsing error response:", parseError)
                }
              }
            } catch (textError) {
              console.error("Error getting error response text:", textError)
            }

            throw new Error(errorMessage)
          }
        }, "login-fetch-and-process")
      } else {
        // Fallback if error detection is not available
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        })

        if (response.ok) {
          localStorage.setItem("isLoggedIn", "true")
          localStorage.setItem("loginTime", new Date().toISOString())
          router.push("/dashboard")
        } else {
          throw new Error(`Login failed (${response.status})`)
        }
      }
    } catch (error) {
      console.error("Login error:", error)
      setError(error instanceof Error ? error.message : "Failed to log in")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="h-screen flex items-center justify-center">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">Login</CardTitle>
          <CardDescription>Enter your email below to login to your account</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
            <div className="text-sm text-center text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="underline">
                Sign up
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
