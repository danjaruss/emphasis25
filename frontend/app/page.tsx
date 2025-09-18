"use client"

import { useAuth } from "@/components/auth/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardOverview } from "@/components/dashboard/dashboard-overview"
import Link from "next/link"
import { Target, Users, TrendingUp, Globe, Leaf, Waves, ArrowRight, AlertTriangle } from "lucide-react"


export default function HomePage() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emphasis-navy"></div>
      </div>
    )
  }

  // Show dashboard for authenticated users
  if (user) {
    return (
      <div className="min-h-screen bg-gray-50">


        <div className="container mx-auto px-4 py-8">
          <DashboardOverview />
        </div>
      </div>
    )
  }

  // Show landing page for non-authenticated users
  return (
    <div className="min-h-screen bg-gradient-to-br from-emphasis-off-white via-white to-emphasis-mint/10">


      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <img src="/images/emphasis-logo-color.png" alt="Project EMPHASIS" className="h-16 w-auto" />
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold text-emphasis-navy mb-6">
              Sustainable Island State
              <span className="block text-emphasis-teal">Solutions</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Empowering Small Island Developing States through comprehensive project management, monitoring, and
              sustainable development goal tracking.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth">
                <Button size="lg" className="bg-emphasis-navy hover:bg-emphasis-navy/90">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/projects/templates">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-emphasis-teal text-emphasis-teal hover:bg-emphasis-teal/10"
                >
                  Explore Templates
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-emphasis-navy mb-4">Comprehensive Project Management</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From planning to implementation, track your sustainable development projects with powerful tools designed
              for island communities.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-emphasis-mint/20 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Target className="h-12 w-12 text-emphasis-teal mb-4" />
                <CardTitle className="text-emphasis-navy">SDG Alignment</CardTitle>
                <CardDescription>
                  Align your projects with UN Sustainable Development Goals and track progress towards targets.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-emphasis-mint/20 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="h-12 w-12 text-emphasis-teal mb-4" />
                <CardTitle className="text-emphasis-navy">Stakeholder Collaboration</CardTitle>
                <CardDescription>
                  Engage communities, government, and international partners in collaborative project development.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-emphasis-mint/20 hover:shadow-lg transition-shadow">
              <CardHeader>
                <TrendingUp className="h-12 w-12 text-emphasis-teal mb-4" />
                <CardTitle className="text-emphasis-navy">Progress Tracking</CardTitle>
                <CardDescription>
                  Monitor project milestones, budget utilization, and impact metrics with real-time dashboards.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-emphasis-navy text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-emphasis-mint mb-2">15+</div>
              <div className="text-emphasis-off-white">Island States Supported</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-emphasis-mint mb-2">200+</div>
              <div className="text-emphasis-off-white">Active Projects</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-emphasis-mint mb-2">17</div>
              <div className="text-emphasis-off-white">SDG Goals Covered</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-emphasis-mint mb-2">85%</div>
              <div className="text-emphasis-off-white">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Focus Areas */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-emphasis-navy mb-4">Focus Areas for Island Communities</h2>
            <p className="text-lg text-gray-600">
              Addressing the unique challenges and opportunities of Small Island Developing States
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Waves,
                title: "Climate Resilience",
                description: "Sea level rise adaptation and disaster risk reduction projects",
              },
              {
                icon: Leaf,
                title: "Renewable Energy",
                description: "Sustainable energy transition and grid modernization initiatives",
              },
              {
                icon: Globe,
                title: "Marine Conservation",
                description: "Ocean protection and sustainable fisheries management",
              },
              {
                icon: Users,
                title: "Community Development",
                description: "Education, healthcare, and social infrastructure projects",
              },
              {
                icon: TrendingUp,
                title: "Economic Diversification",
                description: "Tourism, agriculture, and blue economy development",
              },
              {
                icon: Target,
                title: "Digital Transformation",
                description: "ICT infrastructure and digital governance solutions",
              },
            ].map((area, index) => (
              <Card key={index} className="border-emphasis-mint/20 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <area.icon className="h-10 w-10 text-emphasis-teal mb-3" />
                  <CardTitle className="text-lg text-emphasis-navy">{area.title}</CardTitle>
                  <CardDescription>{area.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-emphasis-teal to-emphasis-mint">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Transform Your Island Community?</h2>
          <p className="text-xl text-white/90 mb-8">
            Join the growing network of island states using Project EMPHASIS to achieve sustainable development goals
            and build resilient communities.
          </p>
          <Link href="/auth">
            <Button size="lg" className="bg-white text-emphasis-teal hover:bg-gray-50">
              Join Project EMPHASIS
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
