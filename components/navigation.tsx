"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, User, LogOut } from "lucide-react"
import { useUser } from "@/contexts/user-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Navigation() {
  const { user, logout } = useUser()
  const pathname = usePathname()

  const handleLogout = async () => {
    await logout()
    window.location.href = "/"
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="inline-block font-bold bg-gradient-to-r from-purple-600 to-red-600 bg-clip-text text-transparent text-xl">
              SpaceConnect
            </span>
          </Link>
          <nav className="flex gap-6">
            <Link
              href="/"
              className={`flex items-center text-sm font-medium transition-colors hover:text-primary ${
                pathname === "/" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Home
            </Link>
            <Link
              href="/services"
              className={`flex items-center text-sm font-medium transition-colors hover:text-primary ${
                pathname === "/services" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Services
            </Link>
            <Link
              href="/pricing"
              className={`flex items-center text-sm font-medium transition-colors hover:text-primary ${
                pathname === "/pricing" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Pricing
            </Link>
            {user && (
              <Link
                href="/dashboard"
                className={`flex items-center text-sm font-medium transition-colors hover:text-primary ${
                  pathname === "/dashboard" ? "text-primary" : "text-muted-foreground"
                }`}
              >
                Dashboard
              </Link>
            )}
          </nav>
        </div>
        <div className="flex flex-1 items-center space-x-4 sm:justify-end">
          <div className="flex-1 sm:grow-0 sm:w-[300px]">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search..." className="pl-8" />
            </div>
          </div>
          <nav>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="relative h-8 w-8 rounded-full">
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href="/profile" className="w-full">
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/dashboard" className="w-full">
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/transactions" className="w-full">
                      Transactions
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm" className="bg-gradient-to-r from-purple-600 to-red-600 text-white">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
