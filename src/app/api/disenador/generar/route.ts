import { NextRequest, NextResponse } from "next/server"
import { experimental_generateImage as generateImage } from "ai"
import { imageModel } from "@/lib/ai"
import { auth } from "@/lib/auth"

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  const { templateNombre, nombreEquipo, colorPrimario, colorSecundario, logoUrl, sport } =
    await req.json()

  const prompt = [
    `Professional sports uniform design for team "${nombreEquipo}".`,
    `Sport: ${sport ?? "general sports"}.`,
    `Primary color: ${colorPrimario}, secondary color: ${colorSecundario}.`,
    `Modern design with side stripes and athletic style.`,
    `Front and back view on white background.`,
    `High resolution, sports clothing catalog style, clean professional look.`,
    logoUrl
      ? `Include a placeholder area on the left chest for the team logo.`
      : "",
    templateNombre ? `Base template style: ${templateNombre}.` : "",
  ]
    .filter(Boolean)
    .join(" ")

  const { image } = await generateImage({
    model: imageModel,
    prompt,
    size: "1024x1024",
  })

  return NextResponse.json({
    imageBase64: image.base64,
    promptUsado: prompt,
  })
}
