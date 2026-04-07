import { SessionProvider } from "next-auth/react"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </SessionProvider>
  )
}
