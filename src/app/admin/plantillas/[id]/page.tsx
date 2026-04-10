import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { PlantillaForm } from "@/components/admin/PlantillaForm"

export default async function EditarPlantillaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [template, sports] = await Promise.all([
    prisma.uniformTemplate.findUnique({ where: { id } }).catch(() => null),
    prisma.sport.findMany({ orderBy: { nombre: "asc" } }).catch(() => []),
  ])

  if (!template) notFound()

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Editar plantilla</h1>
      <PlantillaForm sports={sports} template={template} />
    </div>
  )
}
