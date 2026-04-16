import Link from "next/link"
import { PRICE_RANGES, TALLAS, type ProductSearchParams } from "@/services/products"

interface Sport    { id: string; nombre: string; slug: string }
interface Category { id: string; nombre: string; slug: string }

interface CatalogoFiltersProps {
  sports: Sport[]
  categories: Category[]
  params: ProductSearchParams
  buildUrl: (updates: Partial<ProductSearchParams>) => string
}

function FilterLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[12px] font-bold tracking-[0.12em] uppercase text-[#1a1a1a] mb-4">
      {children}
    </h3>
  )
}

export function CatalogoFilters({ sports, categories, params, buildUrl }: CatalogoFiltersProps) {
  const uniqueCategories = Array.from(new Map(categories.map((c) => [c.nombre, c])).values())

  return (
    <aside className="hidden md:block w-56 shrink-0">
      {/* Deporte */}
      <div className="mb-8">
        <FilterLabel>Deporte</FilterLabel>
        <div className="space-y-1.5">
          <Link href={buildUrl({ deporte: undefined, page: "1" })} className={`block text-[14px] transition-colors ${!params.deporte ? "text-[#1a1a1a] font-medium" : "text-[#666] hover:text-[#1a1a1a]"}`}>
            Todos
          </Link>
          {sports.map((s) => (
            <Link key={s.id} href={buildUrl({ deporte: s.slug, page: "1" })} className={`block text-[14px] transition-colors ${params.deporte === s.slug ? "text-[#1a1a1a] font-medium" : "text-[#666] hover:text-[#1a1a1a]"}`}>
              {s.nombre}
            </Link>
          ))}
        </div>
      </div>

      {/* Categoría */}
      <div className="mb-8">
        <FilterLabel>Categoría</FilterLabel>
        <div className="space-y-1.5">
          <Link href={buildUrl({ categoria: undefined, page: "1" })} className={`block text-[14px] transition-colors ${!params.categoria ? "text-[#1a1a1a] font-medium" : "text-[#666] hover:text-[#1a1a1a]"}`}>
            Todas
          </Link>
          {uniqueCategories.map((c) => (
            <Link key={c.id} href={buildUrl({ categoria: c.slug, page: "1" })} className={`block text-[14px] transition-colors ${params.categoria === c.slug ? "text-[#1a1a1a] font-medium" : "text-[#666] hover:text-[#1a1a1a]"}`}>
              {c.nombre}
            </Link>
          ))}
        </div>
      </div>

      {/* Talla */}
      <div className="mb-8">
        <FilterLabel>Talla</FilterLabel>
        <div className="flex flex-wrap gap-2">
          {TALLAS.map((t) => (
            <Link
              key={t}
              href={buildUrl({ talla: params.talla === t ? undefined : t, page: "1" })}
              className={`w-10 h-10 flex items-center justify-center text-[12px] font-medium border transition-colors ${
                params.talla === t
                  ? "border-[#1a1a1a] bg-[#1a1a1a] text-white"
                  : "border-[#e5e5e5] text-[#666] hover:border-[#1a1a1a] hover:text-[#1a1a1a]"
              }`}
            >
              {t}
            </Link>
          ))}
        </div>
      </div>

      {/* Precio */}
      <div className="mb-8">
        <FilterLabel>Precio</FilterLabel>
        <div className="space-y-1.5">
          {PRICE_RANGES.map((range) => (
            <Link
              key={range.value}
              href={buildUrl({ precio: params.precio === range.value ? undefined : range.value, page: "1" })}
              className={`block text-[14px] transition-colors ${
                params.precio === range.value ? "text-[#1a1a1a] font-medium" : "text-[#666] hover:text-[#1a1a1a]"
              }`}
            >
              {range.label}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  )
}
