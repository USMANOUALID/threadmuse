/**
 * Database types — hand-authored to match `supabase/migrations/0001_schema.sql`.
 *
 * After Phase 3 ships, regenerate with:
 *   supabase login && supabase link --project-ref <ref>
 *   pnpm db:types     # → supabase gen types typescript > types/database.ts
 *
 * Until then this file is the source of truth and is kept in sync by hand.
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          name: string;
          bio: string | null;
          location: string | null;
          website: string | null;
          avatar_url: string | null;
          cover_url: string | null;
          is_verified: boolean;
          is_admin: boolean;
          followers_count: number;
          following_count: number;
          uploads_count: number;
          saves_total: number;
          deleted_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          name: string;
          bio?: string | null;
          location?: string | null;
          website?: string | null;
          avatar_url?: string | null;
          cover_url?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };

      categories: {
        Row: {
          slug: string;
          name: string;
          icon: string;
          blurb: string | null;
          display_order: number;
          created_at: string;
        };
        Insert: { slug: string; name: string; icon: string; blurb?: string | null; display_order?: number };
        Update: Partial<Database["public"]["Tables"]["categories"]["Insert"]>;
        Relationships: [];
      };

      tags: {
        Row: { slug: string; name: string; usage_count: number; created_at: string };
        Insert: { slug: string; name: string };
        Update: Partial<Database["public"]["Tables"]["tags"]["Insert"]>;
        Relationships: [];
      };

      posts: {
        Row: {
          id: string;
          user_id: string;
          slug: string;
          title: string;
          description: string | null;
          kind: string;
          category: string;
          cover_image_url: string;
          cover_storage_path: string | null;
          gallery_image_urls: string[];
          gallery_storage_paths: string[];
          illustration_height: number;
          price: string;
          is_premium: boolean;
          etsy_url: string | null;
          status: "draft" | "published" | "removed" | "flagged";
          views: number;
          likes_count: number;
          saves_count: number;
          comments_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          slug: string;
          title: string;
          kind: string;
          category: string;
          cover_image_url: string;
          description?: string | null;
          cover_storage_path?: string | null;
          gallery_image_urls?: string[];
          gallery_storage_paths?: string[];
          illustration_height?: number;
          price?: string;
          is_premium?: boolean;
          etsy_url?: string | null;
          status?: "draft" | "published" | "removed" | "flagged";
        };
        Update: Partial<Database["public"]["Tables"]["posts"]["Insert"]>;
        Relationships: [
          { foreignKeyName: "posts_user_id_fkey"; columns: ["user_id"]; referencedRelation: "profiles"; referencedColumns: ["id"] },
          { foreignKeyName: "posts_category_fkey"; columns: ["category"]; referencedRelation: "categories"; referencedColumns: ["slug"] },
        ];
      };

      post_tags: {
        Row: { post_id: string; tag_slug: string };
        Insert: { post_id: string; tag_slug: string };
        Update: never;
        Relationships: [
          { foreignKeyName: "post_tags_post_id_fkey"; columns: ["post_id"]; referencedRelation: "posts"; referencedColumns: ["id"] },
          { foreignKeyName: "post_tags_tag_slug_fkey"; columns: ["tag_slug"]; referencedRelation: "tags"; referencedColumns: ["slug"] },
        ];
      };

      likes: {
        Row: { user_id: string; post_id: string; created_at: string };
        Insert: { user_id: string; post_id: string };
        Update: never;
        Relationships: [];
      };
      saves: {
        Row: { user_id: string; post_id: string; created_at: string };
        Insert: { user_id: string; post_id: string };
        Update: never;
        Relationships: [];
      };
      follows: {
        Row: { follower_id: string; following_id: string; created_at: string };
        Insert: { follower_id: string; following_id: string };
        Update: never;
        Relationships: [];
      };

      comments: {
        Row: {
          id: string;
          post_id: string;
          user_id: string;
          body: string;
          parent_id: string | null;
          likes_count: number;
          is_hidden: boolean;
          created_at: string;
        };
        Insert: { post_id: string; user_id: string; body: string; parent_id?: string | null };
        Update: Partial<Pick<Database["public"]["Tables"]["comments"]["Row"], "body" | "is_hidden">>;
        Relationships: [];
      };

      post_views: {
        Row: {
          id: number;
          post_id: string;
          user_id: string | null;
          session_id: string | null;
          referrer: string | null;
          utm_source: string | null;
          utm_campaign: string | null;
          created_at: string;
        };
        Insert: {
          post_id: string;
          user_id?: string | null;
          session_id?: string | null;
          referrer?: string | null;
          utm_source?: string | null;
          utm_campaign?: string | null;
        };
        Update: never;
        Relationships: [];
      };

      reports: {
        Row: {
          id: string;
          reporter_id: string | null;
          post_id: string | null;
          comment_id: string | null;
          reason: string;
          status: "open" | "reviewed" | "dismissed";
          created_at: string;
        };
        Insert: {
          reporter_id?: string | null;
          post_id?: string | null;
          comment_id?: string | null;
          reason: string;
        };
        Update: Partial<Pick<Database["public"]["Tables"]["reports"]["Row"], "status">>;
        Relationships: [];
      };

      plans: {
        Row: {
          id: string;
          product_id: string;
          name: string;
          description: string | null;
          interval: "month" | "year";
          amount_cents: number;
          currency: string;
          is_active: boolean;
          display_order: number;
          features: string[];
          max_published_posts: number;
          max_uploads_per_day: number;
          feature_ai_tagging: boolean;
          feature_priority_discovery: boolean;
          feature_advanced_analytics: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          product_id: string;
          name: string;
          interval: "month" | "year";
          amount_cents: number;
          description?: string | null;
          currency?: string;
          is_active?: boolean;
          display_order?: number;
          features?: string[];
          max_published_posts?: number;
          max_uploads_per_day?: number;
          feature_ai_tagging?: boolean;
          feature_priority_discovery?: boolean;
          feature_advanced_analytics?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["plans"]["Insert"]>;
        Relationships: [];
      };

      customers: {
        Row: {
          user_id: string;
          stripe_customer_id: string;
          email: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          stripe_customer_id: string;
          email?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["customers"]["Insert"]>;
        Relationships: [
          { foreignKeyName: "customers_user_id_fkey"; columns: ["user_id"]; referencedRelation: "profiles"; referencedColumns: ["id"] },
        ];
      };

      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          plan_id: string;
          status:
            | "trialing"
            | "active"
            | "past_due"
            | "canceled"
            | "incomplete"
            | "incomplete_expired"
            | "unpaid"
            | "paused";
          current_period_start: string;
          current_period_end: string;
          cancel_at_period_end: boolean;
          canceled_at: string | null;
          trial_end: string | null;
          latest_invoice_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          user_id: string;
          plan_id: string;
          status: Database["public"]["Tables"]["subscriptions"]["Row"]["status"];
          current_period_start: string;
          current_period_end: string;
          cancel_at_period_end?: boolean;
          canceled_at?: string | null;
          trial_end?: string | null;
          latest_invoice_id?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["subscriptions"]["Insert"]>;
        Relationships: [
          { foreignKeyName: "subscriptions_user_id_fkey"; columns: ["user_id"]; referencedRelation: "profiles"; referencedColumns: ["id"] },
          { foreignKeyName: "subscriptions_plan_id_fkey"; columns: ["plan_id"]; referencedRelation: "plans"; referencedColumns: ["id"] },
        ];
      };
    };
    Views: {
      current_plan: {
        Row: {
          user_id: string;
          plan_id: string;
          plan_name: string;
          status: Database["public"]["Tables"]["subscriptions"]["Row"]["status"] | null;
          current_period_end: string | null;
          cancel_at_period_end: boolean | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      record_post_view: {
        Args: { p_post_id: string; p_session_id?: string | null; p_referrer?: string | null };
        Returns: void;
      };
      slugify: {
        Args: { p_input: string };
        Returns: string;
      };
      get_or_null_stripe_customer: {
        Args: { p_user: string };
        Returns: string | null;
      };
    };
    Enums: {
      post_status: "draft" | "published" | "removed" | "flagged";
      subscription_status:
        | "trialing"
        | "active"
        | "past_due"
        | "canceled"
        | "incomplete"
        | "incomplete_expired"
        | "unpaid"
        | "paused";
    };
    CompositeTypes: Record<string, never>;
  };
}

// Convenience aliases re-used throughout the codebase.
export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
export type CategoryRow = Database["public"]["Tables"]["categories"]["Row"];
export type TagRow = Database["public"]["Tables"]["tags"]["Row"];
export type PostRow = Database["public"]["Tables"]["posts"]["Row"];
export type PostInsert = Database["public"]["Tables"]["posts"]["Insert"];
export type CommentRow = Database["public"]["Tables"]["comments"]["Row"];
export type PlanRow = Database["public"]["Tables"]["plans"]["Row"];
export type CustomerRow = Database["public"]["Tables"]["customers"]["Row"];
export type SubscriptionRow = Database["public"]["Tables"]["subscriptions"]["Row"];
export type CurrentPlanRow = Database["public"]["Views"]["current_plan"]["Row"];
