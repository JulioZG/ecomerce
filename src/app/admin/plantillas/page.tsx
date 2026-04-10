import Link from "next/link"
import Image from "next/image"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Pencil, Palette } from "lucide-react"

export default async function AdminPlantillasPage() {
  const templates = await prisma.uniformTemplate
    .findMany({
      include: { sport: { select: { nombre: true, icono: true } } },
      orderBy: { sportId: "asc" },
    })
    .catch(() => [])

  const byDeporte = templates.reduce(
    (acc, t) => {
      const key = t.sport.nombre
      if (!acc[key]) acc[key] = []
      acc[key].push(t)
      return acc
    },
    {} as Record<string, (typeof templates)[number][]>,
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Palette className="h-6 w-6 text-blue-600" />
            Plantillas de Uniformes
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gestioná las plantillas base que usa el diseñador IA
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/plantillas/nueva">
            <Plus className="h-4 w-4 mr-2" />
            Nueva plantilla
          </Link>
        </Button>
      </div>

      {Object.keys(byDeporte).length === 0 ? (
        <div className="text-center py-20 text-muted-foreground border rounded-xl bg-white">
          <Palette className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No hay plantillas todavía</p>
          <p className="text-sm mt-1">
            <Link href="/admin/plantillas/nueva" className="text-blue-600 hover:underline">
              Creá la primera
            </Link>
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(byDeporte).map(([deporte, items]) => (
            <div key={deporte}>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                {items[0]?.sport.icono} {deporte}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {items.map((t) => (
                  <div
                    key={t.id}
                    className="bg-white border rounded-xl overflow-hidden hover:shadow-md transition-shadow group"
                  >
                    {/* Preview imagen */}
                    <div className="relative h-44 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                      {t.imagenBase && !t.imagenBase.startsWith("/templates/") ? (
                        <Image
                          src={t.imagenBase}
                          alt={t.nombre}
                          fill
                          className="object-contain p-4"
                        />
                      ) : (
                        <div className="text-center">
                          <div className="text-5xl mb-2">{t.sport.icono}</div>
                          <p className="text-xs text-slate-400">Vista previa</p>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                    </div>

                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm truncate">{t.nombre}</p>
                          <Badge variant="outline" className="text-xs mt-1">
                            {t.sport.nombre}
                          </Badge>
                        </div>
                        <Button asChild variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                          <Link href={`/admin/plantillas/${t.id}`}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Link>
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2 truncate">{t.imagenBase}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
