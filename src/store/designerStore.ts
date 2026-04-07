"use client"

import { create } from "zustand"

interface UniformTemplate {
  id: string
  nombre: string
  sportId: string
  imagenBase: string
  sport?: { nombre: string; slug: string }
}

interface DesignerStore {
  currentStep: number
  selectedSport: string | null
  selectedTemplate: UniformTemplate | null
  nombreEquipo: string
  colorPrimario: string
  colorSecundario: string
  logoFile: File | null
  logoUrl: string | null
  cantidades: Record<string, number>
  notasAdicionales: string
  isGenerating: boolean
  generatedImageUrl: string | null
  promptUsado: string | null
  error: string | null
  generationCount: number

  setStep: (step: number) => void
  setSport: (sportId: string) => void
  setTemplate: (template: UniformTemplate) => void
  setNombreEquipo: (nombre: string) => void
  setColor: (tipo: "primario" | "secundario", hex: string) => void
  setLogoUrl: (url: string | null) => void
  setCantidades: (cantidades: Record<string, number>) => void
  setNotas: (notas: string) => void
  setGenerating: (loading: boolean) => void
  setGeneratedImage: (url: string, prompt: string) => void
  setError: (error: string | null) => void
  reset: () => void
}

const initialState = {
  currentStep: 1,
  selectedSport: null,
  selectedTemplate: null,
  nombreEquipo: "",
  colorPrimario: "#1a56db",
  colorSecundario: "#ffffff",
  logoFile: null,
  logoUrl: null,
  cantidades: { XS: 0, S: 0, M: 0, L: 0, XL: 0, XXL: 0 },
  notasAdicionales: "",
  isGenerating: false,
  generatedImageUrl: null,
  promptUsado: null,
  error: null,
  generationCount: 0,
}

export const useDesignerStore = create<DesignerStore>()((set) => ({
  ...initialState,

  setStep: (step) => set({ currentStep: step }),
  setSport: (sportId) => set({ selectedSport: sportId, selectedTemplate: null }),
  setTemplate: (template) => set({ selectedTemplate: template }),
  setNombreEquipo: (nombre) => set({ nombreEquipo: nombre }),
  setColor: (tipo, hex) =>
    tipo === "primario"
      ? set({ colorPrimario: hex })
      : set({ colorSecundario: hex }),
  setLogoUrl: (url) => set({ logoUrl: url }),
  setCantidades: (cantidades) => set({ cantidades }),
  setNotas: (notas) => set({ notasAdicionales: notas }),
  setGenerating: (loading) => set({ isGenerating: loading }),
  setGeneratedImage: (url, prompt) =>
    set((state) => ({
      generatedImageUrl: url,
      promptUsado: prompt,
      isGenerating: false,
      error: null,
      generationCount: state.generationCount + 1,
    })),
  setError: (error) => set({ error, isGenerating: false }),
  reset: () => set(initialState),
}))
