"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/auth-provider"
import { useEffect } from "react"
import { TemplateGallery } from "@/components/project-templates/template-gallery"
import { templateToFormData, type ProjectTemplate } from "@/lib/project-templates"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ProjectTemplatesPage() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth")
    }
  }, [user, loading, router])

  const handleSelectTemplate = (template: ProjectTemplate) => {
    // Convert template to form data and store in session storage
    const formData = templateToFormData(template)
    sessionStorage.setItem(
      "selectedTemplate",
      JSON.stringify({
        templateId: template.id,
        templateName: template.name,
        formData,
      }),
    )

    // Navigate to the new project form
    router.push("/projects/new?template=true")
  }

  const handleCreateBlank = () => {
    // Clear any stored template data
    sessionStorage.removeItem("selectedTemplate")
    router.push("/projects/new")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-brand-off-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/projects">
                <Button variant="ghost" size="sm" className="text-brand-teal hover:bg-brand-mint">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Projects
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-brand-navy">Project Templates</h1>
                <p className="text-sm text-brand-teal">
                  Choose from pre-built templates for common island SDG projects
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="outline" size="sm" className="border-brand-teal text-brand-teal hover:bg-brand-mint">
                  Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TemplateGallery onSelectTemplate={handleSelectTemplate} onCreateBlank={handleCreateBlank} />
      </div>
    </div>
  )
}
