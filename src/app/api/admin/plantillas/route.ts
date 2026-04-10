import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const { nombre, sportId, imagenBase } = await req.json()
    if (!nombre || !sportId || !imagenBase) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 })
    }
    const template = await prisma.uniformTemplate.create({
      data: { nombre, sportId, imagenBase },
    })
    return NextResponse.json(template, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Error al crear plantilla" }, { status: 500 })
  }
}
