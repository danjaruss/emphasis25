import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Search, Plus } from "lucide-react"

export default function ProjectNotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full px-4">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Search className="h-6 w-6 text-gray-400" />
            </div>
            <CardTitle>Project Not Found</CardTitle>
            <CardDescription>
              The project you're looking for doesn't exist or you don't have permission to view it.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col space-y-2">
              <Link href="/projects">
                <Button className="w-full">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Projects
                </Button>
              </Link>
              <Link href="/projects/new">
                <Button variant="outline" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Project
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
