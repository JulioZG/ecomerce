import Link from "next/link"
import { SessionProvider } from "next-auth/react"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { Button } from "@/components/ui/button"
import { prisma } from "@/lib/prisma"
import { ProductCard } from "@/components/store/ProductCard"
import { ArrowRight, Sparkles, Truck, Shield, RefreshCw } from "lucide-react"

export const revalidate = 60

async function getFeaturedProducts() {
  try {
    return await prisma.product.findMany({
      where: { destacado: true, activo: true },
      include: {
        sport: { select: { nombre: true, slug: true } },
        variants: { select: { talla: true, color: true, stock: true } },
      },
      take: 8,
      orderBy: { createdAt: "desc" },
    })
  } catch {
    return []
  }
}

const sports = [
  { label: "Fútbol", slug: "futbol", emoji: "⚽", color: "from-emerald-500 to-green-600", bg: "bg-emerald-50" },
  { label: "Básquet", slug: "basquet", emoji: "🏀", color: "from-orange-500 to-amber-600", bg: "bg-orange-50" },
  { label: "Running", slug: "running", emoji: "🏃", color: "from-blue-500 to-cyan-600", bg: "bg-blue-50" },
  { label: "Vóley", slug: "voley", emoji: "🏐", color: "from-violet-500 to-purple-600", bg: "bg-violet-50" },
]

const features = [
  { icon: Truck, title: "Envío rápido", desc: "Todo el país en 48-72 hs" },
  { icon: Shield, title: "Pago seguro", desc: "Con MercadoPago" },
  { icon: RefreshCw, title: "Cambios", desc: "30 días sin preguntas" },
  { icon: Sparkles, title: "IA incluida", desc: "Diseñá tu uniforme" },
]

export default async function HomePage() {
  const products = await getFeaturedProducts()

  return (
    <SessionProvider>
      <Navbar />
      <main className="flex-1">

        {/* ── Hero ─────────────────────────────────────────── */}
        <section className="hero-gradient text-white overflow-hidden relative">
          {/* Decorative circles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-white/5" />
            <div className="absolute top-1/2 -left-32 w-64 h-64 rounded-full bg-white/5" />
            <div className="absolute bottom-0 right-1/3 w-48 h-48 rounded-full bg-blue-400/10" />
          </div>

          <div className="container mx-auto px-4 py-24 md:py-32 relative">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur rounded-full px-4 py-1.5 mb-6 text-sm font-medium border border-white/20">
                <Sparkles className="h-3.5 w-3.5 text-yellow-300" />
                Diseñador de uniformes con IA
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight tracking-tight">
                Ropa Deportiva<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-blue-200">
                  para Todos
                </span>
              </h1>
              <p className="text-lg md:text-xl text-blue-100 mb-10 max-w-xl mx-auto leading-relaxed">
                Fútbol, básquet, running y más. También diseñá el uniforme de tu equipo
                con inteligencia artificial en minutos.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild size="lg" className="bg-white text-blue-700 hover:bg-blue-50 font-bold rounded-full px-8 shadow-lg hover:shadow-xl transition-all">
                  <Link href="/catalogo" className="flex items-center gap-2">
                    Ver catálogo
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild size="lg"
                  className="bg-transparent border-2 border-white/50 hover:border-white hover:bg-white/10 rounded-full px-8 transition-all font-semibold"
                >
                  <Link href="/disenador" className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Diseñar uniforme
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* ── Features strip ───────────────────────────────── */}
        <section className="bg-slate-900 text-white py-5">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
              {features.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex items-center gap-3 px-6 py-2">
                  <div className="shrink-0 w-9 h-9 rounded-lg bg-blue-600/30 flex items-center justify-center">
                    <Icon className="h-4 w-4 text-blue-300" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{title}</p>
                    <p className="text-xs text-slate-400">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Sport categories ─────────────────────────────── */}
        <section className="py-16 px-4 bg-slate-50">
          <div className="container mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Explorá por deporte</h2>
              <p className="text-slate-500">Encontrá lo que buscás según tu actividad</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {sports.map((sport) => (
                <Link
                  key={sport.slug}
                  href={`/catalogo?deporte=${sport.slug}`}
                  className={`card-hover group relative flex flex-col items-center gap-3 p-6 rounded-2xl border border-white bg-white shadow-sm overflow-hidden`}
                >
                  {/* Color bar top */}
                  <div className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r ${sport.color}`} />
                  <div className={`w-16 h-16 rounded-2xl ${sport.bg} flex items-center justify-center text-4xl`}>
                    {sport.emoji}
                  </div>
                  <span className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{sport.label}</span>
                  <span className="text-xs text-slate-400 flex items-center gap-1 group-hover:text-blue-500 transition-colors">
                    Ver productos <ArrowRight className="h-3 w-3" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── Featured products ────────────────────────────── */}
        {products.length > 0 && (
          <section className="py-16 px-4">
            <div className="container mx-auto">
              <div className="flex items-end justify-between mb-8">
                <div>
                  <p className="text-blue-600 text-sm font-semibold uppercase tracking-widest mb-1">Selección especial</p>
                  <h2 className="text-3xl font-extrabold text-slate-900">Productos destacados</h2>
                </div>
                <Button asChild variant="outline" className="rounded-full border-slate-300 hover:border-blue-400 hover:text-blue-600">
                  <Link href="/catalogo" className="flex items-center gap-2">
                    Ver todos <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Custom uniform CTA ───────────────────────────── */}
        <section className="py-20 px-4 bg-slate-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-72 h-72 rounded-full bg-blue-600/20 blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full bg-violet-600/20 blur-3xl" />
          </div>
          <div className="container mx-auto text-center relative">
            <div className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 rounded-full px-4 py-1.5 mb-6 text-sm text-blue-300">
              <Sparkles className="h-3.5 w-3.5" />
              Powered by IA
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
              Diseñá el uniforme
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                de tu equipo
              </span>
            </h2>
            <p className="text-slate-400 mb-8 max-w-lg mx-auto leading-relaxed">
              Elegí colores, subí tu logo y generá una preview al instante con IA.
              El diseño va directo al productor local.
            </p>
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-500 text-white rounded-full px-10 font-bold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all">
              <Link href="/disenador" className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Empezar a diseñar
              </Link>
            </Button>
          </div>
        </section>

      </main>
      <Footer />
    </SessionProvider>
  )
}
