"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { apiClient } from "@/lib/api"

interface User {
  id: string
  email: string
  user_metadata: {
    full_name: string
  }
}

interface AuthContextType {
  user: User | null
  profile: any | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signOut: async () => { },
})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        // Check for access token
        const token = localStorage.getItem('access_token')
        if (token) {
          // Get user profile
          const profile = await apiClient.getProfile()
          if (profile) {
            setUser({
              id: profile.id.toString(),
              email: profile.email,
              user_metadata: {
                full_name: `${profile.first_name} ${profile.last_name}`,
              },
            })
            setProfile(profile)
          }
        }
      } catch (error) {
        console.error("Error getting initial session:", error)
        // Clear invalid tokens
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()
  }, [])

  // Listen for storage changes to update user state
  useEffect(() => {
    const handleStorageChange = async () => {
      const token = localStorage.getItem('access_token')
      if (token && !user) {
        try {
          const profile = await apiClient.getProfile()
          if (profile) {
            setUser({
              id: profile.id.toString(),
              email: profile.email,
              user_metadata: {
                full_name: `${profile.first_name} ${profile.last_name}`,
              },
            })
            setProfile(profile)
          }
        } catch (error) {
          console.error("Error updating user state:", error)
        }
      }
    }

    // Also check for token changes on mount and when user changes
    const checkToken = async () => {
      const token = localStorage.getItem('access_token')
      if (token && !user) {
        try {
          const profile = await apiClient.getProfile()
          if (profile) {
            setUser({
              id: profile.id.toString(),
              email: profile.email,
              user_metadata: {
                full_name: `${profile.first_name} ${profile.last_name}`,
              },
            })
            setProfile(profile)
          }
        } catch (error) {
          console.error("Error updating user state:", error)
        }
      }
    }

    checkToken()
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [user])

  const handleSignOut = async () => {
    try {
      await apiClient.logout()
      setUser(null)
      setProfile(null)
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signOut: handleSignOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
