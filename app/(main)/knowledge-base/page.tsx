'use client'

import React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { KnowledgeBase } from '@/types'
import { loadKnowledgeBases } from '@/api/knowledge-base'
import { Empty, EmptyTitle } from '@/components/ui/empty'
import CreateButton from './_components/create-button'
import EditButton from './_components/edit-button'
import UploadButton from './_components/upload-button'
import DeleteButton from './_components/delete-button'
import RefreshButton from './_components/refresh-button'
import { Button } from '@/components/ui/button'
import { Eye } from 'lucide-react'
import Link from 'next/link'

export default function Page() {
  const [knowledgeBases, setKnowledgeBases] = React.useState<KnowledgeBase[]>()
  const [isLoading, setIsLoading] = React.useState(true)

  function onRefresh(knowledgeBases: KnowledgeBase[]) {
    setKnowledgeBases(knowledgeBases)
  }

  async function init() {
    try {
      setIsLoading(true)
      const { data } = await loadKnowledgeBases()
      setKnowledgeBases(data)
    } catch {
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    init()
  }, [])

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex gap-4">
        <RefreshButton onRefreshSuccess={onRefresh} />
        <CreateButton onCreateSuccess={init} />
        <UploadButton onUploadSuccess={init} />
      </div>
      <div className="flex-1 flex flex-col">
        {isLoading ? (
          <Skeleton />
        ) : !knowledgeBases?.length ? (
          <div className="flex-1 flex justify-center items-center">
            <Empty>
              <EmptyTitle>No Knowledge Base Found</EmptyTitle>
            </Empty>
          </div>
        ) : (
          <div className="grid auto-rows-min gap-4 md:grid-cols-4">
            {knowledgeBases?.map((knowledgeBase) => (
              <Card key={knowledgeBase.id} className="gap-2 pb-2">
                <CardHeader>
                  <CardTitle className="truncate">
                    {knowledgeBase.title || knowledgeBase.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-neutral-500 line-clamp-4 font-mono">
                  {knowledgeBase.content}
                </CardContent>
                <CardFooter className="flex flex-col space-y-2">
                  <div
                    className="text-xs w-full truncate font-semibold"
                    title={knowledgeBase.name}
                  >
                    Source: {knowledgeBase.name}
                  </div>
                  <div className="ml-auto">
                    <Link
                      href={`/knowledge/${knowledgeBase.id}`}
                      target="_blank"
                    >
                      <Button variant="ghost" size="icon">
                        <Eye />
                      </Button>
                    </Link>
                    <EditButton
                      knowledgeBase={knowledgeBase}
                      onEditSuccess={init}
                    />
                    <DeleteButton
                      knowledgeBase={knowledgeBase}
                      onDeleteSuccess={init}
                    />
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function Skeleton() {
  return (
    <div className="grid auto-rows-min gap-4 md:grid-cols-4">
      {new Array(16).fill(0).map((_, i) => (
        <div key={i} className="bg-muted/50 aspect-video rounded-xl" />
      ))}
    </div>
  )
}
