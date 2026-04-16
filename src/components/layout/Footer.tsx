import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-[#f5f5f5] text-[#1a1a1a]">
      <div className="container mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div>
            <Link href="/" className="font-heading text-2xl font-bold tracking-[0.06em] uppercase mb-4 inline-block">
              ATLÉTICA
            </Link>
            <p className="text-[13px] text-[#666] leading-relaxed max-w-[260px]">
              Ropa deportiva de calidad para todos los deportes.
              Uniformes personalizados con inteligencia artificial.
            </p>
          </div>

          {/* Menu principal */}
          <div>
            <h4 className="text-[12px] font-semibold uppercase tracking-[0.15em] mb-5 text-[#1a1a1a]">
              Menú
            </h4>
            <ul className="space-y-3 text-[13px]">
              <li><Link href="/catalogo" className="text-[#666] hover:text-[#1a1a1a] transition-colors">Catálogo</Link></li>
              <li><Link href="/disenador" className="text-[#666] hover:text-[#1a1a1a] transition-colors">Diseñador</Link></li>
              <li><Link href="/nosotros" className="text-[#666] hover:text-[#1a1a1a] transition-colors">Nosotros</Link></li>
              <li><Link href="/faq" className="text-[#666] hover:text-[#1a1a1a] transition-colors">FAQ</Link></li>
              <li><Link href="/contacto" className="text-[#666] hover:text-[#1a1a1a] transition-colors">Contacto</Link></li>
            </ul>
          </div>

          {/* Colecciones */}
          <div>
            <h4 className="text-[12px] font-semibold uppercase tracking-[0.15em] mb-5 text-[#1a1a1a]">
              Deportes
            </h4>
            <ul className="space-y-3 text-[13px]">
              <li><Link href="/catalogo?deporte=futbol" className="text-[#666] hover:text-[#1a1a1a] transition-colors">Fútbol</Link></li>
              <li><Link href="/catalogo?deporte=basquet" className="text-[#666] hover:text-[#1a1a1a] transition-colors">Básquet</Link></li>
              <li><Link href="/catalogo?deporte=running" className="text-[#666] hover:text-[#1a1a1a] transition-colors">Running</Link></li>
              <li><Link href="/catalogo?deporte=voley" className="text-[#666] hover:text-[#1a1a1a] transition-colors">Vóley</Link></li>
            </ul>
          </div>

          {/* Newsletter mini */}
          <div>
            <h4 className="text-[12px] font-semibold uppercase tracking-[0.15em] mb-5 text-[#1a1a1a]">
              Contacto
            </h4>
            <ul className="space-y-3 text-[13px] text-[#666]">
              <li><Link href="/iniciar-sesion" className="hover:text-[#1a1a1a] transition-colors">Ingresar</Link></li>
              <li><Link href="/registrarse" className="hover:text-[#1a1a1a] transition-colors">Registrarse</Link></li>
              <li><Link href="/mis-pedidos" className="hover:text-[#1a1a1a] transition-colors">Mis pedidos</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#e5e5e5] pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="text-[11px] text-[#999] flex items-center gap-1">🇲🇽 México (MXN $)</span>
            {/* Social icons */}
            <div className="flex gap-3">
              {["M 24 12.07C24 5.41 18.63 0 12 0S0 5.41 0 12.07c0 5.88 4.17 10.77 9.71 11.83v-8.36H6.79v-3.47h2.92V9.41c0-2.91 1.72-4.52 4.36-4.52 1.26 0 2.58.23 2.58.23v2.85h-1.45c-1.43 0-1.88.9-1.88 1.82v2.18h3.19l-.51 3.47h-2.68v8.36C19.83 22.84 24 17.95 24 12.07",
                "M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85 0 3.2-.01 3.58-.07 4.85-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.64.07-4.85.07-3.2 0-3.58-.01-4.85-.07-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.64-.07-4.85 0-3.2.01-3.58.07-4.85C2.38 3.86 3.9 2.31 7.15 2.23 8.42 2.17 8.8 2.16 12 2.16zM12 0C8.74 0 8.33.01 7.05.07 2.7.27.27 2.7.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.2 4.36 2.62 6.78 6.98 6.98C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c4.35-.2 6.78-2.62 6.98-6.98.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.2-4.35-2.63-6.78-6.98-6.98C15.67.01 15.26 0 12 0zm0 5.84A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.4-11.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z",
              ].map((path, i) => (
                <a key={i} href="#" className="text-[#999] hover:text-[#1a1a1a] transition-colors">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d={path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
          <p className="text-[11px] text-[#999]">
            &copy; {new Date().getFullYear()} ATLÉTICA. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
