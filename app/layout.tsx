import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import ErrorTracker from "@/components/error-tracker"
import SuccessPropertyFixer from "@/components/success-property-fixer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SMS Reseller Platform",
  description: "A platform for reselling SMS verification services",
    generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorTracker />
        <SuccessPropertyFixer />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
