import { UniformDesigner } from "@/components/designer/UniformDesigner"
import { prisma } from "@/lib/prisma"

async function getTemplates() {
  try {
    return await prisma.uniformTemplate.findMany({
      include: { sport: { select: { nombre: true, slug: true } } },
    })
  } catch {
    return []
  }
}

async function getSports() {
  try {
    return await prisma.sport.findMany({ orderBy: { nombre: "asc" } })
  } catch {
    return []
  }
}

export default async function DisenadorPage() {
  const [templates, sports] = await Promise.all([getTemplates(), getSports()])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Diseñador de Uniformes</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Personalizá el uniforme de tu equipo con inteligencia artificial.
          Elegí colores, subí tu logo y generá una preview al instante.
        </p>
      </div>
      <UniformDesigner templates={templates} sports={sports} />
    </div>
  )
}
