export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      blueprints: {
        Row: {
          author: string
          collaborators: string[] | null
          created_at: string
          data: Json
          description: string | null
          id: string
          is_public: boolean
          name: string
        }
        Insert: {
          author: string
          collaborators?: string[] | null
          created_at?: string
          data: Json
          description?: string | null
          id?: string
          is_public?: boolean
          name: string
        }
        Update: {
          author?: string
          collaborators?: string[] | null
          created_at?: string
          data?: Json
          description?: string | null
          id?: string
          is_public?: boolean
          name?: string
        }
      }
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
