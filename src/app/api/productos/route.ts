import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const sportSlug = searchParams.get("deporte")
  const categorySlug = searchParams.get("categoria")
  const talla = searchParams.get("talla")
  const minPrecio = searchParams.get("minPrecio")
  const maxPrecio = searchParams.get("maxPrecio")
  const destacado = searchParams.get("destacado")
  const page = Number(searchParams.get("page") ?? "1")
  const limit = Number(searchParams.get("limit") ?? "12")

  const where = {
    activo: true,
    ...(sportSlug && { sport: { slug: sportSlug } }),
    ...(categorySlug && { category: { slug: categorySlug } }),
    ...(destacado === "true" && { destacado: true }),
    ...(talla && { variants: { some: { talla, stock: { gt: 0 } } } }),
    ...((minPrecio || maxPrecio) && {
      precio: {
        ...(minPrecio && { gte: Number(minPrecio) }),
        ...(maxPrecio && { lte: Number(maxPrecio) }),
      },
    }),
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        sport: { select: { nombre: true, slug: true } },
        category: { select: { nombre: true, slug: true } },
        variants: { select: { talla: true, color: true, stock: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({ where }),
  ])

  return NextResponse.json({ products, total, page, pages: Math.ceil(total / limit) })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session || (session.user as { role?: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const body = await req.json()

  const product = await prisma.product.create({
    data: {
      nombre: body.nombre,
      slug: body.slug,
      descripcion: body.descripcion,
      precio: body.precio,
      images: body.images ?? [],
      destacado: body.destacado ?? false,
      activo: body.activo ?? true,
      sportId: body.sportId,
      categoryId: body.categoryId,
    },
  })

  return NextResponse.json(product, { status: 201 })
}
