"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, Smartphone, Rocket } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)
  const pathname = usePathname()

  // Handle scroll events
  useEffect(() => {
    let scrollTimer: NodeJS.Timeout

    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Determine if we're scrolling up or down
      if (currentScrollY > lastScrollY) {
        // Scrolling down
        setIsVisible(false)
      } else {
        // Scrolling up
        setIsVisible(true)
      }

      // Update last scroll position
      setLastScrollY(currentScrollY)

      // Set scrolling state to true
      setIsScrolling(true)

      // Clear any existing timer
      clearTimeout(scrollTimer)

      // Set a timer to detect when scrolling stops
      scrollTimer = setTimeout(() => {
        setIsScrolling(false)
        setIsVisible(true) // Show header when scrolling stops
      }, 150)
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      clearTimeout(scrollTimer)
    }
  }, [lastScrollY])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <header
      className={`sticky top-0 z-30 w-full backdrop-blur-md bg-white/10 transition-transform duration-300 ${
        !isVisible ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="container flex h-16 items-center">
        {/* Left section with EsimCity logo */}
        <div className="flex items-center gap-2 flex-1">
          <Link href="/" className="flex items-center gap-2">
            <Smartphone className="h-6 w-6 text-white" />
            <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              EsimCity
            </span>
          </Link>
        </div>

        {/* Center section with Space Connect and rocket */}
        <div className="flex-1 flex justify-center items-center">
          <div className="flex items-center gap-2">
            <Rocket className="h-6 w-6 text-white" />
            <span className="text-xl font-semibold text-white">Space Connect</span>
          </div>
        </div>

        {/* Right section with navigation and mobile menu */}
        <div className="flex-1 flex justify-end items-center">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-white"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors hover:text-white ${
                isActive("/") ? "text-white" : "text-gray-300"
              }`}
            >
              Home
            </Link>
            <Link
              href="/services"
              className={`text-sm font-medium transition-colors hover:text-white ${
                isActive("/services") ? "text-white" : "text-gray-300"
              }`}
            >
              Services
            </Link>
            <Link
              href="/countries"
              className={`text-sm font-medium transition-colors hover:text-white ${
                isActive("/countries") ? "text-white" : "text-gray-300"
              }`}
            >
              Countries
            </Link>
            <Link
              href="/dashboard"
              className={`text-sm font-medium transition-colors hover:text-white ${
                isActive("/dashboard") ? "text-white" : "text-gray-300"
              }`}
            >
              Dashboard
            </Link>
            <Link href="/login">
              <Button variant="outline" className="border-white text-white hover:bg-white/20">
                Login
              </Button>
            </Link>
          </nav>
        </div>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-gradient-to-r from-purple-600 via-blue-600 to-red-500 p-4 md:hidden z-40">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/"
                className={`text-sm font-medium transition-colors hover:text-white ${
                  isActive("/") ? "text-white" : "text-gray-200"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/services"
                className={`text-sm font-medium transition-colors hover:text-white ${
                  isActive("/services") ? "text-white" : "text-gray-200"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Services
              </Link>
              <Link
                href="/countries"
                className={`text-sm font-medium transition-colors hover:text-white ${
                  isActive("/countries") ? "text-white" : "text-gray-200"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Countries
              </Link>
              <Link
                href="/dashboard"
                className={`text-sm font-medium transition-colors hover:text-white ${
                  isActive("/dashboard") ? "text-white" : "text-gray-200"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                <Button variant="outline" className="border-white text-white hover:bg-white/20 w-full">
                  Login
                </Button>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
