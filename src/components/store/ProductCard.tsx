import Link from "next/link"
import Image from "next/image"
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
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[#f5f5f5] mb-3">
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.nombre}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl select-none">
            👕
          </div>
        )}

        {/* Second image on hover */}
        {product.images[1] && (
          <Image
            src={product.images[1]}
            alt=""
            fill
            className="object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        )}

        {/* Out of stock */}
        {!hasStock && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="bg-[#1a1a1a] text-white text-[11px] font-semibold uppercase tracking-[0.1em] px-4 py-1.5">
              Agotado
            </span>
          </div>
        )}

        {/* Sport badge */}
        {product.sport && (
          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[10px] font-semibold uppercase tracking-[0.1em] text-[#1a1a1a] px-2.5 py-1">
            {product.sport.nombre}
          </span>
        )}
      </div>

      {/* Info */}
      <div>
        <h3 className="text-[13px] text-[#1a1a1a] line-clamp-1 group-hover:text-[#007AFF] transition-colors leading-snug">
          {product.nombre}
        </h3>
        <p className="text-[14px] font-semibold text-[#1a1a1a] mt-1">
          {formatPrice(product.precio)}
        </p>
      </div>
    </Link>
  )
}
