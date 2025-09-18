export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string
          name: string
          description: string
          created_at: string
          updated_at: string
          created_by: string
          data: Json
          status: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          created_at?: string
          updated_at?: string
          created_by: string
          data: Json
          status?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          created_at?: string
          updated_at?: string
          created_by?: string
          data?: Json
          status?: string
        }
      }
      project_collaborators: {
        Row: {
          id: string
          project_id: string
          user_id: string
          role: string
          added_at: string
        }
        Insert: {
          id?: string
          project_id: string
          user_id: string
          role: string
          added_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          user_id?: string
          role?: string
          added_at?: string
        }
      }
      project_comments: {
        Row: {
          id: string
          project_id: string
          user_id: string
          content: string
          created_at: string
          parent_id: string | null
          section: string | null
        }
        Insert: {
          id?: string
          project_id: string
          user_id: string
          content: string
          created_at?: string
          parent_id?: string | null
          section?: string | null
        }
        Update: {
          id?: string
          project_id?: string
          user_id?: string
          content?: string
          created_at?: string
          parent_id?: string | null
          section?: string | null
        }
      }
      project_activity: {
        Row: {
          id: string
          project_id: string
          user_id: string
          action: string
          details: Json
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          user_id: string
          action: string
          details: Json
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          user_id?: string
          action?: string
          details?: Json
          created_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string
          avatar_url: string | null
          organization: string | null
          role: string | null
          created_at: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          avatar_url?: string | null
          organization?: string | null
          role?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          avatar_url?: string | null
          organization?: string | null
          role?: string | null
          created_at?: string
        }
      }
      user_presence: {
        Row: {
          id: string
          user_id: string
          project_id: string
          last_seen: string
          current_section: string | null
        }
        Insert: {
          id?: string
          user_id: string
          project_id: string
          last_seen?: string
          current_section?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          project_id?: string
          last_seen?: string
          current_section?: string | null
        }
      }
    }
  }
}
