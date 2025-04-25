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
      categories: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
        Relationships: []
      }
      ingredients: {
        Row: {
          id: string
          name: string
          price_cents: number
        }
        Insert: {
          id?: string
          name: string
          price_cents: number
        }
        Update: {
          id?: string
          name?: string
          price_cents?: number
        }
        Relationships: []
      }
      recipes: {
        Row: {
          id: string
          name: string
          category_id: string | null
        }
        Insert: {
          id?: string
          name: string
          category_id?: string | null
        }
        Update: {
          id?: string
          name?: string
          category_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "recipes_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          }
        ]
      }
      recipe_ingredients: {
        Row: {
          recipe_id: string
          ingredient_id: string
          qty: number
        }
        Insert: {
          recipe_id: string
          ingredient_id: string
          qty: number
        }
        Update: {
          recipe_id?: string
          ingredient_id?: string
          qty?: number
        }
        Relationships: [
          {
            foreignKeyName: "recipe_ingredients_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipe_ingredients_ingredient_id_fkey"
            columns: ["ingredient_id"]
            isOneToOne: false
            referencedRelation: "ingredients"
            referencedColumns: ["id"]
          }
        ]
      }
      packets: {
        Row: {
          id: string
          name: string
          description: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
        }
        Relationships: []
      }
      packet_recipes: {
        Row: {
          packet_id: string
          recipe_id: string
          qty: number
        }
        Insert: {
          packet_id: string
          recipe_id: string
          qty: number
        }
        Update: {
          packet_id?: string
          recipe_id?: string
          qty?: number
        }
        Relationships: [
          {
            foreignKeyName: "packet_recipes_packet_id_fkey"
            columns: ["packet_id"]
            isOneToOne: false
            referencedRelation: "packets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "packet_recipes_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      recipe_cost_cents: {
        Row: {
          id: string
          total_cents: number
        }
        Relationships: [
          {
            foreignKeyName: "recipes_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          }
        ]
      }
      packet_cost_cents: {
        Row: {
          id: string
          total_cents: number
        }
        Relationships: [
          {
            foreignKeyName: "packets_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "packets"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Functions: {}
    Enums: {}
  }
} 