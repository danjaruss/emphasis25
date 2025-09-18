"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "./auth-provider"
import { Loader2 } from "lucide-react"
import { apiClient } from "@/lib/api"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { user } = useAuth()
  const router = useRouter()

  // Redirect if already authenticated
  if (user) {
    router.push("/")
    return null
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await apiClient.login(email, password)
      if (response.access) {
        // Store tokens
        localStorage.setItem('access_token', response.access)
        if (response.refresh) {
          localStorage.setItem('refresh_token', response.refresh)
        }

        // Redirect to dashboard - auth provider will handle user state
        router.push('/dashboard')
        // Force a page refresh to ensure auth provider picks up the new token
        window.location.reload()
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = () => {
    // For demo purposes, use test credentials
    setEmail('test@example.com')
    setPassword('password123')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Project EMPHASIS</h2>
          <p className="mt-2 text-sm text-gray-600">Sustainable Island State Solutions</p>
          <p className="mt-1 text-xs text-gray-500">SDG Project Management & Monitoring Platform</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Welcome</CardTitle>
            <CardDescription>
              Sign in to your account to access Project EMPHASIS
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                />
              </div>
              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-600">{error}</AlertDescription>
                </Alert>
              )}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign In
              </Button>

              <div className="text-center">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDemoLogin}
                  className="w-full"
                >
                  Use Demo Credentials
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
