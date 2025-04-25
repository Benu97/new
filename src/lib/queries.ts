import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClientClient } from './supabase'
import { Database } from './database.types'

// Type definitions
type Category = Database['public']['Tables']['categories']['Row']
type Ingredient = Database['public']['Tables']['ingredients']['Row']
type Recipe = Database['public']['Tables']['recipes']['Row']
type RecipeWithCost = Recipe & { total_cents: number }
type Packet = Database['public']['Tables']['packets']['Row']
type PacketWithCost = Packet & { total_cents: number }

// Initialize Supabase client
const supabase = createClientClient()

// Categories
export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name')
      
      if (error) throw error
      return data as Category[]
    }
  })
}

export const useAddCategory = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (category: { name: string }) => {
      const { data, error } = await supabase
        .from('categories')
        .insert(category)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    }
  })
}

// Ingredients
export const useIngredients = () => {
  return useQuery({
    queryKey: ['ingredients'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ingredients')
        .select('*')
        .order('name')
      
      if (error) throw error
      return data as Ingredient[]
    }
  })
}

export const useAddIngredient = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (ingredient: { name: string, price_cents: number }) => {
      const { data, error } = await supabase
        .from('ingredients')
        .insert(ingredient)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredients'] })
    }
  })
}

// Recipes
export const useRecipes = () => {
  return useQuery({
    queryKey: ['recipes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('recipes')
        .select(`
          *,
          categories (
            name
          )
        `)
        .order('name')
      
      if (error) throw error
      return data
    }
  })
}

export const useRecipeWithCost = (recipeId: string) => {
  return useQuery({
    queryKey: ['recipe', recipeId],
    queryFn: async () => {
      // Get recipe details
      const { data: recipe, error: recipeError } = await supabase
        .from('recipes')
        .select(`
          *,
          categories (
            name
          )
        `)
        .eq('id', recipeId)
        .single()
      
      if (recipeError) throw recipeError
      
      // Get recipe cost
      const { data: cost, error: costError } = await supabase
        .from('recipe_cost_cents')
        .select('total_cents')
        .eq('id', recipeId)
        .single()
      
      if (costError) throw costError
      
      // Get recipe ingredients
      const { data: ingredients, error: ingredientsError } = await supabase
        .from('recipe_ingredients')
        .select(`
          qty,
          ingredients (
            id,
            name,
            price_cents
          )
        `)
        .eq('recipe_id', recipeId)
      
      if (ingredientsError) throw ingredientsError
      
      return {
        ...recipe,
        total_cents: cost?.total_cents || 0,
        ingredients: ingredients || []
      } as RecipeWithCost & { ingredients: any[] }
    },
    enabled: !!recipeId
  })
}

export const useAddRecipe = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ recipe, ingredients }: { 
      recipe: { name: string, category_id?: string }, 
      ingredients: { ingredient_id: string, qty: number }[] 
    }) => {
      // Insert recipe
      const { data: recipeData, error: recipeError } = await supabase
        .from('recipes')
        .insert(recipe)
        .select()
        .single()
      
      if (recipeError) throw recipeError
      
      // If there are ingredients, link them to the recipe
      if (ingredients.length > 0) {
        const recipeIngredients = ingredients.map(ing => ({
          recipe_id: recipeData.id,
          ingredient_id: ing.ingredient_id,
          qty: ing.qty
        }))
        
        const { error: ingredientsError } = await supabase
          .from('recipe_ingredients')
          .insert(recipeIngredients)
        
        if (ingredientsError) throw ingredientsError
      }
      
      return recipeData
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] })
    }
  })
}

// Packets
export const usePackets = () => {
  return useQuery({
    queryKey: ['packets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('packets')
        .select('*')
        .order('name')
      
      if (error) throw error
      return data as Packet[]
    }
  })
}

export const usePacketWithCost = (packetId: string) => {
  return useQuery({
    queryKey: ['packet', packetId],
    queryFn: async () => {
      // Get packet details
      const { data: packet, error: packetError } = await supabase
        .from('packets')
        .select('*')
        .eq('id', packetId)
        .single()
      
      if (packetError) throw packetError
      
      // Get packet cost
      const { data: cost, error: costError } = await supabase
        .from('packet_cost_cents')
        .select('total_cents')
        .eq('id', packetId)
        .single()
      
      if (costError) throw costError
      
      // Get packet recipes
      const { data: recipes, error: recipesError } = await supabase
        .from('packet_recipes')
        .select(`
          qty,
          recipes (
            id,
            name,
            recipe_cost_cents (
              total_cents
            )
          )
        `)
        .eq('packet_id', packetId)
      
      if (recipesError) throw recipesError
      
      return {
        ...packet,
        total_cents: cost?.total_cents || 0,
        recipes: recipes || []
      } as PacketWithCost & { recipes: any[] }
    },
    enabled: !!packetId
  })
}

export const useAddPacket = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ packet, recipes }: { 
      packet: { name: string, description?: string }, 
      recipes: { recipe_id: string, qty: number }[] 
    }) => {
      // Insert packet
      const { data: packetData, error: packetError } = await supabase
        .from('packets')
        .insert(packet)
        .select()
        .single()
      
      if (packetError) throw packetError
      
      // If there are recipes, link them to the packet
      if (recipes.length > 0) {
        const packetRecipes = recipes.map(rec => ({
          packet_id: packetData.id,
          recipe_id: rec.recipe_id,
          qty: rec.qty
        }))
        
        const { error: recipesError } = await supabase
          .from('packet_recipes')
          .insert(packetRecipes)
        
        if (recipesError) throw recipesError
      }
      
      return packetData
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['packets'] })
    }
  })
} 