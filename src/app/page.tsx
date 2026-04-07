import Link from "next/link"
import { SessionProvider } from "next-auth/react"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { Button } from "@/components/ui/button"
import { prisma } from "@/lib/prisma"
import { ProductCard } from "@/components/store/ProductCard"

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

export default async function HomePage() {
  const products = await getFeaturedProducts()

  return (
    <SessionProvider>
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Ropa Deportiva para Todos
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Fútbol, básquet, running y más. También diseñá tu uniforme personalizado
              con inteligencia artificial.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary">
                <Link href="/catalogo">Ver catálogo</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="bg-transparent border-white text-white hover:bg-white hover:text-blue-600"
              >
                <Link href="/disenador">Diseñar uniforme</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Sports categories */}
        <section className="py-12 px-4 bg-gray-50">
          <div className="container mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">Deportes</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Fútbol", slug: "futbol", emoji: "⚽" },
                { label: "Básquet", slug: "basquet", emoji: "🏀" },
                { label: "Running", slug: "running", emoji: "🏃" },
                { label: "Vóley", slug: "voley", emoji: "🏐" },
              ].map((sport) => (
                <Link
                  key={sport.slug}
                  href={`/catalogo?deporte=${sport.slug}`}
                  className="flex flex-col items-center gap-2 p-6 bg-white rounded-xl border hover:border-blue-400 hover:shadow-md transition-all"
                >
                  <span className="text-4xl">{sport.emoji}</span>
                  <span className="font-medium">{sport.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured products */}
        {products.length > 0 && (
          <section className="py-12 px-4">
            <div className="container mx-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Productos destacados</h2>
                <Button asChild variant="outline">
                  <Link href="/catalogo">Ver todos</Link>
                </Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Custom uniform CTA */}
        <section className="py-16 px-4 bg-blue-50">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">¿Necesitás uniformes personalizados?</h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Usá nuestra herramienta con IA para diseñar el uniforme de tu equipo:
              elegí colores, subí tu logo y generá una preview al instante.
            </p>
            <Button asChild size="lg">
              <Link href="/disenador">Empezar a diseñar</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </SessionProvider>
  )
}
