import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function GET() {
  const session = await auth()
  if (!session || (session.user as { role?: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const [sports, categories] = await Promise.all([
    prisma.sport.findMany({ orderBy: { nombre: "asc" } }),
    prisma.category.findMany({ orderBy: { nombre: "asc" } }),
  ])

  return NextResponse.json({ sports, categories })
}
