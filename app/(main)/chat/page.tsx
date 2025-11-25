'use client'

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation'
import {
  Message,
  MessageAction,
  MessageActions,
  MessageAttachment,
  MessageAttachments,
  MessageContent,
  MessageResponse,
} from '@/components/ai-elements/message'
import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputAttachment,
  PromptInputAttachments,
  PromptInputBody,
  PromptInputButton,
  PromptInputHeader,
  type PromptInputMessage,
  PromptInputSelect,
  PromptInputSelectContent,
  PromptInputSelectItem,
  PromptInputSelectTrigger,
  PromptInputSelectValue,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputTools,
  PromptInputProvider,
} from '@/components/ai-elements/prompt-input'
import { Fragment, useState } from 'react'
import { useChat } from '@ai-sdk/react'
import { CopyIcon, GlobeIcon, RefreshCcwIcon } from 'lucide-react'
import {
  Source,
  Sources,
  SourcesContent,
  SourcesTrigger,
} from '@/components/ai-elements/sources'
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from '@/components/ai-elements/reasoning'
import { Loader } from '@/components/ai-elements/loader'
import { DefaultChatTransport } from 'ai'
import { TypewriterEffectSmooth } from '@/components/ui/typewriter-effect'
import { UIText } from '@/types'

const models = [
  {
    name: 'DeepSeek R1',
    value: 'deepseek-r1',
  },
  {
    name: 'Qwen3 Omni Flash',
    value: 'qwen3-omni-flash',
  },
  {
    name: 'Qwen3 Max',
    value: 'qwen3-max',
  },
]

const words = [
  {
    text: `Let's`,
  },
  {
    text: 'chat',
  },
  {
    text: 'with',
  },
  {
    text: UIText.AppName,
    className: 'text-blue-500',
  },
  {
    text: 'together.',
  },
]

const ChatBotDemo = () => {
  const [input, setInput] = useState('')
  const [model, setModel] = useState<string>(models[0].value)
  const [webSearch, setWebSearch] = useState(false)
  const { messages, sendMessage, status, regenerate } = useChat({
    transport: new DefaultChatTransport({
      api: '/api2/chat',
    }),
  })

  const handleSubmit = (message: PromptInputMessage) => {
    const hasText = Boolean(message.text)
    const hasAttachments = Boolean(message.files?.length)

    if (!(hasText || hasAttachments)) {
      return
    }

    sendMessage(
      {
        text: message.text || 'Sent with attachments',
        files: message.files,
      },
      {
        body: {
          model,
          webSearch,
        },
      }
    )
    setInput('')
  }

  return (
    <PromptInputProvider>
      <div className="max-w-4xl mx-auto p-6 relative size-full h-[calc(100vh-5rem)]">
        <div className="flex flex-col h-full">
          {!messages.length && (
            <div className="h-full flex justify-center items-center">
              <TypewriterEffectSmooth words={words} />
            </div>
          )}

          {!!messages.length && (
            <Conversation className="h-full overflow-y-hidden">
              <ConversationContent>
                {messages.map((message, index) => (
                  <div key={message.id}>
                    {message.role === 'user' &&
                      message.parts.filter((part) => part.type === 'file')
                        .length > 0 && (
                        <MessageAttachments className="mb-2">
                          {message.parts.map((part, i) => {
                            if (
                              part.type === 'file' &&
                              part.mediaType.startsWith('image/')
                            ) {
                              return (
                                <Fragment key={`${message.id}-${i}`}>
                                  <MessageAttachment data={part} />
                                </Fragment>
                              )
                            }
                          })}
                        </MessageAttachments>
                      )}
                    {message.role === 'assistant' &&
                      message.parts.filter((part) => part.type === 'source-url')
                        .length > 0 && (
                        <Sources>
                          <SourcesTrigger
                            count={
                              message.parts.filter(
                                (part) => part.type === 'source-url'
                              ).length
                            }
                          />
                          {message.parts
                            .filter((part) => part.type === 'source-url')
                            .map((part, i) => (
                              <SourcesContent key={`${message.id}-${i}`}>
                                <Source
                                  key={`${message.id}-${i}`}
                                  href={part.url}
                                  title={part.url}
                                />
                              </SourcesContent>
                            ))}
                        </Sources>
                      )}
                    {message.parts.map((part, i) => {
                      if (part.type === 'text') {
                        return (
                          <Fragment key={`${message.id}-${i}`}>
                            <Message from={message.role}>
                              <MessageContent>
                                <MessageResponse>{part.text}</MessageResponse>
                              </MessageContent>
                            </Message>
                            {message.role === 'assistant' &&
                              index === messages.length - 1 && (
                                <MessageActions className="mt-2">
                                  <MessageAction
                                    onClick={() =>
                                      regenerate({
                                        body: {
                                          model,
                                          webSearch,
                                        },
                                      })
                                    }
                                    label="Retry"
                                  >
                                    <RefreshCcwIcon className="size-3" />
                                  </MessageAction>
                                  <MessageAction
                                    onClick={() =>
                                      navigator.clipboard.writeText(part.text)
                                    }
                                    label="Copy"
                                  >
                                    <CopyIcon className="size-3" />
                                  </MessageAction>
                                </MessageActions>
                              )}
                          </Fragment>
                        )
                      }
                      if (part.type === 'reasoning') {
                        return (
                          <Fragment key={`${message.id}-${i}`}>
                            <Reasoning
                              className="w-full"
                              isStreaming={
                                status === 'streaming' &&
                                i === message.parts.length - 1 &&
                                message.id === messages.at(-1)?.id
                              }
                            >
                              <ReasoningTrigger />
                              <ReasoningContent>{part.text}</ReasoningContent>
                            </Reasoning>
                          </Fragment>
                        )
                      }
                      return null
                    })}
                  </div>
                ))}
                {status === 'submitted' && (
                  <div className="h-6 flex justify-center items-center">
                    <Loader />
                  </div>
                )}
              </ConversationContent>
              <ConversationScrollButton />
            </Conversation>
          )}

          <PromptInput
            onSubmit={handleSubmit}
            className="mt-4"
            globalDrop
            multiple
          >
            <PromptInputHeader>
              <PromptInputAttachments>
                {(attachment) => <PromptInputAttachment data={attachment} />}
              </PromptInputAttachments>
            </PromptInputHeader>
            <PromptInputBody>
              <PromptInputTextarea
                onChange={(e) => setInput(e.target.value)}
                value={input}
              />
            </PromptInputBody>
            <PromptInputFooter>
              <PromptInputTools>
                <PromptInputActionMenu>
                  <PromptInputActionMenuTrigger />
                  <PromptInputActionMenuContent>
                    <PromptInputActionAddAttachments />
                  </PromptInputActionMenuContent>
                </PromptInputActionMenu>
                <PromptInputButton
                  variant={webSearch ? 'default' : 'ghost'}
                  onClick={() => setWebSearch(!webSearch)}
                >
                  <GlobeIcon size={16} />
                  <span>Search</span>
                </PromptInputButton>
                <PromptInputSelect
                  onValueChange={(value) => {
                    setModel(value)
                  }}
                  value={model}
                >
                  <PromptInputSelectTrigger>
                    <PromptInputSelectValue />
                  </PromptInputSelectTrigger>
                  <PromptInputSelectContent>
                    {models.map((model) => (
                      <PromptInputSelectItem
                        key={model.value}
                        value={model.value}
                      >
                        {model.name}
                      </PromptInputSelectItem>
                    ))}
                  </PromptInputSelectContent>
                </PromptInputSelect>
              </PromptInputTools>
              <PromptInputSubmit disabled={!input && !status} status={status} />
            </PromptInputFooter>
          </PromptInput>
        </div>
      </div>
    </PromptInputProvider>
  )
}

export default ChatBotDemo
