import { streamText, UIMessage, convertToModelMessages } from 'ai'
import { createQwen } from 'qwen-ai-provider-v5'

const qwen = createQwen({
  apiKey: process.env.DASHSCOPE_API_KEY,
  baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
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
    model: qwen('qwen-max'),
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
