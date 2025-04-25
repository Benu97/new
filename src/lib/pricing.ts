/**
 * Pricing utility functions
 */

/**
 * Convert cents to dollars/euros for display
 */
export function formatCurrency(cents: number): string {
  return (cents / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: 'EUR'
  })
}

/**
 * Apply markup percentage to a price in cents
 */
export function applyMarkup(priceCents: number, markupPercentage: number): number {
  return Math.round(priceCents * (1 + markupPercentage / 100))
}

/**
 * Calculate average markup percentage across a cart of items
 */
export function calculateAverageMarkup(items: Array<{ priceCents: number, markupPercentage: number }>): number {
  if (items.length === 0) return 0
  
  const totalPrice = items.reduce((sum, item) => sum + item.priceCents, 0)
  const totalAfterMarkup = items.reduce((sum, item) => 
    sum + applyMarkup(item.priceCents, item.markupPercentage), 0)
  
  if (totalPrice === 0) return 0
  
  return Math.round(((totalAfterMarkup / totalPrice) - 1) * 100)
}

/**
 * Calculate totals for a cart
 */
export function calculateCartTotals(items: Array<{ 
  priceCents: number, 
  markupPercentage: number,
  quantity: number 
}>) {
  const subtotalCents = items.reduce((sum, item) => 
    sum + (item.priceCents * item.quantity), 0)
  
  const totalCents = items.reduce((sum, item) => 
    sum + (applyMarkup(item.priceCents, item.markupPercentage) * item.quantity), 0)
  
  const averageMarkup = calculateAverageMarkup(items)
  
  return {
    subtotalCents,
    totalCents,
    averageMarkup,
    subtotalFormatted: formatCurrency(subtotalCents),
    totalFormatted: formatCurrency(totalCents)
  }
} 