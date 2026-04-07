"use client"

import Link from "next/link"
import Image from "next/image"
import { Trash2, Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/store/cartStore"
import { formatPrice } from "@/lib/utils"

export default function CarritoPage() {
  const { items, removeItem, updateQuantity, total } = useCartStore()

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-6xl mb-4">🛒</p>
        <h2 className="text-xl font-semibold mb-2">Tu carrito está vacío</h2>
        <p className="text-muted-foreground mb-6">
          Explorá nuestro catálogo y agregá productos
        </p>
        <Button asChild>
          <Link href="/catalogo">Ver catálogo</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Tu carrito</h1>
      <div className="grid md:grid-cols-3 gap-8">
        {/* Items */}
        <div className="md:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.variantId} className="flex gap-4 p-4 border rounded-lg">
              <div className="relative w-20 h-20 rounded overflow-hidden bg-gray-100 shrink-0">
                {item.image ? (
                  <Image src={item.image} alt={item.nombre} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl">👕</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <Link
                  href={`/producto/${item.slug}`}
                  className="font-medium hover:text-blue-600 line-clamp-2"
                >
                  {item.nombre}
                </Link>
                <p className="text-sm text-muted-foreground">
                  {item.talla} / {item.color}
                </p>
                <p className="font-bold text-blue-600 mt-1">
                  {formatPrice(item.precio)}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <button
                  onClick={() => removeItem(item.variantId)}
                  className="text-red-400 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => updateQuantity(item.variantId, item.cantidad - 1)}
                    className="w-7 h-7 rounded border flex items-center justify-center hover:bg-gray-100"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="w-8 text-center text-sm">{item.cantidad}</span>
                  <button
                    onClick={() => updateQuantity(item.variantId, item.cantidad + 1)}
                    disabled={item.cantidad >= item.stock}
                    className="w-7 h-7 rounded border flex items-center justify-center hover:bg-gray-100 disabled:opacity-50"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-gray-50 rounded-lg p-6 h-fit">
          <h2 className="font-bold text-lg mb-4">Resumen</h2>
          {items.map((item) => (
            <div key={item.variantId} className="flex justify-between text-sm mb-2">
              <span className="truncate max-w-[150px]">{item.nombre} x{item.cantidad}</span>
              <span>{formatPrice(item.precio * item.cantidad)}</span>
            </div>
          ))}
          <div className="border-t mt-4 pt-4 flex justify-between font-bold">
            <span>Total</span>
            <span className="text-blue-600">{formatPrice(total())}</span>
          </div>
          <Button asChild className="w-full mt-4" size="lg">
            <Link href="/checkout">Ir al checkout</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
