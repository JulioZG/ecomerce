"use client"

import { useState } from "react"
import { toast } from "sonner"
import { MapPin, Star, Trash2, Plus, X } from "lucide-react"

type Address = {
  id: string
  nombre: string
  apellido: string
  calle: string
  numero: string
  piso?: string | null
  ciudad: string
  provincia: string
  codigoPostal: string
  telefono: string
  esPrincipal: boolean
}

const EMPTY: Omit<Address, "id" | "esPrincipal"> = {
  nombre: "", apellido: "", calle: "", numero: "", piso: "",
  ciudad: "", provincia: "", codigoPostal: "", telefono: "",
}

interface Props {
  initialAddresses: Address[]
}

export function MisDirecciones({ initialAddresses }: Props) {
  const [addresses, setAddresses] = useState(initialAddresses)
  const [showForm, setShowForm]   = useState(false)
  const [form, setForm]           = useState({ ...EMPTY })
  const [saving, setSaving]       = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }))
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch("/api/direcciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const newAddr: Address = await res.json()
      setAddresses((prev) => [...prev, { ...newAddr, esPrincipal: false }])
      setForm({ ...EMPTY })
      setShowForm(false)
      toast.success("Dirección guardada")
    } catch {
      toast.error("Error al guardar la dirección")
    } finally {
      setSaving(false)
    }
  }

  async function handleSetPrincipal(id: string) {
    try {
      await fetch(`/api/direcciones/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ esPrincipal: true }),
      })
      setAddresses((prev) =>
        prev.map((a) => ({ ...a, esPrincipal: a.id === id }))
      )
      toast.success("Dirección predeterminada actualizada")
    } catch {
      toast.error("Error al actualizar")
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/direcciones/${id}`, { method: "DELETE" })
      if (!res.ok) {
        const err = await res.json()
        toast.error(err.error ?? "Error al eliminar")
        return
      }
      setAddresses((prev) => prev.filter((a) => a.id !== id))
      toast.success("Dirección eliminada")
    } catch {
      toast.error("Error al eliminar")
    }
  }

  return (
    <div className="max-w-2xl">
      {addresses.length === 0 && !showForm && (
        <div className="text-center py-12 border border-dashed border-[#e5e5e5]">
          <MapPin className="h-8 w-8 text-[#ccc] mx-auto mb-3" strokeWidth={1.5} />
          <p className="text-[14px] text-[#666] mb-4">No tienes direcciones guardadas</p>
        </div>
      )}

      <div className="space-y-3 mb-5">
        {addresses.map((addr) => (
          <div key={addr.id} className={`border p-4 flex items-start justify-between gap-4 ${addr.esPrincipal ? "border-[#1a1a1a]" : "border-[#e5e5e5]"}`}>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-[14px] font-medium text-[#1a1a1a]">
                  {addr.nombre} {addr.apellido}
                </p>
                {addr.esPrincipal && (
                  <span className="text-[10px] font-bold uppercase tracking-wide bg-[#1a1a1a] text-white px-2 py-0.5">
                    Principal
                  </span>
                )}
              </div>
              <p className="text-[13px] text-[#666]">
                {addr.calle} {addr.numero}{addr.piso ? `, ${addr.piso}` : ""}
              </p>
              <p className="text-[13px] text-[#666]">
                {addr.ciudad}, {addr.provincia} {addr.codigoPostal}
              </p>
              <p className="text-[13px] text-[#999] mt-0.5">{addr.telefono}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {!addr.esPrincipal && (
                <button
                  onClick={() => handleSetPrincipal(addr.id)}
                  title="Marcar como principal"
                  className="p-1.5 text-[#999] hover:text-[#1a1a1a] transition-colors"
                >
                  <Star className="h-4 w-4" />
                </button>
              )}
              <button
                onClick={() => handleDelete(addr.id)}
                title="Eliminar"
                className="p-1.5 text-[#ccc] hover:text-red-500 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-5 py-2.5 border border-[#e5e5e5] text-[12px] font-semibold uppercase tracking-[0.08em] text-[#1a1a1a] hover:border-[#1a1a1a] transition-colors"
        >
          <Plus className="h-3.5 w-3.5" /> Agregar dirección
        </button>
      ) : (
        <div className="border border-[#e5e5e5] p-5">
          <div className="flex items-center justify-between mb-5">
            <p className="text-[12px] font-bold tracking-[0.1em] uppercase text-[#1a1a1a]">
              Nueva dirección
            </p>
            <button onClick={() => setShowForm(false)} className="text-[#999] hover:text-[#1a1a1a]">
              <X className="h-4 w-4" />
            </button>
          </div>

          <form onSubmit={handleAdd}>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                { name: "nombre",       label: "Nombre",          span: 1 },
                { name: "apellido",     label: "Apellido",        span: 1 },
                { name: "calle",        label: "Calle",           span: 2 },
                { name: "numero",       label: "Número",          span: 1 },
                { name: "piso",         label: "Piso / Depto",    span: 1 },
                { name: "ciudad",       label: "Ciudad",          span: 1 },
                { name: "provincia",    label: "Estado",          span: 1 },
                { name: "codigoPostal", label: "Código Postal",   span: 1 },
                { name: "telefono",     label: "Teléfono",        span: 1 },
              ].map(({ name, label, span }) => (
                <div key={name} className={span === 2 ? "col-span-2" : ""}>
                  <label className="block text-[11px] font-medium text-[#666] uppercase tracking-wide mb-1">
                    {label}
                  </label>
                  <input
                    name={name}
                    value={(form as Record<string, string>)[name]}
                    onChange={handleChange}
                    required={name !== "piso"}
                    className="w-full h-10 px-3 border border-[#e5e5e5] text-[14px] text-[#1a1a1a] focus:outline-none focus:border-[#1a1a1a] transition-colors"
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2.5 bg-[#1a1a1a] text-white text-[12px] font-semibold uppercase tracking-[0.08em] hover:bg-[#333] transition-colors disabled:bg-[#ccc]"
              >
                {saving ? "Guardando..." : "Guardar"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-5 py-2.5 border border-[#e5e5e5] text-[12px] font-medium uppercase tracking-[0.08em] text-[#666] hover:border-[#1a1a1a] transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
