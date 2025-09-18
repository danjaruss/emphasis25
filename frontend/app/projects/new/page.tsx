"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/auth-provider"
import { useEffect, useState } from "react"
import ProjectForm from "@/components/project-form"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { apiClient } from "@/lib/api"

export default function NewProjectPage() {
  const router = useRouter()
  const { user, profile, loading: authLoading } = useAuth()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [templateName, setTemplateName] = useState<string | null>(null)

  // Check for template query param
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      const template = params.get("template")
      setTemplateName(template)
    }
  }, [])

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to create a project",
        variant: "destructive",
      })
      router.push("/auth")
    }
  }, [user, authLoading, router, toast])

  const handleSubmit = async (formData: any) => {
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to create a project",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // If Supabase is configured, save to database
      // REMOVE: if (isSupabaseConfigured()) {
      // Prepare all project data as JSONB
      const projectData = {
        projectType: formData.projectType,
        priority: formData.priority,
        sdgGoals: formData.selectedSDGs,
        startDate: formData.startDate || null,
        endDate: formData.endDate || null,
        budget: formData.budget ? Number.parseFloat(formData.budget.replace(/,/g, "")) : null,
        fundingSources: formData.fundingSources,
        location: formData.location,
        geographicScope: formData.geographicScope,
        objectives: formData.objectives.filter((obj: string) => obj.trim()),
        successMetrics: formData.successMetrics.filter((metric: string) => metric.trim()),
        stakeholders: formData.assignedStakeholders,
        riskLevel: formData.riskLevel,
        riskFactors: formData.riskFactors,
        milestones: formData.milestones
          .filter((m: any) => m.name.trim())
          .map((milestone: any) => ({
            name: milestone.name,
            description: milestone.description,
            date: milestone.date,
            status: "pending",
          })),
      }

      // Insert project with correct schema structure
      // REMOVE: const { data, error } = await supabase
      // REMOVE:   .from("projects")
      // REMOVE:   .insert({
      // REMOVE:     name: formData.name,
      // REMOVE:     description: formData.description,
      // REMOVE:     data: projectData,
      // REMOVE:     created_by: user.id,
      // REMOVE:     status: "active",
      // REMOVE:   })
      // REMOVE:   .select()
      // REMOVE:   .single()

      // Debug: Log the data being sent
      const apiProjectData = {
        name: formData.name,
        description: formData.description,
        client_id: profile?.client?.id, // Get client_id from profile
        project_type: formData.projectType,
        priority: formData.priority,
        location: formData.location,
        geographic_scope: formData.geographicScope,
        sdg_ids: formData.selectedSDGs,
        sdg_target_ids: formData.selectedSDGTargets,
        // Note: start_date, end_date, budget, funding_sources, objectives, 
        // success_metrics, assigned_stakeholders, risk_level, risk_factors, 
        // and milestones are not part of the Project model and will be ignored
      }

      console.log('Profile:', profile)
      console.log('Profile.client:', profile?.client)
      console.log('Profile.client.id:', profile?.client?.id)
      console.log('Project data being sent:', apiProjectData)

      // Use apiClient for project creation
      const data = await apiClient.createProject(apiProjectData)

      // Log activity
      if (data?.id) {
        try {
          // REMOVE: await supabase.from("project_activity").insert({
          // REMOVE:   project_id: data.id,
          // REMOVE:   user_id: user.id,
          // REMOVE:   action: "project_created",
          // REMOVE:   details: {
          // REMOVE:     project_name: formData.name,
          // REMOVE:     project_type: formData.projectType,
          // REMOVE:     sdg_count: formData.selectedSDGs.length,
          // REMOVE:   },
          // REMOVE: })
        } catch (activityError) {
          console.warn("Failed to log activity:", activityError)
          // Don't fail the whole operation for activity logging
        }
      }

      toast({
        title: "Project Created",
        description: "Your SDG project has been created successfully!",
      })

      // Navigate to the new project
      if (data?.id) {
        router.push(`/projects/${data.id}`)
      } else {
        router.push("/projects")
      }
      // } else {
      // Demo mode - just show success and redirect
      // console.log("Demo mode - Project data:", formData)

      // toast({
      //   title: "Project Created (Demo)",
      //   description: "Your SDG project has been created successfully in demo mode!",
      // })

      // router.push("/projects")
      // }
    } catch (error) {
      console.error("Error creating project:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create project. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.push("/projects")
  }

  // Show loading state
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Show not logged in message
  if (!user) {
    return (
      <div className="container mx-auto py-12">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
              Authentication Required
            </CardTitle>
            <CardDescription>You need to be logged in to create a project</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Please log in or create an account to continue.</p>
            <div className="flex justify-center">
              <Button asChild>
                <Link href="/auth">Go to Login</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show project form
  return (
    <div className="container mx-auto py-6">
      {/* REMOVE: {!isSupabaseConfigured() && (
        <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-6">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
            <div>
              <h3 className="font-medium text-amber-800">Development Mode</h3>
              <p className="text-amber-700 text-sm">
                Running in demo mode without database connection. Project creation will be simulated.
              </p>
            </div>
          </div>
        </div>
      )} */}

      <ProjectForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        templateName={templateName || undefined}
      />
    </div>
  )
}
