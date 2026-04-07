import { createOpenAI } from "@ai-sdk/openai"

// Uses Vercel AI SDK with OpenAI provider (can be swapped for any Vercel AI gateway model)
export const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.AI_GATEWAY_URL ?? undefined,
})

export const imageModel = openai.image(
  process.env.AI_IMAGE_MODEL ?? "dall-e-3"
)
