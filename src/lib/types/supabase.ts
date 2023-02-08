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
      projects: {
        Row: {
          collaborators: string[] | null
          created_at: string | null
          id: string
          is_public: boolean
          owner: string
        }
        Insert: {
          collaborators?: string[] | null
          created_at?: string | null
          id?: string
          is_public?: boolean
          owner: string
        }
        Update: {
          collaborators?: string[] | null
          created_at?: string | null
          id?: string
          is_public?: boolean
          owner?: string
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
  }
}
