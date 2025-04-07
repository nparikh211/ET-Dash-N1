export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      crm_entries: {
        Row: {
          id: number
          status: 'Contracted' | 'Hired In-Seat' | 'Terminated'
          company_name: string
          personnel_name: string
          position: string
          start_date: string
          end_date: string | null
          hiring_manager: string
          cost: number
          exordiom_rate: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          status: 'Contracted' | 'Hired In-Seat' | 'Terminated'
          company_name: string
          personnel_name: string
          position: string
          start_date: string
          end_date?: string | null
          hiring_manager: string
          cost: number
          exordiom_rate: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          status?: 'Contracted' | 'Hired In-Seat' | 'Terminated'
          company_name?: string
          personnel_name?: string
          position?: string
          start_date?: string
          end_date?: string | null
          hiring_manager?: string
          cost?: number
          exordiom_rate?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      customers: {
        Row: {
          id: number
          company_name: string
          is_churned: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          company_name: string
          is_churned?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          company_name?: string
          is_churned?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          id: number
          table_name: string
          record_id: number
          action: 'INSERT' | 'UPDATE' | 'DELETE'
          old_data: Json | null
          new_data: Json | null
          created_at: string
          user_id: string | null
        }
        Insert: {
          id?: number
          table_name: string
          record_id: number
          action: 'INSERT' | 'UPDATE' | 'DELETE'
          old_data?: Json | null
          new_data?: Json | null
          created_at?: string
          user_id?: string | null
        }
        Update: {
          id?: number
          table_name?: string
          record_id?: number
          action?: 'INSERT' | 'UPDATE' | 'DELETE'
          old_data?: Json | null
          new_data?: Json | null
          created_at?: string
          user_id?: string | null
        }
        Relationships: []
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
