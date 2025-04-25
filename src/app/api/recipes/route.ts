import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { z } from 'zod'

// Validation schema for recipe creation
const createRecipeSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  category_id: z.string().uuid().optional().nullable(),
  ingredients: z.array(
    z.object({
      ingredient_id: z.string().uuid(),
      qty: z.number().positive('Quantity must be positive')
    })
  ).optional()
})

export async function GET() {
  try {
    const supabase = createServerClient()
    
    // Get recipes with their categories and cost
    const { data: recipes, error: recipesError } = await supabase
      .from('recipes')
      .select(`
        *,
        categories (
          name
        )
      `)
      .order('name')
    
    if (recipesError) {
      return NextResponse.json({ error: recipesError.message }, { status: 500 })
    }
    
    // Get recipe costs
    const { data: costs, error: costsError } = await supabase
      .from('recipe_cost_cents')
      .select('id, total_cents')
    
    if (costsError) {
      return NextResponse.json({ error: costsError.message }, { status: 500 })
    }
    
    // Combine recipe data with costs
    const costsMap = new Map(costs?.map(cost => [cost.id, cost.total_cents]) || [])
    const recipesWithCost = recipes?.map(recipe => ({
      ...recipe,
      total_cents: costsMap.get(recipe.id) || 0
    }))
    
    return NextResponse.json(recipesWithCost)
  } catch (error) {
    console.error('Error fetching recipes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch recipes' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const body = await request.json()
    
    // Validate the request body
    const result = createRecipeSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.format() },
        { status: 400 }
      )
    }
    
    // Extract data from validated result
    const { name, category_id, ingredients = [] } = result.data
    
    // Start a transaction-like operation (not real transactions, but sequential)
    // 1. Insert the recipe
    const { data: recipe, error: recipeError } = await supabase
      .from('recipes')
      .insert({ name, category_id })
      .select()
      .single()
    
    if (recipeError) {
      return NextResponse.json({ error: recipeError.message }, { status: 500 })
    }
    
    // 2. If there are ingredients, link them to the recipe
    if (ingredients.length > 0) {
      const recipeIngredients = ingredients.map(ing => ({
        recipe_id: recipe.id,
        ingredient_id: ing.ingredient_id,
        qty: ing.qty
      }))
      
      const { error: ingredientsError } = await supabase
        .from('recipe_ingredients')
        .insert(recipeIngredients)
      
      if (ingredientsError) {
        // In a real transaction we would rollback, but Supabase doesn't support that directly
        // through the API. In a production app, you might want to handle this with RPC.
        await supabase.from('recipes').delete().eq('id', recipe.id)
        
        return NextResponse.json(
          { error: ingredientsError.message },
          { status: 500 }
        )
      }
    }
    
    return NextResponse.json(recipe, { status: 201 })
  } catch (error) {
    console.error('Error creating recipe:', error)
    return NextResponse.json(
      { error: 'Failed to create recipe' },
      { status: 500 }
    )
  }
} 