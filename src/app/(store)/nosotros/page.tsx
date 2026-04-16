import Image from "next/image"
import Link from "next/link"
import { ChevronRight, Target, Heart, Zap, Users } from "lucide-react"

const values = [
  {
    icon: Target,
    title: "Calidad sin compromiso",
    desc: "Cada prenda pasa por controles rigurosos para garantizar durabilidad y rendimiento en cualquier disciplina.",
  },
  {
    icon: Heart,
    title: "Pasión por el deporte",
    desc: "Somos atletas creando para atletas. Entendemos lo que necesitas porque lo vivimos todos los días.",
  },
  {
    icon: Zap,
    title: "Innovación constante",
    desc: "Integramos inteligencia artificial para que diseñes uniformes únicos para tu equipo, directo desde nuestra plataforma.",
  },
  {
    icon: Users,
    title: "Producción local",
    desc: "Trabajamos con productores locales para fabricar tus uniformes personalizados con los más altos estándares.",
  },
]

export default function NosotrosPage() {
  return (
    <div className="bg-white">
      {/* Breadcrumb */}
      <div className="border-b border-[#e5e5e5]">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-1.5 text-[12px] text-[#999]">
            <Link href="/" className="hover:text-[#1a1a1a] transition-colors">Inicio</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-[#1a1a1a] font-medium">Nosotros</span>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="relative h-[50vh] min-h-[350px] overflow-hidden bg-[#1a1a1a]">
        <Image
          src="https://essence-theme-bold.myshopify.com/cdn/shop/files/AdobeStock_426917731.jpg?v=1693911718&width=1920"
          alt="Nosotros"
          fill
          className="object-cover opacity-60"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-[11px] tracking-[0.2em] uppercase text-white/70 font-medium mb-3">
              NUESTRA HISTORIA
            </p>
            <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold text-white uppercase tracking-tight">
              ATLÉTICA
            </h1>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <p className="text-[11px] tracking-[0.2em] uppercase text-[#999] font-medium mb-3">
            QUIÉNES SOMOS
          </p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-[#1a1a1a] uppercase tracking-tight mb-6">
            Ropa deportiva con propósito
          </h2>
          <p className="text-[15px] text-[#666] leading-relaxed mb-6">
            ATLÉTICA nació con una misión simple: ofrecer ropa deportiva de calidad premium
            accesible para todos los atletas, desde los que entrenan todos los días hasta
            los equipos que buscan uniformes personalizados que los representen.
          </p>
          <p className="text-[15px] text-[#666] leading-relaxed">
            Combinamos tecnología de punta con producción local para crear prendas que
            no solo se ven bien, sino que rinden al máximo. Nuestro diseñador con
            inteligencia artificial te permite crear uniformes únicos para tu equipo
            en minutos, que luego producimos con los más altos estándares.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-20 bg-[#f5f5f5]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-[11px] tracking-[0.2em] uppercase text-[#999] font-medium mb-3">
              LO QUE NOS DEFINE
            </p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-[#1a1a1a] uppercase tracking-tight">
              Nuestros valores
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center border border-[#e5e5e5] bg-white">
                  <Icon className="h-5 w-5 text-[#1a1a1a]" strokeWidth={1.5} />
                </div>
                <h3 className="text-[14px] font-bold text-[#1a1a1a] uppercase tracking-wide mb-2">
                  {title}
                </h3>
                <p className="text-[13px] text-[#666] leading-relaxed">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-[#1a1a1a] uppercase tracking-tight mb-4">
            Únete al movimiento
          </h2>
          <p className="text-[15px] text-[#666] mb-8 max-w-md mx-auto">
            Explora nuestra colección o diseña el uniforme perfecto para tu equipo.
          </p>
          <div className="flex gap-3 justify-center">
            <Link
              href="/catalogo"
              className="inline-flex px-7 py-3 bg-[#1a1a1a] text-white text-[12px] font-semibold uppercase tracking-[0.1em] hover:bg-[#333] transition-colors"
            >
              Ver catálogo
            </Link>
            <Link
              href="/disenador"
              className="inline-flex px-7 py-3 border border-[#1a1a1a] text-[#1a1a1a] text-[12px] font-semibold uppercase tracking-[0.1em] hover:bg-[#1a1a1a] hover:text-white transition-colors"
            >
              Diseñar uniforme
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
