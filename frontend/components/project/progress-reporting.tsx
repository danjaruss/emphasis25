"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import {
  Camera,
  X,
  Calendar,
  MapPin,
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  ImageIcon,
} from "lucide-react"
import { format } from "date-fns"

interface ProgressPhoto {
  id: string
  url: string
  caption: string
  uploadedAt: string
  uploadedBy: string
  milestone?: string
  location?: string
}

interface ProgressUpdate {
  id: string
  title: string
  description: string
  status: "on-track" | "delayed" | "at-risk" | "completed"
  progress: number
  photos: ProgressPhoto[]
  milestone?: string
  location?: string
  reportedBy: string
  reportedAt: string
  nextSteps?: string
  challenges?: string
  achievements?: string
}

interface ProgressReportingProps {
  projectId: string
  projectName: string
  milestones: Array<{
    id: string
    name: string
    targetDate: string
    status: string
  }>
}

export default function ProgressReporting({ projectId, projectName, milestones }: ProgressReportingProps) {
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedPhotos, setSelectedPhotos] = useState<File[]>([])
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([])

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "on-track" as const,
    progress: 0,
    milestone: "",
    location: "",
    nextSteps: "",
    challenges: "",
    achievements: "",
    photoCaptions: [] as string[],
  })

  // Sample existing progress updates
  const [progressUpdates] = useState<ProgressUpdate[]>([
    {
      id: "1",
      title: "Foundation Work Completed",
      description:
        "Successfully completed the foundation work for the coastal protection barrier. All concrete has been poured and is curing properly.",
      status: "completed",
      progress: 100,
      photos: [
        {
          id: "p1",
          url: "/placeholder.svg?height=200&width=300",
          caption: "Foundation concrete pour completed",
          uploadedAt: "2024-01-15T10:30:00Z",
          uploadedBy: "John Smith",
          location: "Northern Coast, Section A",
        },
        {
          id: "p2",
          url: "/placeholder.svg?height=200&width=300",
          caption: "Team completing final foundation checks",
          uploadedAt: "2024-01-15T14:20:00Z",
          uploadedBy: "Maria Garcia",
          location: "Northern Coast, Section A",
        },
      ],
      milestone: "Phase 1 Foundation",
      location: "Northern Coast, Section A",
      reportedBy: "John Smith",
      reportedAt: "2024-01-15T16:00:00Z",
      achievements: "Completed ahead of schedule with excellent quality standards",
      nextSteps: "Begin steel reinforcement installation next week",
    },
    {
      id: "2",
      title: "Environmental Impact Assessment",
      description:
        "Ongoing environmental monitoring shows positive results. Marine life displacement is minimal and within acceptable parameters.",
      status: "on-track",
      progress: 75,
      photos: [
        {
          id: "p3",
          url: "/placeholder.svg?height=200&width=300",
          caption: "Coral reef health monitoring",
          uploadedAt: "2024-01-20T09:15:00Z",
          uploadedBy: "Dr. Sarah Chen",
          location: "Marine Protected Area",
        },
      ],
      milestone: "Environmental Compliance",
      location: "Marine Protected Area",
      reportedBy: "Dr. Sarah Chen",
      reportedAt: "2024-01-20T17:30:00Z",
      achievements: "Marine biodiversity levels maintained above baseline",
      challenges: "Weather conditions affecting underwater surveys",
      nextSteps: "Continue weekly monitoring and prepare mid-project assessment",
    },
  ])

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (files.length === 0) return

    // Validate file types and sizes
    const validFiles = files.filter((file) => {
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid File Type",
          description: `${file.name} is not an image file`,
          variant: "destructive",
        })
        return false
      }
      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        toast({
          title: "File Too Large",
          description: `${file.name} is larger than 10MB`,
          variant: "destructive",
        })
        return false
      }
      return true
    })

    if (validFiles.length === 0) return

    setSelectedPhotos((prev) => [...prev, ...validFiles])

    // Create preview URLs
    const newPreviews = validFiles.map((file) => URL.createObjectURL(file))
    setPhotoPreviews((prev) => [...prev, ...newPreviews])

    // Initialize captions for new photos
    setFormData((prev) => ({
      ...prev,
      photoCaptions: [...prev.photoCaptions, ...validFiles.map(() => "")],
    }))
  }

  const removePhoto = (index: number) => {
    URL.revokeObjectURL(photoPreviews[index])
    setSelectedPhotos((prev) => prev.filter((_, i) => i !== index))
    setPhotoPreviews((prev) => prev.filter((_, i) => i !== index))
    setFormData((prev) => ({
      ...prev,
      photoCaptions: prev.photoCaptions.filter((_, i) => i !== index),
    }))
  }

  const updatePhotoCaption = (index: number, caption: string) => {
    setFormData((prev) => ({
      ...prev,
      photoCaptions: prev.photoCaptions.map((c, i) => (i === index ? caption : c)),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate photo upload and progress report submission
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Progress Report Submitted",
        description: `Progress update for ${projectName} has been recorded successfully`,
      })

      // Reset form
      setFormData({
        title: "",
        description: "",
        status: "on-track",
        progress: 0,
        milestone: "",
        location: "",
        nextSteps: "",
        challenges: "",
        achievements: "",
        photoCaptions: [],
      })
      setSelectedPhotos([])
      setPhotoPreviews([])
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Failed to submit progress report. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "on-track":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "delayed":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "at-risk":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "on-track":
        return <TrendingUp className="h-4 w-4" />
      case "delayed":
        return <Clock className="h-4 w-4" />
      case "at-risk":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Progress Reporting</h2>
          <p className="text-gray-600 mt-1">Track and document project progress with photos and updates</p>
        </div>
      </div>

      <Tabs defaultValue="new-report" className="space-y-6">
        <TabsList>
          <TabsTrigger value="new-report">New Report</TabsTrigger>
          <TabsTrigger value="history">Progress History</TabsTrigger>
        </TabsList>

        <TabsContent value="new-report">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Submit Progress Report
              </CardTitle>
              <CardDescription>
                Document project progress with photos, status updates, and detailed information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Report Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g., Foundation Work Completed"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status *</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value: any) => setFormData((prev) => ({ ...prev, status: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="on-track">On Track</SelectItem>
                        <SelectItem value="delayed">Delayed</SelectItem>
                        <SelectItem value="at-risk">At Risk</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the current progress, what has been accomplished, and any relevant details..."
                    rows={4}
                    required
                  />
                </div>

                {/* Progress and Context */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="progress">Progress Percentage</Label>
                    <div className="space-y-2">
                      <Input
                        id="progress"
                        type="number"
                        min="0"
                        max="100"
                        value={formData.progress}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, progress: Number.parseInt(e.target.value) || 0 }))
                        }
                        placeholder="0"
                      />
                      <Progress value={formData.progress} className="w-full" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="milestone">Related Milestone</Label>
                    <Select
                      value={formData.milestone}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, milestone: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select milestone" />
                      </SelectTrigger>
                      <SelectContent>
                        {milestones.map((milestone) => (
                          <SelectItem key={milestone.id} value={milestone.id}>
                            {milestone.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                      placeholder="e.g., Northern Coast, Section A"
                    />
                  </div>
                </div>

                {/* Photo Upload */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Progress Photos</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center space-x-2"
                    >
                      <Camera className="h-4 w-4" />
                      <span>Add Photos</span>
                    </Button>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />

                  {photoPreviews.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {photoPreviews.map((preview, index) => (
                        <div key={index} className="relative border rounded-lg overflow-hidden">
                          <img
                            src={preview || "/placeholder.svg"}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-48 object-cover"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removePhoto(index)}
                            className="absolute top-2 right-2 h-8 w-8 p-0"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          <div className="p-3">
                            <Input
                              placeholder="Add photo caption..."
                              value={formData.photoCaptions[index] || ""}
                              onChange={(e) => updatePhotoCaption(index, e.target.value)}
                              className="text-sm"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {photoPreviews.length === 0 && (
                    <div
                      className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Click to upload progress photos</p>
                      <p className="text-sm text-gray-500 mt-1">PNG, JPG up to 10MB each</p>
                    </div>
                  )}
                </div>

                {/* Additional Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="achievements">Key Achievements</Label>
                    <Textarea
                      id="achievements"
                      value={formData.achievements}
                      onChange={(e) => setFormData((prev) => ({ ...prev, achievements: e.target.value }))}
                      placeholder="What was accomplished successfully..."
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="challenges">Challenges Faced</Label>
                    <Textarea
                      id="challenges"
                      value={formData.challenges}
                      onChange={(e) => setFormData((prev) => ({ ...prev, challenges: e.target.value }))}
                      placeholder="Any obstacles or issues encountered..."
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nextSteps">Next Steps</Label>
                    <Textarea
                      id="nextSteps"
                      value={formData.nextSteps}
                      onChange={(e) => setFormData((prev) => ({ ...prev, nextSteps: e.target.value }))}
                      placeholder="What will be done next..."
                      rows={3}
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <Button type="button" variant="outline">
                    Save as Draft
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit Report"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <div className="space-y-6">
            {progressUpdates.map((update) => (
              <Card key={update.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        {getStatusIcon(update.status)}
                        <span>{update.title}</span>
                      </CardTitle>
                      <CardDescription className="mt-2">{update.description}</CardDescription>
                    </div>
                    <Badge className={getStatusColor(update.status)}>{update.status.replace("-", " ")}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{update.progress}%</span>
                    </div>
                    <Progress value={update.progress} className="w-full" />
                  </div>

                  {/* Metadata */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4" />
                      <span>Reported by {update.reportedBy}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>{format(new Date(update.reportedAt), "MMM dd, yyyy 'at' HH:mm")}</span>
                    </div>
                    {update.location && (
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4" />
                        <span>{update.location}</span>
                      </div>
                    )}
                  </div>

                  {/* Photos */}
                  {update.photos.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-medium">Progress Photos</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {update.photos.map((photo) => (
                          <div key={photo.id} className="space-y-2">
                            <img
                              src={photo.url || "/placeholder.svg"}
                              alt={photo.caption}
                              className="w-full h-48 object-cover rounded-lg border"
                            />
                            <div className="space-y-1">
                              <p className="text-sm font-medium">{photo.caption}</p>
                              <p className="text-xs text-gray-500">
                                By {photo.uploadedBy} • {format(new Date(photo.uploadedAt), "MMM dd, HH:mm")}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Additional Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {update.achievements && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-green-700">Achievements</h4>
                        <p className="text-sm text-gray-600">{update.achievements}</p>
                      </div>
                    )}
                    {update.challenges && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-orange-700">Challenges</h4>
                        <p className="text-sm text-gray-600">{update.challenges}</p>
                      </div>
                    )}
                    {update.nextSteps && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-blue-700">Next Steps</h4>
                        <p className="text-sm text-gray-600">{update.nextSteps}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
