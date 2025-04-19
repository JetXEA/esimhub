// Session management utilities

// Session timeout in milliseconds (30 minutes)
const SESSION_TIMEOUT = 30 * 60 * 1000

// Check if the user is logged in
export const isLoggedIn = (): boolean => {
  if (typeof window === "undefined") return false

  const isLoggedIn = localStorage.getItem("isLoggedIn")
  if (!isLoggedIn || isLoggedIn !== "true") return false

  // Check session timeout
  const loginTime = localStorage.getItem("loginTime")
  if (!loginTime) return false

  const loginDate = new Date(loginTime)
  const now = new Date()

  // If session has expired
  if (now.getTime() - loginDate.getTime() > SESSION_TIMEOUT) {
    // Clear session
    logout()
    return false
  }

  // Refresh session timeout
  localStorage.setItem("loginTime", now.toISOString())
  return true
}

// Get the current user
export const getCurrentUser = () => {
  if (typeof window === "undefined") return null

  if (!isLoggedIn()) return null

  const userJson = localStorage.getItem("user")
  if (!userJson) return null

  try {
    return JSON.parse(userJson)
  } catch (error) {
    console.error("Error parsing user data:", error)
    return null
  }
}

// Logout the user
export const logout = () => {
  if (typeof window === "undefined") return

  localStorage.removeItem("user")
  localStorage.removeItem("isLoggedIn")
  localStorage.removeItem("loginTime")

  // Also call the API to invalidate the server-side session
  fetch("/api/auth/logout", { method: "POST" }).catch((error) => {
    console.error("Error logging out:", error)
  })
}

// Update the current user
export const updateCurrentUser = (userData: any) => {
  if (typeof window === "undefined") return

  const currentUser = getCurrentUser()
  if (!currentUser) return

  const updatedUser = { ...currentUser, ...userData }
  localStorage.setItem("user", JSON.stringify(updatedUser))
}

// Check if the session is about to expire and refresh it if needed
export const checkAndRefreshSession = () => {
  if (typeof window === "undefined") return

  const loginTime = localStorage.getItem("loginTime")
  if (!loginTime) return

  const loginDate = new Date(loginTime)
  const now = new Date()

  // If session is about to expire (less than 5 minutes left)
  if (now.getTime() - loginDate.getTime() > SESSION_TIMEOUT - 5 * 60 * 1000) {
    // Refresh session
    localStorage.setItem("loginTime", now.toISOString())

    // Also refresh the server-side session
    fetch("/api/auth/refresh", { method: "POST" }).catch((error) => {
      console.error("Error refreshing session:", error)
    })
  }
}

// Set up session check interval
export const setupSessionCheck = () => {
  if (typeof window === "undefined") return

  // Check session every minute
  const intervalId = setInterval(checkAndRefreshSession, 60 * 1000)

  // Store interval ID to clear it later
  return intervalId
}

// Clear session check interval
export const clearSessionCheck = (intervalId: number) => {
  if (typeof window === "undefined") return

  clearInterval(intervalId)
}
