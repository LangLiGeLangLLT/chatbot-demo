import {
  streamText,
  UIMessage,
  convertToModelMessages,
  createUIMessageStreamResponse,
  createUIMessageStream,
} from 'ai'
import { qwen } from '@/lib/ai/qwen'
import { experimental_createMCPClient as createMCPClient } from '@ai-sdk/mcp'
import prompt from './prompt.md'
import z from 'zod'

export const maxDuration = 30

export async function POST(req: Request) {
  const {
    messages,
    model,
    webSearch,
  }: {
    messages: UIMessage[]
    model: string
    webSearch: boolean
  } = await req.json()

  try {
    return createUIMessageStreamResponse({
      status: 200,
      statusText: 'OK',
      stream: createUIMessageStream({
        async execute({ writer }) {
          const modelMessages = convertToModelMessages(messages)

          if (webSearch) {
            const sseClient = await createMCPClient({
              transport: {
                type: 'sse',
                url: 'https://dashscope.aliyuncs.com/api/v1/mcps/WebSearch/sse',
                headers: {
                  Authorization: `Bearer ${process.env.DASHSCOPE_API_KEY}`,
                },
              },
            })
            const sseClientTools = await sseClient.tools({
              schemas: {
                bailian_web_search: {
                  description:
                    'Search can be used to query information such as encyclopedia knowledge, current news, weather, etc.',
                  inputSchema: z.object({
                    query: z
                      .string()
                      .describe('user query in the format of string'),
                    count: z
                      .number()
                      .optional()
                      .describe('number of search results'),
                  }),
                },
              },
            })
            const { response } = streamText({
              model: qwen(model),
              messages: modelMessages,
              tools: sseClientTools,
              onFinish: async () => {
                await sseClient.close()
              },
              onError: async () => {
                await sseClient.close()
              },
            })

            modelMessages.push(...(await response).messages)
          }

          const result = streamText({
            model: qwen(model),
            messages: modelMessages,
            // system: prompt,
            system: `You are a helpful assistant that can answer questions and help with tasks`,
            tools: {},
          })
          writer.merge(
            result.toUIMessageStream({
              sendSources: true,
              sendReasoning: true,
            })
          )
        },
      }),
    })
  } catch {
    return createUIMessageStreamResponse({
      status: 200,
      statusText: 'OK',
      stream: createUIMessageStream({
        execute({ writer }) {
          const result = streamText({
            model: qwen(model),
            prompt: `Only Say: Internal Server Error`,
          })
          writer.merge(result.toUIMessageStream())
        },
      }),
    })
  }
}
