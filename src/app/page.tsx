import Link from "next/link"
import Image from "next/image"
import { SessionProvider } from "next-auth/react"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { getFeaturedProducts } from "@/services/products"
import { ProductCard } from "@/components/store/ProductCard"
import { ArrowRight, Star, Truck, RotateCcw, Shield, Sparkles } from "lucide-react"

export const revalidate = 60

const heroSlides = [
  {
    image: "https://essence-theme-bold.myshopify.com/cdn/shop/files/AdobeStock_313314948.jpg?v=1693913088&width=1920",
    title: "ELEGANCIA EN\nCADA MOVIMIENTO",
    subtitle: "Donde el estilo se encuentra con tu entrenamiento.",
  },
  {
    image: "https://essence-theme-bold.myshopify.com/cdn/shop/files/AdobeStock_418546909.jpg?v=1693911719&width=1920",
    title: "RENDIMIENTO\nSIN LÍMITES",
    subtitle: "Tecnología y diseño para superar tus metas.",
  },
]

const collections = [
  {
    name: "PLAYERAS",
    image: "https://essence-theme-bold.myshopify.com/cdn/shop/files/AdobeStock_618643633.jpg?v=1693911718&width=800",
    href: "/catalogo?categoria=camisetas",
  },
  {
    name: "CALZADO",
    image: "https://essence-theme-bold.myshopify.com/cdn/shop/files/AdobeStock_397499344.jpg?v=1693911719&width=800",
    href: "/catalogo?categoria=calzado",
  },
  {
    name: "ACCESORIOS",
    image: "https://essence-theme-bold.myshopify.com/cdn/shop/files/AdobeStock_265984915.jpg?v=1693911718&width=800",
    href: "/catalogo?categoria=accesorios",
  },
]

const testimonials = [
  {
    name: "Valentina M.",
    text: "La calidad de las telas es increíble. Uso la ropa para entrenar todos los días y sigue como nueva después de meses.",
    rating: 5,
    title: "Calidad excepcional",
  },
  {
    name: "Santiago R.",
    text: "Pedí uniformes personalizados para mi equipo de fútbol y quedaron espectaculares. El diseñador con IA es muy fácil de usar.",
    rating: 5,
    title: "Uniformes perfectos",
  },
  {
    name: "Lucía P.",
    text: "El envío fue rapidísimo y la atención al cliente excelente. Las calzas son super cómodas para running.",
    rating: 5,
    title: "Servicio impecable",
  },
]

const features = [
  { icon: Truck, title: "Envío gratis", desc: "En compras +$2,500" },
  { icon: RotateCcw, title: "Devolución fácil", desc: "30 días sin preguntas" },
  { icon: Shield, title: "Pago seguro", desc: "Con MercadoPago" },
  { icon: Sparkles, title: "Diseño IA", desc: "Crea tu uniforme" },
]

export default async function HomePage() {
  const products = await getFeaturedProducts()

  return (
    <SessionProvider>
      <Navbar />
      <main>

        {/* ── HERO SLIDER ─────────────────────────────────── */}
        <section className="relative w-full h-[85vh] min-h-[500px] overflow-hidden bg-[#1a1a1a]">
          <Image
            src={heroSlides[0].image}
            alt="Hero"
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent" />

          <div className="absolute inset-0 flex items-end pb-20 md:pb-24">
            <div className="container mx-auto px-6 md:px-12">
              <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold text-white uppercase leading-[0.95] tracking-tight whitespace-pre-line">
                {heroSlides[0].title}
              </h1>
              <p className="mt-4 text-[15px] md:text-[17px] text-white/80 max-w-md">
                {heroSlides[0].subtitle}
              </p>
              <div className="flex gap-3 mt-8">
                <Link
                  href="/catalogo"
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-white text-[#1a1a1a] text-[13px] font-semibold uppercase tracking-[0.08em] hover:bg-[#f5f5f5] transition-colors"
                >
                  COMPRAR AHORA
                </Link>
                <Link
                  href="/disenador"
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-full border-2 border-white/60 text-white text-[13px] font-semibold uppercase tracking-[0.08em] hover:bg-white/10 hover:border-white transition-colors"
                >
                  DISEÑAR UNIFORME
                </Link>
              </div>
            </div>
          </div>

          <div className="absolute bottom-8 right-8 flex items-center gap-2">
            <span className="text-white/60 text-[13px] font-medium">1/2</span>
            <button className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white/10 transition-colors">
              <ArrowRight className="h-4 w-4 rotate-180" />
            </button>
            <button className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white/10 transition-colors">
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </section>

        {/* ── FEATURES STRIP ──────────────────────────────── */}
        <section className="border-b border-[#e5e5e5]">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-[#e5e5e5]">
              {features.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex items-center gap-3 px-5 py-5">
                  <Icon className="h-5 w-5 text-[#1a1a1a] shrink-0" strokeWidth={1.5} />
                  <div>
                    <p className="text-[13px] font-semibold text-[#1a1a1a]">{title}</p>
                    <p className="text-[11px] text-[#666]">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── COLLECTIONS ─────────────────────────────────── */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4 mb-10">
            <p className="text-[11px] tracking-[0.2em] uppercase text-[#666] font-medium mb-2 text-center">
              COMPRA LO ESENCIAL
            </p>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-[#1a1a1a] uppercase text-center tracking-tight">
              COLECCIONES DESTACADAS
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3">
            {collections.map((col) => (
              <Link
                key={col.name}
                href={col.href}
                className="relative h-[450px] md:h-[550px] overflow-hidden group"
              >
                <Image
                  src={col.image}
                  alt={col.name}
                  fill
                  className="object-cover product-image-hover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 p-6 md:p-8">
                  <h3 className="font-heading text-2xl md:text-3xl font-bold text-white uppercase tracking-tight">
                    {col.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── PRODUCTS GRID ───────────────────────────────── */}
        {products.length > 0 && (
          <section className="py-16 md:py-20 bg-white">
            <div className="container mx-auto px-4">
              <div className="flex items-end justify-between mb-10">
                <div>
                  <p className="text-[11px] tracking-[0.2em] uppercase text-[#666] font-medium mb-2">
                    LO MÁS NUEVO
                  </p>
                  <h2 className="font-heading text-4xl md:text-5xl font-bold text-[#1a1a1a] uppercase tracking-tight">
                    NOVEDADES
                  </h2>
                </div>
                <Link
                  href="/catalogo"
                  className="hidden md:flex items-center gap-1.5 text-[12px] font-semibold tracking-[0.1em] uppercase text-[#1a1a1a] hover:text-[#007AFF] transition-colors"
                >
                  VER TODO <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
              <div className="flex justify-center mt-10 md:hidden">
                <Link
                  href="/catalogo"
                  className="inline-flex items-center gap-1.5 px-7 py-3 rounded-full bg-[#1a1a1a] text-white text-[12px] font-semibold tracking-[0.1em] uppercase"
                >
                  VER TODO <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* ── SPLIT BANNER ────────────────────────────────── */}
        <section className="grid grid-cols-1 md:grid-cols-2">
          <div className="relative h-[400px] md:h-auto md:min-h-[500px] overflow-hidden">
            <Image
              src="https://essence-theme-bold.myshopify.com/cdn/shop/files/AdobeStock_426917731.jpg?v=1693911718&width=1200"
              alt="Uniformes personalizados"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className="flex flex-col justify-center px-8 md:px-16 lg:px-24 py-16 md:py-20 bg-white">
            <p className="text-[11px] tracking-[0.2em] uppercase text-[#666] font-medium mb-3">
              DISEÑADOR CON INTELIGENCIA ARTIFICIAL
            </p>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-[#1a1a1a] uppercase leading-[0.95] tracking-tight mb-5">
              DISEÑA EL UNIFORME DE TU EQUIPO
            </h2>
            <p className="text-[15px] text-[#666] leading-relaxed mb-8 max-w-md">
              Elige colores, sube tu logo y genera una vista previa al instante.
              El diseño va directo al productor local para confeccionar
              tus uniformes de forma profesional.
            </p>
            <Link
              href="/disenador"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#1a1a1a] text-white text-[12px] font-semibold uppercase tracking-[0.1em] w-fit hover:bg-[#333] transition-colors"
            >
              EMPEZAR A DISEÑAR
            </Link>
          </div>
        </section>

        {/* ── TESTIMONIALS ────────────────────────────────── */}
        <section className="py-16 md:py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <p className="text-[11px] tracking-[0.2em] uppercase text-[#666] font-medium mb-2">
                TESTIMONIOS
              </p>
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-[#1a1a1a] uppercase tracking-tight">
                LO QUE DICEN NUESTROS CLIENTES
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t) => (
                <div
                  key={t.name}
                  className="border border-[#e5e5e5] p-6 md:p-8 bg-white"
                >
                  <div className="flex gap-0.5 mb-3">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <h4 className="text-[15px] font-bold text-[#1a1a1a] mb-2">{t.title}</h4>
                  <p className="text-[14px] text-[#666] leading-relaxed mb-4">{t.text}</p>
                  <p className="text-[13px] font-medium text-[#1a1a1a]">{t.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FULL-WIDTH BANNER ───────────────────────────── */}
        <section className="relative h-[400px] md:h-[500px] overflow-hidden">
          <Image
            src="https://essence-theme-bold.myshopify.com/cdn/shop/files/AdobeStock_496639144.jpg?width=1920"
            alt="Banner"
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <h2 className="font-heading text-4xl md:text-6xl font-bold text-white uppercase tracking-tight mb-4">
              RENDIMIENTO PERFECTO
            </h2>
            <p className="text-[15px] text-white/80 mb-8 max-w-lg">
              Cada prenda diseñada para acompañar tu movimiento con comodidad y estilo.
            </p>
            <Link
              href="/catalogo"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-white text-[#1a1a1a] text-[12px] font-semibold uppercase tracking-[0.1em] hover:bg-[#f5f5f5] transition-colors"
            >
              EXPLORAR CATÁLOGO
            </Link>
          </div>
        </section>

        {/* ── NEWSLETTER ──────────────────────────────────── */}
        <section className="grid grid-cols-1 md:grid-cols-2">
          <div className="relative h-[300px] md:h-auto md:min-h-[400px] overflow-hidden">
            <Image
              src="https://essence-theme-bold.myshopify.com/cdn/shop/files/deep-rose.jpg?width=1200"
              alt="Newsletter"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className="flex flex-col justify-center px-8 md:px-16 lg:px-24 py-14 bg-[#f5f5f5]">
            <div className="w-10 h-10 rounded-full border border-[#ccc] flex items-center justify-center mb-5">
              <svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L9 8L17 1M1 13H17V1H1V13Z" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-[#1a1a1a] uppercase tracking-tight mb-3">
              MANTENTE AL DÍA
            </h2>
            <p className="text-[14px] text-[#666] leading-relaxed mb-6">
              Suscríbete a nuestro newsletter y obtén un 10% de descuento
              en tu primera compra. Recibe novedades y ofertas exclusivas.
            </p>
            <form className="flex gap-2 max-w-md">
              <input
                type="email"
                placeholder="Tu email"
                className="flex-1 px-4 py-3 bg-white border border-[#e5e5e5] text-[14px] text-[#1a1a1a] placeholder:text-[#999] focus:outline-none focus:border-[#1a1a1a]"
              />
              <button
                type="button"
                className="px-6 py-3 bg-[#1a1a1a] text-white text-[12px] font-semibold uppercase tracking-[0.1em] rounded-full hover:bg-[#333] transition-colors shrink-0"
              >
                SUSCRIBIRSE
              </button>
            </form>
          </div>
        </section>

      </main>
      <Footer />
    </SessionProvider>
  )
}
