import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  // Sports
  const sports = await Promise.all([
    prisma.sport.upsert({
      where: { slug: "futbol" },
      update: {},
      create: { nombre: "Fútbol", slug: "futbol", icono: "⚽" },
    }),
    prisma.sport.upsert({
      where: { slug: "basquet" },
      update: {},
      create: { nombre: "Básquet", slug: "basquet", icono: "🏀" },
    }),
    prisma.sport.upsert({
      where: { slug: "running" },
      update: {},
      create: { nombre: "Running", slug: "running", icono: "🏃" },
    }),
    prisma.sport.upsert({
      where: { slug: "voley" },
      update: {},
      create: { nombre: "Vóley", slug: "voley", icono: "🏐" },
    }),
  ])

  const [futbol, basquet, running, voley] = sports

  // Categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "camisetas-futbol" },
      update: {},
      create: { nombre: "Camisetas", slug: "camisetas-futbol", sportId: futbol.id },
    }),
    prisma.category.upsert({
      where: { slug: "shorts-futbol" },
      update: {},
      create: { nombre: "Shorts", slug: "shorts-futbol", sportId: futbol.id },
    }),
    prisma.category.upsert({
      where: { slug: "camisetas-basquet" },
      update: {},
      create: { nombre: "Camisetas", slug: "camisetas-basquet", sportId: basquet.id },
    }),
    prisma.category.upsert({
      where: { slug: "remeras-running" },
      update: {},
      create: { nombre: "Remeras", slug: "remeras-running", sportId: running.id },
    }),
  ])

  const [camisetasFutbol, shortsFutbol, camisetasBasquet, remerasRunning] = categories

  // Uniform templates
  await Promise.all([
    prisma.uniformTemplate.upsert({
      where: { id: "tmpl-futbol" },
      update: {},
      create: {
        id: "tmpl-futbol",
        nombre: "Camiseta Fútbol Clásica",
        sportId: futbol.id,
        imagenBase: "/templates/futbol-base.png",
      },
    }),
    prisma.uniformTemplate.upsert({
      where: { id: "tmpl-basquet" },
      update: {},
      create: {
        id: "tmpl-basquet",
        nombre: "Camiseta Básquet",
        sportId: basquet.id,
        imagenBase: "/templates/basquet-base.png",
      },
    }),
    prisma.uniformTemplate.upsert({
      where: { id: "tmpl-voley" },
      update: {},
      create: {
        id: "tmpl-voley",
        nombre: "Camiseta Vóley",
        sportId: voley.id,
        imagenBase: "/templates/voley-base.png",
      },
    }),
    prisma.uniformTemplate.upsert({
      where: { id: "tmpl-running" },
      update: {},
      create: {
        id: "tmpl-running",
        nombre: "Remera Running",
        sportId: running.id,
        imagenBase: "/templates/running-base.png",
      },
    }),
  ])

  // Sample products
  const product1 = await prisma.product.upsert({
    where: { slug: "camiseta-futbol-pro" },
    update: {},
    create: {
      nombre: "Camiseta Fútbol Pro",
      slug: "camiseta-futbol-pro",
      descripcion: "Camiseta de fútbol profesional, tela transpirable DryFit.",
      precio: 8500,
      destacado: true,
      sportId: futbol.id,
      categoryId: camisetasFutbol.id,
      images: [],
    },
  })

  await Promise.all(
    [
      { talla: "S", color: "Blanco", stock: 10 },
      { talla: "M", color: "Blanco", stock: 15 },
      { talla: "L", color: "Blanco", stock: 12 },
      { talla: "S", color: "Negro", stock: 8 },
      { talla: "M", color: "Negro", stock: 10 },
      { talla: "L", color: "Negro", stock: 6 },
    ].map((v) =>
      prisma.productVariant.upsert({
        where: { sku: `${product1.id}-${v.talla}-${v.color}`.toLowerCase().replace(/\s/g, "-") },
        update: {},
        create: {
          productId: product1.id,
          talla: v.talla,
          color: v.color,
          stock: v.stock,
          sku: `${product1.id}-${v.talla}-${v.color}`.toLowerCase().replace(/\s/g, "-"),
        },
      })
    )
  )

  const product2 = await prisma.product.upsert({
    where: { slug: "camiseta-basquet-team" },
    update: {},
    create: {
      nombre: "Camiseta Básquet Team",
      slug: "camiseta-basquet-team",
      descripcion: "Camiseta de básquet reversible, tela ultra liviana.",
      precio: 9200,
      destacado: true,
      sportId: basquet.id,
      categoryId: camisetasBasquet.id,
      images: [],
    },
  })

  await Promise.all(
    [
      { talla: "S", color: "Azul", stock: 7 },
      { talla: "M", color: "Azul", stock: 10 },
      { talla: "L", color: "Azul", stock: 5 },
      { talla: "XL", color: "Rojo", stock: 8 },
    ].map((v) =>
      prisma.productVariant.upsert({
        where: { sku: `${product2.id}-${v.talla}-${v.color}`.toLowerCase().replace(/\s/g, "-") },
        update: {},
        create: {
          productId: product2.id,
          talla: v.talla,
          color: v.color,
          stock: v.stock,
          sku: `${product2.id}-${v.talla}-${v.color}`.toLowerCase().replace(/\s/g, "-"),
        },
      })
    )
  )

  console.log("✅ Seed completado")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
