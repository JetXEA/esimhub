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

export default function SignupPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
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
        throw new Error(data.error || `Failed to sign up (${response.status})`)
      }

      // Store session info in localStorage for better session management
      localStorage.setItem("user", JSON.stringify(data))
      localStorage.setItem("isLoggedIn", "true")
      localStorage.setItem("loginTime", new Date().toISOString())

      // Redirect to dashboard on successful signup
      router.push("/dashboard")
    } catch (error) {
      console.error("Signup error:", error)
      setError(error instanceof Error ? error.message : "Failed to sign up")
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
        className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]"
      >
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-white">Create an account</h1>
          <p className="text-sm text-white/80">Enter your information to create an account</p>
        </div>
        <Card className="bg-purple-900/30 backdrop-blur-sm border-purple-500/50">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name" className="text-white">
                    Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="bg-purple-900/50 border-purple-500/50 text-white placeholder:text-gray-400"
                  />
                </div>
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
                  <Label htmlFor="password" className="text-white">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-purple-900/50 border-purple-500/50 text-white placeholder:text-gray-400"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirm-password" className="text-white">
                    Confirm Password
                  </Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                      Creating account...
                    </div>
                  ) : (
                    "Sign Up"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col">
            <div className="mt-2 text-center text-sm text-white/80">
              Already have an account?{" "}
              <Link href="/login" className="underline underline-offset-4 hover:text-white">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}
