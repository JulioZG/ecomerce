"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { formatPrice } from "@/lib/utils"
import { useCartStore } from "@/store/cartStore"

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
    toast.success("Agregado al carrito")
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 grid md:grid-cols-2 gap-8">
        <Skeleton className="aspect-square rounded-xl" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center text-muted-foreground">
        Producto no encontrado.
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Images */}
        <div>
          <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 mb-2">
            {product.images[activeImage] ? (
              <Image
                src={product.images[activeImage]}
                alt={product.nombre}
                fill
                className="object-cover"
                priority
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
                  className={`relative w-16 h-16 rounded border-2 overflow-hidden ${
                    activeImage === i ? "border-blue-600" : "border-transparent"
                  }`}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground uppercase tracking-wide">
              {product.sport.nombre} · {product.category.nombre}
            </p>
            <h1 className="text-2xl font-bold mt-1">{product.nombre}</h1>
            <p className="text-2xl font-bold text-blue-600 mt-2">
              {formatPrice(product.precio)}
            </p>
          </div>

          {product.descripcion && (
            <p className="text-muted-foreground text-sm">{product.descripcion}</p>
          )}

          {/* Color selector */}
          {colores.length > 0 && (
            <div>
              <p className="text-sm font-semibold mb-2">Color</p>
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
                      className={`px-3 py-1 rounded border text-sm transition-colors ${
                        isSelected
                          ? "border-blue-600 bg-blue-50 text-blue-700"
                          : "border-gray-200 hover:border-gray-400"
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
            <div>
              <p className="text-sm font-semibold mb-2">Talla</p>
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
                      className={`w-12 h-12 rounded border text-sm font-medium transition-colors ${
                        isSelected
                          ? "border-blue-600 bg-blue-600 text-white"
                          : hasStock
                          ? "border-gray-200 hover:border-blue-400"
                          : "border-gray-100 text-gray-300 cursor-not-allowed line-through"
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
            <p className="text-xs text-muted-foreground">
              Stock disponible: {selectedVariant.stock}
            </p>
          )}

          <Button
            size="lg"
            className="w-full"
            disabled={!selectedVariant || selectedVariant.stock === 0}
            onClick={handleAddToCart}
          >
            {!selectedVariant
              ? "Seleccioná talla y color"
              : selectedVariant.stock === 0
              ? "Sin stock"
              : "Agregar al carrito"}
          </Button>
        </div>
      </div>
    </div>
  )
}
