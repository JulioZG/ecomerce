import { Suspense } from "react"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { ProductCard } from "@/components/store/ProductCard"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

interface SearchParams {
  deporte?: string
  categoria?: string
  talla?: string
  page?: string
}

async function getProducts(params: SearchParams) {
  const page = Number(params.page ?? "1")
  const limit = 12

  const where = {
    activo: true,
    ...(params.deporte && { sport: { slug: params.deporte } }),
    ...(params.categoria && { category: { slug: params.categoria } }),
    ...(params.talla && {
      variants: { some: { talla: params.talla, stock: { gt: 0 } } },
    }),
  }

  try {
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          sport: { select: { nombre: true, slug: true } },
          variants: { select: { talla: true, color: true, stock: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where }),
    ])
    return { products, total, pages: Math.ceil(total / limit) }
  } catch {
    return { products: [], total: 0, pages: 0 }
  }
}

async function getSports() {
  try {
    return await prisma.sport.findMany({ orderBy: { nombre: "asc" } })
  } catch {
    return []
  }
}

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const { products, total, pages } = await getProducts(params)
  const sports = await getSports()
  const page = Number(params.page ?? "1")

  const tallas = ["XS", "S", "M", "L", "XL", "XXL"]

  function buildUrl(updates: Partial<SearchParams>) {
    const merged = { ...params, ...updates }
    const qs = Object.entries(merged)
      .filter(([, v]) => v)
      .map(([k, v]) => `${k}=${v}`)
      .join("&")
    return `/catalogo${qs ? `?${qs}` : ""}`
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters */}
        <aside className="w-full md:w-56 shrink-0">
          <h2 className="font-bold mb-4">Filtros</h2>

          <div className="mb-6">
            <h3 className="text-sm font-semibold mb-2 text-muted-foreground uppercase">Deporte</h3>
            <div className="flex flex-col gap-1">
              <Link href="/catalogo">
                <Badge
                  variant={!params.deporte ? "default" : "outline"}
                  className="cursor-pointer"
                >
                  Todos
                </Badge>
              </Link>
              {sports.map((s) => (
                <Link key={s.id} href={buildUrl({ deporte: s.slug, page: "1" })}>
                  <Badge
                    variant={params.deporte === s.slug ? "default" : "outline"}
                    className="cursor-pointer"
                  >
                    {s.nombre}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-semibold mb-2 text-muted-foreground uppercase">Talla</h3>
            <div className="flex flex-wrap gap-2">
              {tallas.map((t) => (
                <Link key={t} href={buildUrl({ talla: params.talla === t ? undefined : t, page: "1" })}>
                  <Badge
                    variant={params.talla === t ? "default" : "outline"}
                    className="cursor-pointer"
                  >
                    {t}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        </aside>

        {/* Products */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">
              {total} producto{total !== 1 ? "s" : ""}
            </p>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              No se encontraron productos con los filtros aplicados.
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {page > 1 && (
                <Button asChild variant="outline">
                  <Link href={buildUrl({ page: String(page - 1) })}>Anterior</Link>
                </Button>
              )}
              <span className="flex items-center px-4 text-sm">
                {page} / {pages}
              </span>
              {page < pages && (
                <Button asChild variant="outline">
                  <Link href={buildUrl({ page: String(page + 1) })}>Siguiente</Link>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
