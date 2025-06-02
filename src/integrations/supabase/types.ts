export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      cv_redesign_sessions: {
        Row: {
          created_at: string
          feedback_comments: string | null
          feedback_rating: number | null
          id: string
          redesigned_data: Json | null
          selected_template_id: string | null
          updated_at: string
          uploaded_cv_id: string | null
        }
        Insert: {
          created_at?: string
          feedback_comments?: string | null
          feedback_rating?: number | null
          id?: string
          redesigned_data?: Json | null
          selected_template_id?: string | null
          updated_at?: string
          uploaded_cv_id?: string | null
        }
        Update: {
          created_at?: string
          feedback_comments?: string | null
          feedback_rating?: number | null
          id?: string
          redesigned_data?: Json | null
          selected_template_id?: string | null
          updated_at?: string
          uploaded_cv_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cv_redesign_sessions_selected_template_id_fkey"
            columns: ["selected_template_id"]
            isOneToOne: false
            referencedRelation: "premium_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cv_redesign_sessions_uploaded_cv_id_fkey"
            columns: ["uploaded_cv_id"]
            isOneToOne: false
            referencedRelation: "uploaded_cvs"
            referencedColumns: ["id"]
          },
        ]
      }
      design_patterns: {
        Row: {
          confidence_score: number | null
          created_at: string
          id: string
          pattern_data: Json
          pattern_type: string
          template_id: string | null
          updated_at: string
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string
          id?: string
          pattern_data: Json
          pattern_type: string
          template_id?: string | null
          updated_at?: string
        }
        Update: {
          confidence_score?: number | null
          created_at?: string
          id?: string
          pattern_data?: Json
          pattern_type?: string
          template_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "design_patterns_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "premium_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      horse_identifications: {
        Row: {
          additional_data: Json | null
          breed: string | null
          confidence: number | null
          created_at: string
          description: string | null
          id: string
          image_url: string
          updated_at: string
          user_id: string
        }
        Insert: {
          additional_data?: Json | null
          breed?: string | null
          confidence?: number | null
          created_at?: string
          description?: string | null
          id?: string
          image_url: string
          updated_at?: string
          user_id: string
        }
        Update: {
          additional_data?: Json | null
          breed?: string | null
          confidence?: number | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      premium_templates: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string
          industry: string | null
          is_active: boolean
          name: string
          updated_at: string
          upload_date: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url: string
          industry?: string | null
          is_active?: boolean
          name: string
          updated_at?: string
          upload_date?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string
          industry?: string | null
          is_active?: boolean
          name?: string
          updated_at?: string
          upload_date?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          id: string
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id: string
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      resume_stats: {
        Row: {
          created_at: string
          daily_count: number
          id: string
          last_reset_date: string
          total_resumes_created: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          daily_count?: number
          id?: string
          last_reset_date?: string
          total_resumes_created?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          daily_count?: number
          id?: string
          last_reset_date?: string
          total_resumes_created?: number
          updated_at?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          stripe_customer_id: string | null
          subscription_status: Database["public"]["Enums"]["subscription_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          stripe_customer_id?: string | null
          subscription_status?: Database["public"]["Enums"]["subscription_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          stripe_customer_id?: string | null
          subscription_status?: Database["public"]["Enums"]["subscription_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      template_purchases: {
        Row: {
          amount: number
          created_at: string
          currency: string | null
          download_count: number | null
          id: string
          max_downloads: number | null
          status: string | null
          stripe_session_id: string
          template_name: string
          updated_at: string
          user_email: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string | null
          download_count?: number | null
          id?: string
          max_downloads?: number | null
          status?: string | null
          stripe_session_id: string
          template_name: string
          updated_at?: string
          user_email: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string | null
          download_count?: number | null
          id?: string
          max_downloads?: number | null
          status?: string | null
          stripe_session_id?: string
          template_name?: string
          updated_at?: string
          user_email?: string
        }
        Relationships: []
      }
      template_training_data: {
        Row: {
          ai_response: Json
          created_at: string
          feedback_score: number | null
          human_feedback: string | null
          id: string
          template_id: string | null
          training_prompt: string
        }
        Insert: {
          ai_response: Json
          created_at?: string
          feedback_score?: number | null
          human_feedback?: string | null
          id?: string
          template_id?: string | null
          training_prompt: string
        }
        Update: {
          ai_response?: Json
          created_at?: string
          feedback_score?: number | null
          human_feedback?: string | null
          id?: string
          template_id?: string | null
          training_prompt?: string
        }
        Relationships: [
          {
            foreignKeyName: "template_training_data_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "premium_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      uploaded_cvs: {
        Row: {
          created_at: string
          extracted_content: Json | null
          file_type: string
          file_url: string
          id: string
          original_filename: string
          processing_error: string | null
          processing_status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          extracted_content?: Json | null
          file_type: string
          file_url: string
          id?: string
          original_filename: string
          processing_error?: string | null
          processing_status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          extracted_content?: Json | null
          file_type?: string
          file_url?: string
          id?: string
          original_filename?: string
          processing_error?: string | null
          processing_status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_analysis_count: {
        Row: {
          created_at: string | null
          total_analyses: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          total_analyses?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          total_analyses?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_user_account: {
        Args: { target_user_id: string }
        Returns: undefined
      }
      get_resume_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          total_resumes: number
          daily_count: number
          last_updated: string
        }[]
      }
      has_role: {
        Args: { user_id: string; role: Database["public"]["Enums"]["app_role"] }
        Returns: boolean
      }
      increment_resume_count: {
        Args: Record<PropertyKey, never>
        Returns: {
          new_total: number
        }[]
      }
    }
    Enums: {
      app_role: "admin" | "user"
      subscription_status: "free" | "premium"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
      subscription_status: ["free", "premium"],
    },
  },
} as const
