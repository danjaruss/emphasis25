"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Home, Folder, Users, Settings, LogOut, User, ChevronDown, BarChart3, Plus, Shield } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { NotificationCenter } from "./notification-center"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/components/auth/auth-provider"

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Projects", href: "/projects", icon: Folder },
  { name: "Reports", href: "/reports", icon: BarChart3 },
  { name: "Stakeholders", href: "/stakeholders", icon: Users },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { user, profile, signOut } = useAuth()

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(href)
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      // Optionally redirect to home or login page
      window.location.href = "/"
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const getUserInitials = () => {
    if (profile?.full_name) {
      return profile.full_name
        .split(" ")
        .map((name: string) => name[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    }
    if (profile?.email) {
      return profile.email.slice(0, 2).toUpperCase()
    }
    return "U"
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-emphasis-light-blue/20 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="relative h-10 w-10">
              <Image
                src="/images/emphasis-logo-mark.png"
                alt="Project EMPHASIS"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="hidden sm:block">
              <div className="text-lg font-bold text-emphasis-navy">project EMPHASIS</div>
              <div className="text-xs text-emphasis-teal font-medium tracking-wide">
                SUSTAINABLE ISLAND STATE SOLUTIONS
              </div>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navigation.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  active
                    ? "bg-emphasis-mint text-emphasis-navy"
                    : "text-emphasis-teal hover:bg-emphasis-mint/50 hover:text-emphasis-navy",
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* User Menu & Actions */}
        <div className="flex items-center space-x-3">
          {/* Notifications */}
          <div className="hidden md:block">
            <NotificationCenter />
          </div>

          {/* New Project Button */}
          <Button asChild size="sm" className="bg-emphasis-teal hover:bg-emphasis-navy text-white">
            <Link href="/projects/new">
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden lg:block">New Project</span>
              <span className="lg:hidden">New</span>
            </Link>
          </Button>

          {/* User Profile Dropdown - Desktop */}
          <div className="hidden md:flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={profile?.avatar_url || ""} alt={profile?.full_name || "User"} />
                    <AvatarFallback className="bg-emphasis-mint text-emphasis-navy font-medium">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown className="absolute -right-1 -bottom-1 h-3 w-3 text-emphasis-teal bg-white rounded-full" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[220px]">
                <div className="flex items-center justify-start gap-2 p-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={profile?.avatar_url || ""} alt={profile?.full_name || "User"} />
                    <AvatarFallback className="bg-emphasis-mint text-emphasis-navy text-xs">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{profile?.full_name || "User"}</p>
                    <p className="text-xs leading-none text-muted-foreground">{profile?.email || "user@example.com"}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                {profile?.role === "admin" && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/admin">
                        <Shield className="mr-2 h-4 w-4" />
                        <span>Admin Panel</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-red-600 focus:text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden text-emphasis-teal hover:bg-emphasis-mint/50">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 bg-emphasis-off-white border-emphasis-light-blue/20">
              <div className="flex flex-col h-full">
                {/* Mobile Logo */}
                <div className="flex items-center space-x-3 pb-6 border-b border-emphasis-light-blue/20">
                  <div className="relative h-8 w-8">
                    <Image
                      src="/images/emphasis-logo-mark.png"
                      alt="Project EMPHASIS"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-emphasis-navy">project EMPHASIS</div>
                    <div className="text-xs text-emphasis-teal font-medium">SUSTAINABLE SOLUTIONS</div>
                  </div>
                </div>

                {/* Mobile User Profile */}
                <div className="py-4 border-b border-emphasis-light-blue/20">
                  <div className="flex items-center space-x-3 px-3 py-2">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={profile?.avatar_url || ""} alt={profile?.full_name || "User"} />
                      <AvatarFallback className="bg-emphasis-mint text-emphasis-navy">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm font-medium text-emphasis-navy">{profile?.full_name || "User"}</div>
                      <div className="text-xs text-emphasis-teal">{profile?.email || "user@example.com"}</div>
                    </div>
                  </div>
                </div>

                {/* Mobile Notifications */}
                <div className="py-4 border-b border-emphasis-light-blue/20">
                  <NotificationCenter />
                </div>

                {/* Mobile New Project Button */}
                <div className="py-4 border-b border-emphasis-light-blue/20">
                  <Button asChild className="w-full bg-emphasis-teal hover:bg-emphasis-navy text-white">
                    <Link href="/projects/new" onClick={() => setMobileMenuOpen(false)}>
                      <Plus className="h-4 w-4 mr-2" />
                      New Project
                    </Link>
                  </Button>
                </div>

                {/* Mobile Navigation */}
                <nav className="flex-1 py-6">
                  <div className="space-y-1">
                    {navigation.map((item) => {
                      const Icon = item.icon
                      const active = isActive(item.href)

                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={cn(
                            "flex items-center space-x-3 px-3 py-3 rounded-md text-sm font-medium transition-colors",
                            active
                              ? "bg-emphasis-mint text-emphasis-navy"
                              : "text-emphasis-teal hover:bg-emphasis-mint/50 hover:text-emphasis-navy",
                          )}
                        >
                          <Icon className="h-5 w-5" />
                          <span>{item.name}</span>
                        </Link>
                      )
                    })}
                  </div>

                  <div className="mt-8 pt-6 border-t border-emphasis-light-blue/20">
                    <div className="space-y-1">
                      <Link
                        href="/profile"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center space-x-3 px-3 py-3 rounded-md text-sm font-medium text-emphasis-teal hover:bg-emphasis-mint/50 hover:text-emphasis-navy transition-colors"
                      >
                        <User className="h-5 w-5" />
                        <span>Profile</span>
                      </Link>
                      <Link
                        href="/settings"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center space-x-3 px-3 py-3 rounded-md text-sm font-medium text-emphasis-teal hover:bg-emphasis-mint/50 hover:text-emphasis-navy transition-colors"
                      >
                        <Settings className="h-5 w-5" />
                        <span>Settings</span>
                      </Link>

                      <button
                        onClick={() => {
                          setMobileMenuOpen(false)
                          handleSignOut()
                        }}
                        className="flex items-center space-x-3 px-3 py-3 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors w-full text-left"
                      >
                        <LogOut className="h-5 w-5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </nav>

                {/* Mobile Footer */}
                <div className="pt-6 border-t border-emphasis-light-blue/20">
                  <div className="text-xs text-emphasis-teal text-center">© 2024 Project EMPHASIS</div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
