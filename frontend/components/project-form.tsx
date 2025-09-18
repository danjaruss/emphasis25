"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Target, Save, Users, Calendar, AlertTriangle, TrendingUp, Plus, X, CheckCircle, Download, Loader2 } from "lucide-react"
import { apiClient } from "@/lib/api"

interface SDGGoal {
  id: number
  number: number
  title: string
  shortened_title: string
  color: string
  description: string
}

interface Milestone {
  name: string
  description: string
  date: string
}

interface ProjectFormData {
  // Basic Information
  name: string
  description: string
  selectedSDGs: number[]
  selectedSDGTargets: number[]
  projectType: string
  priority: string

  // Timeline & Budget
  startDate: string
  endDate: string
  budget: string
  fundingSources: string[]

  // Location & Scope
  location: string
  geographicScope: string

  // Objectives & Metrics
  objectives: string[]
  successMetrics: string[]

  // Stakeholders
  assignedStakeholders: string[]

  // Risk Assessment
  riskLevel: string
  riskFactors: string[]

  // Milestones
  milestones: Milestone[]
}

interface ProjectFormProps {
  onSubmit: (data: ProjectFormData) => void
  onCancel: () => void
  initialData?: Partial<ProjectFormData>
  isEditing?: boolean
  templateName?: string
}

const fundingSourceOptions = [
  "Government Budget",
  "International Donors",
  "Private Investment",
  "Green Climate Fund",
  "World Bank",
  "Asian Development Bank",
  "EU Funding",
  "UN Agencies",
  "NGO Partnerships",
  "Community Contributions",
]

const stakeholderOptions = [
  "Government Agencies",
  "Local Communities",
  "International Partners",
  "Private Sector",
  "NGOs",
  "Academic Institutions",
  "Technical Experts",
  "Community Leaders",
]

const riskFactorOptions = [
  "Climate Change Impacts",
  "Funding Shortfalls",
  "Technical Challenges",
  "Community Resistance",
  "Regulatory Delays",
  "Environmental Concerns",
  "Political Instability",
  "Supply Chain Issues",
  "Capacity Constraints",
  "External Dependencies",
]

export default function ProjectForm({
  onSubmit,
  onCancel,
  initialData,
  isEditing = false,
  templateName,
}: ProjectFormProps) {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("basic")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isExportingPDF, setIsExportingPDF] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [autoSaveStatus, setAutoSaveStatus] = useState<"saved" | "saving" | "unsaved">("saved")
  const previewRef = useRef<HTMLDivElement>(null)

  const [pdfSettings, setPdfSettings] = useState({
    includeLogo: true,
    logoPosition: "header" as "header" | "footer",
    organizationName: "Project EMPHASIS",
    logoType: "color" as "color" | "black" | "mark",
    theme: "emphasis" as "professional" | "modern" | "minimal" | "emphasis",
    includeWatermark: false,
    customColors: {
      primary: "#272f51", // EMPHASIS Navy
      secondary: "#22504f", // EMPHASIS Teal
      accent: "#ACD7EC", // EMPHASIS Light Blue
    },
  })
  const [showPdfSettings, setShowPdfSettings] = useState(false)

  const [formData, setFormData] = useState<ProjectFormData>({
    name: initialData?.name || "",
    description: initialData?.description || "",
    selectedSDGs: initialData?.selectedSDGs || [],
    selectedSDGTargets: initialData?.selectedSDGTargets || [],
    projectType: initialData?.projectType || "",
    priority: initialData?.priority || "",
    startDate: initialData?.startDate || "",
    endDate: initialData?.endDate || "",
    budget: initialData?.budget || "",
    fundingSources: initialData?.fundingSources || [],
    location: initialData?.location || "",
    geographicScope: initialData?.geographicScope || "",
    objectives: initialData?.objectives || [""],
    successMetrics: initialData?.successMetrics || [""],
    assignedStakeholders: initialData?.assignedStakeholders || [],
    riskLevel: initialData?.riskLevel || "",
    riskFactors: initialData?.riskFactors || [],
    milestones: initialData?.milestones || [{ name: "", description: "", date: "" }],
  })

  // State for SDG goals and targets
  const [sdgGoals, setSdgGoals] = useState<SDGGoal[]>([])
  const [sdgTargets, setSdgTargets] = useState<{ [key: number]: any[] }>({})
  const [loadingTargets, setLoadingTargets] = useState<{ [key: number]: boolean }>({})
  const [loadingGoals, setLoadingGoals] = useState(true)

  // Auto-save functionality with visual feedback
  useEffect(() => {
    if (formData.name || formData.description) {
      setAutoSaveStatus("saving")
      const autoSaveTimer = setTimeout(() => {
        localStorage.setItem("projectFormDraft", JSON.stringify(formData))
        setAutoSaveStatus("saved")
        setTimeout(() => setAutoSaveStatus("unsaved"), 2000) // Show saved status for 2 seconds
      }, 2000)

      return () => clearTimeout(autoSaveTimer)
    }
  }, [formData])

  // Load draft on mount
  useEffect(() => {
    if (!initialData && !isEditing) {
      const draft = localStorage.getItem("projectFormDraft")
      if (draft) {
        try {
          const draftData = JSON.parse(draft)
          setFormData(draftData)
          toast({
            title: "Draft Restored",
            description: "Your previous work has been restored from auto-save",
          })
        } catch (error) {
          console.error("Error loading draft:", error)
        }
      }
    }
  }, [initialData, isEditing, toast])

  // Load SDG goals on mount
  useEffect(() => {
    const loadSDGGoals = async () => {
      try {
        setLoadingGoals(true)
        const response = await apiClient.getSDGGoals()
        console.log('SDG Goals API response:', response)
        // Handle paginated response from Django REST Framework
        const goals = response.results || response
        // Ensure we always have an array
        if (Array.isArray(goals)) {
          setSdgGoals(goals)
        } else {
          console.error('SDG goals API returned non-array:', goals)
          setSdgGoals([])
          toast({
            title: "Error",
            description: "Invalid SDG goals data received",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error('Error fetching SDG goals:', error)
        setSdgGoals([])
        toast({
          title: "Error",
          description: "Failed to load SDG goals",
          variant: "destructive",
        })
      } finally {
        setLoadingGoals(false)
      }
    }

    loadSDGGoals()
  }, [toast])

  const handleInputChange = (field: keyof ProjectFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const toggleSDG = async (sdgId: number) => {
    const isCurrentlySelected = formData.selectedSDGs.includes(sdgId)

    setFormData((prev) => ({
      ...prev,
      selectedSDGs: isCurrentlySelected
        ? prev.selectedSDGs.filter((id) => id !== sdgId)
        : [...prev.selectedSDGs, sdgId],
    }))

    // If selecting an SDG, fetch its targets
    if (!isCurrentlySelected && !sdgTargets[sdgId]) {
      setLoadingTargets(prev => ({ ...prev, [sdgId]: true }))
      try {
        const targets = await apiClient.getSDGTargets(sdgId)
        setSdgTargets(prev => ({ ...prev, [sdgId]: targets }))
      } catch (error) {
        console.error('Error fetching SDG targets:', error)
      } finally {
        setLoadingTargets(prev => ({ ...prev, [sdgId]: false }))
      }
    }
  }

  const toggleSDGTarget = (targetId: number) => {
    setFormData((prev) => ({
      ...prev,
      selectedSDGTargets: prev.selectedSDGTargets.includes(targetId)
        ? prev.selectedSDGTargets.filter((id) => id !== targetId)
        : [...prev.selectedSDGTargets, targetId],
    }))
  }

  const toggleArrayItem = (field: keyof ProjectFormData, item: string) => {
    setFormData((prev) => {
      const currentArray = prev[field] as string[]
      return {
        ...prev,
        [field]: currentArray.includes(item) ? currentArray.filter((i) => i !== item) : [...currentArray, item],
      }
    })
  }

  const addObjective = () => {
    setFormData((prev) => ({
      ...prev,
      objectives: [...prev.objectives, ""],
    }))
  }

  const updateObjective = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      objectives: prev.objectives.map((obj, i) => (i === index ? value : obj)),
    }))
  }

  const removeObjective = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      objectives: prev.objectives.filter((_, i) => i !== index),
    }))
  }

  const addSuccessMetric = () => {
    setFormData((prev) => ({
      ...prev,
      successMetrics: [...prev.successMetrics, ""],
    }))
  }

  const updateSuccessMetric = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      successMetrics: prev.successMetrics.map((metric, i) => (i === index ? value : metric)),
    }))
  }

  const removeSuccessMetric = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      successMetrics: prev.successMetrics.filter((_, i) => i !== index),
    }))
  }

  const addMilestone = () => {
    setFormData((prev) => ({
      ...prev,
      milestones: [...prev.milestones, { name: "", description: "", date: "" }],
    }))
  }

  const updateMilestone = (index: number, field: keyof Milestone, value: string) => {
    setFormData((prev) => ({
      ...prev,
      milestones: prev.milestones.map((milestone, i) => (i === index ? { ...milestone, [field]: value } : milestone)),
    }))
  }

  const removeMilestone = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      milestones: prev.milestones.filter((_, i) => i !== index),
    }))
  }

  const validateForm = (): { isValid: boolean; incompleteSection?: string; message?: string } => {
    const errors: Record<string, string> = {}

    // Check each section for completion
    const sections = {
      basic: {
        complete:
          formData.name.trim() &&
          formData.description.trim() &&
          formData.selectedSDGs.length > 0 &&
          formData.projectType &&
          formData.priority,
        name: "Basic Information",
      },
      timeline: {
        complete: formData.startDate && formData.endDate,
        name: "Timeline & Budget",
      },
      objectives: {
        complete: formData.objectives.some((obj) => obj.trim()),
        name: "Objectives & Success Metrics",
      },
      stakeholders: {
        complete: formData.assignedStakeholders.length > 0,
        name: "Stakeholders",
      },
      risk: {
        complete: formData.riskLevel,
        name: "Risk Assessment",
      },
      milestones: {
        complete: formData.milestones.some((m) => m.name.trim()),
        name: "Milestones",
      },
    }

    // Find first incomplete section
    const incompleteSection = Object.entries(sections).find(([key, section]) => !section.complete)

    if (incompleteSection) {
      return {
        isValid: false,
        incompleteSection: incompleteSection[0],
        message: `Please complete the "${incompleteSection[1].name}" section before creating the project.`,
      }
    }

    // Required fields validation for basic section
    if (!formData.name.trim()) errors.name = "Project name is required"
    if (!formData.description.trim()) errors.description = "Project description is required"
    if (formData.selectedSDGs.length === 0) errors.selectedSDGs = "At least one SDG must be selected"
    if (formData.selectedSDGTargets.length === 0) errors.selectedSDGTargets = "At least one SDG target must be selected"
    if (!formData.projectType) errors.projectType = "Project type is required"
    if (!formData.priority) errors.priority = "Priority level is required"

    // Date validation
    if (formData.startDate && formData.endDate) {
      if (new Date(formData.startDate) >= new Date(formData.endDate)) {
        errors.endDate = "End date must be after start date"
      }
    }

    // Budget validation
    if (formData.budget && isNaN(Number(formData.budget.replace(/,/g, "")))) {
      errors.budget = "Budget must be a valid number"
    }

    setValidationErrors(errors)
    return { isValid: Object.keys(errors).length === 0 }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const validation = validateForm()

    if (!validation.isValid) {
      if (validation.incompleteSection && validation.message) {
        // Navigate to the incomplete section
        setActiveTab(validation.incompleteSection)
        toast({
          title: "Incomplete Section",
          description: validation.message,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Validation Error",
          description: "Please fix the errors before submitting",
          variant: "destructive",
        })
      }
      return
    }

    setIsSubmitting(true)

    try {
      // Clean up data before submitting
      const cleanedData = {
        ...formData,
        objectives: formData.objectives.filter((obj) => obj.trim()),
        successMetrics: formData.successMetrics.filter((metric) => metric.trim()),
        milestones: formData.milestones.filter((milestone) => milestone.name.trim()),
      }

      await onSubmit(cleanedData)

      // Clear draft on successful submit
      localStorage.removeItem("projectFormDraft")
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getTabStatus = (tab: string) => {
    switch (tab) {
      case "basic":
        return formData.name && formData.description && formData.selectedSDGs.length > 0 && formData.selectedSDGTargets.length > 0 ? "complete" : "incomplete"
      case "timeline":
        return formData.startDate && formData.endDate ? "complete" : "incomplete"
      case "objectives":
        return formData.objectives.some((obj) => obj.trim()) ? "complete" : "incomplete"
      case "stakeholders":
        return formData.assignedStakeholders.length > 0 ? "complete" : "incomplete"
      case "risk":
        return formData.riskLevel ? "complete" : "incomplete"
      case "milestones":
        return formData.milestones.some((m) => m.name.trim()) ? "complete" : "incomplete"
      default:
        return "incomplete"
    }
  }

  const exportToPDF = async () => {
    setIsExportingPDF(true)

    try {
      // Dynamic import to avoid SSR issues
      const html2canvas = (await import("html2canvas")).default
      const jsPDF = (await import("jspdf")).jsPDF

      if (!previewRef.current) {
        throw new Error("Preview content not found")
      }

      // Create a clone of the preview content for PDF generation
      const element = previewRef.current.cloneNode(true) as HTMLElement

      // Apply PDF-specific styles based on theme
      const applyThemeStyles = (el: HTMLElement) => {
        el.style.width = "210mm" // A4 width
        el.style.padding = pdfSettings.includeLogo ? "30mm 20mm 20mm 20mm" : "20mm"
        el.style.backgroundColor = "white"
        el.style.fontFamily =
          pdfSettings.theme === "modern"
            ? "Inter, Arial, sans-serif"
            : pdfSettings.theme === "minimal"
              ? "Helvetica, Arial, sans-serif"
              : "Times New Roman, serif"
        el.style.fontSize = "12px"
        el.style.lineHeight = "1.5"
        el.style.color = "#000000"

        // Apply theme-specific styling
        if (pdfSettings.theme === "emphasis") {
          el.style.fontSize = "11px"
          el.style.lineHeight = "1.5"
          el.style.fontFamily = "Inter, Arial, sans-serif"
          el.style.backgroundColor = "#F7FFF7" // EMPHASIS off-white
        } else if (pdfSettings.theme === "modern") {
          el.style.fontSize = "11px"
          el.style.lineHeight = "1.4"
        } else if (pdfSettings.theme === "minimal") {
          el.style.fontSize = "10px"
          el.style.lineHeight = "1.3"
        }

        // Style headers with custom colors
        const headers = el.querySelectorAll("h1, h2, h3, h4, h5, h6")
        headers.forEach((header) => {
          ; (header as HTMLElement).style.color = pdfSettings.customColors.primary
          if (pdfSettings.theme === "modern") {
            ; (header as HTMLElement).style.fontWeight = "600"
          }
        })

        // Style badges and cards
        const badges = el.querySelectorAll('[class*="badge"], [class*="Badge"]')
        badges.forEach((badge) => {
          ; (badge as HTMLElement).style.backgroundColor = pdfSettings.customColors.secondary + "20"
            ; (badge as HTMLElement).style.color = pdfSettings.customColors.secondary
            ; (badge as HTMLElement).style.border = `1px solid ${pdfSettings.customColors.secondary}40`
        })
      }

      applyThemeStyles(element)

      // Create header with logo if enabled
      if (pdfSettings.includeLogo && pdfSettings.logoPosition === "header") {
        const header = document.createElement("div")
        header.style.cssText = `
          position: absolute;
          top: 10mm;
          left: 20mm;
          right: 20mm;
          height: 15mm;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 2px solid ${pdfSettings.customColors.primary};
          padding-bottom: 5mm;
          margin-bottom: 10mm;
        `

        const logoSection = document.createElement("div")
        logoSection.style.cssText = "display: flex; align-items: center; gap: 10px;"

        // Add actual logo instead of placeholder
        const logoImg = document.createElement("img")
        logoImg.crossOrigin = "anonymous"
        logoImg.style.cssText = "width: 120px; height: auto; max-height: 40px; object-fit: contain;"

        const logoSrc =
          pdfSettings.logoType === "color"
            ? "/images/emphasis-logo-color.png"
            : pdfSettings.logoType === "black"
              ? "/images/emphasis-logo-black.png"
              : "/images/emphasis-logo-mark.png"

        logoImg.src = logoSrc

        const orgInfo = document.createElement("div")
        if (pdfSettings.logoType !== "mark") {
          orgInfo.innerHTML = `
            <div style="font-size: 10px; color: ${pdfSettings.customColors.secondary}; margin-top: 5px;">
              SDG Project Documentation
            </div>
          `
        } else {
          orgInfo.innerHTML = `
            <div style="font-size: 16px; font-weight: bold; color: ${pdfSettings.customColors.primary};">
              ${pdfSettings.organizationName}
            </div>
            <div style="font-size: 10px; color: ${pdfSettings.customColors.secondary};">
              SDG Project Documentation
            </div>
          `
        }

        logoSection.appendChild(logoImg)
        logoSection.appendChild(orgInfo)

        const dateInfo = document.createElement("div")
        dateInfo.style.cssText = `text-align: right; font-size: 10px; color: ${pdfSettings.customColors.secondary};`
        dateInfo.innerHTML = `
          <div>Generated: ${new Date().toLocaleDateString()}</div>
          <div>Time: ${new Date().toLocaleTimeString()}</div>
        `

        header.appendChild(logoSection)
        header.appendChild(dateInfo)
        element.insertBefore(header, element.firstChild)
      }

      // Add watermark if enabled
      if (pdfSettings.includeWatermark) {
        const watermark = document.createElement("div")
        watermark.style.cssText = `
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-45deg);
          font-size: 72px;
          color: ${pdfSettings.customColors.primary}15;
          font-weight: bold;
          z-index: -1;
          pointer-events: none;
        `
        watermark.textContent = "DRAFT"
        element.appendChild(watermark)
      }

      // Temporarily add to DOM for rendering
      element.style.position = "absolute"
      element.style.left = "-9999px"
      element.style.top = "0"
      document.body.appendChild(element)

      // Generate canvas from HTML
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        width: 794, // A4 width in pixels at 96 DPI
        height: element.scrollHeight,
      })

      // Remove temporary element
      document.body.removeChild(element)

      // Create PDF
      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF("p", "mm", "a4")

      const imgWidth = 210 // A4 width in mm
      const pageHeight = 297 // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight
      let position = 0

      // Add first page
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()

        // Add header to subsequent pages if logo is enabled
        if (pdfSettings.includeLogo && pdfSettings.logoPosition === "header") {
          pdf.setFontSize(10)
          pdf.setTextColor(pdfSettings.customColors.secondary)
          pdf.text(pdfSettings.organizationName, 20, 15)
          pdf.text(`Page ${pdf.getNumberOfPages()}`, 190, 15)
          pdf.setDrawColor(pdfSettings.customColors.primary)
          pdf.line(20, 20, 190, 20)
        }

        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      // Add footer with page numbers and organization info
      const totalPages = pdf.getNumberOfPages()
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i)

        if (pdfSettings.logoPosition === "footer" || !pdfSettings.includeLogo) {
          pdf.setFontSize(8)
          pdf.setTextColor(pdfSettings.customColors.secondary)

          if (pdfSettings.includeLogo && pdfSettings.logoPosition === "footer") {
            pdf.text(pdfSettings.organizationName, 20, 285)
          }

          pdf.text(`Page ${i} of ${totalPages}`, 190, 285, { align: "right" })
          pdf.text(`Generated on ${new Date().toLocaleDateString()}`, 105, 285, { align: "center" })

          // Footer line
          pdf.setDrawColor(pdfSettings.customColors.primary)
          pdf.line(20, 280, 190, 280)
        }
      }

      // Generate filename
      const projectName = formData.name || "SDG_Project"
      const sanitizedName = projectName.replace(/[^a-z0-9]/gi, "_").toLowerCase()
      const timestamp = new Date().toISOString().split("T")[0]
      const filename = `${sanitizedName}_${pdfSettings.theme}_${timestamp}.pdf`

      // Save PDF
      pdf.save(filename)

      toast({
        title: "Branded PDF Exported Successfully",
        description: `Project preview has been saved as ${filename} with ${pdfSettings.theme} theme`,
      })
    } catch (error) {
      console.error("Error exporting PDF:", error)
      toast({
        title: "Export Failed",
        description: "There was an error exporting the PDF. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsExportingPDF(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEditing ? "Edit SDG Project" : "Create New SDG Project"}
            </h1>
            {templateName && <p className="text-blue-600 mt-1">Using template: {templateName}</p>}
            <p className="text-gray-600 mt-2">
              {isEditing
                ? "Update your sustainable development project details"
                : "Define a new sustainable development project for your island nation"}
            </p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
              Cancel
            </Button>
            {/* Remove the Create Project button from header */}
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <span>Form Progress</span>
              <div className="flex items-center space-x-2">
                {autoSaveStatus === "saving" && (
                  <div className="flex items-center text-blue-600">
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 mr-1"></div>
                    <span className="text-xs">Saving...</span>
                  </div>
                )}
                {autoSaveStatus === "saved" && (
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    <span className="text-xs">Auto-saved</span>
                  </div>
                )}
              </div>
            </div>
            <span>
              {
                Object.values({
                  basic: getTabStatus("basic"),
                  timeline: getTabStatus("timeline"),
                  objectives: getTabStatus("objectives"),
                  stakeholders: getTabStatus("stakeholders"),
                  risk: getTabStatus("risk"),
                  milestones: getTabStatus("milestones"),
                }).filter((status) => status === "complete").length
              }
              /6 sections complete
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="basic" className="flex items-center space-x-1">
                {getTabStatus("basic") === "complete" && <CheckCircle className="h-3 w-3" />}
                <span>Basic</span>
              </TabsTrigger>
              <TabsTrigger value="timeline" className="flex items-center space-x-1">
                {getTabStatus("timeline") === "complete" && <CheckCircle className="h-3 w-3" />}
                <span>Timeline</span>
              </TabsTrigger>
              <TabsTrigger value="objectives" className="flex items-center space-x-1">
                {getTabStatus("objectives") === "complete" && <CheckCircle className="h-3 w-3" />}
                <span>Objectives</span>
              </TabsTrigger>
              <TabsTrigger value="stakeholders" className="flex items-center space-x-1">
                {getTabStatus("stakeholders") === "complete" && <CheckCircle className="h-3 w-3" />}
                <span>Stakeholders</span>
              </TabsTrigger>
              <TabsTrigger value="risk" className="flex items-center space-x-1">
                {getTabStatus("risk") === "complete" && <CheckCircle className="h-3 w-3" />}
                <span>Risk</span>
              </TabsTrigger>
              <TabsTrigger value="milestones" className="flex items-center space-x-1">
                {getTabStatus("milestones") === "complete" && <CheckCircle className="h-3 w-3" />}
                <span>Milestones</span>
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex items-center space-x-1">
                <span>Preview</span>
              </TabsTrigger>
            </TabsList>

            {/* Basic Information Tab */}
            <TabsContent value="basic" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="h-5 w-5 mr-2" />
                    Project Information
                  </CardTitle>
                  <CardDescription>Basic details about your sustainable development project</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Project Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="e.g., Coastal Protection Initiative"
                        className={validationErrors.name ? "border-red-500" : ""}
                      />
                      {validationErrors.name && <p className="text-sm text-red-500">{validationErrors.name}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="type">Project Type *</Label>
                      <Select
                        value={formData.projectType}
                        onValueChange={(value) => handleInputChange("projectType", value)}
                      >
                        <SelectTrigger className={validationErrors.projectType ? "border-red-500" : ""}>
                          <SelectValue placeholder="Select project type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="infrastructure">Infrastructure Development</SelectItem>
                          <SelectItem value="climate">Climate Adaptation</SelectItem>
                          <SelectItem value="energy">Renewable Energy</SelectItem>
                          <SelectItem value="conservation">Marine Conservation</SelectItem>
                          <SelectItem value="tourism">Sustainable Tourism</SelectItem>
                          <SelectItem value="education">Education & Training</SelectItem>
                          <SelectItem value="health">Health & Wellbeing</SelectItem>
                          <SelectItem value="agriculture">Agriculture & Food Security</SelectItem>
                        </SelectContent>
                      </Select>
                      {validationErrors.projectType && (
                        <p className="text-sm text-red-500">{validationErrors.projectType}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Project Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      placeholder="Provide a comprehensive description of the project..."
                      rows={4}
                      className={validationErrors.description ? "border-red-500" : ""}
                    />
                    {validationErrors.description && (
                      <p className="text-sm text-red-500">{validationErrors.description}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority Level *</Label>
                      <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                        <SelectTrigger className={validationErrors.priority ? "border-red-500" : ""}>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="critical">Critical</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                      {validationErrors.priority && <p className="text-sm text-red-500">{validationErrors.priority}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => handleInputChange("location", e.target.value)}
                        placeholder="e.g., Northern Coast"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="scope">Geographic Scope</Label>
                      <Select
                        value={formData.geographicScope}
                        onValueChange={(value) => handleInputChange("geographicScope", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select scope" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="local">Local Community</SelectItem>
                          <SelectItem value="regional">Regional</SelectItem>
                          <SelectItem value="island-wide">Island-wide</SelectItem>
                          <SelectItem value="multi-island">Multi-island</SelectItem>
                          <SelectItem value="national">National</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* SDG Alignment */}
              <Card>
                <CardHeader>
                  <CardTitle>SDG Alignment *</CardTitle>
                  <CardDescription>
                    Select which UN Sustainable Development Goals this project addresses
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingGoals ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin mr-2" />
                      <span>Loading SDG Goals...</span>
                    </div>
                  ) : Array.isArray(sdgGoals) && sdgGoals.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {sdgGoals.map((sdg) => (
                        <div key={sdg.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                          <Checkbox
                            id={`sdg-${sdg.id}`}
                            checked={formData.selectedSDGs.includes(sdg.id)}
                            onCheckedChange={() => toggleSDG(sdg.id)}
                          />
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <div
                                className={`w-6 h-6 rounded-full ${sdg.color} flex items-center justify-center text-white text-xs font-bold`}
                              >
                                {sdg.id}
                              </div>
                              <Label htmlFor={`sdg-${sdg.id}`} className="text-sm font-medium cursor-pointer">
                                {sdg.shortened_title}
                              </Label>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No SDG Goals available. Please try refreshing the page.
                    </div>
                  )}

                  {/* SDG Targets Section */}
                  {formData.selectedSDGs.length > 0 && (
                    <div className="mt-6">
                      <Label className="text-sm font-medium mb-4 block">SDG Targets</Label>
                      <div className="space-y-4">
                        {formData.selectedSDGs.map((sdgId) => {
                          const sdg = sdgGoals.find((g) => g.id === sdgId)
                          const targets = sdgTargets[sdgId] || []
                          const isLoading = loadingTargets[sdgId]

                          return (
                            <div key={sdgId} className="border rounded-lg p-4">
                              <div className="flex items-center space-x-2 mb-3">
                                <div
                                  className={`w-8 h-8 rounded-full ${sdg?.color} flex items-center justify-center text-white text-sm font-bold`}
                                >
                                  {sdgId}
                                </div>
                                <h4 className="font-medium">{sdg?.shortened_title}</h4>
                                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                              </div>

                              {targets.length > 0 && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  {targets.map((target) => (
                                    <div key={target.id} className="flex items-start space-x-2 p-2 border rounded hover:bg-gray-50">
                                      <Checkbox
                                        id={`target-${target.id}`}
                                        checked={formData.selectedSDGTargets.includes(target.id)}
                                        onCheckedChange={() => toggleSDGTarget(target.id)}
                                      />
                                      <div className="flex-1">
                                        <Label htmlFor={`target-${target.id}`} className="text-sm cursor-pointer">
                                          <div className="font-medium">{target.target_number} - {target.title}</div>
                                          <div className="text-xs text-gray-600 mt-1">{target.description}</div>
                                        </Label>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                  {validationErrors.selectedSDGs && (
                    <p className="text-sm text-red-500 mt-2">{validationErrors.selectedSDGs}</p>
                  )}
                  {formData.selectedSDGs.length > 0 && (
                    <div className="mt-4">
                      <Label className="text-sm font-medium">
                        Selected SDGs ({formData.selectedSDGs.length}) and Targets ({formData.selectedSDGTargets.length}):
                      </Label>
                      <div className="space-y-2 mt-2">
                        {formData.selectedSDGs.map((sdgId) => {
                          const sdg = sdgGoals.find((g) => g.id === sdgId)
                          const selectedTargets = formData.selectedSDGTargets.filter(targetId =>
                            sdgTargets[sdgId]?.some(target => target.id === targetId)
                          )

                          return (
                            <div key={sdgId} className="border rounded p-2">
                              <Badge variant="secondary" className="mb-2">
                                SDG {sdgId}: {sdg?.shortened_title}
                              </Badge>
                              {selectedTargets.length > 0 && (
                                <div className="ml-4">
                                  <div className="text-xs text-gray-600 mb-1">Selected Targets:</div>
                                  <div className="flex flex-wrap gap-1">
                                    {selectedTargets.map(targetId => {
                                      const target = sdgTargets[sdgId]?.find(t => t.id === targetId)
                                      return target ? (
                                        <Badge key={targetId} variant="outline" className="text-xs">
                                          {target.target_number}
                                        </Badge>
                                      ) : null
                                    })}
                                  </div>
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Timeline & Budget Tab */}
            <TabsContent value="timeline" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Timeline & Budget
                  </CardTitle>
                  <CardDescription>Project timeline, budget, and funding information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => handleInputChange("startDate", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endDate">End Date</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => handleInputChange("endDate", e.target.value)}
                        className={validationErrors.endDate ? "border-red-500" : ""}
                      />
                      {validationErrors.endDate && <p className="text-sm text-red-500">{validationErrors.endDate}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="budget">Total Budget (USD)</Label>
                    <Input
                      id="budget"
                      value={formData.budget}
                      onChange={(e) => handleInputChange("budget", e.target.value)}
                      placeholder="e.g., 2,500,000"
                      className={validationErrors.budget ? "border-red-500" : ""}
                    />
                    {validationErrors.budget && <p className="text-sm text-red-500">{validationErrors.budget}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label>Funding Sources</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {fundingSourceOptions.map((source) => (
                        <div key={source} className="flex items-center space-x-2">
                          <Checkbox
                            id={source}
                            checked={formData.fundingSources.includes(source)}
                            onCheckedChange={() => toggleArrayItem("fundingSources", source)}
                          />
                          <Label htmlFor={source} className="text-sm cursor-pointer">
                            {source}
                          </Label>
                        </div>
                      ))}
                    </div>
                    {formData.fundingSources.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {formData.fundingSources.map((source) => (
                          <Badge key={source} variant="outline">
                            {source}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Objectives Tab */}
            <TabsContent value="objectives" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Objectives & Success Metrics
                  </CardTitle>
                  <CardDescription>Define project objectives and how success will be measured</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Project Objectives *</Label>
                      <Button type="button" variant="outline" size="sm" onClick={addObjective}>
                        <Plus className="h-4 w-4 mr-1" />
                        Add Objective
                      </Button>
                    </div>
                    {formData.objectives.map((objective, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <div className="flex-1">
                          <Textarea
                            value={objective}
                            onChange={(e) => updateObjective(index, e.target.value)}
                            placeholder={`Objective ${index + 1}...`}
                            rows={2}
                          />
                        </div>
                        {formData.objectives.length > 1 && (
                          <Button type="button" variant="outline" size="sm" onClick={() => removeObjective(index)}>
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    {validationErrors.objectives && (
                      <p className="text-sm text-red-500">{validationErrors.objectives}</p>
                    )}
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Success Metrics</Label>
                      <Button type="button" variant="outline" size="sm" onClick={addSuccessMetric}>
                        <Plus className="h-4 w-4 mr-1" />
                        Add Metric
                      </Button>
                    </div>
                    {formData.successMetrics.map((metric, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <div className="flex-1">
                          <Input
                            value={metric}
                            onChange={(e) => updateSuccessMetric(index, e.target.value)}
                            placeholder={`Success metric ${index + 1}...`}
                          />
                        </div>
                        {formData.successMetrics.length > 1 && (
                          <Button type="button" variant="outline" size="sm" onClick={() => removeSuccessMetric(index)}>
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Stakeholders Tab */}
            <TabsContent value="stakeholders" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Stakeholders
                  </CardTitle>
                  <CardDescription>Identify key stakeholders and partners for this project</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Stakeholder Categories</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {stakeholderOptions.map((stakeholder) => (
                        <div key={stakeholder} className="flex items-center space-x-2">
                          <Checkbox
                            id={stakeholder}
                            checked={formData.assignedStakeholders.includes(stakeholder)}
                            onCheckedChange={() => toggleArrayItem("assignedStakeholders", stakeholder)}
                          />
                          <Label htmlFor={stakeholder} className="text-sm cursor-pointer">
                            {stakeholder}
                          </Label>
                        </div>
                      ))}
                    </div>
                    {formData.assignedStakeholders.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {formData.assignedStakeholders.map((stakeholder) => (
                          <Badge key={stakeholder} variant="outline">
                            {stakeholder}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Risk Assessment Tab */}
            <TabsContent value="risk" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    Risk Assessment
                  </CardTitle>
                  <CardDescription>Identify and assess potential risks to project success</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="riskLevel">Overall Risk Level</Label>
                    <Select value={formData.riskLevel} onValueChange={(value) => handleInputChange("riskLevel", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select risk level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low Risk</SelectItem>
                        <SelectItem value="medium">Medium Risk</SelectItem>
                        <SelectItem value="high">High Risk</SelectItem>
                        <SelectItem value="critical">Critical Risk</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Risk Factors</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {riskFactorOptions.map((factor) => (
                        <div key={factor} className="flex items-center space-x-2">
                          <Checkbox
                            id={factor}
                            checked={formData.riskFactors.includes(factor)}
                            onCheckedChange={() => toggleArrayItem("riskFactors", factor)}
                          />
                          <Label htmlFor={factor} className="text-sm cursor-pointer">
                            {factor}
                          </Label>
                        </div>
                      ))}
                    </div>
                    {formData.riskFactors.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {formData.riskFactors.map((factor) => (
                          <Badge key={factor} variant="outline" className="text-orange-700 border-orange-300">
                            {factor}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Milestones Tab */}
            <TabsContent value="milestones" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="h-5 w-5 mr-2" />
                    Project Milestones
                  </CardTitle>
                  <CardDescription>Define key milestones and deliverables</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Milestones</Label>
                      <Button type="button" variant="outline" size="sm" onClick={addMilestone}>
                        <Plus className="h-4 w-4 mr-1" />
                        Add Milestone
                      </Button>
                    </div>
                    {formData.milestones.map((milestone, index) => (
                      <div key={index} className="p-4 border rounded-lg space-y-3">
                        <div className="flex items-center justify-between">
                          <Label>Milestone {index + 1}</Label>
                          {formData.milestones.length > 1 && (
                            <Button type="button" variant="outline" size="sm" onClick={() => removeMilestone(index)}>
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Milestone Name</Label>
                            <Input
                              value={milestone.name}
                              onChange={(e) => updateMilestone(index, "name", e.target.value)}
                              placeholder="e.g., Phase 1 Completion"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Target Date</Label>
                            <Input
                              type="date"
                              value={milestone.date}
                              onChange={(e) => updateMilestone(index, "date", e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Description</Label>
                          <Textarea
                            value={milestone.description}
                            onChange={(e) => updateMilestone(index, "description", e.target.value)}
                            placeholder="Describe what will be achieved..."
                            rows={2}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Preview Tab */}
            <TabsContent value="preview" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Target className="h-5 w-5 mr-2" />
                      Project Preview
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowPdfSettings(!showPdfSettings)}
                        className="flex items-center space-x-2"
                      >
                        <span>PDF Settings</span>
                      </Button>
                      <Button
                        variant="outline"
                        onClick={exportToPDF}
                        disabled={isExportingPDF}
                        className="flex items-center space-x-2"
                      >
                        {isExportingPDF ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                            <span>Exporting...</span>
                          </>
                        ) : (
                          <>
                            <Download className="h-4 w-4" />
                            <span>Export Branded PDF</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                  <CardDescription>Review your project details before creating</CardDescription>
                  {showPdfSettings && (
                    <div className="bg-gray-50 p-4 rounded-lg border space-y-4 mb-4">
                      <h4 className="font-semibold text-sm">PDF Customization Settings</h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Organization Settings */}
                        <div className="space-y-2">
                          <Label htmlFor="orgName">Organization Name</Label>
                          <Input
                            id="orgName"
                            value={pdfSettings.organizationName}
                            onChange={(e) => setPdfSettings((prev) => ({ ...prev, organizationName: e.target.value }))}
                            placeholder="Your Organization"
                          />
                        </div>

                        {/* Theme Selection */}
                        <div className="space-y-2">
                          <Label>PDF Theme</Label>
                          <Select
                            value={pdfSettings.theme}
                            onValueChange={(value: "professional" | "modern" | "minimal" | "emphasis") =>
                              setPdfSettings((prev) => ({ ...prev, theme: value }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="emphasis">Project EMPHASIS</SelectItem>
                              <SelectItem value="professional">Professional</SelectItem>
                              <SelectItem value="modern">Modern</SelectItem>
                              <SelectItem value="minimal">Minimal</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Logo Type Selection */}
                        <div className="space-y-2">
                          <Label>Logo Style</Label>
                          <Select
                            value={pdfSettings.logoType}
                            onValueChange={(value: "color" | "black" | "mark") =>
                              setPdfSettings((prev) => ({ ...prev, logoType: value }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="color">Color Logo</SelectItem>
                              <SelectItem value="black">Black Logo</SelectItem>
                              <SelectItem value="mark">Logo Mark Only</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Logo Position */}
                        <div className="space-y-2">
                          <Label>Logo Position</Label>
                          <Select
                            value={pdfSettings.logoPosition}
                            onValueChange={(value: "header" | "footer") =>
                              setPdfSettings((prev) => ({ ...prev, logoPosition: value }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="header">Header</SelectItem>
                              <SelectItem value="footer">Footer</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Color Customization */}
                        <div className="space-y-2">
                          <Label htmlFor="primaryColor">Primary Color</Label>
                          <div className="flex items-center space-x-2">
                            <Input
                              id="primaryColor"
                              type="color"
                              value={pdfSettings.customColors.primary}
                              onChange={(e) =>
                                setPdfSettings((prev) => ({
                                  ...prev,
                                  customColors: { ...prev.customColors, primary: e.target.value },
                                }))
                              }
                              className="w-12 h-8 p-1 border rounded"
                            />
                            <Input
                              value={pdfSettings.customColors.primary}
                              onChange={(e) =>
                                setPdfSettings((prev) => ({
                                  ...prev,
                                  customColors: { ...prev.customColors, primary: e.target.value },
                                }))
                              }
                              placeholder="#2563eb"
                              className="flex-1"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="secondaryColor">Secondary Color</Label>
                          <div className="flex items-center space-x-2">
                            <Input
                              id="secondaryColor"
                              type="color"
                              value={pdfSettings.customColors.secondary}
                              onChange={(e) =>
                                setPdfSettings((prev) => ({
                                  ...prev,
                                  customColors: { ...prev.customColors, secondary: e.target.value },
                                }))
                              }
                              className="w-12 h-8 p-1 border rounded"
                            />
                            <Input
                              value={pdfSettings.customColors.secondary}
                              onChange={(e) =>
                                setPdfSettings((prev) => ({
                                  ...prev,
                                  customColors: { ...prev.customColors, secondary: e.target.value },
                                }))
                              }
                              placeholder="#64748b"
                              className="flex-1"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="accentColor">Accent Color</Label>
                          <div className="flex items-center space-x-2">
                            <Input
                              id="accentColor"
                              type="color"
                              value={pdfSettings.customColors.accent}
                              onChange={(e) =>
                                setPdfSettings((prev) => ({
                                  ...prev,
                                  customColors: { ...prev.customColors, accent: e.target.value },
                                }))
                              }
                              className="w-12 h-8 p-1 border rounded"
                            />
                            <Input
                              value={pdfSettings.customColors.accent}
                              onChange={(e) =>
                                setPdfSettings((prev) => ({
                                  ...prev,
                                  customColors: { ...prev.customColors, accent: e.target.value },
                                }))
                              }
                              placeholder="#059669"
                              className="flex-1"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="includeLogo"
                            checked={pdfSettings.includeLogo}
                            onCheckedChange={(checked) =>
                              setPdfSettings((prev) => ({ ...prev, includeLogo: !!checked }))
                            }
                          />
                          <Label htmlFor="includeLogo" className="text-sm">
                            Include Organization Logo
                          </Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="includeWatermark"
                            checked={pdfSettings.includeWatermark}
                            onCheckedChange={(checked) =>
                              setPdfSettings((prev) => ({ ...prev, includeWatermark: !!checked }))
                            }
                          />
                          <Label htmlFor="includeWatermark" className="text-sm">
                            Add Draft Watermark
                          </Label>
                        </div>
                      </div>

                      {/* Theme Preview */}
                      <div
                        className="mt-4 p-3 border rounded-lg"
                        style={{
                          backgroundColor: pdfSettings.customColors.primary + "05",
                          borderColor: pdfSettings.customColors.primary + "20",
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div
                              className="w-6 h-6 rounded"
                              style={{
                                background: `linear-gradient(135deg, ${pdfSettings.customColors.primary}, ${pdfSettings.customColors.accent})`,
                              }}
                            ></div>
                            <span className="text-sm font-medium" style={{ color: pdfSettings.customColors.primary }}>
                              {pdfSettings.organizationName}
                            </span>
                          </div>
                          <Badge
                            variant="outline"
                            style={{
                              borderColor: pdfSettings.customColors.secondary,
                              color: pdfSettings.customColors.secondary,
                            }}
                          >
                            {pdfSettings.theme} Theme
                          </Badge>
                        </div>
                      </div>
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <div ref={previewRef} className="space-y-8">
                    {/* Project Header */}
                    <div className="border-b pb-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900">{formData.name || "Untitled Project"}</h2>
                          <div className="flex items-center space-x-4 mt-2">
                            {formData.projectType && <Badge variant="outline">{formData.projectType}</Badge>}
                            {formData.priority && (
                              <Badge
                                className={
                                  formData.priority === "critical"
                                    ? "bg-red-100 text-red-800"
                                    : formData.priority === "high"
                                      ? "bg-orange-100 text-orange-800"
                                      : formData.priority === "medium"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "bg-green-100 text-green-800"
                                }
                              >
                                {formData.priority} Priority
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="text-right text-sm text-gray-500">
                          {formData.location && <p>{formData.location}</p>}
                          {formData.geographicScope && <p>{formData.geographicScope}</p>}
                        </div>
                      </div>

                      {formData.description && <p className="text-gray-700 leading-relaxed">{formData.description}</p>}
                    </div>

                    {/* Key Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">Timeline</CardTitle>
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-sm">
                            {formData.startDate && formData.endDate ? (
                              <>
                                <div>Start: {new Date(formData.startDate).toLocaleDateString()}</div>
                                <div>End: {new Date(formData.endDate).toLocaleDateString()}</div>
                                <div className="text-xs text-gray-500 mt-1">
                                  Duration:{" "}
                                  {Math.ceil(
                                    (new Date(formData.endDate).getTime() - new Date(formData.startDate).getTime()) /
                                    (1000 * 60 * 60 * 24 * 30),
                                  )}{" "}
                                  months
                                </div>
                              </>
                            ) : (
                              <span className="text-gray-400">Not specified</span>
                            )}
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">Budget</CardTitle>
                          <span className="text-lg">💰</span>
                        </CardHeader>
                        <CardContent>
                          <div className="text-lg font-bold">
                            {formData.budget
                              ? `$${Number(formData.budget.replace(/,/g, "")).toLocaleString()}`
                              : "Not specified"}
                          </div>
                          {formData.fundingSources.length > 0 && (
                            <p className="text-xs text-gray-500">{formData.fundingSources.length} funding sources</p>
                          )}
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">SDG Goals</CardTitle>
                          <Target className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{formData.selectedSDGs.length}</div>
                          <p className="text-xs text-gray-500">Goals addressed</p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">Risk Level</CardTitle>
                          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-lg font-bold capitalize">{formData.riskLevel || "Not assessed"}</div>
                          {formData.riskFactors.length > 0 && (
                            <p className="text-xs text-gray-500">{formData.riskFactors.length} risk factors</p>
                          )}
                        </CardContent>
                      </Card>
                    </div>

                    {/* SDG Alignment */}
                    {formData.selectedSDGs.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-3">SDG Alignment</h3>
                        <div className="flex flex-wrap gap-2">
                          {formData.selectedSDGs.map((sdgId) => {
                            const sdg = sdgGoals.find((g) => g.id === sdgId)
                            return (
                              <div key={sdgId} className="flex items-center space-x-2 bg-gray-50 p-2 rounded-lg">
                                <div
                                  className={`w-8 h-8 rounded-full ${sdg?.color} flex items-center justify-center text-white text-sm font-bold`}
                                >
                                  {sdgId}
                                </div>
                                <span className="text-sm font-medium">{sdg?.shortened_title}</span>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {/* Objectives */}
                    {formData.objectives.some((obj) => obj.trim()) && (
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Project Objectives</h3>
                        <ul className="space-y-2">
                          {formData.objectives
                            .filter((obj) => obj.trim())
                            .map((objective, index) => (
                              <li key={index} className="flex items-start">
                                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                                  {index + 1}
                                </span>
                                <span className="text-gray-700">{objective}</span>
                              </li>
                            ))}
                        </ul>
                      </div>
                    )}

                    {/* Success Metrics */}
                    {formData.successMetrics.some((metric) => metric.trim()) && (
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Success Metrics</h3>
                        <ul className="space-y-2">
                          {formData.successMetrics
                            .filter((metric) => metric.trim())
                            .map((metric, index) => (
                              <li key={index} className="flex items-center">
                                <TrendingUp className="h-4 w-4 text-green-600 mr-2" />
                                <span className="text-gray-700">{metric}</span>
                              </li>
                            ))}
                        </ul>
                      </div>
                    )}

                    {/* Stakeholders */}
                    {formData.assignedStakeholders.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Key Stakeholders</h3>
                        <div className="flex flex-wrap gap-2">
                          {formData.assignedStakeholders.map((stakeholder) => (
                            <Badge key={stakeholder} variant="outline" className="flex items-center">
                              <Users className="h-3 w-3 mr-1" />
                              {stakeholder}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Funding Sources */}
                    {formData.fundingSources.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Funding Sources</h3>
                        <div className="flex flex-wrap gap-2">
                          {formData.fundingSources.map((source) => (
                            <Badge key={source} variant="secondary">
                              {source}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Risk Assessment */}
                    {(formData.riskLevel || formData.riskFactors.length > 0) && (
                      <div>
                        <h3 className="text-lg font-semibold mb-3 flex items-center">
                          <AlertTriangle className="h-5 w-5 mr-2 text-orange-500" />
                          Risk Assessment
                        </h3>
                        <div className="bg-orange-50 p-4 rounded-lg">
                          {formData.riskLevel && (
                            <div className="flex items-center justify-between mb-3">
                              <span className="font-medium">Risk Level:</span>
                              <Badge variant="outline" className="capitalize">
                                {formData.riskLevel}
                              </Badge>
                            </div>
                          )}
                          {formData.riskFactors.length > 0 && (
                            <div>
                              <span className="font-medium">Risk Factors:</span>
                              <ul className="mt-2 space-y-1">
                                {formData.riskFactors.map((factor, index) => (
                                  <li key={index} className="flex items-center text-sm">
                                    <AlertTriangle className="h-3 w-3 text-orange-500 mr-2" />
                                    <span>{factor}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Milestones */}
                    {formData.milestones.some((m) => m.name.trim()) && (
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Project Milestones</h3>
                        <div className="space-y-4">
                          {formData.milestones
                            .filter((m) => m.name.trim())
                            .map((milestone, index) => (
                              <div key={index} className="border-l-4 border-blue-200 pl-4 py-2">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-medium">{milestone.name}</h4>
                                  {milestone.date && (
                                    <Badge variant="outline">{new Date(milestone.date).toLocaleDateString()}</Badge>
                                  )}
                                </div>
                                {milestone.description && (
                                  <p className="text-sm text-gray-600 mt-1">{milestone.description}</p>
                                )}
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* Completion Status */}
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold mb-2">Project Readiness</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {[
                          { key: "basic", label: "Basic Information", status: getTabStatus("basic") },
                          { key: "timeline", label: "Timeline & Budget", status: getTabStatus("timeline") },
                          { key: "objectives", label: "Objectives", status: getTabStatus("objectives") },
                          { key: "stakeholders", label: "Stakeholders", status: getTabStatus("stakeholders") },
                          { key: "risk", label: "Risk Assessment", status: getTabStatus("risk") },
                          { key: "milestones", label: "Milestones", status: getTabStatus("milestones") },
                        ].map((section) => (
                          <div key={section.key} className="flex items-center space-x-2">
                            {section.status === "complete" ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
                            )}
                            <span
                              className={`text-sm ${section.status === "complete" ? "text-green-700" : "text-gray-600"}`}
                            >
                              {section.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center pt-6">
            <div className="flex space-x-2">
              {activeTab !== "basic" && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const tabs = ["basic", "timeline", "objectives", "stakeholders", "risk", "milestones", "preview"]
                    const currentIndex = tabs.indexOf(activeTab)
                    if (currentIndex > 0) {
                      setActiveTab(tabs[currentIndex - 1])
                    }
                  }}
                >
                  Previous
                </Button>
              )}
            </div>

            <div className="flex space-x-2">
              {/* Save Draft button - always visible except when submitting */}
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  localStorage.setItem("projectFormDraft", JSON.stringify(formData))
                  setAutoSaveStatus("saved")
                  toast({
                    title: "Draft Saved",
                    description: "Your project draft has been saved locally",
                  })
                }}
                disabled={isSubmitting}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>

              {activeTab !== "preview" && (
                <Button
                  type="button"
                  onClick={() => {
                    const tabs = ["basic", "timeline", "objectives", "stakeholders", "risk", "milestones", "preview"]
                    const currentIndex = tabs.indexOf(activeTab)
                    if (currentIndex < tabs.length - 1) {
                      setActiveTab(tabs[currentIndex + 1])
                    }
                  }}
                >
                  {activeTab === "milestones" ? "Preview Project" : "Next"}
                </Button>
              )}

              {/* Create Project button - show on preview tab or if all sections complete */}
              {(activeTab === "preview" ||
                Object.values({
                  basic: getTabStatus("basic"),
                  timeline: getTabStatus("timeline"),
                  objectives: getTabStatus("objectives"),
                  stakeholders: getTabStatus("stakeholders"),
                  risk: getTabStatus("risk"),
                  milestones: getTabStatus("milestones"),
                }).every((status) => status === "complete")) && (
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Creating..." : isEditing ? "Update Project" : "Create Project"}
                  </Button>
                )}
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
