import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { z } from 'zod'

// Validation schema for packet creation
const createPacketSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  recipes: z.array(
    z.object({
      recipe_id: z.string().uuid(),
      qty: z.number().int().positive('Quantity must be a positive integer')
    })
  ).optional()
})

export async function GET() {
  try {
    const supabase = createServerClient()
    
    // Get packets
    const { data: packets, error: packetsError } = await supabase
      .from('packets')
      .select('*')
      .order('name')
    
    if (packetsError) {
      return NextResponse.json({ error: packetsError.message }, { status: 500 })
    }
    
    // Get packet costs
    const { data: costs, error: costsError } = await supabase
      .from('packet_cost_cents')
      .select('id, total_cents')
    
    if (costsError) {
      return NextResponse.json({ error: costsError.message }, { status: 500 })
    }
    
    // Combine packet data with costs
    const costsMap = new Map(costs?.map(cost => [cost.id, cost.total_cents]) || [])
    const packetsWithCost = packets?.map(packet => ({
      ...packet,
      total_cents: costsMap.get(packet.id) || 0
    }))
    
    return NextResponse.json(packetsWithCost)
  } catch (error) {
    console.error('Error fetching packets:', error)
    return NextResponse.json(
      { error: 'Failed to fetch packets' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const body = await request.json()
    
    // Validate the request body
    const result = createPacketSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.format() },
        { status: 400 }
      )
    }
    
    // Extract data from validated result
    const { name, description, recipes = [] } = result.data
    
    // Start a transaction-like operation
    // 1. Insert the packet
    const { data: packet, error: packetError } = await supabase
      .from('packets')
      .insert({ name, description })
      .select()
      .single()
    
    if (packetError) {
      return NextResponse.json({ error: packetError.message }, { status: 500 })
    }
    
    // 2. If there are recipes, link them to the packet
    if (recipes.length > 0) {
      const packetRecipes = recipes.map(recipe => ({
        packet_id: packet.id,
        recipe_id: recipe.recipe_id,
        qty: recipe.qty
      }))
      
      const { error: recipesError } = await supabase
        .from('packet_recipes')
        .insert(packetRecipes)
      
      if (recipesError) {
        // In a real transaction we would rollback, but Supabase doesn't support that directly
        await supabase.from('packets').delete().eq('id', packet.id)
        
        return NextResponse.json(
          { error: recipesError.message },
          { status: 500 }
        )
      }
    }
    
    return NextResponse.json(packet, { status: 201 })
  } catch (error) {
    console.error('Error creating packet:', error)
    return NextResponse.json(
      { error: 'Failed to create packet' },
      { status: 500 }
    )
  }
} 