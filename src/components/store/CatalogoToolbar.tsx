import Link from "next/link"
import { SlidersHorizontal, ChevronRight, X } from "lucide-react"
import { PRICE_RANGES, SORT_OPTIONS, type ProductSearchParams } from "@/services/products"

interface Sport { id: string; nombre: string; slug: string }

interface CatalogoToolbarProps {
  total: number
  sports: Sport[]
  params: ProductSearchParams
  buildUrl: (updates: Partial<ProductSearchParams>) => string
}

export function CatalogoToolbar({ total, sports, params, buildUrl }: CatalogoToolbarProps) {
  const hasFilters = params.deporte || params.categoria || params.talla || params.precio
  const activeSort = SORT_OPTIONS.find((s) => s.value === params.orden) ?? SORT_OPTIONS[0]

  return (
    <div className="border-b border-[#e5e5e5]">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Count */}
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-[#666]" />
          <span className="text-[12px] font-medium text-[#1a1a1a] uppercase tracking-[0.08em]">
            {total} producto{total !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Active filter chips */}
        {hasFilters && (
          <div className="hidden md:flex items-center gap-2">
            {params.deporte && (
              <Link href={buildUrl({ deporte: undefined, page: "1" })} className="inline-flex items-center gap-1 px-3 py-1 bg-[#f5f5f5] text-[11px] font-medium uppercase tracking-wide text-[#1a1a1a] hover:bg-[#e5e5e5] transition-colors">
                {sports.find((s) => s.slug === params.deporte)?.nombre ?? params.deporte}
                <X className="h-3 w-3 text-[#999]" />
              </Link>
            )}
            {params.categoria && (
              <Link href={buildUrl({ categoria: undefined, page: "1" })} className="inline-flex items-center gap-1 px-3 py-1 bg-[#f5f5f5] text-[11px] font-medium uppercase tracking-wide text-[#1a1a1a] hover:bg-[#e5e5e5] transition-colors">
                {params.categoria}
                <X className="h-3 w-3 text-[#999]" />
              </Link>
            )}
            {params.talla && (
              <Link href={buildUrl({ talla: undefined, page: "1" })} className="inline-flex items-center gap-1 px-3 py-1 bg-[#f5f5f5] text-[11px] font-medium uppercase tracking-wide text-[#1a1a1a] hover:bg-[#e5e5e5] transition-colors">
                Talla: {params.talla}
                <X className="h-3 w-3 text-[#999]" />
              </Link>
            )}
            {params.precio && (
              <Link href={buildUrl({ precio: undefined, page: "1" })} className="inline-flex items-center gap-1 px-3 py-1 bg-[#f5f5f5] text-[11px] font-medium uppercase tracking-wide text-[#1a1a1a] hover:bg-[#e5e5e5] transition-colors">
                {PRICE_RANGES.find((r) => r.value === params.precio)?.label ?? params.precio}
                <X className="h-3 w-3 text-[#999]" />
              </Link>
            )}
            <Link href="/catalogo" className="text-[11px] font-medium text-[#007AFF] uppercase tracking-wide hover:underline ml-1">
              Limpiar todo
            </Link>
          </div>
        )}

        {/* Sort */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-[#666] uppercase tracking-wide hidden sm:inline">Ordenar:</span>
          <div className="relative group">
            <button className="text-[12px] font-medium text-[#1a1a1a] uppercase tracking-[0.06em] flex items-center gap-1 hover:text-[#007AFF] transition-colors">
              {activeSort.label}
              <ChevronRight className="h-3 w-3 rotate-90" />
            </button>
            <div className="absolute right-0 top-full mt-1 w-52 bg-white border border-[#e5e5e5] shadow-md z-20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150">
              {SORT_OPTIONS.map((opt) => (
                <Link
                  key={opt.value}
                  href={buildUrl({ orden: opt.value === "nuevo" ? undefined : opt.value, page: "1" })}
                  className={`block px-4 py-2.5 text-[13px] transition-colors ${
                    activeSort.value === opt.value ? "text-[#007AFF] bg-[#f5f5f5] font-medium" : "text-[#1a1a1a] hover:bg-[#f5f5f5]"
                  }`}
                >
                  {opt.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
