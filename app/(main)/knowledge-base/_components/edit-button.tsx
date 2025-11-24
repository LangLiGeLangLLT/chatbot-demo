'use client'

import { updateKnowledgeBase } from '@/api/knowledge-base'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'
import { Textarea } from '@/components/ui/textarea'
import { KnowledgeBase, UIText } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { SquarePen } from 'lucide-react'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'

const schema = z.object({
  name: z.string().min(1),
  content: z.string().min(1),
})

export default function EditButton({
  knowledgeBase,
  onEditSuccess,
}: {
  knowledgeBase: KnowledgeBase
  onEditSuccess: () => void
}) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const {
    control,
    handleSubmit,
    formState: { isValid },
    reset,
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    mode: 'all',
    defaultValues: {
      name: knowledgeBase.name || '',
      content: knowledgeBase.content || '',
    },
  })

  async function onSubmit(values: z.infer<typeof schema>) {
    try {
      if (!knowledgeBase.id) return

      setIsLoading(true)

      await updateKnowledgeBase({
        id: knowledgeBase.id,
        name: values.name,
        content: values.content,
      })

      setIsOpen(false)
      onEditSuccess()
      toast.success('Updated Successfully')
    } catch {
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open)
        if (open) {
          reset()
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <SquarePen />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Edit {UIText.KnowledgeBase}</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="py-4 grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name">Name</Label>
              <Controller
                control={control}
                name="name"
                render={({ field }) => (
                  <Input {...field} id="name" autoComplete="off" />
                )}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="content">Content</Label>
              <Controller
                control={control}
                name="content"
                render={({ field }) => (
                  <Textarea {...field} id="content" className="h-60" />
                )}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isLoading || !isValid}>
              {isLoading && <Spinner />}
              Submit
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
