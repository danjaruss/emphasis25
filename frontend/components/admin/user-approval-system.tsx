"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  MessageSquare,
  Building,
  MapPin,
  Mail,
  Phone,
  Shield,
  Search,
} from "lucide-react"

// Mock data for pending registrations
const mockPendingUsers = [
  {
    id: "pending-1",
    full_name: "Dr. Mere Ratunabuabua",
    email: "m.ratunabuabua@environment.gov.fj",
    organization_type: "government",
    organization_name: "Ministry of Environment, Fiji",
    country: "Fiji",
    job_title: "Climate Change Specialist",
    phone_number: "+679 123 4567",
    website: "https://environment.gov.fj",
    focus_areas: ["Climate Change Adaptation", "Marine Conservation"],
    project_experience:
      "10+ years in climate adaptation projects across Pacific islands. Led implementation of National Adaptation Plan for Fiji.",
    motivation:
      "Want to collaborate with other Pacific islands on climate resilience projects and share best practices.",
    submitted_at: "2024-01-20T10:30:00Z",
    status: "pending",
    priority: "high",
    verification_status: {
      email_verified: true,
      organization_verified: false,
      documents_submitted: true,
    },
    submitted_documents: [
      { name: "Government ID", type: "identification", status: "verified" },
      { name: "Employment Letter", type: "employment", status: "pending" },
    ],
    admin_notes: [],
  },
  {
    id: "pending-2",
    full_name: "Salote Nasau",
    email: "s.nasau@wwf.org.fj",
    organization_type: "ngo",
    organization_name: "WWF Pacific",
    country: "Fiji",
    job_title: "Marine Conservation Program Manager",
    phone_number: "+679 987 6543",
    website: "https://wwf.org.fj",
    focus_areas: ["Marine Conservation", "Biodiversity Conservation"],
    project_experience: "8 years managing marine protected areas and community-based conservation programs.",
    motivation: "Looking to expand our conservation network and collaborate on regional marine protection initiatives.",
    submitted_at: "2024-01-19T14:22:00Z",
    status: "pending",
    priority: "medium",
    verification_status: {
      email_verified: true,
      organization_verified: true,
      documents_submitted: false,
    },
    submitted_documents: [{ name: "NGO Registration", type: "organization", status: "verified" }],
    admin_notes: [
      {
        id: "note-1",
        admin_name: "Sarah Johnson",
        message: "Organization verified. Waiting for employment verification.",
        timestamp: "2024-01-19T16:00:00Z",
      },
    ],
  },
  {
    id: "pending-3",
    full_name: "Dr. James Mitchell",
    email: "j.mitchell@consultant.com",
    organization_type: "individual",
    organization_name: "Independent Consultant",
    country: "Barbados",
    job_title: "Sustainable Development Consultant",
    phone_number: "+1 246 555 0123",
    website: "https://jamesmitchell.consulting",
    focus_areas: ["Sustainable Tourism", "Economic Development"],
    project_experience: "15 years consulting on sustainable tourism development across Caribbean islands.",
    motivation: "Seeking to contribute expertise to regional sustainable development initiatives.",
    submitted_at: "2024-01-18T09:15:00Z",
    status: "under_review",
    priority: "low",
    verification_status: {
      email_verified: true,
      organization_verified: false,
      documents_submitted: true,
    },
    submitted_documents: [
      { name: "Professional License", type: "professional", status: "pending" },
      { name: "Portfolio", type: "portfolio", status: "verified" },
    ],
    admin_notes: [
      {
        id: "note-2",
        admin_name: "Marcus Williams",
        message: "Need to verify consulting credentials. Requested additional documentation.",
        timestamp: "2024-01-18T11:30:00Z",
      },
    ],
  },
]

interface UserApprovalSystemProps {
  jurisdiction?: string
  isSuperAdmin?: boolean
}

export function UserApprovalSystem({ jurisdiction, isSuperAdmin = false }: UserApprovalSystemProps) {
  const [pendingUsers, setPendingUsers] = useState(mockPendingUsers)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [approvalAction, setApprovalAction] = useState<"approve" | "reject" | null>(null)
  const [approvalMessage, setApprovalMessage] = useState("")
  const [adminNote, setAdminNote] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterPriority, setFilterPriority] = useState("all")

  // Filter users based on jurisdiction for regular admins
  const filteredUsers = pendingUsers.filter((user) => {
    const matchesJurisdiction = isSuperAdmin || !jurisdiction || user.country === jurisdiction
    const matchesSearch =
      user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.organization_name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || user.status === filterStatus
    const matchesPriority = filterPriority === "all" || user.priority === filterPriority

    return matchesJurisdiction && matchesSearch && matchesStatus && matchesPriority
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending Review</Badge>
      case "under_review":
        return <Badge className="bg-blue-100 text-blue-800">Under Review</Badge>
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge className="bg-red-100 text-red-800">High Priority</Badge>
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800">Medium Priority</Badge>
      case "low":
        return <Badge className="bg-blue-100 text-blue-800">Low Priority</Badge>
      default:
        return <Badge variant="secondary">{priority}</Badge>
    }
  }

  const getOrgTypeIcon = (type: string) => {
    switch (type) {
      case "government":
        return <Shield className="h-4 w-4 text-blue-600" />
      case "ngo":
        return <Users className="h-4 w-4 text-green-600" />
      case "academic":
        return <Building className="h-4 w-4 text-purple-600" />
      case "private":
        return <Building className="h-4 w-4 text-orange-600" />
      case "individual":
        return <Users className="h-4 w-4 text-gray-600" />
      default:
        return <Users className="h-4 w-4" />
    }
  }

  const getVerificationIcon = (verified: boolean) => {
    return verified ? <CheckCircle className="h-4 w-4 text-green-600" /> : <XCircle className="h-4 w-4 text-red-600" />
  }

  const handleApproval = async (userId: string, action: "approve" | "reject", message: string) => {
    try {
      // In a real app, this would call your API
      console.log(`${action} user ${userId} with message: ${message}`)

      // Update user status
      setPendingUsers((prev) =>
        prev.map((user) =>
          user.id === userId
            ? {
                ...user,
                status: action === "approve" ? "approved" : "rejected",
                admin_notes: [
                  ...user.admin_notes,
                  {
                    id: `note-${Date.now()}`,
                    admin_name: "Current Admin",
                    message: `${action === "approve" ? "Approved" : "Rejected"}: ${message}`,
                    timestamp: new Date().toISOString(),
                  },
                ],
              }
            : user,
        ),
      )

      // Send email notification (mock)
      await sendApprovalEmail(userId, action, message)

      setApprovalAction(null)
      setApprovalMessage("")
      setSelectedUser(null)
    } catch (error) {
      console.error("Error processing approval:", error)
    }
  }

  const addAdminNote = async (userId: string, note: string) => {
    setPendingUsers((prev) =>
      prev.map((user) =>
        user.id === userId
          ? {
              ...user,
              admin_notes: [
                ...user.admin_notes,
                {
                  id: `note-${Date.now()}`,
                  admin_name: "Current Admin",
                  message: note,
                  timestamp: new Date().toISOString(),
                },
              ],
            }
          : user,
      ),
    )
    setAdminNote("")
  }

  const sendApprovalEmail = async (userId: string, action: "approve" | "reject", message: string) => {
    // Mock email sending
    console.log(`📧 Sending ${action} email to user ${userId}`)
    return new Promise((resolve) => setTimeout(resolve, 1000))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-emphasis-navy">User Registration Approvals</h2>
          <p className="text-gray-600">
            {isSuperAdmin ? "Global user registration management" : `Manage registrations for ${jurisdiction}`}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className="bg-yellow-100 text-yellow-800">{filteredUsers.length} pending</Badge>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filter & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or organization..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="under_review">Under Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="high">High Priority</SelectItem>
                <SelectItem value="medium">Medium Priority</SelectItem>
                <SelectItem value="low">Low Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Pending Users List */}
      <div className="space-y-4">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="border-l-4 border-l-yellow-500">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-green-500 text-white">
                      {user.full_name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold">{user.full_name}</h3>
                      {getOrgTypeIcon(user.organization_type)}
                      {getStatusBadge(user.status)}
                      {getPriorityBadge(user.priority)}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4" />
                          <span>{user.email}</span>
                          {getVerificationIcon(user.verification_status.email_verified)}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Building className="h-4 w-4" />
                          <span>{user.organization_name}</span>
                          {getVerificationIcon(user.verification_status.organization_verified)}
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4" />
                          <span>{user.country}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4" />
                          <span>{user.job_title}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4" />
                          <span>{user.phone_number}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4" />
                          <span>Submitted {formatDate(user.submitted_at)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3">
                      <div className="flex flex-wrap gap-1">
                        {user.focus_areas.map((area) => (
                          <Badge key={area} variant="outline" className="text-xs">
                            {area}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {user.admin_notes.length > 0 && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                        <h4 className="text-sm font-medium text-blue-900 mb-2">Admin Notes:</h4>
                        <div className="space-y-1">
                          {user.admin_notes.map((note) => (
                            <div key={note.id} className="text-sm text-blue-800">
                              <span className="font-medium">{note.admin_name}:</span> {note.message}
                              <span className="text-blue-600 ml-2">({formatDate(note.timestamp)})</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col space-y-2 ml-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedUser(user)}
                        className="whitespace-nowrap"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Review
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>User Registration Review</DialogTitle>
                        <DialogDescription>Review and approve or reject this user registration</DialogDescription>
                      </DialogHeader>

                      {selectedUser && (
                        <div className="space-y-6">
                          {/* User Details */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h3 className="font-semibold mb-3">Personal Information</h3>
                              <div className="space-y-2 text-sm">
                                <div>
                                  <strong>Name:</strong> {selectedUser.full_name}
                                </div>
                                <div>
                                  <strong>Email:</strong> {selectedUser.email}
                                </div>
                                <div>
                                  <strong>Phone:</strong> {selectedUser.phone_number}
                                </div>
                                <div>
                                  <strong>Country:</strong> {selectedUser.country}
                                </div>
                                {selectedUser.website && (
                                  <div>
                                    <strong>Website:</strong>{" "}
                                    <a
                                      href={selectedUser.website}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:underline"
                                    >
                                      {selectedUser.website}
                                    </a>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div>
                              <h3 className="font-semibold mb-3">Organization Details</h3>
                              <div className="space-y-2 text-sm">
                                <div>
                                  <strong>Organization:</strong> {selectedUser.organization_name}
                                </div>
                                <div>
                                  <strong>Type:</strong> {selectedUser.organization_type}
                                </div>
                                <div>
                                  <strong>Job Title:</strong> {selectedUser.job_title}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Experience & Motivation */}
                          <div>
                            <h3 className="font-semibold mb-3">Experience & Motivation</h3>
                            <div className="space-y-4">
                              <div>
                                <strong>Project Experience:</strong>
                                <p className="text-sm text-gray-600 mt-1">{selectedUser.project_experience}</p>
                              </div>
                              <div>
                                <strong>Motivation:</strong>
                                <p className="text-sm text-gray-600 mt-1">{selectedUser.motivation}</p>
                              </div>
                            </div>
                          </div>

                          {/* Focus Areas */}
                          <div>
                            <h3 className="font-semibold mb-3">Focus Areas</h3>
                            <div className="flex flex-wrap gap-2">
                              {selectedUser.focus_areas.map((area: string) => (
                                <Badge key={area} variant="outline">
                                  {area}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {/* Verification Status */}
                          <div>
                            <h3 className="font-semibold mb-3">Verification Status</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="flex items-center space-x-2">
                                {getVerificationIcon(selectedUser.verification_status.email_verified)}
                                <span className="text-sm">Email Verified</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                {getVerificationIcon(selectedUser.verification_status.organization_verified)}
                                <span className="text-sm">Organization Verified</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                {getVerificationIcon(selectedUser.verification_status.documents_submitted)}
                                <span className="text-sm">Documents Submitted</span>
                              </div>
                            </div>
                          </div>

                          {/* Submitted Documents */}
                          {selectedUser.submitted_documents.length > 0 && (
                            <div>
                              <h3 className="font-semibold mb-3">Submitted Documents</h3>
                              <div className="space-y-2">
                                {selectedUser.submitted_documents.map((doc: any, index: number) => (
                                  <div key={index} className="flex items-center justify-between p-2 border rounded">
                                    <span className="text-sm">{doc.name}</span>
                                    <div className="flex items-center space-x-2">
                                      <Badge
                                        variant={doc.status === "verified" ? "default" : "secondary"}
                                        className={
                                          doc.status === "verified"
                                            ? "bg-green-100 text-green-800"
                                            : "bg-yellow-100 text-yellow-800"
                                        }
                                      >
                                        {doc.status}
                                      </Badge>
                                      <Button variant="outline" size="sm">
                                        <Eye className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Admin Notes */}
                          <div>
                            <h3 className="font-semibold mb-3">Admin Notes</h3>
                            <div className="space-y-3">
                              {selectedUser.admin_notes.map((note: any) => (
                                <div key={note.id} className="p-3 bg-gray-50 rounded-lg">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <span className="font-medium text-sm">{note.admin_name}</span>
                                      <p className="text-sm text-gray-600 mt-1">{note.message}</p>
                                    </div>
                                    <span className="text-xs text-gray-500">{formatDate(note.timestamp)}</span>
                                  </div>
                                </div>
                              ))}

                              {/* Add New Note */}
                              <div className="space-y-2">
                                <Label htmlFor="admin-note">Add Admin Note</Label>
                                <div className="flex space-x-2">
                                  <Textarea
                                    id="admin-note"
                                    placeholder="Add a note about this registration..."
                                    value={adminNote}
                                    onChange={(e) => setAdminNote(e.target.value)}
                                    className="flex-1"
                                  />
                                  <Button
                                    onClick={() => addAdminNote(selectedUser.id, adminNote)}
                                    disabled={!adminNote.trim()}
                                    size="sm"
                                  >
                                    <MessageSquare className="h-4 w-4 mr-2" />
                                    Add Note
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Approval Actions */}
                          <div className="border-t pt-6">
                            <h3 className="font-semibold mb-3">Approval Decision</h3>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="approval-message">Message to User</Label>
                                <Textarea
                                  id="approval-message"
                                  placeholder="Enter a message to include in the approval/rejection email..."
                                  value={approvalMessage}
                                  onChange={(e) => setApprovalMessage(e.target.value)}
                                />
                              </div>

                              <div className="flex space-x-3">
                                <Button
                                  onClick={() => handleApproval(selectedUser.id, "approve", approvalMessage)}
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                  disabled={!approvalMessage.trim()}
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Approve Registration
                                </Button>
                                <Button
                                  onClick={() => handleApproval(selectedUser.id, "reject", approvalMessage)}
                                  variant="destructive"
                                  disabled={!approvalMessage.trim()}
                                >
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Reject Registration
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>

                  {user.status === "pending" && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => handleApproval(user.id, "approve", "Registration approved")}
                        className="bg-green-600 hover:bg-green-700 text-white whitespace-nowrap"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Quick Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleApproval(user.id, "reject", "Registration rejected")}
                        className="whitespace-nowrap"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredUsers.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No pending registrations</h3>
              <p className="text-gray-600">All user registrations have been processed.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
