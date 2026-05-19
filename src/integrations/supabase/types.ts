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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      briefs: {
        Row: {
          additional_notes: string | null
          admin_notes: string | null
          brand_colors: string | null
          brand_fonts: string | null
          brand_notes: string | null
          budget_range: string | null
          client_email: string
          client_name: string
          client_phone: string | null
          company_name: string | null
          created_at: string
          document_urls: Json | null
          goals: string | null
          has_logo: boolean | null
          id: string
          image_urls: Json | null
          inspiration: string | null
          logo_urls: Json | null
          project_description: string | null
          project_title: string
          project_type: string
          status: string
          target_audience: string | null
          timeline: string | null
          updated_at: string
          wants_logo_design: boolean | null
        }
        Insert: {
          additional_notes?: string | null
          admin_notes?: string | null
          brand_colors?: string | null
          brand_fonts?: string | null
          brand_notes?: string | null
          budget_range?: string | null
          client_email: string
          client_name: string
          client_phone?: string | null
          company_name?: string | null
          created_at?: string
          document_urls?: Json | null
          goals?: string | null
          has_logo?: boolean | null
          id?: string
          image_urls?: Json | null
          inspiration?: string | null
          logo_urls?: Json | null
          project_description?: string | null
          project_title: string
          project_type: string
          status?: string
          target_audience?: string | null
          timeline?: string | null
          updated_at?: string
          wants_logo_design?: boolean | null
        }
        Update: {
          additional_notes?: string | null
          admin_notes?: string | null
          brand_colors?: string | null
          brand_fonts?: string | null
          brand_notes?: string | null
          budget_range?: string | null
          client_email?: string
          client_name?: string
          client_phone?: string | null
          company_name?: string | null
          created_at?: string
          document_urls?: Json | null
          goals?: string | null
          has_logo?: boolean | null
          id?: string
          image_urls?: Json | null
          inspiration?: string | null
          logo_urls?: Json | null
          project_description?: string | null
          project_title?: string
          project_type?: string
          status?: string
          target_audience?: string | null
          timeline?: string | null
          updated_at?: string
          wants_logo_design?: boolean | null
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          metadata: Json | null
          order_id: string | null
          role: string
          session_token: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          metadata?: Json | null
          order_id?: string | null
          role: string
          session_token: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          order_id?: string | null
          role?: string
          session_token?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          auth_id: string | null
          created_at: string
          email: string | null
          id: string
          name: string | null
          phone: string | null
          session_token: string | null
          updated_at: string
        }
        Insert: {
          auth_id?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
          phone?: string | null
          session_token?: string | null
          updated_at?: string
        }
        Update: {
          auth_id?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
          phone?: string | null
          session_token?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          admin_notes: string | null
          chat_summary: string | null
          client_id: string | null
          created_at: string
          discount_pct: number | null
          discount_usd: number | null
          id: string
          invoice_number: string | null
          line_items: Json | null
          notes: string | null
          payment_method: string | null
          payment_reference: string | null
          services_summary: string | null
          status: string
          subtotal_usd: number | null
          total_usd: number | null
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          chat_summary?: string | null
          client_id?: string | null
          created_at?: string
          discount_pct?: number | null
          discount_usd?: number | null
          id?: string
          invoice_number?: string | null
          line_items?: Json | null
          notes?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          services_summary?: string | null
          status?: string
          subtotal_usd?: number | null
          total_usd?: number | null
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          chat_summary?: string | null
          client_id?: string | null
          created_at?: string
          discount_pct?: number | null
          discount_usd?: number | null
          id?: string
          invoice_number?: string | null
          line_items?: Json | null
          notes?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          services_summary?: string | null
          status?: string
          subtotal_usd?: number | null
          total_usd?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount_usd: number
          created_at: string
          gateway_response: Json | null
          id: string
          method: string
          order_id: string
          paid_at: string | null
          status: string
          transaction_reference: string | null
        }
        Insert: {
          amount_usd: number
          created_at?: string
          gateway_response?: Json | null
          id?: string
          method: string
          order_id: string
          paid_at?: string | null
          status?: string
          transaction_reference?: string | null
        }
        Update: {
          amount_usd?: number
          created_at?: string
          gateway_response?: Json | null
          id?: string
          method?: string
          order_id?: string
          paid_at?: string | null
          status?: string
          transaction_reference?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          base_price_usd: number
          created_at: string
          description: string | null
          example_scopes: string[] | null
          id: string
          is_active: boolean | null
          name: string
        }
        Insert: {
          base_price_usd: number
          created_at?: string
          description?: string | null
          example_scopes?: string[] | null
          id?: string
          is_active?: boolean | null
          name: string
        }
        Update: {
          base_price_usd?: number
          created_at?: string
          description?: string | null
          example_scopes?: string[] | null
          id?: string
          is_active?: boolean | null
          name?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
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
      generate_invoice_number: { Args: never; Returns: string }
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "user"
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
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
