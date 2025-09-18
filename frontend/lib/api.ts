const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

interface Project {
  id: number;
  name: string;
  timeline?: {
    end_date: string;
    total_budget: number;
  };
  priority: string;
  created_at: string;
  funding_sources?: Array<{
    amount: number;
  }>;
  sdgs?: Array<{
    title: string;
    color: string;
  }>;
  sdg_targets?: Array<{
    id: number;
    target_number: string;
    title: string;
    description: string;
    goal: {
      id: number;
      number: number;
      title: string;
      color: string;
    };
  }>;
}

interface Milestone {
  id: number;
  title: string;
  due_date: string;
  completed: boolean;
  project: {
    name: string;
  };
}

interface DashboardData {
  projectStats: {
    total: number;
    active: number;
    completed: number;
    onHold: number;
  };
  budgetData: Array<{
    month: string;
    planned: number;
    actual: number;
  }>;
  sdgDistribution: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  recentActivity: Array<{
    id: number;
    type: string;
    message: string;
    project: string;
    time: string;
    status: string;
  }>;
  upcomingMilestones: Array<{
    id: number;
    title: string;
    project: string;
    dueDate: string;
    status: string;
    progress: number;
  }>;
}

class ApiClient {
  private baseURL: string
  private token: string | null = null

  constructor() {
    this.baseURL = API_BASE_URL
    // Get token from localStorage if available
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('access_token')
    }
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`

    const headers = new Headers({
      'Content-Type': 'application/json',
    })

    if (this.token) {
      headers.append('Authorization', `Bearer ${this.token}`)
    }

    // Add any additional headers from options
    if (options.headers) {
      if (options.headers instanceof Headers) {
        options.headers.forEach((value, key) => {
          headers.append(key, value)
        })
      } else if (typeof options.headers === 'object') {
        Object.entries(options.headers).forEach(([key, value]) => {
          headers.append(key, value)
        })
      }
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      console.error('API Error Response:', error)
      throw new Error(error.detail || error.message || `API Error: ${response.status}`)
    }

    return response.json()
  }

  // Auth methods
  async login(email: string, password: string) {
    const response = await this.request('/token/', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    return response
  }

  async register(userData: {
    username: string
    email: string
    password: string
    first_name: string
    last_name: string
    organization_type: string
    organization_name: string
    country: string
    phone_number?: string
    website?: string
    job_title?: string
    focus_areas?: string[]
    project_experience?: string
    motivation?: string
    subscribe_to_updates?: boolean
  }) {
    // First create the client
    const clientData = {
      name: userData.organization_name,
      organization_type: userData.organization_type,
      organization_name: userData.organization_name,
      country: userData.country,
      phone_number: userData.phone_number,
      website: userData.website,
    }

    const client = await this.request('/clients/', {
      method: 'POST',
      body: JSON.stringify(clientData),
    })

    // Then create the user with the client ID
    const userRegistrationData = {
      username: userData.username,
      email: userData.email,
      password: userData.password,
      first_name: userData.first_name,
      last_name: userData.last_name,
      client: client.id,
      role: 'ADMIN',
      job_title: userData.job_title,
      focus_areas: userData.focus_areas,
      project_experience: userData.project_experience,
      motivation: userData.motivation,
      subscribe_to_updates: userData.subscribe_to_updates,
    }

    return this.request('/users/', {
      method: 'POST',
      body: JSON.stringify(userRegistrationData),
    })
  }

  async refreshToken() {
    const refresh = localStorage.getItem('refresh_token')
    if (!refresh) throw new Error('No refresh token available')

    const data = await this.request('/token/refresh/', {
      method: 'POST',
      body: JSON.stringify({ refresh }),
    })

    if (data.access) {
      this.token = data.access
      localStorage.setItem('access_token', data.access)
    }

    return data
  }

  async logout() {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    this.token = null
  }

  // Project methods
  async getProjects() {
    return this.request('/projects/projects/')
  }

  async getProject(id: string) {
    return this.request(`/projects/projects/${id}/`)
  }

  async getSDGTargets(goalId?: number) {
    if (goalId) {
      return this.request(`/projects/sdg-targets/by_goal/?goal_id=${goalId}`)
    }
    return this.request('/projects/sdg-targets/')
  }

  async getSDGGoals() {
    return this.request('/projects/sdgs/')
  }

  async createProject(projectData: any) {
    return this.request('/projects/projects/', {
      method: 'POST',
      body: JSON.stringify(projectData),
    })
  }

  async updateProject(id: string, projectData: any) {
    return this.request(`/projects/projects/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(projectData),
    })
  }

  async getDashboardData(): Promise<DashboardData> {
    try {
      const response = await this.request('/projects/dashboard/', {
        method: 'GET',
      })

      if (!response) {
        throw new Error('No data received from server')
      }

      return response as DashboardData
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      throw error
    }
  }

  async getProfile() {
    return this.request('/users/me/')
  }

  // Generic HTTP methods
  async get(endpoint: string) {
    return this.request(endpoint)
  }

  async post(endpoint: string, data?: any) {
    return this.request(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put(endpoint: string, data?: any) {
    return this.request(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete(endpoint: string) {
    return this.request(endpoint, {
      method: 'DELETE',
    })
  }

  // Utility methods
  isValidUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    return uuidRegex.test(uuid)
  }

  // Project collaborator methods
  async getProjectCollaborators(projectId: string) {
    return this.request(`/project_collaborators/${projectId}/`)
  }

  // Stakeholder methods
  async getStakeholders() {
    return this.request('/stakeholders/')
  }

  async createStakeholder(stakeholderData: any) {
    return this.request('/stakeholders/', {
      method: 'POST',
      body: JSON.stringify(stakeholderData),
    })
  }

  async updateStakeholder(id: string, stakeholderData: any) {
    return this.request(`/stakeholders/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(stakeholderData),
    })
  }

  async deleteStakeholder(id: string) {
    return this.request(`/stakeholders/${id}/`, {
      method: 'DELETE',
    })
  }
}

export const apiClient = new ApiClient()

// Add a hook to use the API client
export function useApi() {
  return apiClient
}