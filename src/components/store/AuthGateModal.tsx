"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import Link from "next/link"
import { X, Lock } from "lucide-react"
import { toast } from "sonner"

interface Props {
  onSuccess?: () => void
}

export function AuthGateModal({ onSuccess }: Props) {
  const [mode, setMode]       = useState<"options" | "email">("options")
  const [email, setEmail]     = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleGoogle() {
    setLoading(true)
    await signIn("google", { callbackUrl: "/checkout" })
  }

  async function handleCredentials(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })
    setLoading(false)
    if (res?.ok) {
      onSuccess?.()
    } else {
      toast.error("Email o contraseña incorrectos")
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative bg-white w-full max-w-sm mx-4 p-8 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-center mb-6">
          <div className="w-10 h-10 bg-[#1a1a1a] flex items-center justify-center mr-3">
            <Lock className="h-5 w-5 text-white" strokeWidth={1.5} />
          </div>
          <div>
            <h2 className="font-heading text-xl font-bold text-[#1a1a1a] uppercase tracking-tight">
              Inicia sesión
            </h2>
            <p className="text-[12px] text-[#999]">para continuar con tu compra</p>
          </div>
        </div>

        {mode === "options" ? (
          <div className="space-y-3">
            {/* Google */}
            <button
              onClick={handleGoogle}
              disabled={loading}
              className="w-full h-11 flex items-center justify-center gap-3 border border-[#e5e5e5] text-[13px] font-medium text-[#1a1a1a] hover:border-[#1a1a1a] transition-colors disabled:opacity-50"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
                <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
              </svg>
              Continuar con Google
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-[#e5e5e5]" />
              <span className="text-[11px] text-[#999] uppercase tracking-wide">o</span>
              <div className="flex-1 h-px bg-[#e5e5e5]" />
            </div>

            {/* Email button */}
            <button
              onClick={() => setMode("email")}
              className="w-full h-11 bg-[#1a1a1a] text-white text-[12px] font-semibold uppercase tracking-[0.1em] hover:bg-[#333] transition-colors"
            >
              Continuar con email
            </button>

            <p className="text-center text-[12px] text-[#999] pt-1">
              ¿No tienes cuenta?{" "}
              <Link href="/registrarse" className="text-[#1a1a1a] font-medium underline">
                Regístrate gratis
              </Link>
            </p>
          </div>
        ) : (
          <form onSubmit={handleCredentials} className="space-y-3">
            <div>
              <label className="block text-[11px] font-medium text-[#666] uppercase tracking-wide mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                className="w-full h-11 px-4 border border-[#e5e5e5] text-[14px] focus:outline-none focus:border-[#1a1a1a] transition-colors"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-[#666] uppercase tracking-wide mb-1.5">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full h-11 px-4 border border-[#e5e5e5] text-[14px] focus:outline-none focus:border-[#1a1a1a] transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-[#1a1a1a] text-white text-[12px] font-semibold uppercase tracking-[0.1em] hover:bg-[#333] transition-colors disabled:bg-[#ccc]"
            >
              {loading ? "Ingresando..." : "Ingresar"}
            </button>
            <button
              type="button"
              onClick={() => setMode("options")}
              className="w-full text-[12px] text-[#999] hover:text-[#1a1a1a] transition-colors"
            >
              ← Volver
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
