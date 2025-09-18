"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"

import { Loader2, Building, Globe, Users, Shield, CheckCircle, Clock } from "lucide-react"
import { apiClient } from "@/lib/api"

const ORGANIZATION_TYPES = [
  { value: "government", label: "Government Agency", icon: Shield },
  { value: "ngo", label: "Non-Governmental Organization", icon: Users },
  { value: "international", label: "International Organization", icon: Globe },
  { value: "private", label: "Private Sector", icon: Building },
  { value: "academic", label: "Academic Institution", icon: Users },
  { value: "community", label: "Community Organization", icon: Users },
  { value: "individual", label: "Individual Consultant", icon: Users },
]

const ISLAND_COUNTRIES = [
  "Antigua and Barbuda",
  "Bahamas",
  "Bahrain",
  "Barbados",
  "Cabo Verde",
  "Comoros",
  "Cook Islands",
  "Cuba",
  "Cyprus",
  "Dominica",
  "Dominican Republic",
  "Fiji",
  "Grenada",
  "Haiti",
  "Iceland",
  "Jamaica",
  "Kiribati",
  "Maldives",
  "Malta",
  "Marshall Islands",
  "Mauritius",
  "Micronesia",
  "Nauru",
  "New Zealand",
  "Niue",
  "Palau",
  "Papua New Guinea",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "São Tomé and Príncipe",
  "Seychelles",
  "Singapore",
  "Solomon Islands",
  "Sri Lanka",
  "Timor-Leste",
  "Tonga",
  "Trinidad and Tobago",
  "Tuvalu",
  "Vanuatu",
  "Other",
]

const FOCUS_AREAS = [
  "Climate Change Adaptation",
  "Renewable Energy",
  "Marine Conservation",
  "Sustainable Tourism",
  "Water Management",
  "Waste Management",
  "Disaster Risk Reduction",
  "Food Security",
  "Healthcare",
  "Education",
  "Digital Infrastructure",
  "Economic Development",
  "Biodiversity Conservation",
]

interface EnhancedSignupFormProps {
  onSuccess?: () => void
}

export function EnhancedSignupForm({ onSuccess }: EnhancedSignupFormProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    jobTitle: "",
    organizationType: "",
    organizationName: "",
    country: "",
    phoneNumber: "",
    website: "",
    focusAreas: [] as string[],
    projectExperience: "",
    motivation: "",
    agreeToTerms: false,
    subscribeToUpdates: true,
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const router = useRouter()

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFocusAreaToggle = (area: string) => {
    setFormData((prev) => ({
      ...prev,
      focusAreas: prev.focusAreas.includes(area)
        ? prev.focusAreas.filter((a) => a !== area)
        : [...prev.focusAreas, area],
    }))
  }

  const validateStep = (stepNumber: number) => {
    switch (stepNumber) {
      case 1:
        return (
          formData.email &&
          formData.password &&
          formData.confirmPassword &&
          formData.fullName &&
          formData.password === formData.confirmPassword
        )
      case 2:
        return formData.organizationType && formData.country
      case 3:
        return formData.agreeToTerms
      default:
        return true
    }
  }

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1)
      setError(null)
    } else {
      setError("Please fill in all required fields")
    }
  }

  const handleBack = () => {
    setStep(step - 1)
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (!formData.agreeToTerms) {
      setError("Please agree to the terms and conditions")
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Split full name into first and last name
      const [firstName, ...lastNameParts] = formData.fullName.split(' ')
      const lastName = lastNameParts.join(' ')

      // Create username from email
      const username = formData.email.split('@')[0]

      await apiClient.register({
        username,
        email: formData.email,
        password: formData.password,
        first_name: firstName,
        last_name: lastName,
        organization_type: formData.organizationType,
        organization_name: formData.organizationName,
        country: formData.country,
        phone_number: formData.phoneNumber,
        website: formData.website,
        job_title: formData.jobTitle,
        focus_areas: formData.focusAreas,
        project_experience: formData.projectExperience,
        motivation: formData.motivation,
        subscribe_to_updates: formData.subscribeToUpdates,
      })

      setSubmitted(true)
    } catch (err) {
      console.error("Sign up error:", err)
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  // Show success message after submission
  if (submitted) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-fit">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-800">Registration Submitted!</CardTitle>
          <CardDescription className="text-lg">Your account is pending approval</CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <Alert className="border-blue-200 bg-blue-50">
            <Clock className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>What happens next?</strong>
              <br />
              Your registration has been submitted to the appropriate administrators for review. You will receive an
              email notification once your account has been approved.
            </AlertDescription>
          </Alert>

          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-center justify-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Registration details submitted</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Clock className="h-4 w-4 text-yellow-600" />
              <span>Pending admin review</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Clock className="h-4 w-4 text-gray-400" />
              <span>Email confirmation (after approval)</span>
            </div>
          </div>

          <div className="pt-4">
            <p className="text-sm text-gray-600 mb-4">
              Approval typically takes 1-2 business days. If you have any questions, please contact support.
            </p>
            <Button onClick={() => router.push("/")} className="bg-emphasis-teal hover:bg-emphasis-navy">
              Return to Homepage
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-emphasis-navy">Account Information</h3>
        <p className="text-sm text-gray-600">Let's start with your basic account details</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name *</Label>
        <Input
          id="fullName"
          type="text"
          value={formData.fullName}
          onChange={(e) => handleInputChange("fullName", e.target.value)}
          placeholder="Enter your full name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email Address *</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          placeholder="Enter your email address"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password *</Label>
        <Input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) => handleInputChange("password", e.target.value)}
          placeholder="Create a secure password"
          minLength={8}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password *</Label>
        <Input
          id="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
          placeholder="Confirm your password"
          required
        />
      </div>

      {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
        <Alert className="border-red-200 bg-red-50">
          <AlertDescription className="text-red-600">Passwords do not match</AlertDescription>
        </Alert>
      )}
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-emphasis-navy">Organization & Location</h3>
        <p className="text-sm text-gray-600">Tell us about your organization and location</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="organizationType">Organization Type *</Label>
        <Select
          value={formData.organizationType}
          onValueChange={(value) => handleInputChange("organizationType", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select your organization type" />
          </SelectTrigger>
          <SelectContent>
            {ORGANIZATION_TYPES.map((type) => {
              const Icon = type.icon
              return (
                <SelectItem key={type.value} value={type.value}>
                  <div className="flex items-center space-x-2">
                    <Icon className="h-4 w-4" />
                    <span>{type.label}</span>
                  </div>
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="organizationName">Organization Name</Label>
        <Input
          id="organizationName"
          type="text"
          value={formData.organizationName}
          onChange={(e) => handleInputChange("organizationName", e.target.value)}
          placeholder="Enter your organization name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="jobTitle">Job Title/Position</Label>
        <Input
          id="jobTitle"
          type="text"
          value={formData.jobTitle}
          onChange={(e) => handleInputChange("jobTitle", e.target.value)}
          placeholder="Enter your job title or position"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="country">Country/Territory *</Label>
        <Select value={formData.country} onValueChange={(value) => handleInputChange("country", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select your country or territory" />
          </SelectTrigger>
          <SelectContent>
            {ISLAND_COUNTRIES.map((country) => (
              <SelectItem key={country} value={country}>
                {country}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phoneNumber">Phone Number</Label>
        <Input
          id="phoneNumber"
          type="tel"
          value={formData.phoneNumber}
          onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
          placeholder="Enter your phone number"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="website">Website (Optional)</Label>
        <Input
          id="website"
          type="url"
          value={formData.website}
          onChange={(e) => handleInputChange("website", e.target.value)}
          placeholder="https://your-organization.com"
        />
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-emphasis-navy">Areas of Interest</h3>
        <p className="text-sm text-gray-600">Help us understand your focus areas and experience</p>
      </div>

      <div className="space-y-2">
        <Label>Focus Areas (Select all that apply)</Label>
        <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border rounded-md p-3">
          {FOCUS_AREAS.map((area) => (
            <div key={area} className="flex items-center space-x-2">
              <Checkbox
                id={area}
                checked={formData.focusAreas.includes(area)}
                onCheckedChange={() => handleFocusAreaToggle(area)}
              />
              <Label htmlFor={area} className="text-sm font-normal cursor-pointer">
                {area}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="projectExperience">Project Experience</Label>
        <Textarea
          id="projectExperience"
          value={formData.projectExperience}
          onChange={(e) => handleInputChange("projectExperience", e.target.value)}
          placeholder="Briefly describe your experience with sustainable development projects..."
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="motivation">Why are you interested in Project EMPHASIS?</Label>
        <Textarea
          id="motivation"
          value={formData.motivation}
          onChange={(e) => handleInputChange("motivation", e.target.value)}
          placeholder="Tell us what motivates you to work on sustainable island development..."
          rows={3}
        />
      </div>

      <div className="space-y-4 pt-4 border-t">
        <div className="flex items-start space-x-2">
          <Checkbox
            id="agreeToTerms"
            checked={formData.agreeToTerms}
            onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked)}
            required
          />
          <Label htmlFor="agreeToTerms" className="text-sm font-normal cursor-pointer">
            I agree to the{" "}
            <a href="/terms" className="text-emphasis-teal hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="text-emphasis-teal hover:underline">
              Privacy Policy
            </a>{" "}
            *
          </Label>
        </div>

        <div className="flex items-start space-x-2">
          <Checkbox
            id="subscribeToUpdates"
            checked={formData.subscribeToUpdates}
            onCheckedChange={(checked) => handleInputChange("subscribeToUpdates", checked)}
          />
          <Label htmlFor="subscribeToUpdates" className="text-sm font-normal cursor-pointer">
            Subscribe to project updates and newsletters
          </Label>
        </div>
      </div>

      <Alert className="border-blue-200 bg-blue-50">
        <Clock className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>Admin Approval Required:</strong> Your registration will be reviewed by administrators before your
          account is activated. You'll receive an email notification once approved.
        </AlertDescription>
      </Alert>
    </div>
  )

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Join Project EMPHASIS</span>
          <span className="text-sm font-normal text-gray-500">Step {step} of 3</span>
        </CardTitle>
        <CardDescription>Create your account to start managing sustainable development projects</CardDescription>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
          <div
            className="bg-emphasis-teal h-2 rounded-full transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit}>
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}

          {error && (
            <Alert className="border-red-200 bg-red-50 mt-4">
              <AlertDescription className="text-red-600">{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-between mt-6">
            {step > 1 && (
              <Button type="button" variant="outline" onClick={handleBack}>
                Back
              </Button>
            )}

            <div className="ml-auto">
              {step < 3 ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={!validateStep(step)}
                  className="bg-emphasis-teal hover:bg-emphasis-navy"
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={loading || !validateStep(step)}
                  className="bg-emphasis-teal hover:bg-emphasis-navy"
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Submit Registration
                </Button>
              )}
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
