import type { ReactNode } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Sidebar } from "@/components/sidebar"
import { SupportButton } from "@/components/support-button"

interface LayoutProps {
  children: ReactNode
}

// Update the Layout component to ensure proper spacing with the fixed-width sidebar
export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen ml-[80px] transition-all duration-300">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="glass-container p-6">{children}</div>
        </main>
        <Footer />
        <SupportButton />
      </div>
    </div>
  )
}
