import { prisma } from "@/lib/prisma"
import { PlantillaForm } from "@/components/admin/PlantillaForm"

export default async function NuevaPlantillaPage() {
  const sports = await prisma.sport.findMany({ orderBy: { nombre: "asc" } }).catch(() => [])
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Nueva plantilla</h1>
      <PlantillaForm sports={sports} />
    </div>
  )
}
