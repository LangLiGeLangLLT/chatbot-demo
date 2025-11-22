import { PromptInputProvider } from '@/components/ai-elements/prompt-input'
import React from 'react'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <PromptInputProvider>{children}</PromptInputProvider>
    </div>
  )
}
