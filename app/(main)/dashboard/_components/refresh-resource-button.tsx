'use client'

import { loadKnowledgeBases } from '@/api/knowledge-base'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { KnowledgeBase } from '@/types'
import { RefreshCcw } from 'lucide-react'
import React from 'react'

export default function RefreshResourceButton({
  onRefreshSuccess,
}: {
  onRefreshSuccess: (knowledgeBases: KnowledgeBase[]) => void
}) {
  const [isLoading, setIsLoading] = React.useState(false)

  async function onRefresh() {
    try {
      setIsLoading(true)
      const { data } = await loadKnowledgeBases()
      onRefreshSuccess(data)
    } catch {
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button disabled={isLoading} onClick={onRefresh}>
      {isLoading ? <Spinner /> : <RefreshCcw />} Refresh
    </Button>
  )
}
