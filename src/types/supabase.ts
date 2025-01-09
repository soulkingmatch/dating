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
      profiles: {
        Row: {
          id: string
          username: string | null
          full_name: string | null
          bio: string | null
          birth_date: string | null
          gender: string | null
          looking_for: string[] | null
          location: [number, number] | null
          avatar_url: string | null
          video_url: string | null
          favorite_llms: string[]
          ai_tools: string[]
          ai_interests: string[]
          ai_use_case: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          full_name?: string | null
          bio?: string | null
          birth_date?: string | null
          gender?: string | null
          looking_for?: string[] | null
          location?: [number, number] | null
          avatar_url?: string | null
          video_url?: string | null
          favorite_llms?: string[]
          ai_tools?: string[]
          ai_interests?: string[]
          ai_use_case?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          full_name?: string | null
          bio?: string | null
          birth_date?: string | null
          gender?: string | null
          looking_for?: string[] | null
          location?: [number, number] | null
          avatar_url?: string | null
          video_url?: string | null
          favorite_llms?: string[]
          ai_tools?: string[]
          ai_interests?: string[]
          ai_use_case?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      matches: {
        Row: {
          id: string
          user1_id: string
          user2_id: string
          status: 'pending' | 'accepted' | 'rejected'
          created_at: string
        }
        Insert: {
          id?: string
          user1_id: string
          user2_id: string
          status: 'pending' | 'accepted' | 'rejected'
          created_at?: string
        }
        Update: {
          id?: string
          user1_id?: string
          user2_id?: string
          status?: 'pending' | 'accepted' | 'rejected'
          created_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          plan_id: string
          status: 'active' | 'canceled' | 'past_due'
          stripe_subscription_id: string
          current_period_end: string
          cancel_at_period_end: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          plan_id: string
          status: 'active' | 'canceled' | 'past_due'
          stripe_subscription_id: string
          current_period_end: string
          cancel_at_period_end?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          plan_id?: string
          status?: 'active' | 'canceled' | 'past_due'
          stripe_subscription_id?: string
          current_period_end?: string
          cancel_at_period_end?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}