'use client'

import React from 'react'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { KnowledgeBase } from '@/types'
import { loadKnowledgeBases } from '@/api/knowledge-base'
import { Empty, EmptyTitle } from '@/components/ui/empty'
import AddResourceButton from './_components/add-resource-button'
import EditResourceButton from './_components/edit-resource-button'
import UploadResourceButton from './_components/upload-resource-button'
import DeleteResourceButton from './_components/delete-resource-button'
import RefreshResourceButton from './_components/refresh-resource-button'

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
        <RefreshResourceButton onRefreshSuccess={onRefresh} />
        <AddResourceButton onAddSuccess={init} />
        <UploadResourceButton onUploadSuccess={init} />
      </div>
      <div className="flex-1 flex flex-col">
        {isLoading ? (
          <Skeleton />
        ) : !knowledgeBases?.length ? (
          <div className="flex-1 flex justify-center items-center">
            <Empty>
              <EmptyTitle>No Resources Found</EmptyTitle>
            </Empty>
          </div>
        ) : (
          <div className="grid auto-rows-min gap-4 md:grid-cols-4">
            {knowledgeBases?.map((knowledgeBase) => (
              <Card key={knowledgeBase.id} className="gap-2 pb-2">
                <CardHeader>
                  <CardTitle>{knowledgeBase.name}</CardTitle>
                  <CardDescription className="truncate">
                    {knowledgeBase.content}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="justify-end">
                  <EditResourceButton
                    knowledgeBase={knowledgeBase}
                    onEditSuccess={init}
                  />
                  <DeleteResourceButton
                    knowledgeBase={knowledgeBase}
                    onDeleteSuccess={init}
                  />
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
