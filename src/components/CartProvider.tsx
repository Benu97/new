/**
 * CartProvider: Provides cart state management via Zustand
 */

'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { calculateCartTotals } from '@/lib/pricing'

// Cart item types
export type PacketItem = {
  id: string
  type: 'packet'
  name: string
  description?: string | null
  priceCents: number
  quantity: number
  markupPercentage: number
  recipes: Array<{
    id: string
    name: string
    quantity: number
    priceCents: number
  }>
  custom?: boolean
}

// Cart state type
interface CartState {
  items: PacketItem[]
  addPacket: (packet: Omit<PacketItem, 'markupPercentage'> & { markupPercentage?: number }) => void
  updatePacket: (id: string, updates: Partial<Omit<PacketItem, 'id' | 'type'>>) => void
  removePacket: (id: string) => void
  clearCart: () => void
  getCartTotals: () => ReturnType<typeof calculateCartTotals>
}

// Create the Zustand store
export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addPacket: (packet) => set((state) => {
        // Set default markup to 25% if not provided
        const newPacket: PacketItem = {
          ...packet,
          markupPercentage: packet.markupPercentage ?? 25,
        }
        
        return {
          items: [...state.items, newPacket]
        }
      }),
      
      updatePacket: (id, updates) => set((state) => ({
        items: state.items.map((item) =>
          item.id === id ? { ...item, ...updates } : item
        )
      })),
      
      removePacket: (id) => set((state) => ({
        items: state.items.filter((item) => item.id !== id)
      })),
      
      clearCart: () => set({ items: [] }),
      
      getCartTotals: () => {
        const { items } = get()
        return calculateCartTotals(
          items.map((item) => ({
            priceCents: item.priceCents,
            markupPercentage: item.markupPercentage,
            quantity: item.quantity
          }))
        )
      }
    }),
    {
      name: 'costify-cart', // localStorage key
    }
  )
)

// Cart Provider component (for React Context fallback if needed)
export default function CartProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
} 