"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { CartItemLocal } from "@/types"

interface CartStore {
  items: CartItemLocal[]
  addItem: (item: CartItemLocal) => void
  removeItem: (variantId: string) => void
  updateQuantity: (variantId: string, cantidad: number) => void
  clearCart: () => void
  total: () => number
  count: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (newItem) => {
        const items = get().items
        const existing = items.find((i) => i.variantId === newItem.variantId)
        if (existing) {
          set({
            items: items.map((i) =>
              i.variantId === newItem.variantId
                ? { ...i, cantidad: Math.min(i.cantidad + newItem.cantidad, i.stock) }
                : i
            ),
          })
        } else {
          set({ items: [...items, newItem] })
        }
      },

      removeItem: (variantId) => {
        set({ items: get().items.filter((i) => i.variantId !== variantId) })
      },

      updateQuantity: (variantId, cantidad) => {
        if (cantidad <= 0) {
          get().removeItem(variantId)
          return
        }
        set({
          items: get().items.map((i) =>
            i.variantId === variantId ? { ...i, cantidad } : i
          ),
        })
      },

      clearCart: () => set({ items: [] }),

      total: () =>
        get().items.reduce((sum, i) => sum + i.precio * i.cantidad, 0),

      count: () =>
        get().items.reduce((sum, i) => sum + i.cantidad, 0),
    }),
    {
      name: "carrito",
    }
  )
)
