"use client"

import { useState } from "react"
import Image from "next/image"
import { toast } from "sonner"
import { User } from "lucide-react"

interface Props {
  user: {
    id: string
    name?: string | null
    email: string
    image?: string | null
  }
}

export function MisDatos({ user }: Props) {
  const [name, setName]     = useState(user.name ?? "")
  const [loading, setLoading] = useState(false)

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch("/api/usuarios/perfil", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      })
      if (!res.ok) throw new Error()
      toast.success("Nombre actualizado")
    } catch {
      toast.error("Error al guardar los cambios")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md">
      {/* Avatar */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 bg-[#f5f5f5] flex items-center justify-center overflow-hidden shrink-0">
          {user.image ? (
            <Image src={user.image} alt={user.name ?? "Perfil"} width={64} height={64} className="object-cover" />
          ) : (
            <User className="h-7 w-7 text-[#999]" strokeWidth={1.5} />
          )}
        </div>
        <div>
          <p className="text-[14px] font-semibold text-[#1a1a1a]">{user.name ?? "Sin nombre"}</p>
          <p className="text-[13px] text-[#999]">{user.email}</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        <div>
          <label className="block text-[12px] font-medium text-[#666] uppercase tracking-wide mb-1.5">
            Nombre completo
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            minLength={2}
            className="w-full h-11 px-4 border border-[#e5e5e5] text-[14px] text-[#1a1a1a] focus:outline-none focus:border-[#1a1a1a] transition-colors"
          />
        </div>

        <div>
          <label className="block text-[12px] font-medium text-[#666] uppercase tracking-wide mb-1.5">
            Email
          </label>
          <input
            value={user.email}
            disabled
            className="w-full h-11 px-4 border border-[#e5e5e5] text-[14px] text-[#999] bg-[#f5f5f5] cursor-not-allowed"
          />
          <p className="text-[11px] text-[#999] mt-1">El email no se puede cambiar</p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-[#1a1a1a] text-white text-[12px] font-semibold uppercase tracking-[0.1em] hover:bg-[#333] transition-colors disabled:bg-[#ccc]"
        >
          {loading ? "Guardando..." : "Guardar cambios"}
        </button>
      </form>
    </div>
  )
}
