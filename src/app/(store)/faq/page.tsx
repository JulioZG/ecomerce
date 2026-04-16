"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronRight, ChevronDown } from "lucide-react"

const faqs = [
  {
    category: "PEDIDOS Y ENVÍOS",
    items: [
      {
        q: "¿Cuánto tarda en llegar mi pedido?",
        a: "Los envíos estándar tardan entre 3 y 7 días hábiles dependiendo de tu ubicación. Los envíos express llegan en 1-3 días hábiles.",
      },
      {
        q: "¿El envío es gratis?",
        a: "Sí, todos los pedidos mayores a $2,500 MXN tienen envío gratis. Para pedidos menores, el costo de envío se calcula al momento del checkout.",
      },
      {
        q: "¿Puedo rastrear mi pedido?",
        a: "Sí, una vez que tu pedido sea enviado recibirás un correo con el número de seguimiento. También puedes consultarlo en la sección 'Mis pedidos'.",
      },
      {
        q: "¿Hacen envíos a toda la República Mexicana?",
        a: "Sí, enviamos a todos los estados de la República Mexicana a través de paqueterías confiables.",
      },
    ],
  },
  {
    category: "PAGOS",
    items: [
      {
        q: "¿Qué métodos de pago aceptan?",
        a: "Aceptamos tarjetas de crédito y débito, transferencias bancarias y pagos en OXXO a través de MercadoPago.",
      },
      {
        q: "¿Es seguro pagar en su tienda?",
        a: "Totalmente. Procesamos todos los pagos a través de MercadoPago, una plataforma certificada con los más altos estándares de seguridad.",
      },
      {
        q: "¿Puedo pagar en mensualidades?",
        a: "Sí, a través de MercadoPago puedes acceder a meses sin intereses con tarjetas de crédito participantes.",
      },
    ],
  },
  {
    category: "DEVOLUCIONES",
    items: [
      {
        q: "¿Cuál es su política de devoluciones?",
        a: "Tienes 30 días a partir de la recepción para devolver productos que no hayan sido usados y conserven sus etiquetas originales.",
      },
      {
        q: "¿Cómo inicio una devolución?",
        a: "Escríbenos a través de la sección de contacto con tu número de pedido y el motivo de la devolución. Te enviaremos una guía prepagada para el retorno.",
      },
      {
        q: "¿Los uniformes personalizados se pueden devolver?",
        a: "Los uniformes personalizados no aceptan devolución al ser productos hechos a medida. Asegúrate de revisar bien el diseño antes de confirmar tu pedido.",
      },
    ],
  },
  {
    category: "DISEÑADOR DE UNIFORMES",
    items: [
      {
        q: "¿Cómo funciona el diseñador con IA?",
        a: "Seleccionas un deporte y plantilla base, personalizas colores, subes tu logo y nuestra IA genera una vista previa del uniforme. Una vez aprobado, se envía a producción.",
      },
      {
        q: "¿Cuánto tardan los uniformes personalizados?",
        a: "Los uniformes personalizados tienen un tiempo de producción de 10 a 15 días hábiles, más el tiempo de envío.",
      },
      {
        q: "¿Hay un mínimo de piezas para uniformes?",
        a: "No hay mínimo de piezas. Puedes pedir desde una sola unidad, aunque ofrecemos mejores precios para pedidos de 10 o más.",
      },
    ],
  },
]

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-b border-[#e5e5e5]">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left"
      >
        <span className="text-[14px] font-medium text-[#1a1a1a] pr-8">{q}</span>
        <ChevronDown
          className={`h-4 w-4 text-[#999] shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="pb-5 -mt-1">
          <p className="text-[14px] text-[#666] leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  )
}

export default function FaqPage() {
  return (
    <div className="bg-white">
      {/* Breadcrumb */}
      <div className="border-b border-[#e5e5e5]">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-1.5 text-[12px] text-[#999]">
            <Link href="/" className="hover:text-[#1a1a1a] transition-colors">Inicio</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-[#1a1a1a] font-medium">Preguntas frecuentes</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="border-b border-[#e5e5e5]">
        <div className="container mx-auto px-4 py-12 md:py-16 text-center">
          <p className="text-[11px] tracking-[0.2em] uppercase text-[#999] font-medium mb-3">
            AYUDA
          </p>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-[#1a1a1a] uppercase tracking-tight">
            Preguntas frecuentes
          </h1>
          <p className="text-[14px] text-[#666] mt-3 max-w-md mx-auto">
            Encuentra respuestas a las dudas más comunes sobre pedidos, envíos, pagos y nuestro diseñador de uniformes.
          </p>
        </div>
      </div>

      {/* FAQ sections */}
      <div className="container mx-auto px-4 py-10 md:py-14 max-w-2xl">
        {faqs.map((section) => (
          <div key={section.category} className="mb-10">
            <h2 className="text-[12px] font-bold tracking-[0.12em] uppercase text-[#1a1a1a] mb-2">
              {section.category}
            </h2>
            <div>
              {section.items.map((item) => (
                <FaqItem key={item.q} q={item.q} a={item.a} />
              ))}
            </div>
          </div>
        ))}

        {/* Contact CTA */}
        <div className="mt-6 p-6 bg-[#f5f5f5] text-center">
          <p className="text-[14px] text-[#666] mb-4">
            ¿No encontraste lo que buscabas?
          </p>
          <Link
            href="/contacto"
            className="inline-flex px-7 py-3 bg-[#1a1a1a] text-white text-[12px] font-semibold uppercase tracking-[0.1em] hover:bg-[#333] transition-colors"
          >
            Contáctanos
          </Link>
        </div>
      </div>
    </div>
  )
}
