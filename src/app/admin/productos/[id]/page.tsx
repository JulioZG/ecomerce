"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import { ChevronLeft, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface Sport { id: string; nombre: string }
interface Category { id: string; nombre: string; sportId: string }
interface Variant { id?: string; talla: string; color: string; stock: number; sku: string; isNew?: boolean }

const TALLAS = ["XS", "S", "M", "L", "XL", "XXL"]

export default function EditarProductoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [sports, setSports] = useState<Sport[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)

  const [form, setForm] = useState({
    nombre: "",
    slug: "",
    descripcion: "",
    precio: "",
    images: [""],
    destacado: false,
    activo: true,
    sportId: "",
    categoryId: "",
  })
  const [variants, setVariants] = useState<Variant[]>([])

  useEffect(() => {
    Promise.all([
      fetch(`/api/productos/${id}`).then((r) => r.json()),
      fetch("/api/admin/sports-categories").then((r) => r.json()),
    ]).then(([product, sc]) => {
      if (product.id) {
        setForm({
          nombre: product.nombre,
          slug: product.slug,
          descripcion: product.descripcion ?? "",
          precio: String(product.precio),
          images: product.images?.length ? product.images : [""],
          destacado: product.destacado,
          activo: product.activo,
          sportId: product.sportId,
          categoryId: product.categoryId,
        })
        setVariants(product.variants ?? [])
      }
      setSports(sc.sports ?? [])
      setCategories(sc.categories ?? [])
    }).finally(() => setInitialLoading(false))
  }, [id])

  const filteredCategories = categories.filter((c) => c.sportId === form.sportId)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value, type } = e.target
    const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }))
  }

  function addVariant() {
    setVariants((prev) => [...prev, { talla: "M", color: "", stock: 0, sku: "", isNew: true }])
  }

  function removeVariant(i: number) {
    setVariants((prev) => prev.filter((_, idx) => idx !== i))
  }

  function updateVariant(i: number, field: keyof Variant, value: string | number) {
    setVariants((prev) =>
      prev.map((v, idx) =>
        idx === i ? { ...v, [field]: field === "stock" ? Number(value) : value } : v
      )
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (variants.some((v) => !v.sku)) {
      toast.error("Todos los variantes necesitan un SKU")
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/productos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          precio: Number(form.precio),
          images: form.images.filter(Boolean),
        }),
      })
      if (!res.ok) throw new Error("Error actualizando producto")

      // Save new variants
      const newVariants = variants.filter((v) => v.isNew)
      if (newVariants.length > 0) {
        await Promise.all(
          newVariants.map((v) =>
            fetch("/api/productos/variantes", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ talla: v.talla, color: v.color, stock: v.stock, sku: v.sku, productId: id }),
            })
          )
        )
      }

      // Update existing variants stock/color
      const existingVariants = variants.filter((v) => v.id && !v.isNew)
      await Promise.all(
        existingVariants.map((v) =>
          fetch(`/api/productos/variantes/${v.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ stock: v.stock, color: v.color }),
          })
        )
      )

      toast.success("Producto actualizado")
      router.push("/admin/productos")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return <div className="animate-pulse text-slate-400 text-sm">Cargando producto...</div>
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Button variant="ghost" size="sm" asChild className="text-slate-500">
          <Link href="/admin/productos">
            <ChevronLeft className="h-4 w-4" />
            Productos
          </Link>
        </Button>
        <span className="text-slate-300">/</span>
        <h1 className="text-xl font-bold text-slate-900">Editar producto</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        {/* Basic info */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <h2 className="font-semibold text-slate-800 mb-4">Información básica</h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="nombre">Nombre del producto</Label>
              <Input id="nombre" name="nombre" value={form.nombre} onChange={handleChange} required className="mt-1" />
            </div>

            <div className="col-span-2">
              <Label htmlFor="slug">Slug (URL)</Label>
              <Input id="slug" name="slug" value={form.slug} onChange={handleChange} className="mt-1 font-mono text-sm" />
            </div>

            <div className="col-span-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea id="descripcion" name="descripcion" value={form.descripcion} onChange={handleChange} rows={3} className="mt-1" />
            </div>

            <div>
              <Label htmlFor="precio">Precio (ARS)</Label>
              <Input id="precio" name="precio" type="number" min="0" step="0.01" value={form.precio} onChange={handleChange} required className="mt-1" />
            </div>

            <div>
              <Label htmlFor="sportId">Deporte</Label>
              <select id="sportId" name="sportId" value={form.sportId} onChange={handleChange} required className="mt-1 w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Seleccionar...</option>
                {sports.map((s) => <option key={s.id} value={s.id}>{s.nombre}</option>)}
              </select>
            </div>

            <div>
              <Label htmlFor="categoryId">Categoría</Label>
              <select id="categoryId" name="categoryId" value={form.categoryId} onChange={handleChange} required disabled={!form.sportId} className="mt-1 w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50">
                <option value="">Seleccionar...</option>
                {filteredCategories.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
            </div>

            <div className="flex items-center gap-6 col-span-2 pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="activo" checked={form.activo} onChange={handleChange} className="rounded border-slate-300" />
                <span className="text-sm text-slate-700">Activo (visible en catálogo)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="destacado" checked={form.destacado} onChange={handleChange} className="rounded border-slate-300" />
                <span className="text-sm text-slate-700">Producto destacado</span>
              </label>
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h2 className="font-semibold text-slate-800 mb-4">Imágenes (URLs)</h2>
          <div className="space-y-2">
            {form.images.map((img, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  value={img}
                  onChange={(e) => setForm((p) => ({ ...p, images: p.images.map((v, idx) => (idx === i ? e.target.value : v)) }))}
                  placeholder="https://..."
                  className="font-mono text-sm"
                />
                {form.images.length > 1 && (
                  <Button type="button" variant="ghost" size="icon" onClick={() => setForm((p) => ({ ...p, images: p.images.filter((_, idx) => idx !== i) }))} className="text-red-400 hover:text-red-600 hover:bg-red-50">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => setForm((p) => ({ ...p, images: [...p.images, ""] }))}>
              <Plus className="h-3.5 w-3.5 mr-1" /> Agregar imagen
            </Button>
          </div>
        </div>

        {/* Variants */}
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-800">Variantes</h2>
            <Button type="button" variant="outline" size="sm" onClick={addVariant}>
              <Plus className="h-3.5 w-3.5 mr-1" /> Agregar
            </Button>
          </div>
          <div className="space-y-3">
            {variants.map((v, i) => (
              <div key={v.id ?? i} className={`grid grid-cols-4 gap-2 p-3 rounded-lg items-end ${v.isNew ? "bg-blue-50 border border-blue-100" : "bg-slate-50"}`}>
                <div>
                  <Label className="text-xs">Talla</Label>
                  <select value={v.talla} onChange={(e) => updateVariant(i, "talla", e.target.value)} disabled={!v.isNew} className="mt-1 w-full border border-slate-200 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:bg-white">
                    {TALLAS.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <Label className="text-xs">Color</Label>
                  <Input value={v.color} onChange={(e) => updateVariant(i, "color", e.target.value)} placeholder="Rojo" className="mt-1 text-sm h-8" />
                </div>
                <div>
                  <Label className="text-xs">Stock</Label>
                  <Input type="number" min="0" value={v.stock} onChange={(e) => updateVariant(i, "stock", e.target.value)} className="mt-1 text-sm h-8" />
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Label className="text-xs">SKU</Label>
                    <Input value={v.sku} onChange={(e) => updateVariant(i, "sku", e.target.value)} placeholder="CAM-R-M" disabled={!v.isNew} className="mt-1 text-sm h-8 font-mono disabled:opacity-50 disabled:bg-white" />
                  </div>
                  {v.isNew && (
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeVariant(i)} className="mt-5 h-8 w-8 text-red-400 hover:text-red-600 hover:bg-red-50">
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
            {loading ? "Guardando..." : "Guardar cambios"}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/productos">Cancelar</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}
