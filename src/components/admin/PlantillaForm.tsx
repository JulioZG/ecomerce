"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Upload, Trash2, ImageIcon, Loader2 } from "lucide-react"

type Sport = { id: string; nombre: string; icono: string | null }
type Template = { id: string; nombre: string; sportId: string; imagenBase: string }

interface Props {
  sports: Sport[]
  template?: Template
}

export function PlantillaForm({ sports, template }: Props) {
  const router = useRouter()
  const isEdit = !!template

  const [nombre, setNombre] = useState(template?.nombre ?? "")
  const [sportId, setSportId] = useState(template?.sportId ?? "")
  const [imagenBase, setImagenBase] = useState(template?.imagenBase ?? "")
  const [previewUrl, setPreviewUrl] = useState(
    template?.imagenBase && !template.imagenBase.startsWith("/templates/")
      ? template.imagenBase
      : "",
  )
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith("image/")) {
      toast.error("Solo se permiten imágenes")
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("La imagen no puede superar 5 MB")
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      const res = await fetch("/api/upload/plantilla", { method: "POST", body: formData })
      if (!res.ok) throw new Error()
      const { url } = await res.json()
      setImagenBase(url)
      setPreviewUrl(url)
      toast.success("Imagen subida correctamente")
    } catch {
      toast.error("Error al subir la imagen")
    } finally {
      setUploading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!nombre.trim() || !sportId || !imagenBase.trim()) {
      toast.error("Completá todos los campos")
      return
    }

    setSaving(true)
    try {
      const url = isEdit ? `/api/admin/plantillas/${template.id}` : "/api/admin/plantillas"
      const method = isEdit ? "PUT" : "POST"
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, sportId, imagenBase }),
      })
      if (!res.ok) throw new Error()
      toast.success(isEdit ? "Plantilla actualizada" : "Plantilla creada")
      router.push("/admin/plantillas")
      router.refresh()
    } catch {
      toast.error("Error al guardar la plantilla")
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/plantillas/${template!.id}`, { method: "DELETE" })
      if (!res.ok) throw new Error()
      toast.success("Plantilla eliminada")
      router.push("/admin/plantillas")
      router.refresh()
    } catch {
      toast.error("Error al eliminar la plantilla")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white border rounded-xl p-6">
      {/* Nombre */}
      <div className="space-y-2">
        <Label htmlFor="nombre">Nombre de la plantilla *</Label>
        <Input
          id="nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Ej: Camiseta Fútbol Clásica"
          required
        />
      </div>

      {/* Deporte */}
      <div className="space-y-2">
        <Label>Deporte *</Label>
        <Select value={sportId} onValueChange={setSportId} required>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona un deporte" />
          </SelectTrigger>
          <SelectContent>
            {sports.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.icono} {s.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Imagen base */}
      <div className="space-y-2">
        <Label>Imagen base de la plantilla *</Label>

        {/* Preview */}
        <div className="border-2 border-dashed rounded-xl overflow-hidden bg-slate-50 relative">
          {previewUrl ? (
            <div className="relative h-56 w-full">
              <Image src={previewUrl} alt="Preview" fill className="object-contain p-4" />
              <button
                type="button"
                onClick={() => {
                  setPreviewUrl("")
                  setImagenBase("")
                }}
                className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-red-50 transition-colors"
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center h-56 cursor-pointer hover:bg-slate-100 transition-colors">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
                disabled={uploading}
              />
              {uploading ? (
                <>
                  <Loader2 className="h-8 w-8 text-blue-500 animate-spin mb-2" />
                  <p className="text-sm text-muted-foreground">Subiendo imagen...</p>
                </>
              ) : (
                <>
                  <Upload className="h-8 w-8 text-slate-400 mb-2" />
                  <p className="text-sm font-medium text-slate-600">Subir imagen</p>
                  <p className="text-xs text-muted-foreground mt-1">PNG, JPG hasta 5 MB</p>
                </>
              )}
            </label>
          )}
        </div>

        {/* O ingresar URL manualmente */}
        <div className="flex items-center gap-2 mt-2">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted-foreground">o ingresá una URL</span>
          <div className="flex-1 h-px bg-border" />
        </div>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9"
              value={imagenBase}
              onChange={(e) => {
                setImagenBase(e.target.value)
                setPreviewUrl(e.target.value)
              }}
              placeholder="https://... o /templates/nombre.png"
            />
          </div>
        </div>
      </div>

      {/* Acciones */}
      <div className="flex items-center justify-between pt-2">
        {isEdit ? (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button type="button" variant="destructive" size="sm" disabled={deleting}>
                {deleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Trash2 className="h-4 w-4 mr-2" />}
                Eliminar plantilla
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Eliminar esta plantilla?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción no se puede deshacer. Los pedidos de uniformes existentes que usen
                  esta plantilla perderán la referencia.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Sí, eliminar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : (
          <div />
        )}

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={saving}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={saving || uploading}>
            {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            {isEdit ? "Guardar cambios" : "Crear plantilla"}
          </Button>
        </div>
      </div>
    </form>
  )
}
