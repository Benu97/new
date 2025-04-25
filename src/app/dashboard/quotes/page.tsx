'use client'

import React, { useState } from 'react'
import { useCart } from '@/components/CartProvider'
import { formatCurrency } from '@/lib/pricing'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Trash2, FileText, Download } from 'lucide-react'
import { motion } from 'framer-motion'

type QuoteDetails = {
  reference: string
  date: string
  client?: {
    name: string
    email?: string
    phone?: string
  }
  items: any[]
  totals: {
    subtotalCents: number
    totalCents: number
    averageMarkup: number
    subtotalFormatted: string
    totalFormatted: string
  }
  pdfUrl: string | null
}

export default function QuotesPage() {
  const { items, updatePacket, removePacket, clearCart, getCartTotals } = useCart()
  const [clientName, setClientName] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [quoteDetails, setQuoteDetails] = useState<QuoteDetails | null>(null)
  
  const handleGenerateQuote = async () => {
    setIsGenerating(true)
    
    try {
      const response = await fetch('/api/cart/quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items,
          client: clientName ? { name: clientName } : undefined
        }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to generate quote')
      }
      
      const data = await response.json()
      setQuoteDetails(data)
    } catch (error) {
      console.error('Error generating quote:', error)
    } finally {
      setIsGenerating(false)
    }
  }
  
  const totals = getCartTotals()
  
  // Framer motion animations
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Quotes</h1>
        <p className="text-muted-foreground">
          Manage your cart and generate quotes
        </p>
      </div>
      
      {quoteDetails ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card p-6 rounded-lg shadow"
        >
          <div className="flex justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Quote Details</h2>
              <p className="text-muted-foreground">Reference: {quoteDetails.reference}</p>
              <p className="text-muted-foreground">Date: {new Date(quoteDetails.date).toLocaleDateString()}</p>
              {quoteDetails.client && (
                <p className="text-muted-foreground">Client: {quoteDetails.client.name}</p>
              )}
            </div>
            <div>
              <Button variant="outline" onClick={() => setQuoteDetails(null)}>
                Back to Cart
              </Button>
              <Button className="ml-2">
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
            </div>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Unit Price</TableHead>
                <TableHead>Markup</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quoteDetails.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{formatCurrency(item.priceCents)}</TableCell>
                  <TableCell>{item.markupPercentage}%</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(item.priceCents * item.quantity * (1 + item.markupPercentage / 100))}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          <div className="mt-6 border-t pt-4">
            <div className="flex justify-between text-lg">
              <span>Subtotal:</span>
              <span>{quoteDetails.totals.subtotalFormatted}</span>
            </div>
            <div className="flex justify-between text-lg">
              <span>Average Markup:</span>
              <span>{quoteDetails.totals.averageMarkup}%</span>
            </div>
            <div className="flex justify-between text-lg font-bold mt-2">
              <span>Total:</span>
              <span>{quoteDetails.totals.totalFormatted}</span>
            </div>
          </div>
        </motion.div>
      ) : (
        <div>
          {items.length === 0 ? (
            <div className="text-center p-12 border rounded-lg">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Your cart is empty</h3>
              <p className="text-muted-foreground mt-1">
                Add packets from the Packets page to create a quote
              </p>
              <Button className="mt-4" variant="outline" asChild>
                <a href="/dashboard/packets">Browse Packets</a>
              </Button>
            </div>
          ) : (
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="space-y-6"
            >
              <div className="bg-card p-4 rounded-lg">
                <div className="mb-4">
                  <label htmlFor="clientName" className="block text-sm font-medium mb-1">
                    Client Name (Optional)
                  </label>
                  <Input
                    id="clientName"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Enter client name"
                    className="max-w-md"
                  />
                </div>
              </div>
              
              <Table className="cart-items">
                <TableHeader>
                  <TableRow>
                    <TableHead>Packet</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Markup (%)</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <motion.tr
                      key={item.id}
                      variants={item}
                      className="cart-item"
                    >
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => 
                            updatePacket(item.id, { quantity: parseInt(e.target.value) || 1 })
                          }
                          className="w-20"
                        />
                      </TableCell>
                      <TableCell>{formatCurrency(item.priceCents)}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="0"
                          name="markupPercentage"
                          value={item.markupPercentage}
                          onChange={(e) => 
                            updatePacket(item.id, { markupPercentage: parseInt(e.target.value) || 0 })
                          }
                          className="w-20"
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => removePacket(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
              
              <div className="flex justify-between items-center bg-card p-4 rounded-lg">
                <div>
                  <div className="text-sm text-muted-foreground">Subtotal</div>
                  <div className="text-2xl font-bold">{totals.subtotalFormatted}</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    With average {totals.averageMarkup}% markup: {totals.totalFormatted}
                  </div>
                </div>
                <div className="space-x-2">
                  <Button variant="outline" onClick={clearCart}>
                    Clear Cart
                  </Button>
                  <Button 
                    onClick={handleGenerateQuote}
                    disabled={isGenerating}
                  >
                    {isGenerating ? 'Generating...' : 'Generate Quote'}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      )}
    </div>
  )
} 