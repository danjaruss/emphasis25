"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { apiClient } from "@/lib/api"
import { useAuth } from "@/components/auth/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { Users, Search, Filter, Mail, Phone, Building, MapPin, Edit, Trash2, UserPlus } from "lucide-react"

interface Stakeholder {
  id: string
  name: string
  email: string
  phone?: string
  organization: string
  position: string
  category: string
  location?: string
  expertise: string[]
  contact_preference: string
  notes?: string
  created_at: string
  created_by: string
}

interface StakeholderFormData {
  name: string
  email: string
  phone: string
  organization: string
  position: string
  category: string
  location: string
  expertise: string[]
  contact_preference: string
  notes: string
}

const stakeholderCategories = [
  "Government Agencies",
  "NGOs & Civil Society",
  "International Partners",
  "Private Sector",
  "Academic Institutions",
  "Community Leaders",
  "Technical Experts",
  "Funding Organizations",
]

const expertiseAreas = [
  "Climate Change",
  "Marine Conservation",
  "Renewable Energy",
  "Sustainable Tourism",
  "Community Development",
  "Policy & Governance",
  "Finance & Economics",
  "Technology & Innovation",
  "Education & Training",
  "Health & Wellbeing",
  "Infrastructure",
  "Agriculture & Food Security",
]

const contactPreferences = ["Email", "Phone", "Video Call", "In-Person Meeting", "Written Communication"]

export function StakeholderManager() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>([])
  const [filteredStakeholders, setFilteredStakeholders] = useState<Stakeholder[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingStakeholder, setEditingStakeholder] = useState<Stakeholder | null>(null)
  const [formData, setFormData] = useState<StakeholderFormData>({
    name: "",
    email: "",
    phone: "",
    organization: "",
    position: "",
    category: "",
    location: "",
    expertise: [],
    contact_preference: "",
    notes: "",
  })

  useEffect(() => {
    loadStakeholders()
  }, [])

  useEffect(() => {
    filterStakeholders()
  }, [stakeholders, searchTerm, categoryFilter])

  const loadStakeholders = async () => {
    try {
      setIsLoading(true)
      const data = await apiClient.getStakeholders()
      setStakeholders(data || [])
    } catch (error) {
      console.error("Error loading stakeholders:", error)
      toast({
        title: "Error",
        description: "Failed to load stakeholders",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filterStakeholders = () => {
    let filtered = stakeholders

    if (searchTerm) {
      filtered = filtered.filter(
        (stakeholder) =>
          stakeholder.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          stakeholder.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
          stakeholder.email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((stakeholder) => stakeholder.category === categoryFilter)
    }

    setFilteredStakeholders(filtered)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    try {
      const stakeholderData = {
        ...formData,
        created_by: user.id,
        expertise: formData.expertise,
      }

      if (editingStakeholder) {
        await apiClient.updateStakeholder(editingStakeholder.id, stakeholderData)

        toast({
          title: "Success",
          description: "Stakeholder updated successfully",
        })
      } else {
        await apiClient.createStakeholder(stakeholderData)

        toast({
          title: "Success",
          description: "Stakeholder added successfully",
        })
      }

      setIsDialogOpen(false)
      setEditingStakeholder(null)
      resetForm()
      loadStakeholders()
    } catch (error) {
      console.error("Error saving stakeholder:", error)
      toast({
        title: "Error",
        description: "Failed to save stakeholder",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (stakeholder: Stakeholder) => {
    setEditingStakeholder(stakeholder)
    setFormData({
      name: stakeholder.name,
      email: stakeholder.email,
      phone: stakeholder.phone || "",
      organization: stakeholder.organization,
      position: stakeholder.position,
      category: stakeholder.category,
      location: stakeholder.location || "",
      expertise: stakeholder.expertise || [],
      contact_preference: stakeholder.contact_preference,
      notes: stakeholder.notes || "",
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (stakeholder: Stakeholder) => {
    if (!confirm(`Are you sure you want to delete ${stakeholder.name}?`)) return

    try {
      await apiClient.deleteStakeholder(stakeholder.id)

      toast({
        title: "Success",
        description: "Stakeholder deleted successfully",
      })
      loadStakeholders()
    } catch (error) {
      console.error("Error deleting stakeholder:", error)
      toast({
        title: "Error",
        description: "Failed to delete stakeholder",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      organization: "",
      position: "",
      category: "",
      location: "",
      expertise: [],
      contact_preference: "",
      notes: "",
    })
  }

  const toggleExpertise = (area: string) => {
    setFormData((prev) => ({
      ...prev,
      expertise: prev.expertise.includes(area) ? prev.expertise.filter((e) => e !== area) : [...prev.expertise, area],
    }))
  }

  const getCategoryStats = () => {
    const stats = stakeholderCategories.map((category) => ({
      category,
      count: stakeholders.filter((s) => s.category === category).length,
    }))
    return stats
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Stakeholder Management</h2>
          <p className="text-gray-600">Manage your project stakeholders and partners</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                resetForm()
                setEditingStakeholder(null)
              }}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add Stakeholder
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingStakeholder ? "Edit Stakeholder" : "Add New Stakeholder"}</DialogTitle>
              <DialogDescription>
                {editingStakeholder ? "Update stakeholder information" : "Add a new stakeholder to your network"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="organization">Organization *</Label>
                  <Input
                    id="organization"
                    value={formData.organization}
                    onChange={(e) => setFormData((prev) => ({ ...prev, organization: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">Position *</Label>
                  <Input
                    id="position"
                    value={formData.position}
                    onChange={(e) => setFormData((prev) => ({ ...prev, position: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {stakeholderCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
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
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact_preference">Preferred Contact Method</Label>
                  <Select
                    value={formData.contact_preference}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, contact_preference: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select preference" />
                    </SelectTrigger>
                    <SelectContent>
                      {contactPreferences.map((pref) => (
                        <SelectItem key={pref} value={pref}>
                          {pref}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Areas of Expertise</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {expertiseAreas.map((area) => (
                    <div key={area} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={area}
                        checked={formData.expertise.includes(area)}
                        onChange={() => toggleExpertise(area)}
                        className="rounded"
                      />
                      <Label htmlFor={area} className="text-sm cursor-pointer">
                        {area}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                  placeholder="Additional notes about this stakeholder..."
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">{editingStakeholder ? "Update" : "Add"} Stakeholder</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="directory" className="space-y-6">
        <TabsList>
          <TabsTrigger value="directory">Directory</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="directory" className="space-y-6">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search stakeholders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[200px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {stakeholderCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Stakeholder Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredStakeholders.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-24 w-24 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No stakeholders found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || categoryFilter !== "all"
                  ? "Try adjusting your search or filters"
                  : "Get started by adding your first stakeholder"}
              </p>
              {!searchTerm && categoryFilter === "all" && (
                <Button onClick={() => setIsDialogOpen(true)}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add First Stakeholder
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStakeholders.map((stakeholder) => (
                <Card key={stakeholder.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarFallback>
                            {stakeholder.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{stakeholder.name}</CardTitle>
                          <CardDescription>{stakeholder.position}</CardDescription>
                        </div>
                      </div>
                      <Badge variant="outline">{stakeholder.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Building className="h-4 w-4 mr-2" />
                      {stakeholder.organization}
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="h-4 w-4 mr-2" />
                      {stakeholder.email}
                    </div>

                    {stakeholder.phone && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="h-4 w-4 mr-2" />
                        {stakeholder.phone}
                      </div>
                    )}

                    {stakeholder.location && (
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        {stakeholder.location}
                      </div>
                    )}

                    {stakeholder.expertise && stakeholder.expertise.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-1">Expertise:</p>
                        <div className="flex flex-wrap gap-1">
                          {stakeholder.expertise.slice(0, 3).map((area) => (
                            <Badge key={area} variant="secondary" className="text-xs">
                              {area}
                            </Badge>
                          ))}
                          {stakeholder.expertise.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{stakeholder.expertise.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-2">
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(stakeholder)}>
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(stakeholder)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="flex space-x-1">
                        <Button size="sm" variant="ghost" asChild>
                          <a href={`mailto:${stakeholder.email}`}>
                            <Mail className="h-3 w-3" />
                          </a>
                        </Button>
                        {stakeholder.phone && (
                          <Button size="sm" variant="ghost" asChild>
                            <a href={`tel:${stakeholder.phone}`}>
                              <Phone className="h-3 w-3" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getCategoryStats().map(({ category, count }) => (
              <Card key={category}>
                <CardHeader>
                  <CardTitle className="text-lg">{category}</CardTitle>
                  <CardDescription>{count} stakeholders</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {stakeholders
                      .filter((s) => s.category === category)
                      .slice(0, 3)
                      .map((stakeholder) => (
                        <div key={stakeholder.id} className="flex justify-between text-sm">
                          <span>{stakeholder.name}</span>
                          <span className="text-gray-500">{stakeholder.organization}</span>
                        </div>
                      ))}
                    {count > 3 && <div className="text-sm text-gray-500">+{count - 3} more stakeholders</div>}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Total Stakeholders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stakeholders.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{getCategoryStats().filter((s) => s.count > 0).length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Organizations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{new Set(stakeholders.map((s) => s.organization)).size}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Expertise Areas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{new Set(stakeholders.flatMap((s) => s.expertise || [])).size}</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Top Expertise Areas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(
                  stakeholders
                    .flatMap((s) => s.expertise || [])
                    .reduce(
                      (acc, area) => {
                        acc[area] = (acc[area] || 0) + 1
                        return acc
                      },
                      {} as Record<string, number>,
                    ),
                )
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 10)
                  .map(([area, count]) => (
                    <div key={area} className="flex justify-between items-center">
                      <span className="text-sm">{area}</span>
                      <Badge variant="secondary">{count} experts</Badge>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
