"use client"

import { useState } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { ChevronRight, Mail, MapPin, Clock, Send } from "lucide-react"

export default function ContactoPage() {
  const [form, setForm] = useState({ nombre: "", email: "", asunto: "", mensaje: "" })
  const [loading, setLoading] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    // Simulate form submission
    setTimeout(() => {
      toast.success("Mensaje enviado correctamente. Te responderemos pronto.")
      setForm({ nombre: "", email: "", asunto: "", mensaje: "" })
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="bg-white">
      {/* Breadcrumb */}
      <div className="border-b border-[#e5e5e5]">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-1.5 text-[12px] text-[#999]">
            <Link href="/" className="hover:text-[#1a1a1a] transition-colors">Inicio</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-[#1a1a1a] font-medium">Contacto</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="border-b border-[#e5e5e5]">
        <div className="container mx-auto px-4 py-12 md:py-16 text-center">
          <p className="text-[11px] tracking-[0.2em] uppercase text-[#999] font-medium mb-3">
            ESCRÍBENOS
          </p>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-[#1a1a1a] uppercase tracking-tight">
            Contacto
          </h1>
          <p className="text-[14px] text-[#666] mt-3 max-w-md mx-auto">
            ¿Tienes dudas sobre un pedido, necesitas ayuda con el diseñador o quieres hacer un pedido mayorista? Estamos para ayudarte.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 md:py-14">
        <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
          {/* Contact info */}
          <div className="space-y-8">
            <div>
              <div className="w-10 h-10 flex items-center justify-center border border-[#e5e5e5] mb-3">
                <Mail className="h-4 w-4 text-[#1a1a1a]" strokeWidth={1.5} />
              </div>
              <h3 className="text-[12px] font-bold tracking-[0.1em] uppercase text-[#1a1a1a] mb-1">
                Email
              </h3>
              <p className="text-[14px] text-[#666]">hola@atletica.mx</p>
            </div>
            <div>
              <div className="w-10 h-10 flex items-center justify-center border border-[#e5e5e5] mb-3">
                <MapPin className="h-4 w-4 text-[#1a1a1a]" strokeWidth={1.5} />
              </div>
              <h3 className="text-[12px] font-bold tracking-[0.1em] uppercase text-[#1a1a1a] mb-1">
                Ubicación
              </h3>
              <p className="text-[14px] text-[#666]">Ciudad de México, México</p>
            </div>
            <div>
              <div className="w-10 h-10 flex items-center justify-center border border-[#e5e5e5] mb-3">
                <Clock className="h-4 w-4 text-[#1a1a1a]" strokeWidth={1.5} />
              </div>
              <h3 className="text-[12px] font-bold tracking-[0.1em] uppercase text-[#1a1a1a] mb-1">
                Horario de atención
              </h3>
              <p className="text-[14px] text-[#666]">Lunes a viernes</p>
              <p className="text-[14px] text-[#666]">9:00 – 18:00 hrs</p>
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="nombre" className="block text-[12px] font-medium text-[#666] uppercase tracking-wide mb-1.5">
                    Nombre
                  </label>
                  <input
                    id="nombre"
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    required
                    className="w-full h-11 px-4 border border-[#e5e5e5] text-[14px] text-[#1a1a1a] focus:outline-none focus:border-[#1a1a1a] transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-[12px] font-medium text-[#666] uppercase tracking-wide mb-1.5">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full h-11 px-4 border border-[#e5e5e5] text-[14px] text-[#1a1a1a] focus:outline-none focus:border-[#1a1a1a] transition-colors"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="asunto" className="block text-[12px] font-medium text-[#666] uppercase tracking-wide mb-1.5">
                  Asunto
                </label>
                <select
                  id="asunto"
                  name="asunto"
                  value={form.asunto}
                  onChange={handleChange}
                  required
                  className="w-full h-11 px-4 border border-[#e5e5e5] text-[14px] text-[#1a1a1a] focus:outline-none focus:border-[#1a1a1a] transition-colors bg-white"
                >
                  <option value="">Selecciona un asunto</option>
                  <option value="pedido">Consulta sobre un pedido</option>
                  <option value="uniforme">Uniformes personalizados</option>
                  <option value="mayorista">Pedido mayorista</option>
                  <option value="devolucion">Devolución o cambio</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
              <div>
                <label htmlFor="mensaje" className="block text-[12px] font-medium text-[#666] uppercase tracking-wide mb-1.5">
                  Mensaje
                </label>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  value={form.mensaje}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder="Cuéntanos cómo podemos ayudarte..."
                  className="w-full px-4 py-3 border border-[#e5e5e5] text-[14px] text-[#1a1a1a] placeholder:text-[#999] focus:outline-none focus:border-[#1a1a1a] transition-colors resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 px-7 py-3 bg-[#1a1a1a] text-white text-[12px] font-semibold uppercase tracking-[0.1em] hover:bg-[#333] transition-colors disabled:bg-[#ccc]"
              >
                <Send className="h-3.5 w-3.5" />
                {loading ? "Enviando..." : "Enviar mensaje"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
