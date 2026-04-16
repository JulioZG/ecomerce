"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useCartStore } from "@/store/cartStore"
import { formatPrice } from "@/lib/utils"
import { Breadcrumb } from "@/components/shared/Breadcrumb"
import { CartItemRow } from "@/components/store/CartItemRow"

export default function CarritoPage() {
  const { items, removeItem, updateQuantity, total } = useCartStore()

  if (items.length === 0) {
    return (
      <div className="bg-white">
        <Breadcrumb items={[{ label: "Inicio", href: "/" }, { label: "Carrito" }]} />
        <div className="container mx-auto px-4 py-24 text-center">
          <p className="text-[56px] mb-4">🛒</p>
          <h2 className="font-heading text-2xl font-bold text-[#1a1a1a] uppercase tracking-tight mb-2">
            Tu carrito está vacío
          </h2>
          <p className="text-[14px] text-[#666] mb-8">
            Explora nuestro catálogo y agrega productos
          </p>
          <Link
            href="/catalogo"
            className="inline-flex items-center gap-2 px-7 py-3 bg-[#1a1a1a] text-white text-[12px] font-semibold uppercase tracking-[0.1em] hover:bg-[#333] transition-colors"
          >
            Ver catálogo
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white min-h-screen">
      <Breadcrumb items={[{ label: "Inicio", href: "/" }, { label: "Carrito" }]} />

      <div className="border-b border-[#e5e5e5]">
        <div className="container mx-auto px-4 py-8 md:py-10">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-[#1a1a1a] uppercase tracking-tight text-center">
            Tu carrito
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-10">
        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <div className="hidden md:grid grid-cols-[1fr_120px_120px_40px] gap-4 pb-3 border-b border-[#e5e5e5] text-[11px] font-semibold tracking-[0.1em] uppercase text-[#999]">
              <span>Producto</span>
              <span className="text-center">Cantidad</span>
              <span className="text-right">Total</span>
              <span />
            </div>

            <div className="divide-y divide-[#e5e5e5]">
              {items.map((item) => (
                <CartItemRow
                  key={item.variantId}
                  item={item}
                  onRemove={removeItem}
                  onUpdate={updateQuantity}
                />
              ))}
            </div>
          </div>

          <div>
            <div className="bg-[#f5f5f5] p-6">
              <h2 className="text-[12px] font-bold tracking-[0.12em] uppercase text-[#1a1a1a] mb-5">Resumen del pedido</h2>
              <div className="space-y-2 mb-5">
                {items.map((item) => (
                  <div key={item.variantId} className="flex justify-between text-[13px]">
                    <span className="truncate max-w-[160px] text-[#666]">{item.nombre} x{item.cantidad}</span>
                    <span className="text-[#1a1a1a] font-medium">{formatPrice(item.precio * item.cantidad)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-[#e5e5e5] pt-4 flex justify-between items-center">
                <span className="text-[14px] font-bold text-[#1a1a1a] uppercase tracking-wide">Total</span>
                <span className="text-[20px] font-bold text-[#1a1a1a]">{formatPrice(total())}</span>
              </div>
              <Link href="/checkout" className="flex items-center justify-center gap-2 w-full h-12 mt-5 bg-[#1a1a1a] text-white text-[12px] font-semibold uppercase tracking-[0.1em] hover:bg-[#333] transition-colors">
                Ir al checkout <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link href="/catalogo" className="block text-center mt-3 text-[12px] text-[#666] uppercase tracking-wide hover:text-[#1a1a1a] transition-colors">
                Seguir comprando
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
