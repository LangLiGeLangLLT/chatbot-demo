import { streamText, UIMessage, convertToModelMessages } from 'ai'
import { createOllama } from 'ollama-ai-provider-v2'

const ollama = createOllama({
  // optional settings, e.g.
  baseURL: 'http://localhost:11434/api',
})

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  const {
    messages,
  }: {
    messages: UIMessage[]
  } = await req.json()
  const result = streamText({
    model: ollama('qwen3:0.6b'),
    messages: convertToModelMessages(messages),
    system:
      'You are a helpful assistant that can answer questions and help with tasks',
  })
  // send sources and reasoning back to the client
  return result.toUIMessageStreamResponse({
    sendSources: true,
    sendReasoning: true,
  })
}
