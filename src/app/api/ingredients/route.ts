import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { z } from 'zod'

// Validation schema for ingredient creation
const createIngredientSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  price_cents: z.number().int().min(0, 'Price must be a positive integer')
})

export async function GET() {
  try {
    const supabase = createServerClient()
    
    const { data, error } = await supabase
      .from('ingredients')
      .select('*')
      .order('name')
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching ingredients:', error)
    return NextResponse.json(
      { error: 'Failed to fetch ingredients' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const body = await request.json()
    
    // Validate the request body
    const result = createIngredientSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.format() },
        { status: 400 }
      )
    }
    
    // Insert the ingredient
    const { data, error } = await supabase
      .from('ingredients')
      .insert(result.data)
      .select()
      .single()
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Error creating ingredient:', error)
    return NextResponse.json(
      { error: 'Failed to create ingredient' },
      { status: 500 }
    )
  }
} 