"use client"

import { useAuth } from "@/components/auth/auth-provider"
import { SuperAdminDashboard } from "@/components/admin/super-admin-dashboard"
import { JurisdictionAdminDashboard } from "@/components/admin/jurisdiction-admin-dashboard"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Crown, Flag } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function AdminPage() {
  const { user, profile, loading } = useAuth()
  const router = useRouter()
  const [adminLevel, setAdminLevel] = useState<"super-admin" | "admin" | null>(null)

  useEffect(() => {
    // Redirect non-authenticated users
    if (!loading && !user) {
      router.push("/auth")
      return
    }

    // Determine admin level based on user profile
    if (!loading && user && profile) {
      // In a real app, you'd check against proper role system
      // For demo, we'll simulate different admin levels
      if (profile.role === "super-admin" || profile.email?.includes("emphasis")) {
        setAdminLevel("super-admin")
      } else if (profile.role === "admin" || profile.organization_type === "government") {
        setAdminLevel("admin")
      } else {
        // For demo purposes, allow access but show warning
        setAdminLevel("admin") // Default to jurisdiction admin for demo
      }
    }
  }, [user, profile, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emphasis-navy"></div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect
  }

  // Get user's jurisdiction (country) for admin scope
  const userJurisdiction = profile?.country || "Fiji" // Default for demo

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Admin Access Info */}
        <Alert className="mb-6 border-blue-200 bg-blue-50">
          <div className="flex items-center space-x-2">
            {adminLevel === "super-admin" ? (
              <Crown className="h-4 w-4 text-purple-600" />
            ) : (
              <Flag className="h-4 w-4 text-blue-600" />
            )}
            <AlertDescription className="text-blue-800">
              <strong>
                {adminLevel === "super-admin" ? "Super Admin Access:" : `${userJurisdiction} Admin Access:`}
              </strong>{" "}
              {adminLevel === "super-admin"
                ? "You have global system administration privileges."
                : `You can manage users and projects for ${userJurisdiction}.`}
              {profile?.role !== "super-admin" && profile?.role !== "admin" && (
                <span className="ml-2 text-yellow-700">(Demo Mode)</span>
              )}
            </AlertDescription>
          </div>
        </Alert>

        {/* Render appropriate dashboard based on admin level */}
        {adminLevel === "super-admin" ? (
          <>
            {/* Super Admin Header */}
            <div className="flex items-center space-x-3 mb-8">
              <div className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg">
                <Crown className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-emphasis-navy">EMPHASIS Platform Administration</h1>
                <p className="text-gray-600">Global system oversight and management</p>
              </div>
            </div>
            <SuperAdminDashboard />
          </>
        ) : (
          <>
            {/* Jurisdiction Admin Header */}
            <div className="flex items-center space-x-3 mb-8">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg">
                <Flag className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-emphasis-navy">{userJurisdiction} Administration</h1>
                <p className="text-gray-600">
                  Welcome, {profile?.full_name || "Administrator"} - {profile?.job_title || "Admin"}
                </p>
              </div>
            </div>
            <JurisdictionAdminDashboard jurisdiction={userJurisdiction} userProfile={profile} />
          </>
        )}
      </div>
    </div>
  )
}
