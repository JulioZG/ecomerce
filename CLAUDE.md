# Project Context

E-commerce de ropa deportiva con diseñador de uniformes personalizado asistido por IA.

## Stack
- **Next.js 16.2.2** (App Router) + React 19 + TypeScript
- **DB:** PostgreSQL + Prisma 7 (`src/lib/prisma.ts`)
- **Auth:** NextAuth v5 beta (`src/lib/auth.ts`, `src/lib/auth.config.ts`)
- **Pagos:** MercadoPago (`src/lib/mercadopago.ts`)
- **Email:** AWS SES + React Email (`src/lib/ses.ts`, `src/emails/`)
- **IA:** Vercel AI SDK + DALL-E 3 (`src/lib/ai.ts`)
- **UI:** Tailwind CSS v4 + shadcn/ui + Lucide
- **State:** Zustand (`src/store/`)
- **Uploads:** UploadThing

## Estructura
```
src/
  app/
    (store)/     # catálogo, producto, carrito, checkout, diseñador
    (auth)/      # iniciar-sesion, registrarse
    (cuenta)/    # mis-pedidos
    admin/       # dashboard, productos, pedidos, usuarios, plantillas
    api/         # endpoints REST
  components/
    ui/          # shadcn/ui base
    store/       # componentes de tienda
    admin/       # componentes de admin
    designer/    # UniformDesigner
    layout/      # Navbar, Footer
    shared/      # reutilizables
  services/      # lógica de negocio (products, orders, admin)
  store/         # cartStore, designerStore (Zustand)
  lib/           # clientes externos (prisma, auth, ses, ai, mercadopago)
  types/         # tipos globales
  emails/        # plantillas React Email
```