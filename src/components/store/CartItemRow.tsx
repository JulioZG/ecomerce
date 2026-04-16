"use client"

import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, Trash2 } from "lucide-react"
import { formatPrice } from "@/lib/utils"

interface CartItem {
  variantId: string
  nombre: string
  slug: string
  image: string
  talla: string
  color: string
  precio: number
  cantidad: number
  stock: number
}

interface CartItemRowProps {
  item: CartItem
  onRemove: (variantId: string) => void
  onUpdate: (variantId: string, cantidad: number) => void
}

export function CartItemRow({ item, onRemove, onUpdate }: CartItemRowProps) {
  return (
    <div className="py-5 grid md:grid-cols-[1fr_120px_120px_40px] gap-4 items-center">
      <div className="flex gap-4">
        <div className="relative w-20 h-24 bg-[#f5f5f5] shrink-0 overflow-hidden">
          {item.image ? (
            <Image src={item.image} alt={item.nombre} fill className="object-cover" sizes="80px" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl">👕</div>
          )}
        </div>
        <div className="min-w-0">
          <Link href={`/producto/${item.slug}`} className="text-[14px] font-medium text-[#1a1a1a] hover:text-[#007AFF] transition-colors line-clamp-2">
            {item.nombre}
          </Link>
          <p className="text-[12px] text-[#999] mt-1">{item.talla} / {item.color}</p>
          <p className="text-[14px] font-semibold text-[#1a1a1a] mt-1">{formatPrice(item.precio)}</p>
        </div>
      </div>

      <div className="flex items-center justify-center">
        <div className="flex items-center border border-[#e5e5e5]">
          <button onClick={() => onUpdate(item.variantId, item.cantidad - 1)} className="w-9 h-9 flex items-center justify-center text-[#666] hover:text-[#1a1a1a] transition-colors">
            <Minus className="h-3 w-3" />
          </button>
          <span className="w-8 text-center text-[13px] font-medium">{item.cantidad}</span>
          <button onClick={() => onUpdate(item.variantId, item.cantidad + 1)} disabled={item.cantidad >= item.stock} className="w-9 h-9 flex items-center justify-center text-[#666] hover:text-[#1a1a1a] disabled:text-[#ccc] transition-colors">
            <Plus className="h-3 w-3" />
          </button>
        </div>
      </div>

      <p className="text-[14px] font-semibold text-[#1a1a1a] text-right">{formatPrice(item.precio * item.cantidad)}</p>

      <button onClick={() => onRemove(item.variantId)} className="text-[#ccc] hover:text-red-500 transition-colors justify-self-end">
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  )
}
