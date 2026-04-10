import { NextRequest, NextResponse } from "next/server"

export const maxDuration = 60

export async function POST(req: NextRequest) {
  const { templateNombre, nombreEquipo, colorPrimario, colorSecundario, logoUrl, sport } =
    await req.json()

  const prompt = [
    `Professional sports jersey uniform for team "${nombreEquipo}".`,
    `Sport: ${sport ?? "general sports"}.`,
    `Primary color ${colorPrimario} with ${colorSecundario} accents.`,
    `Modern athletic jersey, side stripes, front view, white background.`,
    `High resolution sports apparel catalog photo.`,
    logoUrl ? `Logo placeholder on left chest.` : "",
    templateNombre ? `Style: ${templateNombre}.` : "",
  ]
    .filter(Boolean)
    .join(" ")

  const encodedPrompt = encodeURIComponent(prompt)
  const seed = Math.floor(Math.random() * 99999)

  // Intentamos Pollinations.ai (gratis, sin API key)
  const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true&model=flux&seed=${seed}`

  try {
    const check = await fetch(pollinationsUrl, { signal: AbortSignal.timeout(40000) })
    if (check.ok) {
      return NextResponse.json({ imageUrl: pollinationsUrl, promptUsado: prompt })
    }
  } catch {
    // Pollinations no disponible (ej: entorno local con restricciones de red)
    // Usamos imagen demo de deportes para que el flujo sea testeable
  }

  // Fallback: imagen demo usando picsum (siempre disponible)
  const demoUrl = `https://picsum.photos/seed/${seed}/1024/1024`
  return NextResponse.json({
    imageUrl: demoUrl,
    demo: true, // indica que es una imagen de demostración
    promptUsado: prompt,
  })
}
