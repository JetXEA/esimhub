import type { ReactNode } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Sidebar } from "@/components/sidebar"
import { SupportButton } from "@/components/support-button"

interface MainLayoutProps {
  children: ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div
        className="flex-1 flex flex-col min-h-screen transition-all duration-300"
        style={{
          marginLeft: "var(--sidebar-width-collapsed)",
          "@media (min-width: 768px)": {
            marginLeft: 0,
          },
        }}
      >
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
