import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/utils"

interface ProductCardProps {
  product: {
    id: string
    nombre: string
    slug: string
    precio: number | string | { toNumber: () => number }
    images: string[]
    sport?: { nombre: string; slug: string } | null
    variants: Array<{ talla: string; color: string; stock: number }>
  }
}

export function ProductCard({ product }: ProductCardProps) {
  const hasStock = product.variants.some((v) => v.stock > 0)

  return (
    <Link href={`/producto/${product.slug}`} className="group block">
      <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 mb-2">
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.nombre}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl">
            👕
          </div>
        )}
        {!hasStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="secondary">Sin stock</Badge>
          </div>
        )}
      </div>
      <div className="space-y-0.5">
        {product.sport && (
          <p className="text-xs text-muted-foreground uppercase tracking-wide">
            {product.sport.nombre}
          </p>
        )}
        <h3 className="font-medium text-sm line-clamp-2 group-hover:text-blue-600 transition-colors">
          {product.nombre}
        </h3>
        <p className="font-bold text-blue-600">{formatPrice(product.precio)}</p>
      </div>
    </Link>
  )
}
