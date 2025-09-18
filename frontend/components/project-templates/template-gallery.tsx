"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import {
  projectTemplates,
  getTemplatesByCategory,
  getAllCategories,
  type ProjectTemplate,
} from "@/lib/project-templates"
import { Search, Filter, Clock, DollarSign, Target, Users, Lightbulb, ArrowRight } from "lucide-react"

interface TemplateGalleryProps {
  onSelectTemplate: (template: ProjectTemplate) => void
  onCreateBlank: () => void
}

export function TemplateGallery({ onSelectTemplate, onCreateBlank }: TemplateGalleryProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [complexityFilter, setComplexityFilter] = useState("all")
  const [selectedTemplate, setSelectedTemplate] = useState<ProjectTemplate | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  const categories = getAllCategories()

  const filteredTemplates = projectTemplates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.category.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = categoryFilter === "all" || template.category === categoryFilter
    const matchesComplexity = complexityFilter === "all" || template.complexity === complexityFilter

    return matchesSearch && matchesCategory && matchesComplexity
  })

  const handlePreviewTemplate = (template: ProjectTemplate) => {
    setSelectedTemplate(template)
    setIsPreviewOpen(true)
  }

  const handleUseTemplate = (template: ProjectTemplate) => {
    setIsPreviewOpen(false)
    onSelectTemplate(template)
  }

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "Low":
        return "bg-green-100 text-green-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "High":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getSDGColor = (sdgId: number) => {
    const colors = [
      "bg-red-500",
      "bg-yellow-500",
      "bg-green-500",
      "bg-red-600",
      "bg-orange-500",
      "bg-blue-500",
      "bg-yellow-600",
      "bg-red-700",
      "bg-orange-600",
      "bg-pink-500",
      "bg-orange-500",
      "bg-yellow-700",
      "bg-green-600",
      "bg-blue-600",
      "bg-green-700",
      "bg-blue-700",
      "bg-blue-800",
    ]
    return colors[sdgId - 1] || "bg-gray-500"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div>
          <h1 className="text-3xl font-bold text-brand-navy">Choose a Project Template</h1>
          <p className="text-brand-teal mt-2">
            Get started quickly with pre-built templates for common island SDG projects
          </p>
        </div>

        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={onCreateBlank}
            className="border-brand-teal text-brand-teal hover:bg-brand-mint"
          >
            <Lightbulb className="h-4 w-4 mr-2" />
            Start from Scratch
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[200px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={complexityFilter} onValueChange={setComplexityFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All Complexity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Complexity</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="High">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Templates by Category */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="conservation">Conservation</TabsTrigger>
          <TabsTrigger value="energy">Energy</TabsTrigger>
          <TabsTrigger value="tourism">Tourism</TabsTrigger>
          <TabsTrigger value="climate">Climate</TabsTrigger>
          <TabsTrigger value="other">Other</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <Card key={template.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-3xl">{template.icon}</div>
                      <div>
                        <CardTitle className="text-lg group-hover:text-brand-navy transition-colors">
                          {template.name}
                        </CardTitle>
                        <CardDescription>{template.category}</CardDescription>
                      </div>
                    </div>
                    <Badge className={getComplexityColor(template.complexity)}>{template.complexity}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600 line-clamp-3">{template.description}</p>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{template.estimatedDuration}</span>
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{template.estimatedBudget}</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center mb-2">
                      <Target className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="text-sm font-medium">Primary SDGs:</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {template.primarySDGs.map((sdgId) => (
                        <div
                          key={sdgId}
                          className={`w-6 h-6 rounded-full ${getSDGColor(sdgId)} flex items-center justify-center text-white text-xs font-bold`}
                        >
                          {sdgId}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <Button variant="outline" size="sm" onClick={() => handlePreviewTemplate(template)}>
                      Preview
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleUseTemplate(template)}
                      className="bg-brand-navy hover:bg-brand-teal"
                    >
                      Use Template
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Category-specific tabs would filter templates accordingly */}
        <TabsContent value="conservation">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getTemplatesByCategory("Marine Conservation")
              .concat(getTemplatesByCategory("Climate Adaptation"))
              .map((template) => (
                <Card key={template.id} className="hover:shadow-lg transition-shadow">
                  {/* Same card content as above */}
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Template Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedTemplate && (
            <>
              <DialogHeader>
                <div className="flex items-center space-x-3">
                  <div className="text-4xl">{selectedTemplate.icon}</div>
                  <div>
                    <DialogTitle className="text-2xl">{selectedTemplate.name}</DialogTitle>
                    <DialogDescription className="text-lg">{selectedTemplate.category}</DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-6">
                {/* Overview */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Project Overview</h3>
                  <p className="text-gray-700">{selectedTemplate.description}</p>
                </div>

                {/* Key Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-brand-teal" />
                    <div>
                      <p className="font-medium">Duration</p>
                      <p className="text-sm text-gray-600">{selectedTemplate.estimatedDuration}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-brand-teal" />
                    <div>
                      <p className="font-medium">Budget</p>
                      <p className="text-sm text-gray-600">{selectedTemplate.estimatedBudget}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Target className="h-5 w-5 text-brand-teal" />
                    <div>
                      <p className="font-medium">Complexity</p>
                      <Badge className={getComplexityColor(selectedTemplate.complexity)}>
                        {selectedTemplate.complexity}
                      </Badge>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* SDG Alignment */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">SDG Alignment</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="font-medium mb-2">Primary SDGs:</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedTemplate.primarySDGs.map((sdgId) => (
                          <div key={sdgId} className="flex items-center space-x-2">
                            <div
                              className={`w-8 h-8 rounded-full ${getSDGColor(sdgId)} flex items-center justify-center text-white text-sm font-bold`}
                            >
                              {sdgId}
                            </div>
                            <span className="text-sm">SDG {sdgId}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    {selectedTemplate.secondarySDGs.length > 0 && (
                      <div>
                        <p className="font-medium mb-2">Secondary SDGs:</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedTemplate.secondarySDGs.map((sdgId) => (
                            <div key={sdgId} className="flex items-center space-x-2">
                              <div
                                className={`w-6 h-6 rounded-full ${getSDGColor(sdgId)} flex items-center justify-center text-white text-xs font-bold`}
                              >
                                {sdgId}
                              </div>
                              <span className="text-xs">SDG {sdgId}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Objectives */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Project Objectives</h3>
                  <ul className="space-y-2">
                    {selectedTemplate.template.objectives.map((objective, index) => (
                      <li key={index} className="flex items-start">
                        <span className="flex-shrink-0 w-6 h-6 bg-brand-light-blue text-brand-navy rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                          {index + 1}
                        </span>
                        <span className="text-sm">{objective}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Separator />

                {/* Key Milestones */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Key Milestones</h3>
                  <div className="space-y-3">
                    {selectedTemplate.template.milestones.map((milestone, index) => (
                      <div key={index} className="border-l-4 border-brand-light-blue pl-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{milestone.name}</h4>
                          <Badge variant="outline">Month {milestone.estimatedMonths}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{milestone.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Stakeholders & Expertise */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Key Stakeholders</h3>
                    <div className="space-y-2">
                      {selectedTemplate.template.stakeholderCategories.map((category, index) => (
                        <div key={index} className="flex items-center">
                          <Users className="h-4 w-4 text-brand-teal mr-2" />
                          <span className="text-sm">{category}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Required Expertise</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedTemplate.template.expertiseRequired.map((expertise, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {expertise}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-4">
                  <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>
                    Close
                  </Button>
                  <Button
                    onClick={() => handleUseTemplate(selectedTemplate)}
                    className="bg-brand-navy hover:bg-brand-teal"
                  >
                    Use This Template
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
