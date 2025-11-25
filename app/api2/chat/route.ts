import {
  streamText,
  UIMessage,
  convertToModelMessages,
  createUIMessageStreamResponse,
  createUIMessageStream,
  tool,
  stepCountIs,
} from 'ai'
import { qwen } from '@/lib/ai/qwen'
import { experimental_createMCPClient as createMCPClient } from '@ai-sdk/mcp'
import prompt from './prompt.md'
import z from 'zod'
import { retrieve } from '@/lib/actions/retrieve'

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
              toolChoice: 'required',
              stopWhen: stepCountIs(5),
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
            system: prompt,
            stopWhen: stepCountIs(5),
            tools: {
              retrieve: tool({
                description: `get information from your knowledge base to answer questions.`,
                inputSchema: z.object({
                  query: z.string().describe(`the users query`),
                }),
                execute: async ({ query }) => retrieve(query),
              }),
            },
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
