import { prisma } from "@/lib/prisma"

export interface ProductSearchParams {
  deporte?: string
  categoria?: string
  talla?: string
  precio?: string
  orden?: string
  page?: string
}

export const PRICE_RANGES = [
  { label: "Menos de $500", value: "0-500" },
  { label: "$500 – $1,000", value: "500-1000" },
  { label: "$1,000 – $2,000", value: "1000-2000" },
  { label: "Más de $2,000", value: "2000-999999" },
]

export const SORT_OPTIONS = [
  { label: "Más recientes", value: "nuevo" },
  { label: "Precio: menor a mayor", value: "precio-asc" },
  { label: "Precio: mayor a menor", value: "precio-desc" },
  { label: "Nombre: A-Z", value: "nombre-asc" },
]

export const TALLAS = ["XS", "S", "M", "L", "XL", "XXL"]

function getOrderBy(orden?: string) {
  switch (orden) {
    case "precio-asc":  return { precio: "asc" as const }
    case "precio-desc": return { precio: "desc" as const }
    case "nombre-asc":  return { nombre: "asc" as const }
    default:            return { createdAt: "desc" as const }
  }
}

export async function getProducts(params: ProductSearchParams) {
  const page = Number(params.page ?? "1")
  const limit = 12

  const priceFilter = params.precio
    ? (() => {
        const [min, max] = params.precio.split("-").map(Number)
        return { gte: min, lte: max }
      })()
    : undefined

  const where = {
    activo: true,
    ...(params.deporte   && { sport: { slug: params.deporte } }),
    ...(params.categoria && { category: { slug: { contains: params.categoria } } }),
    ...(params.talla     && { variants: { some: { talla: params.talla, stock: { gt: 0 } } } }),
    ...(priceFilter      && { precio: priceFilter }),
  }

  try {
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          sport: { select: { nombre: true, slug: true } },
          variants: { select: { talla: true, color: true, stock: true } },
        },
        orderBy: getOrderBy(params.orden),
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

export async function getFeaturedProducts() {
  try {
    return await prisma.product.findMany({
      where: { destacado: true, activo: true },
      include: {
        sport: { select: { nombre: true, slug: true } },
        variants: { select: { talla: true, color: true, stock: true } },
      },
      take: 8,
      orderBy: { createdAt: "desc" },
    })
  } catch {
    return []
  }
}

export async function getSports() {
  try {
    return await prisma.sport.findMany({ orderBy: { nombre: "asc" } })
  } catch {
    return []
  }
}

export async function getCategories() {
  try {
    return await prisma.category.findMany({ orderBy: { nombre: "asc" } })
  } catch {
    return []
  }
}
