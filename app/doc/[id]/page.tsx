'use client'

import { loadKnowledgeBases } from '@/api/knowledge-base'
import { KnowledgeBase } from '@/types'
import { find } from 'lodash-es'
import React, { use } from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import { TextShimmer } from '@/components/text-shimmer'

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [knowledgeBase, setKnowledgeBase] = React.useState<KnowledgeBase>()
  const [isLoading, setIsLoading] = React.useState(true)

  async function init() {
    try {
      setIsLoading(true)
      const { data } = await loadKnowledgeBases()
      const newKnowledgeBase = find(data, (item) => `${item.id}` === id)
      setKnowledgeBase(newKnowledgeBase)
    } catch {
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (isLoading) {
    return (
      <div className="flex-1 flex justify-center items-center">
        <TextShimmer className="font-mono text-4xl" duration={1}>
          Loading...
        </TextShimmer>
      </div>
    )
  }

  return (
    <div className="py-10 mx-auto">
      <article className="prose lg:prose-xl">
        <Markdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw, rehypeSanitize]}
        >
          {knowledgeBase?.content}
        </Markdown>
      </article>
    </div>
  )
}
