"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { toast } from "sonner"
import { formatPrice } from "@/lib/utils"
import { useCartStore } from "@/store/cartStore"
import { ChevronRight, Minus, Plus, Truck, RotateCcw, Shield } from "lucide-react"

interface Variant {
  id: string
  talla: string
  color: string
  stock: number
}

interface Product {
  id: string
  nombre: string
  slug: string
  descripcion: string | null
  precio: number
  images: string[]
  sport: { nombre: string; slug: string }
  category: { nombre: string }
  variants: Variant[]
}

export default function ProductoPage() {
  const { slug } = useParams<{ slug: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null)
  const [activeImage, setActiveImage] = useState(0)
  const [qty, setQty] = useState(1)
  const addItem = useCartStore((s) => s.addItem)

  useEffect(() => {
    fetch(`/api/productos/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        setProduct(data)
        setLoading(false)
      })
  }, [slug])

  const tallas = [...new Set(product?.variants.map((v) => v.talla) ?? [])]
  const colores = [...new Set(product?.variants.map((v) => v.color) ?? [])]

  function getVariant(talla: string, color: string) {
    return product?.variants.find((v) => v.talla === talla && v.color === color) ?? null
  }

  function handleAddToCart() {
    if (!product || !selectedVariant) return
    for (let i = 0; i < qty; i++) {
      addItem({
        variantId: selectedVariant.id,
        productId: product.id,
        nombre: product.nombre,
        slug: product.slug,
        image: product.images[0] ?? "",
        talla: selectedVariant.talla,
        color: selectedVariant.color,
        precio: product.precio,
        cantidad: 1,
        stock: selectedVariant.stock,
      })
    }
    toast.success("Agregado al carrito")
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="aspect-[3/4] bg-[#f5f5f5] animate-pulse" />
          <div className="space-y-6 py-4">
            <div className="h-4 w-32 bg-[#f5f5f5] animate-pulse" />
            <div className="h-8 w-3/4 bg-[#f5f5f5] animate-pulse" />
            <div className="h-6 w-1/3 bg-[#f5f5f5] animate-pulse" />
            <div className="h-32 w-full bg-[#f5f5f5] animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <p className="text-[48px] mb-4">🔍</p>
        <h2 className="font-heading text-xl font-bold text-[#1a1a1a] uppercase mb-2">
          Producto no encontrado
        </h2>
        <p className="text-[14px] text-[#666] mb-6">
          El producto que buscas no existe o fue eliminado.
        </p>
        <Link
          href="/catalogo"
          className="inline-flex px-6 py-3 bg-[#1a1a1a] text-white text-[12px] font-semibold uppercase tracking-[0.1em] hover:bg-[#333] transition-colors"
        >
          Ir al catálogo
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-white">
      {/* Breadcrumb */}
      <div className="border-b border-[#e5e5e5]">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-1.5 text-[12px] text-[#999]">
            <Link href="/" className="hover:text-[#1a1a1a] transition-colors">Inicio</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/catalogo" className="hover:text-[#1a1a1a] transition-colors">Catálogo</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-[#1a1a1a] font-medium">{product.nombre}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
          {/* Images */}
          <div>
            <div className="relative aspect-[3/4] overflow-hidden bg-[#f5f5f5] mb-3">
              {product.images[activeImage] ? (
                <Image
                  src={product.images[activeImage]}
                  alt={product.nombre}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-7xl">👕</div>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`relative w-20 h-24 overflow-hidden bg-[#f5f5f5] border-2 transition-colors ${
                      activeImage === i ? "border-[#1a1a1a]" : "border-transparent hover:border-[#ccc]"
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" sizes="80px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="py-2">
            <p className="text-[11px] tracking-[0.15em] uppercase text-[#999] font-medium mb-3">
              {product.sport.nombre} · {product.category.nombre}
            </p>
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-[#1a1a1a] uppercase tracking-tight leading-tight">
              {product.nombre}
            </h1>
            <p className="text-[22px] font-semibold text-[#1a1a1a] mt-4">
              {formatPrice(product.precio)}
            </p>

            {product.descripcion && (
              <p className="text-[14px] text-[#666] leading-relaxed mt-5 pb-6 border-b border-[#e5e5e5]">
                {product.descripcion}
              </p>
            )}

            {/* Color selector */}
            {colores.length > 0 && (
              <div className="mt-6">
                <p className="text-[12px] font-bold tracking-[0.1em] uppercase text-[#1a1a1a] mb-3">
                  Color {selectedVariant && <span className="font-normal text-[#666] normal-case tracking-normal">— {selectedVariant.color}</span>}
                </p>
                <div className="flex flex-wrap gap-2">
                  {colores.map((color) => {
                    const isSelected = selectedVariant?.color === color
                    return (
                      <button
                        key={color}
                        onClick={() => {
                          const v = getVariant(selectedVariant?.talla ?? tallas[0], color)
                          setSelectedVariant(v)
                        }}
                        className={`px-4 py-2 text-[13px] border transition-colors ${
                          isSelected
                            ? "border-[#1a1a1a] bg-[#1a1a1a] text-white"
                            : "border-[#e5e5e5] text-[#666] hover:border-[#1a1a1a] hover:text-[#1a1a1a]"
                        }`}
                      >
                        {color}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Talla selector */}
            {tallas.length > 0 && (
              <div className="mt-6">
                <p className="text-[12px] font-bold tracking-[0.1em] uppercase text-[#1a1a1a] mb-3">
                  Talla {selectedVariant && <span className="font-normal text-[#666] normal-case tracking-normal">— {selectedVariant.talla}</span>}
                </p>
                <div className="flex flex-wrap gap-2">
                  {tallas.map((talla) => {
                    const v = getVariant(talla, selectedVariant?.color ?? colores[0])
                    const hasStock = (v?.stock ?? 0) > 0
                    const isSelected = selectedVariant?.talla === talla

                    return (
                      <button
                        key={talla}
                        disabled={!hasStock}
                        onClick={() => setSelectedVariant(v)}
                        className={`w-14 h-12 text-[13px] font-medium border transition-colors ${
                          isSelected
                            ? "border-[#1a1a1a] bg-[#1a1a1a] text-white"
                            : hasStock
                            ? "border-[#e5e5e5] text-[#666] hover:border-[#1a1a1a] hover:text-[#1a1a1a]"
                            : "border-[#f0f0f0] text-[#ccc] cursor-not-allowed line-through"
                        }`}
                      >
                        {talla}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {selectedVariant && (
              <p className="text-[12px] text-[#999] mt-2">
                {selectedVariant.stock} disponible{selectedVariant.stock !== 1 ? "s" : ""}
              </p>
            )}

            {/* Quantity + Add to Cart */}
            <div className="flex gap-3 mt-8">
              <div className="flex items-center border border-[#e5e5e5]">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-11 h-12 flex items-center justify-center text-[#666] hover:text-[#1a1a1a] transition-colors"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-10 text-center text-[14px] font-medium text-[#1a1a1a]">{qty}</span>
                <button
                  onClick={() => setQty(Math.min(selectedVariant?.stock ?? 10, qty + 1))}
                  className="w-11 h-12 flex items-center justify-center text-[#666] hover:text-[#1a1a1a] transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
              <button
                disabled={!selectedVariant || selectedVariant.stock === 0}
                onClick={handleAddToCart}
                className="flex-1 h-12 bg-[#1a1a1a] text-white text-[12px] font-semibold uppercase tracking-[0.1em] hover:bg-[#333] transition-colors disabled:bg-[#ccc] disabled:cursor-not-allowed"
              >
                {!selectedVariant
                  ? "Selecciona talla y color"
                  : selectedVariant.stock === 0
                  ? "Sin stock"
                  : "Agregar al carrito"}
              </button>
            </div>

            {/* Features */}
            <div className="mt-8 pt-6 border-t border-[#e5e5e5] space-y-3">
              <div className="flex items-center gap-3">
                <Truck className="h-4 w-4 text-[#666] shrink-0" strokeWidth={1.5} />
                <span className="text-[13px] text-[#666]">Envío gratis en compras mayores a $2,500</span>
              </div>
              <div className="flex items-center gap-3">
                <RotateCcw className="h-4 w-4 text-[#666] shrink-0" strokeWidth={1.5} />
                <span className="text-[13px] text-[#666]">Devoluciones gratis en 30 días</span>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="h-4 w-4 text-[#666] shrink-0" strokeWidth={1.5} />
                <span className="text-[13px] text-[#666]">Pago seguro con MercadoPago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
