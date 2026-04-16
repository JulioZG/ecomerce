import Link from "next/link"
import { getProducts, getSports, getCategories, type ProductSearchParams } from "@/services/products"
import { ProductCard } from "@/components/store/ProductCard"
import { Breadcrumb } from "@/components/shared/Breadcrumb"
import { PageHeader } from "@/components/shared/PageHeader"
import { EmptyState } from "@/components/shared/EmptyState"
import { CatalogoFilters } from "@/components/store/CatalogoFilters"
import { CatalogoToolbar } from "@/components/store/CatalogoToolbar"

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: Promise<ProductSearchParams>
}) {
  const params = await searchParams
  const [{ products, total, pages }, sports, categories] = await Promise.all([
    getProducts(params),
    getSports(),
    getCategories(),
  ])
  const page = Number(params.page ?? "1")

  function buildUrl(updates: Partial<ProductSearchParams>) {
    const merged = { ...params, ...updates }
    const qs = Object.entries(merged)
      .filter(([, v]) => v)
      .map(([k, v]) => `${k}=${v}`)
      .join("&")
    return `/catalogo${qs ? `?${qs}` : ""}`
  }

  return (
    <div className="bg-white min-h-screen">
      <Breadcrumb items={[{ label: "Inicio", href: "/" }, { label: "Catálogo" }]} />
      <PageHeader
        title="Catálogo"
        subtitle="Encuentra la ropa deportiva ideal para tu entrenamiento"
        size="lg"
      />
      <CatalogoToolbar total={total} sports={sports} params={params} buildUrl={buildUrl} />

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-10">
          <CatalogoFilters sports={sports} categories={categories} params={params} buildUrl={buildUrl} />

          <div className="flex-1">
            {products.length === 0 ? (
              <EmptyState
                emoji="🔍"
                title="Sin resultados"
                description="No encontramos productos con los filtros seleccionados."
                action={{ label: "Ver todos los productos", href: "/catalogo" }}
              />
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}

            {pages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12 pt-8 border-t border-[#e5e5e5]">
                {page > 1 && (
                  <Link
                    href={buildUrl({ page: String(page - 1) })}
                    className="px-5 py-2.5 border border-[#e5e5e5] text-[12px] font-medium uppercase tracking-[0.08em] text-[#1a1a1a] hover:border-[#1a1a1a] transition-colors"
                  >
                    Anterior
                  </Link>
                )}
                <div className="flex items-center gap-1">
                  {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                    <Link
                      key={p}
                      href={buildUrl({ page: String(p) })}
                      className={`w-10 h-10 flex items-center justify-center text-[13px] font-medium transition-colors ${
                        p === page ? "bg-[#1a1a1a] text-white" : "text-[#666] hover:text-[#1a1a1a]"
                      }`}
                    >
                      {p}
                    </Link>
                  ))}
                </div>
                {page < pages && (
                  <Link
                    href={buildUrl({ page: String(page + 1) })}
                    className="px-5 py-2.5 border border-[#e5e5e5] text-[12px] font-medium uppercase tracking-[0.08em] text-[#1a1a1a] hover:border-[#1a1a1a] transition-colors"
                  >
                    Siguiente
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
