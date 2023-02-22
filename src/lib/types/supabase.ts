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
          collaborators: string[] | null
          created_at: string
          data: Json
          description: string | null
          history: Json[]
          id: string
          is_public: boolean
          name: string
          owner: string
          type: string | null
        }
        Insert: {
          collaborators?: string[] | null
          created_at?: string
          data: Json
          description?: string | null
          history?: Json[]
          id?: string
          is_public?: boolean
          name: string
          owner: string
          type?: string | null
        }
        Update: {
          collaborators?: string[] | null
          created_at?: string
          data?: Json
          description?: string | null
          history?: Json[]
          id?: string
          is_public?: boolean
          name?: string
          owner?: string
          type?: string | null
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
