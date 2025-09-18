import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Search, FolderX, Home } from "lucide-react"

export default function ProjectNotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <Card className="text-center">
          <CardHeader className="pb-4">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FolderX className="h-8 w-8 text-gray-400" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Project Not Found</CardTitle>
            <CardDescription className="text-gray-600">
              The project you're looking for doesn't exist or you don't have permission to view it.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-gray-500 space-y-2">
              <p>This could happen if:</p>
              <ul className="list-disc list-inside space-y-1 text-left">
                <li>The project was deleted or archived</li>
                <li>You don't have access permissions</li>
                <li>The project ID in the URL is incorrect</li>
                <li>The project is private and you're not a collaborator</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Link href="/projects" className="flex-1">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Projects
                </Button>
              </Link>
              <Link href="/projects?search=true" className="flex-1">
                <Button variant="outline" className="w-full">
                  <Search className="h-4 w-4 mr-2" />
                  Search Projects
                </Button>
              </Link>
            </div>

            <div className="pt-2">
              <Link href="/">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <Home className="h-4 w-4 mr-2" />
                  Go to Dashboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Additional Help Section */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 mb-3">Need help finding your project?</p>
          <div className="flex justify-center space-x-4 text-xs">
            <Link href="/projects/templates" className="text-blue-600 hover:text-blue-800 hover:underline">
              Browse Templates
            </Link>
            <Link href="/projects/new" className="text-blue-600 hover:text-blue-800 hover:underline">
              Create New Project
            </Link>
            <Link href="/help" className="text-blue-600 hover:text-blue-800 hover:underline">
              Get Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
