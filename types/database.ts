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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      audit_log: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          diff: Json
          entity: string
          entity_id: string | null
          id: string
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          diff?: Json
          entity: string
          entity_id?: string | null
          id?: string
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          diff?: Json
          entity?: string
          entity_id?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_log_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      authors: {
        Row: {
          avatar: string | null
          bio: string | null
          created_at: string
          id: string
          links: Json
          name: string
          profile_id: string | null
          role: string | null
          updated_at: string
        }
        Insert: {
          avatar?: string | null
          bio?: string | null
          created_at?: string
          id?: string
          links?: Json
          name: string
          profile_id?: string | null
          role?: string | null
          updated_at?: string
        }
        Update: {
          avatar?: string | null
          bio?: string | null
          created_at?: string
          id?: string
          links?: Json
          name?: string
          profile_id?: string | null
          role?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "authors_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          slug: string
          solution_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          slug: string
          solution_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          slug?: string
          solution_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_categories_solution_id_fkey"
            columns: ["solution_id"]
            isOneToOne: false
            referencedRelation: "public_solutions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_categories_solution_id_fkey"
            columns: ["solution_id"]
            isOneToOne: false
            referencedRelation: "solutions"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_post_revisions: {
        Row: {
          author_id: string | null
          body: string | null
          created_at: string
          excerpt: string | null
          id: string
          post_id: string
          title: string | null
        }
        Insert: {
          author_id?: string | null
          body?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          post_id: string
          title?: string | null
        }
        Update: {
          author_id?: string | null
          body?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          post_id?: string
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_post_revisions_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_post_revisions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_post_revisions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "public_blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author_id: string | null
          body: string | null
          category_id: string | null
          created_at: string
          excerpt: string | null
          featured_image: string | null
          id: string
          published_at: string | null
          reading_time: number | null
          seo_description: string | null
          seo_image: string | null
          seo_title: string | null
          slug: string
          status: Database["public"]["Enums"]["content_status"]
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          body?: string | null
          category_id?: string | null
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          published_at?: string | null
          reading_time?: number | null
          seo_description?: string | null
          seo_image?: string | null
          seo_title?: string | null
          slug: string
          status?: Database["public"]["Enums"]["content_status"]
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          body?: string | null
          category_id?: string | null
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          published_at?: string | null
          reading_time?: number | null
          seo_description?: string | null
          seo_image?: string | null
          seo_title?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["content_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "authors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "public_authors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "public_blog_posts"
            referencedColumns: ["author_id"]
          },
          {
            foreignKeyName: "blog_posts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "blog_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_posts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "public_blog_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_posts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "public_blog_posts"
            referencedColumns: ["category_id"]
          },
        ]
      }
      branches: {
        Row: {
          address: string
          county: string | null
          created_at: string
          hours: string
          id: string
          lat: number | null
          lng: number | null
          maps_url: string | null
          name: string
          phones: Json
          slug: string
          sort_order: number
          town: string
          updated_at: string
        }
        Insert: {
          address: string
          county?: string | null
          created_at?: string
          hours?: string
          id?: string
          lat?: number | null
          lng?: number | null
          maps_url?: string | null
          name: string
          phones?: Json
          slug: string
          sort_order?: number
          town: string
          updated_at?: string
        }
        Update: {
          address?: string
          county?: string | null
          created_at?: string
          hours?: string
          id?: string
          lat?: number | null
          lng?: number | null
          maps_url?: string | null
          name?: string
          phones?: Json
          slug?: string
          sort_order?: number
          town?: string
          updated_at?: string
        }
        Relationships: []
      }
      certifications: {
        Row: {
          created_at: string
          description: string | null
          document_path: string | null
          effective_on: string | null
          expires_on: string | null
          id: string
          image: string | null
          issuer: string
          name: string
          reference_number: string | null
          scope_note: string | null
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          document_path?: string | null
          effective_on?: string | null
          expires_on?: string | null
          id?: string
          image?: string | null
          issuer: string
          name: string
          reference_number?: string | null
          scope_note?: string | null
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          document_path?: string | null
          effective_on?: string | null
          expires_on?: string | null
          id?: string
          image?: string | null
          issuer?: string
          name?: string
          reference_number?: string | null
          scope_note?: string | null
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      client_logos: {
        Row: {
          created_at: string
          id: string
          logo_path: string | null
          name: string
          notes: string | null
          permission_confirmed: boolean
          permission_requested_at: string | null
          sector: string | null
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          logo_path?: string | null
          name: string
          notes?: string | null
          permission_confirmed?: boolean
          permission_requested_at?: string | null
          sector?: string | null
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          logo_path?: string | null
          name?: string
          notes?: string | null
          permission_confirmed?: boolean
          permission_requested_at?: string | null
          sector?: string | null
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      coverage_locations: {
        Row: {
          active: boolean
          county: string | null
          created_at: string
          id: string
          lat: number | null
          lng: number | null
          town: string
          type: Database["public"]["Enums"]["coverage_type"]
          updated_at: string
        }
        Insert: {
          active?: boolean
          county?: string | null
          created_at?: string
          id?: string
          lat?: number | null
          lng?: number | null
          town: string
          type?: Database["public"]["Enums"]["coverage_type"]
          updated_at?: string
        }
        Update: {
          active?: boolean
          county?: string | null
          created_at?: string
          id?: string
          lat?: number | null
          lng?: number | null
          town?: string
          type?: Database["public"]["Enums"]["coverage_type"]
          updated_at?: string
        }
        Relationships: []
      }
      downloads: {
        Row: {
          category: string | null
          cleared_at: string | null
          cleared_by: string | null
          cleared_for_publication: boolean
          created_at: string
          description: string | null
          document_date: string | null
          download_count: number
          file_path: string | null
          file_size: number | null
          file_type: string | null
          id: string
          slug: string
          status: Database["public"]["Enums"]["content_status"]
          thumbnail: string | null
          title: string
          updated_at: string
          version: string | null
        }
        Insert: {
          category?: string | null
          cleared_at?: string | null
          cleared_by?: string | null
          cleared_for_publication?: boolean
          created_at?: string
          description?: string | null
          document_date?: string | null
          download_count?: number
          file_path?: string | null
          file_size?: number | null
          file_type?: string | null
          id?: string
          slug: string
          status?: Database["public"]["Enums"]["content_status"]
          thumbnail?: string | null
          title: string
          updated_at?: string
          version?: string | null
        }
        Update: {
          category?: string | null
          cleared_at?: string | null
          cleared_by?: string | null
          cleared_for_publication?: boolean
          created_at?: string
          description?: string | null
          document_date?: string | null
          download_count?: number
          file_path?: string | null
          file_size?: number | null
          file_type?: string | null
          id?: string
          slug?: string
          status?: Database["public"]["Enums"]["content_status"]
          thumbnail?: string | null
          title?: string
          updated_at?: string
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "downloads_cleared_by_fkey"
            columns: ["cleared_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      faqs: {
        Row: {
          answer: string
          created_at: string
          id: string
          question: string
          scope: string
          scope_id: string | null
          sort_order: number
          status: Database["public"]["Enums"]["content_status"]
          updated_at: string
        }
        Insert: {
          answer: string
          created_at?: string
          id?: string
          question: string
          scope?: string
          scope_id?: string | null
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          updated_at?: string
        }
        Update: {
          answer?: string
          created_at?: string
          id?: string
          question?: string
          scope?: string
          scope_id?: string | null
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          updated_at?: string
        }
        Relationships: []
      }
      industries: {
        Row: {
          body: string | null
          created_at: string
          hero_image: string | null
          id: string
          name: string
          seo_description: string | null
          seo_image: string | null
          seo_title: string | null
          slug: string
          sort_order: number
          status: Database["public"]["Enums"]["content_status"]
          summary: string | null
          updated_at: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          hero_image?: string | null
          id?: string
          name: string
          seo_description?: string | null
          seo_image?: string | null
          seo_title?: string | null
          slug: string
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          summary?: string | null
          updated_at?: string
        }
        Update: {
          body?: string | null
          created_at?: string
          hero_image?: string | null
          id?: string
          name?: string
          seo_description?: string | null
          seo_image?: string | null
          seo_title?: string | null
          slug?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          summary?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      installation_certificates: {
        Row: {
          certificate_number_last4: string | null
          created_at: string
          expires_on: string | null
          id: string
          installed_on: string | null
          phone_last4_hash: string
          plate_hash: string
          status: string
          updated_at: string
        }
        Insert: {
          certificate_number_last4?: string | null
          created_at?: string
          expires_on?: string | null
          id?: string
          installed_on?: string | null
          phone_last4_hash: string
          plate_hash: string
          status?: string
          updated_at?: string
        }
        Update: {
          certificate_number_last4?: string | null
          created_at?: string
          expires_on?: string | null
          id?: string
          installed_on?: string | null
          phone_last4_hash?: string
          plate_hash?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      installation_plates_restricted: {
        Row: {
          certificate_id: string
          created_at: string
          phone_plaintext: string | null
          plate_plaintext: string
        }
        Insert: {
          certificate_id: string
          created_at?: string
          phone_plaintext?: string | null
          plate_plaintext: string
        }
        Update: {
          certificate_id?: string
          created_at?: string
          phone_plaintext?: string | null
          plate_plaintext?: string
        }
        Relationships: [
          {
            foreignKeyName: "installation_plates_restricted_certificate_id_fkey"
            columns: ["certificate_id"]
            isOneToOne: true
            referencedRelation: "installation_certificates"
            referencedColumns: ["id"]
          },
        ]
      }
      media: {
        Row: {
          alt_text: string
          bytes: number | null
          created_at: string
          height: number | null
          id: string
          mime: string | null
          path: string
          privacy_check_note: string | null
          privacy_checked: boolean
          updated_at: string
          uploaded_by: string | null
          width: number | null
        }
        Insert: {
          alt_text: string
          bytes?: number | null
          created_at?: string
          height?: number | null
          id?: string
          mime?: string | null
          path: string
          privacy_check_note?: string | null
          privacy_checked?: boolean
          updated_at?: string
          uploaded_by?: string | null
          width?: number | null
        }
        Update: {
          alt_text?: string
          bytes?: number | null
          created_at?: string
          height?: number | null
          id?: string
          mime?: string | null
          path?: string
          privacy_check_note?: string | null
          privacy_checked?: boolean
          updated_at?: string
          uploaded_by?: string | null
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "media_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          name_snapshot: string
          order_id: string
          product_id: string | null
          qty: number
          recurring_fee_period_snapshot: string | null
          recurring_fee_snapshot: number | null
          unit_price_snapshot: number
        }
        Insert: {
          created_at?: string
          id?: string
          name_snapshot: string
          order_id: string
          product_id?: string | null
          qty: number
          recurring_fee_period_snapshot?: string | null
          recurring_fee_snapshot?: number | null
          unit_price_snapshot: number
        }
        Update: {
          created_at?: string
          id?: string
          name_snapshot?: string
          order_id?: string
          product_id?: string | null
          qty?: number
          recurring_fee_period_snapshot?: string | null
          recurring_fee_snapshot?: number | null
          unit_price_snapshot?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "public_products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          branch_id: string | null
          created_at: string
          customer_name: string | null
          customer_phone: string | null
          customer_town: string | null
          fulfilment_type: string | null
          id: string
          notes: string | null
          order_number: string
          status: Database["public"]["Enums"]["order_status"]
          subtotal_kes: number
          updated_at: string
          vat_rate_snapshot: number | null
          whatsapp_sent_at: string | null
        }
        Insert: {
          branch_id?: string | null
          created_at?: string
          customer_name?: string | null
          customer_phone?: string | null
          customer_town?: string | null
          fulfilment_type?: string | null
          id?: string
          notes?: string | null
          order_number: string
          status?: Database["public"]["Enums"]["order_status"]
          subtotal_kes?: number
          updated_at?: string
          vat_rate_snapshot?: number | null
          whatsapp_sent_at?: string | null
        }
        Update: {
          branch_id?: string | null
          created_at?: string
          customer_name?: string | null
          customer_phone?: string | null
          customer_town?: string | null
          fulfilment_type?: string | null
          id?: string
          notes?: string | null
          order_number?: string
          status?: Database["public"]["Enums"]["order_status"]
          subtotal_kes?: number
          updated_at?: string
          vat_rate_snapshot?: number | null
          whatsapp_sent_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "public_branches"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_intents: {
        Row: {
          created_at: string
          id: string
          order_id: string
          payload: Json
          provider: string
          status: string
        }
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          payload?: Json
          provider: string
          status?: string
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          payload?: Json
          provider?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_intents_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount_kes: number
          created_at: string
          id: string
          order_id: string
          provider: string
          reference: string | null
          status: string
        }
        Insert: {
          amount_kes: number
          created_at?: string
          id?: string
          order_id: string
          provider: string
          reference?: string | null
          status?: string
        }
        Update: {
          amount_kes?: number
          created_at?: string
          id?: string
          order_id?: string
          provider?: string
          reference?: string | null
          status?: string
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
      product_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      product_industries: {
        Row: {
          industry_id: string
          product_id: string
        }
        Insert: {
          industry_id: string
          product_id: string
        }
        Update: {
          industry_id?: string
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_industries_industry_id_fkey"
            columns: ["industry_id"]
            isOneToOne: false
            referencedRelation: "industries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_industries_industry_id_fkey"
            columns: ["industry_id"]
            isOneToOne: false
            referencedRelation: "public_industries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_industries_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_industries_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "public_products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_solutions: {
        Row: {
          product_id: string
          solution_id: string
        }
        Insert: {
          product_id: string
          solution_id: string
        }
        Update: {
          product_id?: string
          solution_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_solutions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_solutions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "public_products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_solutions_solution_id_fkey"
            columns: ["solution_id"]
            isOneToOne: false
            referencedRelation: "public_solutions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_solutions_solution_id_fkey"
            columns: ["solution_id"]
            isOneToOne: false
            referencedRelation: "solutions"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          availability: Database["public"]["Enums"]["availability_status"]
          body: string | null
          category_id: string | null
          created_at: string
          family: string | null
          featured: boolean
          features: Json
          gallery: Json
          id: string
          installation_terms: string | null
          name: string
          price_kes: number | null
          price_visible: boolean
          recurring_fee_kes: number | null
          recurring_fee_note: string | null
          recurring_fee_period: string | null
          seo_description: string | null
          seo_image: string | null
          seo_title: string | null
          sku: string | null
          slug: string
          specs: Json
          status: Database["public"]["Enums"]["content_status"]
          summary: string | null
          updated_at: string
        }
        Insert: {
          availability?: Database["public"]["Enums"]["availability_status"]
          body?: string | null
          category_id?: string | null
          created_at?: string
          family?: string | null
          featured?: boolean
          features?: Json
          gallery?: Json
          id?: string
          installation_terms?: string | null
          name: string
          price_kes?: number | null
          price_visible?: boolean
          recurring_fee_kes?: number | null
          recurring_fee_note?: string | null
          recurring_fee_period?: string | null
          seo_description?: string | null
          seo_image?: string | null
          seo_title?: string | null
          sku?: string | null
          slug: string
          specs?: Json
          status?: Database["public"]["Enums"]["content_status"]
          summary?: string | null
          updated_at?: string
        }
        Update: {
          availability?: Database["public"]["Enums"]["availability_status"]
          body?: string | null
          category_id?: string | null
          created_at?: string
          family?: string | null
          featured?: boolean
          features?: Json
          gallery?: Json
          id?: string
          installation_terms?: string | null
          name?: string
          price_kes?: number | null
          price_visible?: boolean
          recurring_fee_kes?: number | null
          recurring_fee_note?: string | null
          recurring_fee_period?: string | null
          seo_description?: string | null
          seo_image?: string | null
          seo_title?: string | null
          sku?: string | null
          slug?: string
          specs?: Json
          status?: Database["public"]["Enums"]["content_status"]
          summary?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "product_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "public_product_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      shipments: {
        Row: {
          carrier: string | null
          created_at: string
          id: string
          order_id: string
          status: string
          tracking_ref: string | null
        }
        Insert: {
          carrier?: string | null
          created_at?: string
          id?: string
          order_id: string
          status?: string
          tracking_ref?: string | null
        }
        Update: {
          carrier?: string | null
          created_at?: string
          id?: string
          order_id?: string
          status?: string
          tracking_ref?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shipments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      solution_industries: {
        Row: {
          industry_id: string
          solution_id: string
        }
        Insert: {
          industry_id: string
          solution_id: string
        }
        Update: {
          industry_id?: string
          solution_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "solution_industries_industry_id_fkey"
            columns: ["industry_id"]
            isOneToOne: false
            referencedRelation: "industries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solution_industries_industry_id_fkey"
            columns: ["industry_id"]
            isOneToOne: false
            referencedRelation: "public_industries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solution_industries_solution_id_fkey"
            columns: ["solution_id"]
            isOneToOne: false
            referencedRelation: "public_solutions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solution_industries_solution_id_fkey"
            columns: ["solution_id"]
            isOneToOne: false
            referencedRelation: "solutions"
            referencedColumns: ["id"]
          },
        ]
      }
      solutions: {
        Row: {
          body: string | null
          created_at: string
          hero_image: string | null
          id: string
          last_reviewed_at: string | null
          name: string
          sections: Json
          seo_description: string | null
          seo_image: string | null
          seo_title: string | null
          slug: string
          sort_order: number
          status: Database["public"]["Enums"]["content_status"]
          summary: string | null
          updated_at: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          hero_image?: string | null
          id?: string
          last_reviewed_at?: string | null
          name: string
          sections?: Json
          seo_description?: string | null
          seo_image?: string | null
          seo_title?: string | null
          slug: string
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          summary?: string | null
          updated_at?: string
        }
        Update: {
          body?: string | null
          created_at?: string
          hero_image?: string | null
          id?: string
          last_reviewed_at?: string | null
          name?: string
          sections?: Json
          seo_description?: string | null
          seo_image?: string | null
          seo_title?: string | null
          slug?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          summary?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      submissions: {
        Row: {
          assigned_to: string | null
          created_at: string
          id: string
          is_anonymous: boolean
          notes: string | null
          payload: Json
          status: string
          type: Database["public"]["Enums"]["submission_type"]
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          id?: string
          is_anonymous?: boolean
          notes?: string | null
          payload?: Json
          status?: string
          type: Database["public"]["Enums"]["submission_type"]
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          id?: string
          is_anonymous?: boolean
          notes?: string | null
          payload?: Json
          status?: string
          type?: Database["public"]["Enums"]["submission_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "submissions_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      testimonials: {
        Row: {
          author_name: string
          company: string | null
          created_at: string
          id: string
          industry: string | null
          logo: string | null
          permission_confirmed: boolean
          quote: string
          sort_order: number
          status: Database["public"]["Enums"]["content_status"]
          updated_at: string
        }
        Insert: {
          author_name: string
          company?: string | null
          created_at?: string
          id?: string
          industry?: string | null
          logo?: string | null
          permission_confirmed?: boolean
          quote: string
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          updated_at?: string
        }
        Update: {
          author_name?: string
          company?: string | null
          created_at?: string
          id?: string
          industry?: string | null
          logo?: string | null
          permission_confirmed?: boolean
          quote?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          updated_at?: string
        }
        Relationships: []
      }
      verification_attempts: {
        Row: {
          created_at: string
          id: string
          ip_hash: string | null
          outcome: Database["public"]["Enums"]["verification_outcome"]
          plate_hash: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          ip_hash?: string | null
          outcome: Database["public"]["Enums"]["verification_outcome"]
          plate_hash?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          ip_hash?: string | null
          outcome?: Database["public"]["Enums"]["verification_outcome"]
          plate_hash?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      public_authors: {
        Row: {
          avatar: string | null
          bio: string | null
          id: string | null
          links: Json | null
          name: string | null
          role: string | null
        }
        Insert: {
          avatar?: string | null
          bio?: string | null
          id?: string | null
          links?: Json | null
          name?: string | null
          role?: string | null
        }
        Update: {
          avatar?: string | null
          bio?: string | null
          id?: string | null
          links?: Json | null
          name?: string | null
          role?: string | null
        }
        Relationships: []
      }
      public_blog_categories: {
        Row: {
          description: string | null
          id: string | null
          name: string | null
          slug: string | null
          solution_id: string | null
        }
        Insert: {
          description?: string | null
          id?: string | null
          name?: string | null
          slug?: string | null
          solution_id?: string | null
        }
        Update: {
          description?: string | null
          id?: string | null
          name?: string | null
          slug?: string | null
          solution_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_categories_solution_id_fkey"
            columns: ["solution_id"]
            isOneToOne: false
            referencedRelation: "public_solutions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_categories_solution_id_fkey"
            columns: ["solution_id"]
            isOneToOne: false
            referencedRelation: "solutions"
            referencedColumns: ["id"]
          },
        ]
      }
      public_blog_posts: {
        Row: {
          author_avatar: string | null
          author_id: string | null
          author_name: string | null
          author_role: string | null
          body: string | null
          category_id: string | null
          category_name: string | null
          category_slug: string | null
          excerpt: string | null
          featured_image: string | null
          id: string | null
          published_at: string | null
          reading_time: number | null
          seo_description: string | null
          seo_image: string | null
          seo_title: string | null
          slug: string | null
          title: string | null
          updated_at: string | null
        }
        Relationships: []
      }
      public_branches: {
        Row: {
          address: string | null
          county: string | null
          hours: string | null
          id: string | null
          lat: number | null
          lng: number | null
          maps_url: string | null
          name: string | null
          phones: Json | null
          slug: string | null
          sort_order: number | null
          town: string | null
        }
        Insert: {
          address?: string | null
          county?: string | null
          hours?: string | null
          id?: string | null
          lat?: number | null
          lng?: number | null
          maps_url?: string | null
          name?: string | null
          phones?: Json | null
          slug?: string | null
          sort_order?: number | null
          town?: string | null
        }
        Update: {
          address?: string | null
          county?: string | null
          hours?: string | null
          id?: string | null
          lat?: number | null
          lng?: number | null
          maps_url?: string | null
          name?: string | null
          phones?: Json | null
          slug?: string | null
          sort_order?: number | null
          town?: string | null
        }
        Relationships: []
      }
      public_certifications: {
        Row: {
          description: string | null
          document_path: string | null
          effective_on: string | null
          expires_on: string | null
          id: string | null
          image: string | null
          issuer: string | null
          name: string | null
          reference_number: string | null
          scope_note: string | null
          sort_order: number | null
        }
        Insert: {
          description?: string | null
          document_path?: string | null
          effective_on?: string | null
          expires_on?: string | null
          id?: string | null
          image?: string | null
          issuer?: string | null
          name?: string | null
          reference_number?: string | null
          scope_note?: string | null
          sort_order?: number | null
        }
        Update: {
          description?: string | null
          document_path?: string | null
          effective_on?: string | null
          expires_on?: string | null
          id?: string | null
          image?: string | null
          issuer?: string | null
          name?: string | null
          reference_number?: string | null
          scope_note?: string | null
          sort_order?: number | null
        }
        Relationships: []
      }
      public_client_logos: {
        Row: {
          id: string | null
          logo_path: string | null
          name: string | null
          sector: string | null
          sort_order: number | null
        }
        Insert: {
          id?: string | null
          logo_path?: string | null
          name?: string | null
          sector?: string | null
          sort_order?: number | null
        }
        Update: {
          id?: string | null
          logo_path?: string | null
          name?: string | null
          sector?: string | null
          sort_order?: number | null
        }
        Relationships: []
      }
      public_coverage_locations: {
        Row: {
          county: string | null
          id: string | null
          lat: number | null
          lng: number | null
          town: string | null
          type: Database["public"]["Enums"]["coverage_type"] | null
        }
        Insert: {
          county?: string | null
          id?: string | null
          lat?: number | null
          lng?: number | null
          town?: string | null
          type?: Database["public"]["Enums"]["coverage_type"] | null
        }
        Update: {
          county?: string | null
          id?: string | null
          lat?: number | null
          lng?: number | null
          town?: string | null
          type?: Database["public"]["Enums"]["coverage_type"] | null
        }
        Relationships: []
      }
      public_downloads: {
        Row: {
          category: string | null
          description: string | null
          document_date: string | null
          file_path: string | null
          file_size: number | null
          file_type: string | null
          id: string | null
          slug: string | null
          thumbnail: string | null
          title: string | null
          version: string | null
        }
        Insert: {
          category?: string | null
          description?: string | null
          document_date?: string | null
          file_path?: string | null
          file_size?: number | null
          file_type?: string | null
          id?: string | null
          slug?: string | null
          thumbnail?: string | null
          title?: string | null
          version?: string | null
        }
        Update: {
          category?: string | null
          description?: string | null
          document_date?: string | null
          file_path?: string | null
          file_size?: number | null
          file_type?: string | null
          id?: string | null
          slug?: string | null
          thumbnail?: string | null
          title?: string | null
          version?: string | null
        }
        Relationships: []
      }
      public_faqs: {
        Row: {
          answer: string | null
          id: string | null
          question: string | null
          scope: string | null
          scope_id: string | null
          sort_order: number | null
        }
        Insert: {
          answer?: string | null
          id?: string | null
          question?: string | null
          scope?: string | null
          scope_id?: string | null
          sort_order?: number | null
        }
        Update: {
          answer?: string | null
          id?: string | null
          question?: string | null
          scope?: string | null
          scope_id?: string | null
          sort_order?: number | null
        }
        Relationships: []
      }
      public_industries: {
        Row: {
          body: string | null
          hero_image: string | null
          id: string | null
          name: string | null
          seo_description: string | null
          seo_image: string | null
          seo_title: string | null
          slug: string | null
          sort_order: number | null
          summary: string | null
          updated_at: string | null
        }
        Insert: {
          body?: string | null
          hero_image?: string | null
          id?: string | null
          name?: string | null
          seo_description?: string | null
          seo_image?: string | null
          seo_title?: string | null
          slug?: string | null
          sort_order?: number | null
          summary?: string | null
          updated_at?: string | null
        }
        Update: {
          body?: string | null
          hero_image?: string | null
          id?: string | null
          name?: string | null
          seo_description?: string | null
          seo_image?: string | null
          seo_title?: string | null
          slug?: string | null
          sort_order?: number | null
          summary?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      public_product_categories: {
        Row: {
          description: string | null
          id: string | null
          name: string | null
          slug: string | null
          sort_order: number | null
        }
        Insert: {
          description?: string | null
          id?: string | null
          name?: string | null
          slug?: string | null
          sort_order?: number | null
        }
        Update: {
          description?: string | null
          id?: string | null
          name?: string | null
          slug?: string | null
          sort_order?: number | null
        }
        Relationships: []
      }
      public_product_industries: {
        Row: {
          industry_id: string | null
          product_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_industries_industry_id_fkey"
            columns: ["industry_id"]
            isOneToOne: false
            referencedRelation: "industries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_industries_industry_id_fkey"
            columns: ["industry_id"]
            isOneToOne: false
            referencedRelation: "public_industries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_industries_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_industries_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "public_products"
            referencedColumns: ["id"]
          },
        ]
      }
      public_product_solutions: {
        Row: {
          product_id: string | null
          solution_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_solutions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_solutions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "public_products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_solutions_solution_id_fkey"
            columns: ["solution_id"]
            isOneToOne: false
            referencedRelation: "public_solutions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_solutions_solution_id_fkey"
            columns: ["solution_id"]
            isOneToOne: false
            referencedRelation: "solutions"
            referencedColumns: ["id"]
          },
        ]
      }
      public_products: {
        Row: {
          availability:
            | Database["public"]["Enums"]["availability_status"]
            | null
          body: string | null
          category_id: string | null
          category_name: string | null
          category_slug: string | null
          family: string | null
          featured: boolean | null
          features: Json | null
          gallery: Json | null
          id: string | null
          installation_terms: string | null
          name: string | null
          price_kes: number | null
          price_visible: boolean | null
          recurring_fee_kes: number | null
          recurring_fee_note: string | null
          recurring_fee_period: string | null
          seo_description: string | null
          seo_image: string | null
          seo_title: string | null
          sku: string | null
          slug: string | null
          specs: Json | null
          summary: string | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "product_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "public_product_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      public_solution_industries: {
        Row: {
          industry_id: string | null
          solution_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "solution_industries_industry_id_fkey"
            columns: ["industry_id"]
            isOneToOne: false
            referencedRelation: "industries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solution_industries_industry_id_fkey"
            columns: ["industry_id"]
            isOneToOne: false
            referencedRelation: "public_industries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solution_industries_solution_id_fkey"
            columns: ["solution_id"]
            isOneToOne: false
            referencedRelation: "public_solutions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solution_industries_solution_id_fkey"
            columns: ["solution_id"]
            isOneToOne: false
            referencedRelation: "solutions"
            referencedColumns: ["id"]
          },
        ]
      }
      public_solutions: {
        Row: {
          body: string | null
          hero_image: string | null
          id: string | null
          last_reviewed_at: string | null
          name: string | null
          sections: Json | null
          seo_description: string | null
          seo_image: string | null
          seo_title: string | null
          slug: string | null
          sort_order: number | null
          summary: string | null
          updated_at: string | null
        }
        Insert: {
          body?: string | null
          hero_image?: string | null
          id?: string | null
          last_reviewed_at?: string | null
          name?: string | null
          sections?: Json | null
          seo_description?: string | null
          seo_image?: string | null
          seo_title?: string | null
          slug?: string | null
          sort_order?: number | null
          summary?: string | null
          updated_at?: string | null
        }
        Update: {
          body?: string | null
          hero_image?: string | null
          id?: string | null
          last_reviewed_at?: string | null
          name?: string | null
          sections?: Json | null
          seo_description?: string | null
          seo_image?: string | null
          seo_title?: string | null
          slug?: string | null
          sort_order?: number | null
          summary?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      public_testimonials: {
        Row: {
          author_name: string | null
          company: string | null
          id: string | null
          industry: string | null
          logo: string | null
          quote: string | null
          sort_order: number | null
        }
        Insert: {
          author_name?: string | null
          company?: string | null
          id?: string | null
          industry?: string | null
          logo?: string | null
          quote?: string | null
          sort_order?: number | null
        }
        Update: {
          author_name?: string | null
          company?: string | null
          id?: string | null
          industry?: string | null
          logo?: string | null
          quote?: string | null
          sort_order?: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      current_role_name: {
        Args: never
        Returns: Database["public"]["Enums"]["user_role"]
      }
      is_staff: {
        Args: { min_role: Database["public"]["Enums"]["user_role"] }
        Returns: boolean
      }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
      verification_attempt_counts: {
        Args: { p_ip_hash: string; p_plate_hash: string }
        Returns: {
          ip_last_hour: number
          plate_last_day: number
        }[]
      }
    }
    Enums: {
      availability_status: "in_stock" | "out_of_stock" | "pre_order"
      content_status: "draft" | "in_review" | "published"
      coverage_type: "agent" | "technician" | "both"
      order_status:
        | "new"
        | "contacted"
        | "confirmed"
        | "installed"
        | "closed"
        | "cancelled"
      submission_type:
        | "contact"
        | "quote"
        | "demo"
        | "installation"
        | "suggestion"
      user_role: "admin" | "editor" | "sales" | "viewer"
      verification_outcome: "valid" | "expired" | "not_found" | "factor_failed"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      availability_status: ["in_stock", "out_of_stock", "pre_order"],
      content_status: ["draft", "in_review", "published"],
      coverage_type: ["agent", "technician", "both"],
      order_status: [
        "new",
        "contacted",
        "confirmed",
        "installed",
        "closed",
        "cancelled",
      ],
      submission_type: [
        "contact",
        "quote",
        "demo",
        "installation",
        "suggestion",
      ],
      user_role: ["admin", "editor", "sales", "viewer"],
      verification_outcome: ["valid", "expired", "not_found", "factor_failed"],
    },
  },
} as const
