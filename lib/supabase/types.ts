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
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
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
      authors: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          id: string
          location: string | null
          name: string
          slug: string
          social_links: Json
          title: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          id?: string
          location?: string | null
          name: string
          slug: string
          social_links?: Json
          title?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          id?: string
          location?: string | null
          name?: string
          slug?: string
          social_links?: Json
          title?: string | null
        }
        Relationships: []
      }
      honorees: {
        Row: {
          citation: string | null
          created_at: string
          discipline: string | null
          id: string
          list_year: number
          name: string
          portrait_url: string | null
          published: boolean
          rank: number | null
          related_post_id: string | null
          title: string | null
        }
        Insert: {
          citation?: string | null
          created_at?: string
          discipline?: string | null
          id?: string
          list_year: number
          name: string
          portrait_url?: string | null
          published?: boolean
          rank?: number | null
          related_post_id?: string | null
          title?: string | null
        }
        Update: {
          citation?: string | null
          created_at?: string
          discipline?: string | null
          id?: string
          list_year?: number
          name?: string
          portrait_url?: string | null
          published?: boolean
          rank?: number | null
          related_post_id?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "honorees_related_post_id_fkey"
            columns: ["related_post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      magazine_issues: {
        Row: {
          cover_image_url: string | null
          created_at: string
          id: string
          is_current: boolean
          issue_number: number
          release_date: string | null
          summary: string | null
          title: string
        }
        Insert: {
          cover_image_url?: string | null
          created_at?: string
          id?: string
          is_current?: boolean
          issue_number: number
          release_date?: string | null
          summary?: string | null
          title: string
        }
        Update: {
          cover_image_url?: string | null
          created_at?: string
          id?: string
          is_current?: boolean
          issue_number?: number
          release_date?: string | null
          summary?: string | null
          title?: string
        }
        Relationships: []
      }
      media: {
        Row: {
          alt_text: string
          created_at: string
          filename: string
          id: string
          uploaded_by: string | null
          url: string
        }
        Insert: {
          alt_text: string
          created_at?: string
          filename: string
          id?: string
          uploaded_by?: string | null
          url: string
        }
        Update: {
          alt_text?: string
          created_at?: string
          filename?: string
          id?: string
          uploaded_by?: string | null
          url?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          amount: number
          created_at: string
          customer_email: string
          download_token: string | null
          id: string
          product_id: string
          status: string
          stripe_session_id: string
          ticket_code: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          customer_email: string
          download_token?: string | null
          id?: string
          product_id: string
          status?: string
          stripe_session_id: string
          ticket_code?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          customer_email?: string
          download_token?: string | null
          id?: string
          product_id?: string
          status?: string
          stripe_session_id?: string
          ticket_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      post_revisions: {
        Row: {
          body: Json
          created_at: string
          edited_by: string | null
          id: string
          post_id: string
          title: string
        }
        Insert: {
          body: Json
          created_at?: string
          edited_by?: string | null
          id?: string
          post_id: string
          title: string
        }
        Update: {
          body?: Json
          created_at?: string
          edited_by?: string | null
          id?: string
          post_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_revisions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      post_slug_redirects: {
        Row: {
          created_at: string
          old_slug: string
          post_id: string
        }
        Insert: {
          created_at?: string
          old_slug: string
          post_id: string
        }
        Update: {
          created_at?: string
          old_slug?: string
          post_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_slug_redirects_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          author_id: string
          body: Json
          category: Database["public"]["Enums"]["post_category"]
          created_at: string
          dek: string | null
          featured: boolean
          hero_image_url: string | null
          id: string
          meta: Json
          og_image_url: string | null
          placement: Database["public"]["Enums"]["post_placement"] | null
          published_at: string | null
          reading_time: number | null
          related_issue_id: string | null
          scheduled_for: string | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          status: Database["public"]["Enums"]["post_status"]
          title: string
          updated_at: string
        }
        Insert: {
          author_id: string
          body?: Json
          category: Database["public"]["Enums"]["post_category"]
          created_at?: string
          dek?: string | null
          featured?: boolean
          hero_image_url?: string | null
          id?: string
          meta?: Json
          og_image_url?: string | null
          placement?: Database["public"]["Enums"]["post_placement"] | null
          published_at?: string | null
          reading_time?: number | null
          related_issue_id?: string | null
          scheduled_for?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          status?: Database["public"]["Enums"]["post_status"]
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          body?: Json
          category?: Database["public"]["Enums"]["post_category"]
          created_at?: string
          dek?: string | null
          featured?: boolean
          hero_image_url?: string | null
          id?: string
          meta?: Json
          og_image_url?: string | null
          placement?: Database["public"]["Enums"]["post_placement"] | null
          published_at?: string | null
          reading_time?: number | null
          related_issue_id?: string | null
          scheduled_for?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["post_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "authors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_related_issue_id_fkey"
            columns: ["related_issue_id"]
            isOneToOne: false
            referencedRelation: "magazine_issues"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          created_at: string
          description: string | null
          digital_file_url: string | null
          event_date: string | null
          event_location: string | null
          id: string
          image_url: string | null
          inventory: number | null
          name: string
          price: number
          published: boolean
          slug: string
          stripe_price_id: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          digital_file_url?: string | null
          event_date?: string | null
          event_location?: string | null
          id?: string
          image_url?: string | null
          inventory?: number | null
          name: string
          price: number
          published?: boolean
          slug: string
          stripe_price_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          digital_file_url?: string | null
          event_date?: string | null
          event_location?: string | null
          id?: string
          image_url?: string | null
          inventory?: number | null
          name?: string
          price?: number
          published?: boolean
          slug?: string
          stripe_price_id?: string | null
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
      post_category:
        | "article"
        | "news"
        | "spotlight"
        | "review"
        | "opportunity"
        | "festival"
        | "below_the_line"
        | "production"
        | "video"
        | "behind_the_lens"
      post_placement:
        | "today"
        | "spotlight_feature"
        | "fresh_face"
        | "call_sheet"
        | "below_the_line"
        | "production"
        | "cut"
        | "screening_room"
        | "behind_the_lens"
        | "opportunity"
        | "festival"
      post_status: "draft" | "scheduled" | "published"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      post_category: [
        "article",
        "news",
        "spotlight",
        "review",
        "opportunity",
        "festival",
        "below_the_line",
        "production",
        "video",
        "behind_the_lens",
      ],
      post_placement: [
        "today",
        "spotlight_feature",
        "fresh_face",
        "call_sheet",
        "below_the_line",
        "production",
        "cut",
        "screening_room",
        "behind_the_lens",
        "opportunity",
        "festival",
      ],
      post_status: ["draft", "scheduled", "published"],
    },
  },
} as const

