export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      crop_cultivation_steps: {
        Row: {
          created_at: string | null
          crop_id: string | null
          description: string
          duration_days: number | null
          id: string
          image_url: string | null
          stage_name: string
          step_number: number
          tips: string | null
        }
        Insert: {
          created_at?: string | null
          crop_id?: string | null
          description: string
          duration_days?: number | null
          id?: string
          image_url?: string | null
          stage_name: string
          step_number: number
          tips?: string | null
        }
        Update: {
          created_at?: string | null
          crop_id?: string | null
          description?: string
          duration_days?: number | null
          id?: string
          image_url?: string | null
          stage_name?: string
          step_number?: number
          tips?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crop_cultivation_steps_crop_id_fkey"
            columns: ["crop_id"]
            isOneToOne: false
            referencedRelation: "crops"
            referencedColumns: ["id"]
          },
        ]
      }
      crops: {
        Row: {
          category: string | null
          created_at: string | null
          growth_duration_days: number | null
          id: string
          name: string
          temperature_range: string | null
          water_requirement: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          growth_duration_days?: number | null
          id?: string
          name: string
          temperature_range?: string | null
          water_requirement?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          growth_duration_days?: number | null
          id?: string
          name?: string
          temperature_range?: string | null
          water_requirement?: string | null
        }
        Relationships: []
      }
      district_crop_suitability: {
        Row: {
          created_at: string | null
          crop_id: string | null
          district_id: string | null
          estimated_yield: string | null
          expected_revenue: string | null
          harvest_months: string | null
          id: string
          market_price: string | null
          soil_requirements: string | null
          suitability_score: number | null
          temperature: string | null
          water_needs: string | null
        }
        Insert: {
          created_at?: string | null
          crop_id?: string | null
          district_id?: string | null
          estimated_yield?: string | null
          expected_revenue?: string | null
          harvest_months?: string | null
          id?: string
          market_price?: string | null
          soil_requirements?: string | null
          suitability_score?: number | null
          temperature?: string | null
          water_needs?: string | null
        }
        Update: {
          created_at?: string | null
          crop_id?: string | null
          district_id?: string | null
          estimated_yield?: string | null
          expected_revenue?: string | null
          harvest_months?: string | null
          id?: string
          market_price?: string | null
          soil_requirements?: string | null
          suitability_score?: number | null
          temperature?: string | null
          water_needs?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "district_crop_suitability_crop_id_fkey"
            columns: ["crop_id"]
            isOneToOne: false
            referencedRelation: "crops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "district_crop_suitability_district_id_fkey"
            columns: ["district_id"]
            isOneToOne: false
            referencedRelation: "districts"
            referencedColumns: ["id"]
          },
        ]
      }
      districts: {
        Row: {
          avg_rainfall: number | null
          climate_zone: string | null
          created_at: string | null
          id: string
          name: string
          soil_type: string | null
          state: string | null
        }
        Insert: {
          avg_rainfall?: number | null
          climate_zone?: string | null
          created_at?: string | null
          id?: string
          name: string
          soil_type?: string | null
          state?: string | null
        }
        Update: {
          avg_rainfall?: number | null
          climate_zone?: string | null
          created_at?: string | null
          id?: string
          name?: string
          soil_type?: string | null
          state?: string | null
        }
        Relationships: []
      }
      farmer_crop_experience: {
        Row: {
          challenges: string | null
          created_at: string | null
          crop_id: string | null
          district_id: string | null
          farmer_id: string | null
          id: string
          tips: string | null
          willing_to_help: boolean | null
          year: number | null
          yield_achieved: string | null
        }
        Insert: {
          challenges?: string | null
          created_at?: string | null
          crop_id?: string | null
          district_id?: string | null
          farmer_id?: string | null
          id?: string
          tips?: string | null
          willing_to_help?: boolean | null
          year?: number | null
          yield_achieved?: string | null
        }
        Update: {
          challenges?: string | null
          created_at?: string | null
          crop_id?: string | null
          district_id?: string | null
          farmer_id?: string | null
          id?: string
          tips?: string | null
          willing_to_help?: boolean | null
          year?: number | null
          yield_achieved?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "farmer_crop_experience_crop_id_fkey"
            columns: ["crop_id"]
            isOneToOne: false
            referencedRelation: "crops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "farmer_crop_experience_district_id_fkey"
            columns: ["district_id"]
            isOneToOne: false
            referencedRelation: "districts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "farmer_crop_experience_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      farmer_messages: {
        Row: {
          created_at: string | null
          crop_id: string | null
          id: string
          message: string
          read: boolean | null
          receiver_id: string | null
          sender_id: string | null
          subject: string
        }
        Insert: {
          created_at?: string | null
          crop_id?: string | null
          id?: string
          message: string
          read?: boolean | null
          receiver_id?: string | null
          sender_id?: string | null
          subject: string
        }
        Update: {
          created_at?: string | null
          crop_id?: string | null
          id?: string
          message?: string
          read?: boolean | null
          receiver_id?: string | null
          sender_id?: string | null
          subject?: string
        }
        Relationships: [
          {
            foreignKeyName: "farmer_messages_crop_id_fkey"
            columns: ["crop_id"]
            isOneToOne: false
            referencedRelation: "crops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "farmer_messages_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "farmer_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      help_requests: {
        Row: {
          created_at: string | null
          crop_id: string | null
          farmer_id: string | null
          id: string
          question: string
          status: string | null
        }
        Insert: {
          created_at?: string | null
          crop_id?: string | null
          farmer_id?: string | null
          id?: string
          question: string
          status?: string | null
        }
        Update: {
          created_at?: string | null
          crop_id?: string | null
          farmer_id?: string | null
          id?: string
          question?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "help_requests_crop_id_fkey"
            columns: ["crop_id"]
            isOneToOne: false
            referencedRelation: "crops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "help_requests_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      help_responses: {
        Row: {
          created_at: string | null
          helpful_count: number | null
          id: string
          request_id: string | null
          responder_id: string | null
          response: string
        }
        Insert: {
          created_at?: string | null
          helpful_count?: number | null
          id?: string
          request_id?: string | null
          responder_id?: string | null
          response: string
        }
        Update: {
          created_at?: string | null
          helpful_count?: number | null
          id?: string
          request_id?: string | null
          responder_id?: string | null
          response?: string
        }
        Relationships: [
          {
            foreignKeyName: "help_responses_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "help_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "help_responses_responder_id_fkey"
            columns: ["responder_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          bio: string | null
          created_at: string | null
          district: string | null
          district_id: string | null
          experience_years: number | null
          farm_size: number | null
          full_name: string | null
          id: string
          phone: string | null
          preferred_language: string | null
          updated_at: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          district?: string | null
          district_id?: string | null
          experience_years?: number | null
          farm_size?: number | null
          full_name?: string | null
          id: string
          phone?: string | null
          preferred_language?: string | null
          updated_at?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          district?: string | null
          district_id?: string | null
          experience_years?: number | null
          farm_size?: number | null
          full_name?: string | null
          id?: string
          phone?: string | null
          preferred_language?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_district_id_fkey"
            columns: ["district_id"]
            isOneToOne: false
            referencedRelation: "districts"
            referencedColumns: ["id"]
          },
        ]
      }
      support_contacts: {
        Row: {
          address: string | null
          contact_type: string
          created_at: string | null
          designation: string | null
          district_id: string | null
          email: string | null
          id: string
          name: string
          phone: string | null
          specialization: string | null
          verified: boolean | null
        }
        Insert: {
          address?: string | null
          contact_type: string
          created_at?: string | null
          designation?: string | null
          district_id?: string | null
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          specialization?: string | null
          verified?: boolean | null
        }
        Update: {
          address?: string | null
          contact_type?: string
          created_at?: string | null
          designation?: string | null
          district_id?: string | null
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          specialization?: string | null
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "support_contacts_district_id_fkey"
            columns: ["district_id"]
            isOneToOne: false
            referencedRelation: "districts"
            referencedColumns: ["id"]
          },
        ]
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
