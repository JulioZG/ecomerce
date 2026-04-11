import { SessionProvider } from "next-auth/react"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { Syne, JetBrains_Mono } from "next/font/google"

const syne = Syne({ subsets: ["latin"], variable: "--font-syne" })
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" })

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <div
        className={`flex min-h-screen bg-zinc-950 text-zinc-100 ${syne.variable} ${mono.variable}`}
        style={{ fontFamily: "var(--font-syne), sans-serif" }}
      >
        <AdminSidebar />
        <main className="flex-1 overflow-auto">
          <div className="p-8 min-h-screen">{children}</div>
        </main>
      </div>
    </SessionProvider>
  )
}
