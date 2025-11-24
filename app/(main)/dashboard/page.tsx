'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { RefreshCcw, Trash } from 'lucide-react'
import AddResourceButton from './_components/add-resource-button'
import { KnowledgeBase } from '@/types'
import { loadKnowledgeBases } from '@/api/knowledge-base'
import { Empty, EmptyTitle } from '@/components/ui/empty'
import EditResourceButton from './_components/edit-resource-button'

export default function Page() {
  const [knowledgeBases, setKnowledgeBases] = React.useState<KnowledgeBase[]>()
  const [isLoading, setIsLoading] = React.useState(true)

  function onRefresh() {
    init()
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
        <Button onClick={onRefresh}>
          <RefreshCcw /> Refresh
        </Button>
        <AddResourceButton />
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
                  <CardTitle>{knowledgeBase.title}</CardTitle>
                  <CardDescription className="truncate">
                    {knowledgeBase.description}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="justify-end">
                  <EditResourceButton />
                  <Button variant="ghost" size="icon">
                    <Trash />
                  </Button>
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
