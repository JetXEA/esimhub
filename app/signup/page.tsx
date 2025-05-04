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

export default function SignupPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Add debugging info on mount
  useEffect(() => {
    console.log("Signup page mounted")
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    // Check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    try {
      // Wrap the fetch call with our error detector
      if (typeof window !== "undefined" && window.__detectPropertyError) {
        await window.__detectPropertyError(async () => {
          const response = await fetch("/api/auth/signup", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, email, password }),
          })

          console.log("Signup response status:", response.status)

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
            let errorMessage = `Signup failed (${response.status})`

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
        }, "signup-fetch-and-process")
      } else {
        // Fallback if error detection is not available
        const response = await fetch("/api/auth/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, password }),
        })

        if (response.ok) {
          localStorage.setItem("isLoggedIn", "true")
          localStorage.setItem("loginTime", new Date().toISOString())
          router.push("/dashboard")
        } else {
          throw new Error(`Signup failed (${response.status})`)
        }
      }
    } catch (error) {
      console.error("Signup error:", error)
      setError(error instanceof Error ? error.message : "Failed to sign up")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="h-screen flex items-center justify-center">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">Create an account</CardTitle>
          <CardDescription>Enter your information to create your account</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
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
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
            <div className="text-sm text-center text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="underline">
                Login
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
