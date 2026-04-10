import { NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import path from "path"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null
    if (!file) return NextResponse.json({ error: "No se recibió archivo" }, { status: 400 })

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Guardar en /public/templates/
    const ext = file.name.split(".").pop() ?? "png"
    const filename = `template-${Date.now()}.${ext}`
    const dir = path.join(process.cwd(), "public", "templates")
    await mkdir(dir, { recursive: true })
    await writeFile(path.join(dir, filename), buffer)

    return NextResponse.json({ url: `/templates/${filename}` })
  } catch {
    return NextResponse.json({ error: "Error al subir archivo" }, { status: 500 })
  }
}
