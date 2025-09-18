"use client"

import { useAuth } from "@/components/auth/auth-provider"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { StakeholderManager } from "@/components/stakeholder/stakeholder-manager"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function StakeholdersPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth")
    }
  }, [user, loading, router])

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-brand-off-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-brand-teal hover:bg-brand-mint">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-brand-navy">Stakeholder Management</h1>
                <p className="text-sm text-brand-teal">Manage your project stakeholders and partners</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/projects">
                <Button variant="outline" size="sm" className="border-brand-teal text-brand-teal hover:bg-brand-mint">
                  Projects
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <StakeholderManager />
      </div>
    </div>
  )
}
