'use client'

import { deleteKnowledgeBase } from '@/api/knowledge-base'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { KnowledgeBase } from '@/types'
import { Trash } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'

export default function DeleteResourceButton({
  knowledgeBase,
  onDeleteSuccess,
}: {
  knowledgeBase: KnowledgeBase
  onDeleteSuccess: () => void
}) {
  const [isLoading, setIsLoading] = React.useState(false)

  async function onDelete() {
    try {
      if (!knowledgeBase.id) return

      setIsLoading(true)

      await deleteKnowledgeBase({ knowledgeBaseId: knowledgeBase.id })

      onDeleteSuccess()
      toast.success('Resource deleted!')
    } catch {
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button variant="ghost" size="icon" disabled={isLoading} onClick={onDelete}>
      {isLoading ? <Spinner /> : <Trash />}
    </Button>
  )
}
