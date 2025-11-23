import { streamText, UIMessage, convertToModelMessages } from 'ai'
import { qwen } from '@/lib/ai/qwen'
import prompt from './prompt.md'

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  const {
    messages,
    model,
  }: {
    messages: UIMessage[]
    model: string
    webSearch: boolean
  } = await req.json()
  const result = streamText({
    model: qwen(model),
    messages: convertToModelMessages(messages),
    system: prompt,
    tools: {},
  })
  // send sources and reasoning back to the client
  return result.toUIMessageStreamResponse({
    sendSources: true,
    sendReasoning: true,
  })
}
