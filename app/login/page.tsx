"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  // Update the handleSubmit function to better handle error responses
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      let data
      try {
        // Try to parse the response as JSON
        const text = await response.text()
        data = text ? JSON.parse(text) : {}
      } catch (parseError) {
        console.error("Error parsing response:", parseError)
        throw new Error("Server returned an invalid response. Please try again later.")
      }

      if (!response.ok) {
        throw new Error(data.error || `Failed to log in (${response.status})`)
      }

      // Store session info in localStorage for better session management
      localStorage.setItem("user", JSON.stringify(data))
      localStorage.setItem("isLoggedIn", "true")
      localStorage.setItem("loginTime", new Date().toISOString())

      // Redirect to dashboard on successful login
      router.push("/dashboard")
    } catch (error) {
      console.error("Login error:", error)
      setError(error instanceof Error ? error.message : "Failed to log in")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]"
      >
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-white">Welcome back</h1>
          <p className="text-sm text-white/80">Enter your credentials to sign in to your account</p>
        </div>
        <Card className="bg-purple-900/30 backdrop-blur-sm border-purple-500/50">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-white">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-purple-900/50 border-purple-500/50 text-white placeholder:text-gray-400"
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-white">
                      Password
                    </Label>
                    <Link href="/forgot-password" className="text-xs text-purple-300 hover:text-white">
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-purple-900/50 border-purple-500/50 text-white placeholder:text-gray-400"
                  />
                </div>
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-purple-600 to-red-600 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Signing in...
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col">
            <div className="mt-2 text-center text-sm text-white/80">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="underline underline-offset-4 hover:text-white">
                Sign up
              </Link>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}
