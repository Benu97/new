import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { calculateCartTotals } from '@/lib/pricing'

// Validation schema for cart items
const cartItemSchema = z.object({
  id: z.string().uuid(),
  type: z.literal('packet'),
  name: z.string(),
  description: z.string().optional().nullable(),
  priceCents: z.number().int().min(0),
  quantity: z.number().int().min(1),
  markupPercentage: z.number().min(0),
  recipes: z.array(
    z.object({
      id: z.string().uuid(),
      name: z.string(),
      quantity: z.number().int().min(1),
      priceCents: z.number().int().min(0)
    })
  ).optional()
})

const quoteRequestSchema = z.object({
  items: z.array(cartItemSchema),
  client: z.object({
    name: z.string(),
    email: z.string().email().optional(),
    phone: z.string().optional()
  }).optional()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate the request body
    const result = quoteRequestSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.format() },
        { status: 400 }
      )
    }
    
    const { items, client } = result.data
    
    // Calculate totals
    const totals = calculateCartTotals(
      items.map(item => ({
        priceCents: item.priceCents,
        markupPercentage: item.markupPercentage,
        quantity: item.quantity
      }))
    )
    
    // Create quote data to return
    const quoteData = {
      reference: `QUOTE-${Date.now().toString().substring(5)}`,
      date: new Date().toISOString(),
      client,
      items,
      totals,
      // Optional: generate a PDF url if you implement that feature
      pdfUrl: null
    }
    
    return NextResponse.json(quoteData, { status: 200 })
  } catch (error) {
    console.error('Error generating quote:', error)
    return NextResponse.json(
      { error: 'Failed to generate quote' },
      { status: 500 }
    )
  }
} 