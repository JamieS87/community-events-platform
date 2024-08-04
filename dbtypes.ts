export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      calendar_events: {
        Row: {
          calendar_event_id: string
          event_id: number
          id: number
          user_id: string
        }
        Insert: {
          calendar_event_id: string
          event_id: number
          id?: never
          user_id: string
        }
        Update: {
          calendar_event_id?: string
          event_id?: number
          id?: never
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "calendar_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          customer_id: string
          user_id: string
        }
        Insert: {
          customer_id: string
          user_id: string
        }
        Update: {
          customer_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "customers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string
          description: string
          end_date: string
          end_time: string
          id: number
          name: string | null
          price: number
          pricing_model: Database["public"]["Enums"]["pricing_model"]
          published: boolean
          start_date: string
          start_time: string
          thumbnail: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          description?: string
          end_date?: string
          end_time?: string
          id?: never
          name?: string | null
          price?: number
          pricing_model?: Database["public"]["Enums"]["pricing_model"]
          published?: boolean
          start_date?: string
          start_time?: string
          thumbnail?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          description?: string
          end_date?: string
          end_time?: string
          id?: never
          name?: string | null
          price?: number
          pricing_model?: Database["public"]["Enums"]["pricing_model"]
          published?: boolean
          start_date?: string
          start_time?: string
          thumbnail?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          googlerefreshtoken: string | null
          is_staff: boolean | null
          user_id: string
        }
        Insert: {
          googlerefreshtoken?: string | null
          is_staff?: boolean | null
          user_id: string
        }
        Update: {
          googlerefreshtoken?: string | null
          is_staff?: boolean | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_googlerefreshtoken_fkey"
            columns: ["googlerefreshtoken"]
            isOneToOne: false
            referencedRelation: "decrypted_secrets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_googlerefreshtoken_fkey"
            columns: ["googlerefreshtoken"]
            isOneToOne: false
            referencedRelation: "secrets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      purchased_events: {
        Row: {
          cs_id: string | null
          description: string | null
          end_date: string | null
          end_time: string | null
          event_id: number
          id: number
          name: string | null
          price: number | null
          pricing_model: Database["public"]["Enums"]["pricing_model"] | null
          start_date: string | null
          start_time: string | null
          thumbnail: string | null
          user_id: string
          wh_event_id: string | null
        }
        Insert: {
          cs_id?: string | null
          description?: string | null
          end_date?: string | null
          end_time?: string | null
          event_id: number
          id?: never
          name?: string | null
          price?: number | null
          pricing_model?: Database["public"]["Enums"]["pricing_model"] | null
          start_date?: string | null
          start_time?: string | null
          thumbnail?: string | null
          user_id: string
          wh_event_id?: string | null
        }
        Update: {
          cs_id?: string | null
          description?: string | null
          end_date?: string | null
          end_time?: string | null
          event_id?: number
          id?: never
          name?: string | null
          price?: number | null
          pricing_model?: Database["public"]["Enums"]["pricing_model"] | null
          start_date?: string | null
          start_time?: string | null
          thumbnail?: string | null
          user_id?: string
          wh_event_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "purchased_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      custom_access_token_hook: {
        Args: {
          event: Json
        }
        Returns: Json
      }
      get_google_refresh_token: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      set_google_refresh_token: {
        Args: {
          refresh_token: string
        }
        Returns: undefined
      }
    }
    Enums: {
      pricing_model: "free" | "paid" | "payf"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

