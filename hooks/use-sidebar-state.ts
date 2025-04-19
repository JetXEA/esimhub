"use client"

import { useState, useEffect } from "react"

// Define the sidebar state hook
export function useSidebarState() {
  const [isCollapsed, setIsCollapsed] = useState(false)

  // Load sidebar state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem("sidebar-collapsed")
    if (savedState !== null) {
      setIsCollapsed(savedState === "true")
    }
  }, [])

  // Toggle sidebar collapsed state
  const toggleSidebar = () => {
    const newState = !isCollapsed
    setIsCollapsed(newState)
    // Save to localStorage
    localStorage.setItem("sidebar-collapsed", String(newState))
  }

  return {
    isCollapsed,
    setIsCollapsed,
    toggleSidebar,
  }
}
