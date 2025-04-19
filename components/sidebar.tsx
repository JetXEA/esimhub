"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Home, Package, Globe, CreditCard, Settings, LogOut, Menu, X, Users, HelpCircle, BarChart } from "lucide-react"
import { Button } from "@/components/ui/button"

// Import the custom hook
import { useSidebarState } from "@/hooks/use-sidebar-state"

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  // Always set isCollapsed to true to show only icons
  const { toggleSidebar: toggleCollapse } = useSidebarState()

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  const isActive = (path: string) => {
    return pathname === path
  }

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      })

      if (response.ok) {
        router.push("/login")
      }
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const menuItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Services", path: "/services", icon: Package },
    { name: "Countries", path: "/countries", icon: Globe },
    { name: "Payment", path: "/payment", icon: CreditCard },
    { name: "Dashboard", path: "/dashboard", icon: Settings },
    { name: "Users", path: "/users", icon: Users },
    { name: "Analytics", path: "/analytics", icon: BarChart },
    { name: "Help", path: "/help", icon: HelpCircle },
  ]

  // Always use the collapsed width for the sidebar
  const sidebarWidth = "80px"

  return (
    <>
      {/* Mobile sidebar toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden text-white"
        onClick={toggleSidebar}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Sidebar backdrop for mobile */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={toggleSidebar} />}

      {/* Sidebar - Always showing icons only */}
      <aside
        className="fixed top-0 left-0 z-40 h-full transform transition-all duration-300 ease-in-out md:translate-x-0 w-[80px] bg-gradient-to-r from-purple-800 to-blue-700 backdrop-blur-lg text-white"
        style={{ width: sidebarWidth }}
      >
        <div className="flex flex-col h-full relative">
          {/* Sidebar header */}
          <div className="p-4 border-b border-white/10 flex items-center justify-center">
            <Link href="/" className="flex items-center justify-center" onClick={() => setIsOpen(false)}>
              <span className="text-2xl font-bold">EC</span>
            </Link>
          </div>

          {/* Sidebar navigation - Icons only with hidden scrollbar */}
          <nav className="flex-1 overflow-y-auto p-4 sidebar-no-scrollbar">
            <ul className="space-y-4">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className={`flex items-center justify-center p-2 rounded-md transition-colors ${
                      isActive(item.path)
                        ? "bg-white/20 text-white"
                        : "text-gray-200 hover:bg-white/10 hover:text-white"
                    }`}
                    onClick={() => setIsOpen(false)}
                    title={item.name}
                  >
                    <item.icon className="h-5 w-5" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Sidebar footer */}
          <div className="p-4 border-t border-white/10 flex justify-center">
            <button
              onClick={handleLogout}
              className="flex items-center justify-center p-2 rounded-md text-gray-200 hover:bg-white/10 hover:text-white transition-colors"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
