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

const sportColors: Record<string, string> = {
  futbol: "bg-emerald-100 text-emerald-700",
  basquet: "bg-orange-100 text-orange-700",
  running: "bg-blue-100 text-blue-700",
  voley: "bg-violet-100 text-violet-700",
}

export function ProductCard({ product }: ProductCardProps) {
  const hasStock = product.variants.some((v) => v.stock > 0)
  const sportColor = product.sport ? (sportColors[product.sport.slug] ?? "bg-slate-100 text-slate-600") : ""

  return (
    <Link href={`/producto/${product.slug}`} className="group block">
      {/* Image container */}
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 mb-3">
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.nombre}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl select-none">
            👕
          </div>
        )}

        {/* Out of stock overlay */}
        {!hasStock && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center">
            <span className="bg-slate-800 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
              Sin stock
            </span>
          </div>
        )}

        {/* Quick add hint */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent py-3 px-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <p className="text-white text-xs font-semibold text-center">Ver producto</p>
        </div>
      </div>

      {/* Info */}
      <div className="space-y-1.5">
        {product.sport && (
          <span className={`inline-block text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${sportColor}`}>
            {product.sport.nombre}
          </span>
        )}
        <h3 className="font-semibold text-sm text-slate-800 line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug">
          {product.nombre}
        </h3>
        <p className="font-extrabold text-blue-600 text-base">
          {formatPrice(product.precio)}
        </p>
      </div>
    </Link>
  )
}
