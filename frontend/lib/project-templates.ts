export interface ProjectTemplate {
  id: string
  name: string
  category: string
  description: string
  icon: string
  estimatedDuration: string
  estimatedBudget: string
  complexity: "Low" | "Medium" | "High"
  primarySDGs: number[]
  secondarySDGs: number[]
  template: {
    name: string
    description: string
    objectives: string[]
    projectType: string
    priority: string
    geographicScope: string
    riskLevel: string
    riskFactors: string[]
    successMetrics: string[]
    milestones: Array<{
      name: string
      description: string
      estimatedMonths: number
    }>
    fundingSources: string[]
    stakeholderCategories: string[]
    expertiseRequired: string[]
  }
}

export const projectTemplates: ProjectTemplate[] = [
  {
    id: "marine-conservation",
    name: "Marine Protected Area Development",
    category: "Marine Conservation",
    description:
      "Establish and manage marine protected areas to conserve biodiversity and support sustainable fisheries",
    icon: "🌊",
    estimatedDuration: "3-5 years",
    estimatedBudget: "$2-5 million",
    complexity: "High",
    primarySDGs: [14, 15],
    secondarySDGs: [1, 2, 8, 11],
    template: {
      name: "Marine Protected Area Development Project",
      description:
        "This project aims to establish a comprehensive marine protected area (MPA) system to conserve critical marine ecosystems, protect endangered species, and support sustainable fisheries management. The initiative will involve community engagement, scientific research, policy development, and enforcement mechanisms to ensure long-term conservation success while supporting local livelihoods.",
      objectives: [
        "Establish legally designated marine protected areas covering critical habitats",
        "Develop community-based management systems with local stakeholder participation",
        "Implement sustainable fishing practices and alternative livelihood programs",
        "Create monitoring and enforcement systems for MPA compliance",
        "Build local capacity for marine conservation and management",
      ],
      projectType: "Marine Conservation",
      priority: "high",
      geographicScope: "multi-island",
      riskLevel: "medium",
      riskFactors: [
        "Community resistance to fishing restrictions",
        "Limited enforcement capacity",
        "Climate change impacts on marine ecosystems",
        "Illegal fishing activities",
        "Funding sustainability challenges",
      ],
      successMetrics: [
        "Percentage increase in fish biomass within MPAs",
        "Number of endangered species populations stabilized",
        "Reduction in illegal fishing incidents",
        "Community participation rate in management activities",
        "Economic benefits generated from sustainable tourism",
      ],
      milestones: [
        {
          name: "Baseline Assessment & Community Consultation",
          description: "Conduct marine biodiversity surveys and engage communities in planning process",
          estimatedMonths: 6,
        },
        {
          name: "Legal Framework Development",
          description: "Draft and enact MPA legislation with enforcement mechanisms",
          estimatedMonths: 12,
        },
        {
          name: "MPA Establishment & Zoning",
          description: "Officially designate protected areas with clear boundaries and use zones",
          estimatedMonths: 18,
        },
        {
          name: "Management System Implementation",
          description: "Deploy monitoring systems, train rangers, and begin enforcement",
          estimatedMonths: 24,
        },
        {
          name: "Community Programs Launch",
          description: "Implement alternative livelihood and sustainable fishing programs",
          estimatedMonths: 30,
        },
      ],
      fundingSources: [
        "Green Climate Fund",
        "Global Environment Facility",
        "Blue Economy Development Fund",
        "International Conservation Organizations",
      ],
      stakeholderCategories: [
        "Government Agencies",
        "NGOs & Civil Society",
        "International Partners",
        "Private Sector",
      ],
      expertiseRequired: ["Marine Conservation", "Community Development", "Policy & Governance", "Finance & Economics"],
    },
  },
  {
    id: "renewable-energy-transition",
    name: "Island Renewable Energy Transition",
    category: "Renewable Energy",
    description: "Transition from fossil fuels to renewable energy sources including solar, wind, and ocean energy",
    icon: "⚡",
    estimatedDuration: "5-7 years",
    estimatedBudget: "$10-25 million",
    complexity: "High",
    primarySDGs: [7, 13],
    secondarySDGs: [8, 9, 11, 12],
    template: {
      name: "Comprehensive Renewable Energy Transition Project",
      description:
        "A comprehensive initiative to transition the island's energy system from fossil fuel dependence to 100% renewable energy sources. This project will deploy solar photovoltaic systems, wind turbines, energy storage solutions, and smart grid infrastructure while building local technical capacity and creating green jobs. The transition will significantly reduce greenhouse gas emissions and energy costs while improving energy security.",
      objectives: [
        "Achieve 80% renewable energy generation within 5 years",
        "Install distributed solar PV systems across residential and commercial sectors",
        "Deploy utility-scale wind and solar farms with battery storage",
        "Modernize electrical grid with smart grid technologies",
        "Create local green jobs and technical training programs",
        "Reduce energy costs for consumers by 30%",
      ],
      projectType: "Renewable Energy",
      priority: "critical",
      geographicScope: "island-wide",
      riskLevel: "medium",
      riskFactors: [
        "High upfront capital costs",
        "Technical complexity of grid integration",
        "Weather-related equipment damage",
        "Limited local technical expertise",
        "Regulatory and permitting delays",
      ],
      successMetrics: [
        "Percentage of electricity from renewable sources",
        "Reduction in CO2 emissions (tons per year)",
        "Number of households with solar installations",
        "Grid stability and reliability metrics",
        "Local jobs created in renewable energy sector",
        "Average electricity cost reduction",
      ],
      milestones: [
        {
          name: "Energy Audit & Feasibility Study",
          description: "Comprehensive assessment of current energy use and renewable potential",
          estimatedMonths: 4,
        },
        {
          name: "Regulatory Framework & Permits",
          description: "Develop policies, regulations, and secure necessary permits",
          estimatedMonths: 8,
        },
        {
          name: "Phase 1: Distributed Solar Deployment",
          description: "Install rooftop solar systems on government and commercial buildings",
          estimatedMonths: 18,
        },
        {
          name: "Phase 2: Utility-Scale Installations",
          description: "Deploy large-scale solar and wind farms with storage systems",
          estimatedMonths: 36,
        },
        {
          name: "Grid Modernization & Integration",
          description: "Upgrade grid infrastructure and implement smart grid technologies",
          estimatedMonths: 48,
        },
        {
          name: "Community Solar & Training Programs",
          description: "Expand residential solar access and launch technical training",
          estimatedMonths: 60,
        },
      ],
      fundingSources: [
        "Green Climate Fund",
        "Asian Development Bank",
        "International Renewable Energy Agency",
        "Private Sector Investment",
      ],
      stakeholderCategories: [
        "Government Agencies",
        "Private Sector",
        "International Partners",
        "Academic Institutions",
      ],
      expertiseRequired: ["Renewable Energy", "Technology & Innovation", "Finance & Economics", "Infrastructure"],
    },
  },
  {
    id: "sustainable-tourism",
    name: "Sustainable Tourism Development",
    category: "Sustainable Tourism",
    description: "Develop eco-friendly tourism that preserves natural resources while supporting local communities",
    icon: "🏝️",
    estimatedDuration: "3-4 years",
    estimatedBudget: "$3-8 million",
    complexity: "Medium",
    primarySDGs: [8, 11, 14],
    secondarySDGs: [1, 4, 5, 12, 15],
    template: {
      name: "Sustainable Island Tourism Development Initiative",
      description:
        "A comprehensive sustainable tourism development program that balances economic growth with environmental conservation and cultural preservation. This initiative will establish eco-tourism infrastructure, develop community-based tourism products, implement environmental standards, and create local employment opportunities while protecting the island's natural and cultural heritage for future generations.",
      objectives: [
        "Develop eco-friendly tourism infrastructure and accommodations",
        "Create community-based tourism experiences showcasing local culture",
        "Implement environmental certification and sustainability standards",
        "Build local capacity in hospitality and tourism services",
        "Establish visitor management systems to prevent overtourism",
        "Generate sustainable income for local communities",
      ],
      projectType: "Sustainable Tourism",
      priority: "high",
      geographicScope: "island-wide",
      riskLevel: "medium",
      riskFactors: [
        "Environmental degradation from increased visitor numbers",
        "Loss of cultural authenticity through commercialization",
        "Climate change impacts on tourism attractions",
        "Competition from other destinations",
        "Economic dependence on tourism sector",
      ],
      successMetrics: [
        "Number of certified sustainable tourism businesses",
        "Tourist satisfaction scores and repeat visitor rates",
        "Local employment in tourism sector",
        "Revenue generated for local communities",
        "Environmental impact indicators (waste, water, energy)",
        "Preservation of cultural sites and practices",
      ],
      milestones: [
        {
          name: "Tourism Assessment & Strategy Development",
          description: "Analyze current tourism assets and develop sustainable tourism strategy",
          estimatedMonths: 6,
        },
        {
          name: "Infrastructure Planning & Design",
          description: "Design eco-friendly tourism facilities and visitor management systems",
          estimatedMonths: 12,
        },
        {
          name: "Community Engagement & Training",
          description: "Engage communities and provide tourism service training programs",
          estimatedMonths: 18,
        },
        {
          name: "Sustainable Infrastructure Development",
          description: "Build eco-lodges, visitor centers, and sustainable tourism facilities",
          estimatedMonths: 30,
        },
        {
          name: "Marketing & Certification Launch",
          description: "Launch sustainable tourism certification and marketing campaigns",
          estimatedMonths: 36,
        },
      ],
      fundingSources: [
        "World Bank Tourism Development Fund",
        "EU Sustainable Tourism Initiative",
        "Private Tourism Investors",
        "Community Development Funds",
      ],
      stakeholderCategories: ["Government Agencies", "Private Sector", "NGOs & Civil Society", "Community Leaders"],
      expertiseRequired: ["Sustainable Tourism", "Community Development", "Infrastructure", "Education & Training"],
    },
  },
  {
    id: "coastal-resilience",
    name: "Coastal Resilience & Adaptation",
    category: "Climate Adaptation",
    description: "Build coastal defenses and ecosystem-based adaptation to protect against sea level rise and storms",
    icon: "🏖️",
    estimatedDuration: "4-6 years",
    estimatedBudget: "$5-15 million",
    complexity: "High",
    primarySDGs: [13, 11, 14],
    secondarySDGs: [1, 2, 6, 15],
    template: {
      name: "Integrated Coastal Resilience and Climate Adaptation Project",
      description:
        "A comprehensive coastal protection and climate adaptation initiative combining natural and engineered solutions to protect communities from sea level rise, coastal erosion, and extreme weather events. The project will restore coastal ecosystems, build resilient infrastructure, and strengthen community preparedness while maintaining the natural beauty and ecological functions of coastal areas.",
      objectives: [
        "Restore and protect coastal ecosystems including mangroves and coral reefs",
        "Implement nature-based coastal defense solutions",
        "Build climate-resilient coastal infrastructure",
        "Develop early warning systems for coastal hazards",
        "Strengthen community disaster preparedness and response capacity",
        "Integrate climate adaptation into coastal planning and development",
      ],
      projectType: "Climate Adaptation",
      priority: "critical",
      geographicScope: "island-wide",
      riskLevel: "high",
      riskFactors: [
        "Accelerating sea level rise beyond projections",
        "Increased frequency and intensity of extreme weather",
        "Ecosystem degradation reducing natural protection",
        "High costs of engineered coastal defenses",
        "Community displacement and relocation needs",
      ],
      successMetrics: [
        "Kilometers of coastline protected by natural and built defenses",
        "Reduction in coastal erosion rates",
        "Number of people protected from coastal flooding",
        "Ecosystem health indicators (coral cover, mangrove area)",
        "Community preparedness and response capacity scores",
        "Economic losses avoided from coastal hazards",
      ],
      milestones: [
        {
          name: "Vulnerability Assessment & Mapping",
          description: "Conduct detailed coastal vulnerability and risk assessments",
          estimatedMonths: 8,
        },
        {
          name: "Ecosystem Restoration Planning",
          description: "Design mangrove, coral reef, and coastal vegetation restoration",
          estimatedMonths: 12,
        },
        {
          name: "Infrastructure Design & Permitting",
          description: "Engineer coastal defenses and obtain environmental permits",
          estimatedMonths: 18,
        },
        {
          name: "Phase 1: Ecosystem Restoration",
          description: "Begin mangrove planting and coral reef restoration activities",
          estimatedMonths: 24,
        },
        {
          name: "Phase 2: Infrastructure Construction",
          description: "Build seawalls, breakwaters, and drainage systems",
          estimatedMonths: 42,
        },
        {
          name: "Early Warning System & Community Training",
          description: "Deploy monitoring systems and train communities in disaster response",
          estimatedMonths: 48,
        },
      ],
      fundingSources: [
        "Green Climate Fund",
        "Adaptation Fund",
        "World Bank Climate Resilience Program",
        "Regional Development Banks",
      ],
      stakeholderCategories: [
        "Government Agencies",
        "NGOs & Civil Society",
        "International Partners",
        "Community Leaders",
      ],
      expertiseRequired: ["Climate Change", "Marine Conservation", "Infrastructure", "Community Development"],
    },
  },
  {
    id: "waste-management",
    name: "Circular Waste Management System",
    category: "Waste Management",
    description: "Implement comprehensive waste reduction, recycling, and circular economy principles",
    icon: "♻️",
    estimatedDuration: "2-3 years",
    estimatedBudget: "$1-3 million",
    complexity: "Medium",
    primarySDGs: [12, 11, 14],
    secondarySDGs: [3, 6, 8, 13],
    template: {
      name: "Integrated Circular Waste Management and Zero Waste Initiative",
      description:
        "A comprehensive waste management transformation project implementing circular economy principles to achieve zero waste to landfill. The initiative will establish waste reduction programs, advanced recycling facilities, composting systems, and community education programs while creating green jobs and reducing environmental pollution.",
      objectives: [
        "Achieve 90% waste diversion from landfills within 3 years",
        "Implement island-wide source separation and collection systems",
        "Establish recycling and composting facilities",
        "Develop waste-to-energy solutions for non-recyclable materials",
        "Create community education and behavior change programs",
        "Generate economic value from waste streams",
      ],
      projectType: "Infrastructure Development",
      priority: "high",
      geographicScope: "island-wide",
      riskLevel: "low",
      riskFactors: [
        "Community resistance to behavior change",
        "Limited markets for recycled materials",
        "High operational costs of waste processing",
        "Technical challenges with organic waste processing",
        "Contamination of recyclable materials",
      ],
      successMetrics: [
        "Percentage of waste diverted from landfills",
        "Tons of materials recycled and composted annually",
        "Reduction in marine plastic pollution",
        "Community participation rates in waste programs",
        "Revenue generated from waste processing",
        "Greenhouse gas emissions reduction from waste sector",
      ],
      milestones: [
        {
          name: "Waste Audit & System Design",
          description: "Conduct comprehensive waste characterization and design collection systems",
          estimatedMonths: 4,
        },
        {
          name: "Infrastructure Development",
          description: "Build recycling facility, composting site, and transfer stations",
          estimatedMonths: 12,
        },
        {
          name: "Collection System Launch",
          description: "Deploy island-wide source separation and collection programs",
          estimatedMonths: 18,
        },
        {
          name: "Community Education Campaign",
          description: "Launch comprehensive waste reduction and recycling education",
          estimatedMonths: 24,
        },
        {
          name: "Advanced Processing Implementation",
          description: "Add waste-to-energy and advanced recycling technologies",
          estimatedMonths: 30,
        },
      ],
      fundingSources: [
        "Environmental Protection Funds",
        "Circular Economy Investment Programs",
        "Private Waste Management Companies",
        "Municipal Development Funds",
      ],
      stakeholderCategories: ["Government Agencies", "Private Sector", "NGOs & Civil Society", "Community Leaders"],
      expertiseRequired: ["Infrastructure", "Technology & Innovation", "Community Development", "Education & Training"],
    },
  },
  {
    id: "food-security",
    name: "Sustainable Food Security Program",
    category: "Food Security",
    description: "Develop local food production systems and improve nutrition while building climate resilience",
    icon: "🌱",
    estimatedDuration: "3-5 years",
    estimatedBudget: "$2-6 million",
    complexity: "Medium",
    primarySDGs: [2, 3, 12],
    secondarySDGs: [1, 5, 6, 13, 15],
    template: {
      name: "Climate-Resilient Food Security and Nutrition Program",
      description:
        "A comprehensive food security initiative that enhances local food production capacity, improves nutrition outcomes, and builds resilience to climate change impacts. The program will promote sustainable agriculture practices, establish community gardens, develop aquaculture systems, and strengthen food distribution networks while preserving traditional food knowledge.",
      objectives: [
        "Increase local food production by 50% within 5 years",
        "Establish climate-resilient agricultural and aquaculture systems",
        "Improve household nutrition and food security indicators",
        "Develop community-based food production and distribution networks",
        "Preserve and promote traditional food crops and practices",
        "Create sustainable livelihoods in agriculture and fisheries",
      ],
      projectType: "Economic Development",
      priority: "high",
      geographicScope: "island-wide",
      riskLevel: "medium",
      riskFactors: [
        "Climate change impacts on crop yields",
        "Limited arable land and freshwater resources",
        "Soil degradation and saltwater intrusion",
        "Market competition from imported foods",
        "Limited technical knowledge in sustainable farming",
      ],
      successMetrics: [
        "Percentage increase in local food production",
        "Number of households achieving food security",
        "Improvement in child nutrition indicators",
        "Hectares under sustainable agricultural practices",
        "Income generated from local food systems",
        "Diversity of crops and food sources available",
      ],
      milestones: [
        {
          name: "Food Security Assessment",
          description: "Conduct comprehensive food security and nutrition baseline study",
          estimatedMonths: 6,
        },
        {
          name: "Agricultural Infrastructure Development",
          description: "Establish demonstration farms, irrigation systems, and storage facilities",
          estimatedMonths: 12,
        },
        {
          name: "Community Garden Network",
          description: "Create community gardens and school nutrition programs",
          estimatedMonths: 18,
        },
        {
          name: "Aquaculture Development",
          description: "Establish sustainable fish farming and seaweed cultivation",
          estimatedMonths: 24,
        },
        {
          name: "Market Development & Distribution",
          description: "Create farmers markets and local food distribution systems",
          estimatedMonths: 36,
        },
      ],
      fundingSources: [
        "Food and Agriculture Organization",
        "World Food Programme",
        "Agricultural Development Funds",
        "Community Development Programs",
      ],
      stakeholderCategories: [
        "Government Agencies",
        "NGOs & Civil Society",
        "Community Leaders",
        "Academic Institutions",
      ],
      expertiseRequired: [
        "Agriculture & Food Security",
        "Community Development",
        "Health & Wellbeing",
        "Climate Change",
      ],
    },
  },
  {
    id: "digital-connectivity",
    name: "Digital Infrastructure & Connectivity",
    category: "Digital Development",
    description: "Expand digital infrastructure and build digital literacy for economic development and education",
    icon: "📡",
    estimatedDuration: "2-4 years",
    estimatedBudget: "$3-10 million",
    complexity: "Medium",
    primarySDGs: [4, 8, 9],
    secondarySDGs: [5, 10, 11, 17],
    template: {
      name: "Comprehensive Digital Infrastructure and Literacy Development Project",
      description:
        "A transformative digital development initiative that expands high-speed internet connectivity, builds digital infrastructure, and enhances digital literacy across all sectors of society. The project will enable remote work opportunities, improve access to education and healthcare services, and support the development of a digital economy while ensuring inclusive access for all community members.",
      objectives: [
        "Achieve universal high-speed internet access across the island",
        "Establish digital learning centers and public WiFi networks",
        "Implement comprehensive digital literacy training programs",
        "Develop e-government services and digital public services",
        "Support digital entrepreneurship and remote work opportunities",
        "Bridge the digital divide for vulnerable populations",
      ],
      projectType: "Infrastructure Development",
      priority: "high",
      geographicScope: "island-wide",
      riskLevel: "low",
      riskFactors: [
        "High infrastructure deployment costs in remote areas",
        "Limited local technical expertise for maintenance",
        "Cybersecurity and data privacy concerns",
        "Digital literacy barriers among older populations",
        "Dependence on external technology providers",
      ],
      successMetrics: [
        "Percentage of population with high-speed internet access",
        "Number of people completing digital literacy training",
        "Usage rates of digital government services",
        "Number of digital businesses and remote workers",
        "Student performance improvements through digital learning",
        "Reduction in digital divide indicators",
      ],
      milestones: [
        {
          name: "Digital Infrastructure Assessment",
          description: "Assess current connectivity and plan fiber optic network expansion",
          estimatedMonths: 4,
        },
        {
          name: "Core Network Deployment",
          description: "Install submarine cables, cell towers, and fiber optic backbone",
          estimatedMonths: 12,
        },
        {
          name: "Community Access Points",
          description: "Establish digital centers, public WiFi, and community access points",
          estimatedMonths: 18,
        },
        {
          name: "Digital Literacy Programs",
          description: "Launch comprehensive digital skills training for all age groups",
          estimatedMonths: 24,
        },
        {
          name: "E-Government Services Launch",
          description: "Deploy digital government services and online public services",
          estimatedMonths: 30,
        },
        {
          name: "Digital Economy Development",
          description: "Support digital entrepreneurship and remote work initiatives",
          estimatedMonths: 36,
        },
      ],
      fundingSources: [
        "World Bank Digital Development Program",
        "Telecommunications Development Fund",
        "Private Sector Partnerships",
        "Digital Divide Reduction Initiatives",
      ],
      stakeholderCategories: ["Government Agencies", "Private Sector", "Academic Institutions", "Community Leaders"],
      expertiseRequired: ["Technology & Innovation", "Education & Training", "Infrastructure", "Policy & Governance"],
    },
  },
  {
    id: "health-resilience",
    name: "Community Health Resilience System",
    category: "Health & Wellbeing",
    description:
      "Strengthen healthcare systems and build community health resilience for emergencies and chronic diseases",
    icon: "🏥",
    estimatedDuration: "3-5 years",
    estimatedBudget: "$4-12 million",
    complexity: "High",
    primarySDGs: [3, 11],
    secondarySDGs: [1, 4, 5, 6, 10],
    template: {
      name: "Integrated Community Health Resilience and Emergency Preparedness System",
      description:
        "A comprehensive health system strengthening initiative that builds resilient healthcare infrastructure, enhances emergency preparedness, addresses chronic disease prevention, and improves health outcomes for all community members. The project will integrate traditional and modern healthcare approaches while ensuring equitable access to quality health services.",
      objectives: [
        "Strengthen primary healthcare infrastructure and services",
        "Build emergency response and disaster health preparedness capacity",
        "Implement chronic disease prevention and management programs",
        "Enhance maternal and child health services",
        "Integrate traditional medicine with modern healthcare approaches",
        "Develop community health worker networks and training programs",
      ],
      projectType: "Healthcare Improvement",
      priority: "critical",
      geographicScope: "island-wide",
      riskLevel: "medium",
      riskFactors: [
        "Limited healthcare workforce and specialist availability",
        "High costs of medical equipment and pharmaceuticals",
        "Geographic isolation affecting medical supply chains",
        "Climate change impacts on health (heat, vector-borne diseases)",
        "Emergency evacuation and referral system limitations",
      ],
      successMetrics: [
        "Reduction in preventable disease mortality rates",
        "Improvement in maternal and child health indicators",
        "Emergency response time and capacity metrics",
        "Community health worker coverage and effectiveness",
        "Patient satisfaction and health service utilization rates",
        "Health system resilience and preparedness scores",
      ],
      milestones: [
        {
          name: "Health System Assessment",
          description: "Comprehensive evaluation of current health infrastructure and needs",
          estimatedMonths: 6,
        },
        {
          name: "Infrastructure Upgrades",
          description: "Renovate health facilities and install essential medical equipment",
          estimatedMonths: 18,
        },
        {
          name: "Workforce Development",
          description: "Train healthcare workers and establish community health programs",
          estimatedMonths: 24,
        },
        {
          name: "Emergency Preparedness System",
          description: "Develop disaster response protocols and emergency medical capacity",
          estimatedMonths: 30,
        },
        {
          name: "Chronic Disease Programs",
          description: "Launch prevention and management programs for diabetes, hypertension",
          estimatedMonths: 36,
        },
        {
          name: "Telemedicine & Digital Health",
          description: "Implement remote consultation and digital health monitoring systems",
          estimatedMonths: 42,
        },
      ],
      fundingSources: [
        "World Health Organization",
        "Global Health Security Agenda",
        "Health System Strengthening Funds",
        "Disaster Risk Reduction Programs",
      ],
      stakeholderCategories: [
        "Government Agencies",
        "NGOs & Civil Society",
        "International Partners",
        "Community Leaders",
      ],
      expertiseRequired: [
        "Health & Wellbeing",
        "Community Development",
        "Technology & Innovation",
        "Education & Training",
      ],
    },
  },
]

// Helper functions for template management
export const getTemplatesByCategory = (category: string) => {
  return projectTemplates.filter((template) => template.category === category)
}

export const getTemplatesBySDG = (sdgId: number) => {
  return projectTemplates.filter(
    (template) => template.primarySDGs.includes(sdgId) || template.secondarySDGs.includes(sdgId),
  )
}

export const getTemplatesByComplexity = (complexity: "Low" | "Medium" | "High") => {
  return projectTemplates.filter((template) => template.complexity === complexity)
}

export const getAllCategories = () => {
  return [...new Set(projectTemplates.map((template) => template.category))]
}

export const getTemplateById = (id: string) => {
  return projectTemplates.find((template) => template.id === id)
}

// Function to convert template to project form data
export const templateToFormData = (template: ProjectTemplate) => {
  return {
    name: template.template.name,
    description: template.template.description,
    objectives: template.template.objectives,
    selectedSDGs: [...template.primarySDGs, ...template.secondarySDGs],
    projectType: template.template.projectType,
    priority: template.template.priority,
    startDate: undefined,
    endDate: undefined,
    budget: "",
    fundingSources: template.template.fundingSources,
    location: "",
    geographicScope: template.template.geographicScope,
    assignedStakeholders: [],
    riskLevel: template.template.riskLevel,
    riskFactors: template.template.riskFactors,
    successMetrics: template.template.successMetrics,
    milestones: template.template.milestones.map((milestone) => ({
      name: milestone.name,
      date: undefined,
      description: milestone.description,
    })),
  }
}
