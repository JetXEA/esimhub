"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  name: string
  email: string
  balance: number
  createdAt: string
}

interface UserContextType {
  user: User | null
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch user on initial load
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/users")

        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
        } else {
          // If 401 or 404, user is not authenticated
          if (response.status === 401 || response.status === 404) {
            setUser(null)
          } else {
            throw new Error("Failed to fetch user")
          }
        }
      } catch (error) {
        console.error("Error fetching user:", error)
        setError(error instanceof Error ? error.message : "An error occurred")
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to log in")
      }

      const userData = await response.json()
      setUser(userData)
    } catch (error) {
      console.error("Login error:", error)
      setError(error instanceof Error ? error.message : "Failed to log in")
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to sign up")
      }

      const userData = await response.json()
      setUser(userData)
    } catch (error) {
      console.error("Signup error:", error)
      setError(error instanceof Error ? error.message : "Failed to sign up")
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to log out")
      }

      setUser(null)
    } catch (error) {
      console.error("Logout error:", error)
      setError(error instanceof Error ? error.message : "Failed to log out")
    } finally {
      setIsLoading(false)
    }
  }

  const refreshUser = async () => {
    try {
      const response = await fetch("/api/users")

      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
      } else {
        // If 401 or 404, user is not authenticated
        if (response.status === 401 || response.status === 404) {
          setUser(null)
        } else {
          throw new Error("Failed to fetch user")
        }
      }
    } catch (error) {
      console.error("Error refreshing user:", error)
      setError(error instanceof Error ? error.message : "An error occurred")
    }
  }

  return (
    <UserContext.Provider value={{ user, isLoading, error, login, signup, logout, refreshUser }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
