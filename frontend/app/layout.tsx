import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/components/auth/auth-provider"
import { Header } from "@/components/layout/header"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Project EMPHASIS - SDG Project Management",
  description: "Sustainable Island State Solutions - Project Management & Monitoring Platform",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen bg-emphasis-off-white">
            <Header />
            <main className="flex-1">{children}</main>
          </div>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
