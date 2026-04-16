"use client"

import { useState } from "react"
import { toast } from "sonner"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useDesignerStore } from "@/store/designerStore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Upload, X, CheckCircle2 } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import Image from "next/image"

interface Template {
  id: string
  nombre: string
  sportId: string
  imagenBase: string
  sport?: { nombre: string; slug: string }
}

interface Sport {
  id: string
  nombre: string
  slug: string
}

const TALLAS = ["XS", "S", "M", "L", "XL", "XXL"]

const STEPS = [
  "Plantilla",
  "Personalización",
  "Diseño IA",
  "Cantidades",
  "Revisión",
]

export function UniformDesigner({
  templates,
  sports,
}: {
  templates: Template[]
  sports: Sport[]
}) {
  const { data: session } = useSession()
  const router = useRouter()
  const store = useDesignerStore()
  const [submitting, setSubmitting] = useState(false)
  const [logoFileName, setLogoFileName] = useState("")

  function handleLogoFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setLogoFileName(file.name)
    store.setLogoFile(file)
    const reader = new FileReader()
    reader.onload = () => store.setLogoUrl(reader.result as string)
    reader.readAsDataURL(file)
  }

  function handleRemoveLogo() {
    store.setLogoUrl(null)
    store.setLogoFile(null)
    setLogoFileName("")
  }

  const filteredTemplates = store.selectedSport
    ? templates.filter((t) => t.sportId === store.selectedSport)
    : templates

  async function handleGenerate() {
    if (!session) {
      toast.error("Debés iniciar sesión para generar diseños")
      router.push("/iniciar-sesion")
      return
    }
    if (!store.selectedTemplate) {
      toast.error("Selecciona una plantilla primero")
      return
    }
    if (!store.nombreEquipo.trim()) {
      toast.error("Ingresa el nombre del equipo")
      return
    }
    if (store.generationCount >= 3) {
      toast.error("Alcanzaste el límite de 3 generaciones")
      return
    }

    store.setGenerating(true)
    store.setError(null)

    try {
      const res = await fetch("/api/disenador/generar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateNombre: store.selectedTemplate.nombre,
          nombreEquipo: store.nombreEquipo,
          colorPrimario: store.colorPrimario,
          colorSecundario: store.colorSecundario,
          logoUrl: store.logoUrl,
          sport: store.selectedTemplate.sport?.nombre,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Error generando diseño")

      // Soporte para URL directa (Pollinations) o base64 (DALL-E legacy)
      const imageUrl = data.imageUrl ?? `data:image/png;base64,${data.imageBase64}`
      store.setGeneratedImage(imageUrl, data.promptUsado)
      toast.success("¡Diseño generado!")
    } catch (err) {
      store.setError(err instanceof Error ? err.message : "Error desconocido")
      toast.error("No se pudo generar el diseño")
    }
  }

  async function handleSubmitOrder() {
    if (!session) {
      router.push("/iniciar-sesion")
      return
    }

    const totalUnidades = Object.values(store.cantidades).reduce((a, b) => a + b, 0)
    if (totalUnidades === 0) {
      toast.error("Ingresa al menos una cantidad")
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch("/api/disenador/pedido", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId: store.selectedTemplate?.id,
          nombreEquipo: store.nombreEquipo,
          colorPrimario: store.colorPrimario,
          colorSecundario: store.colorSecundario,
          logoUrl: store.logoUrl,
          disenoGeneradoUrl: store.generatedImageUrl,
          promptUsado: store.promptUsado,
          cantidades: store.cantidades,
          notasAdicionales: store.notasAdicionales,
        }),
      })

      if (!res.ok) throw new Error("Error creando pedido")

      toast.success("¡Pedido enviado al productor!")
      store.reset()
      router.push("/mis-pedidos")
    } catch {
      toast.error("Error enviando el pedido")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Step indicator */}
      <div className="flex items-center justify-between mb-8">
        {STEPS.map((step, i) => (
          <div key={step} className="flex items-center">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold border-2 transition-colors ${
                store.currentStep > i + 1
                  ? "bg-blue-600 border-blue-600 text-white"
                  : store.currentStep === i + 1
                  ? "border-blue-600 text-blue-600"
                  : "border-gray-200 text-gray-400"
              }`}
            >
              {store.currentStep > i + 1 ? "✓" : i + 1}
            </div>
            <span
              className={`hidden sm:block ml-2 text-xs ${
                store.currentStep === i + 1 ? "font-semibold text-blue-600" : "text-muted-foreground"
              }`}
            >
              {step}
            </span>
            {i < STEPS.length - 1 && (
              <div className="w-8 sm:w-16 h-px bg-gray-200 mx-2" />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Template picker */}
      {store.currentStep === 1 && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Elegí un deporte y plantilla</h2>
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={!store.selectedSport ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => store.setSport("")}
            >
              Todos
            </Badge>
            {sports.map((s) => (
              <Badge
                key={s.id}
                variant={store.selectedSport === s.id ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => store.setSport(s.id)}
              >
                {s.nombre}
              </Badge>
            ))}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {filteredTemplates.map((t) => (
              <button
                key={t.id}
                onClick={() => store.setTemplate(t)}
                className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                  store.selectedTemplate?.id === t.id
                    ? "border-blue-600 ring-2 ring-blue-200"
                    : "border-gray-200 hover:border-gray-400"
                }`}
              >
                {t.imagenBase ? (
                  <Image src={t.imagenBase} alt={t.nombre} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-5xl bg-gray-50">
                    👕
                  </div>
                )}
                <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-xs p-2">
                  {t.nombre}
                </div>
              </button>
            ))}
            {filteredTemplates.length === 0 && (
              <p className="col-span-3 text-center text-muted-foreground py-8">
                No hay plantillas disponibles para este deporte.
              </p>
            )}
          </div>
          <div className="flex justify-end">
            <Button
              disabled={!store.selectedTemplate}
              onClick={() => store.setStep(2)}
              className={
                store.selectedTemplate
                  ? "bg-black hover:bg-neutral-800 text-white shadow-lg shadow-black/30 scale-105 transition-all duration-200"
                  : ""
              }
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Personalization */}
      {store.currentStep === 2 && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Personalizá tu uniforme</h2>

          <div>
            <Label htmlFor="nombreEquipo">Nombre del equipo</Label>
            <Input
              id="nombreEquipo"
              value={store.nombreEquipo}
              onChange={(e) => store.setNombreEquipo(e.target.value)}
              placeholder="Ej: Los Tigres FC"
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="colorPrimario">Color primario</Label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="color"
                  id="colorPrimario"
                  value={store.colorPrimario}
                  onChange={(e) => store.setColor("primario", e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer border"
                />
                <Input
                  value={store.colorPrimario}
                  onChange={(e) => store.setColor("primario", e.target.value)}
                  className="font-mono text-sm"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="colorSecundario">Color secundario</Label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="color"
                  id="colorSecundario"
                  value={store.colorSecundario}
                  onChange={(e) => store.setColor("secundario", e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer border"
                />
                <Input
                  value={store.colorSecundario}
                  onChange={(e) => store.setColor("secundario", e.target.value)}
                  className="font-mono text-sm"
                />
              </div>
            </div>
          </div>

          {/* Logo upload */}
          <div>
            <Label className="text-sm font-semibold tracking-wide">
              Logo del equipo{" "}
              <span className="font-normal text-muted-foreground">(opcional)</span>
            </Label>

            {store.logoUrl ? (
              <div className="mt-2 flex items-center gap-4 rounded-2xl border-2 border-zinc-200 bg-zinc-50 p-4">
                <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
                  <Image
                    src={store.logoUrl}
                    alt="Logo del equipo"
                    fill
                    className="object-contain p-1"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
                    <p className="text-xs font-medium text-emerald-600">Logo subido</p>
                  </div>
                  <p className="mt-0.5 text-sm text-zinc-700 truncate">{logoFileName}</p>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveLogo}
                  className="flex-shrink-0 rounded-xl p-2 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-500"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label
                htmlFor="logoFile"
                className="mt-2 flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-zinc-300 bg-zinc-50 px-4 py-8 transition-all hover:border-zinc-400 hover:bg-zinc-100 group"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-200 transition-colors group-hover:bg-zinc-300">
                  <Upload className="h-5 w-5 text-zinc-500" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-zinc-700">
                    Subí el logo de tu equipo
                  </p>
                  <p className="mt-1 text-xs text-zinc-400">PNG, JPG o SVG · Máx. 2 MB</p>
                </div>
                <input
                  id="logoFile"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handleLogoFile}
                />
              </label>
            )}
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => store.setStep(1)}>
              Atrás
            </Button>
            <Button
              disabled={!store.nombreEquipo.trim()}
              onClick={() => store.setStep(3)}
              className={
                store.nombreEquipo
                  ? "bg-black hover:bg-neutral-800 text-white shadow-lg shadow-black/30 scale-105 transition-all duration-200"
                  : ""
              }
            >
              Generar diseño
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: AI Generation */}
      {store.currentStep === 3 && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Diseño generado por IA</h2>

          {store.isGenerating && (
            <div className="space-y-3">
              <Skeleton className="w-full aspect-square rounded-xl" />
              <p className="text-center text-sm text-muted-foreground animate-pulse">
                Generando diseño con IA... puede tardar hasta 20 segundos ⏳
              </p>
            </div>
          )}

          {!store.isGenerating && !store.generatedImageUrl && (
            <div className="text-center py-12 border-2 border-dashed rounded-xl">
              <p className="text-4xl mb-3">🎨</p>
              <p className="text-muted-foreground mb-4">
                Presioná el botón para generar el diseño de tu uniforme
              </p>
              <Button onClick={handleGenerate} size="lg">
                Generar diseño
              </Button>
            </div>
          )}

          {!store.isGenerating && store.generatedImageUrl && (
            <div className="space-y-4">
              <div className="relative aspect-square rounded-xl overflow-hidden border">
                <Image
                  src={store.generatedImageUrl}
                  alt="Diseño generado"
                  fill
                  className="object-contain"
                />
              </div>
              {store.generationCount < 3 && (
                <Button variant="outline" onClick={handleGenerate} className="w-full">
                  Regenerar ({3 - store.generationCount} intentos restantes)
                </Button>
              )}
            </div>
          )}

          {store.error && (
            <p className="text-red-500 text-sm text-center">{store.error}</p>
          )}

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => store.setStep(2)}>
              Atrás
            </Button>
            <Button
              disabled={!store.generatedImageUrl}
              onClick={() => store.setStep(4)}
            >
              Continuar
            </Button>
          </div>
        </div>
      )}

      {/* Step 4: Quantities */}
      {store.currentStep === 4 && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Cantidades por talla</h2>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {TALLAS.map((talla) => (
              <div key={talla} className="text-center">
                <Label className="block mb-1">{talla}</Label>
                <Input
                  type="number"
                  min="0"
                  value={store.cantidades[talla] ?? 0}
                  onChange={(e) =>
                    store.setCantidades({
                      ...store.cantidades,
                      [talla]: Math.max(0, Number(e.target.value)),
                    })
                  }
                  className="text-center"
                />
              </div>
            ))}
          </div>
          <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-700">
            Total:{" "}
            <strong>
              {Object.values(store.cantidades).reduce((a, b) => a + b, 0)} unidades
            </strong>
          </div>

          <div>
            <Label htmlFor="notas">Notas adicionales</Label>
            <Textarea
              id="notas"
              value={store.notasAdicionales}
              onChange={(e) => store.setNotas(e.target.value)}
              placeholder="Ej: Número y nombre en la espalda, tipografía sans-serif..."
              className="mt-1"
              rows={3}
            />
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => store.setStep(3)}>
              Atrás
            </Button>
            <Button onClick={() => store.setStep(5)}>Revisar pedido</Button>
          </div>
        </div>
      )}

      {/* Step 5: Review & Submit */}
      {store.currentStep === 5 && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Revisión del pedido</h2>

          <div className="grid sm:grid-cols-2 gap-6">
            {store.generatedImageUrl && (
              <div className="relative aspect-square rounded-xl overflow-hidden border">
                <Image
                  src={store.generatedImageUrl}
                  alt="Tu diseño"
                  fill
                  className="object-contain"
                />
              </div>
            )}
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-semibold">Plantilla:</span>{" "}
                {store.selectedTemplate?.nombre}
              </div>
              <div>
                <span className="font-semibold">Equipo:</span> {store.nombreEquipo}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">Color primario:</span>
                <span
                  className="inline-block w-5 h-5 rounded border"
                  style={{ backgroundColor: store.colorPrimario }}
                />
                {store.colorPrimario}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">Color secundario:</span>
                <span
                  className="inline-block w-5 h-5 rounded border"
                  style={{ backgroundColor: store.colorSecundario }}
                />
                {store.colorSecundario}
              </div>
              <div>
                <span className="font-semibold">Cantidades:</span>
                <div className="mt-1 flex flex-wrap gap-1">
                  {Object.entries(store.cantidades)
                    .filter(([, q]) => q > 0)
                    .map(([t, q]) => (
                      <Badge key={t} variant="outline">
                        {t}: {q}
                      </Badge>
                    ))}
                </div>
              </div>
              {store.notasAdicionales && (
                <div>
                  <span className="font-semibold">Notas:</span>{" "}
                  {store.notasAdicionales}
                </div>
              )}
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
            Al confirmar, el diseño y las especificaciones serán enviados
            automáticamente al productor para presupuestar y producir los uniformes.
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => store.setStep(4)}>
              Atrás
            </Button>
            <Button onClick={handleSubmitOrder} disabled={submitting} size="lg">
              {submitting ? "Enviando..." : "Confirmar pedido"}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
