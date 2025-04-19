export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      countries: {
        Row: {
          id: number
          name: string
          iso: string
          available: boolean
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          iso: string
          available?: boolean
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          iso?: string
          available?: boolean
          created_at?: string
        }
      }
      services: {
        Row: {
          id: number
          name: string
          description: string | null
          price: number
          available: boolean
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          description?: string | null
          price: number
          available?: boolean
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          description?: string | null
          price?: number
          available?: boolean
          created_at?: string
        }
      }
      users: {
        Row: {
          id: string
          auth_id: string | null
          name: string | null
          email: string | null
          balance: number
          created_at: string
        }
        Insert: {
          id?: string
          auth_id?: string | null
          name?: string | null
          email?: string | null
          balance?: number
          created_at?: string
        }
        Update: {
          id?: string
          auth_id?: string | null
          name?: string | null
          email?: string | null
          balance?: number
          created_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          amount: number
          type: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          type: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          amount?: number
          type?: string
          description?: string | null
          created_at?: string
        }
      }
      sms_requests: {
        Row: {
          id: string
          user_id: string
          service_id: number | null
          country_id: number | null
          phone_number: string | null
          code: string | null
          status: string
          request_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          service_id?: number | null
          country_id?: number | null
          phone_number?: string | null
          code?: string | null
          status?: string
          request_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          service_id?: number | null
          country_id?: number | null
          phone_number?: string | null
          code?: string | null
          status?: string
          request_id?: string | null
          created_at?: string
          updated_at?: string
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
