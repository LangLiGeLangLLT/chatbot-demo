'use client'

import { uploadFile } from '@/api/knowledge-base'
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
import { Spinner } from '@/components/ui/spinner'
import { zodResolver } from '@hookform/resolvers/zod'
import { Upload } from 'lucide-react'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'
import mime from 'mime'
import { UIText } from '@/types'

const schema = z.object({
  fileList: z.array(z.instanceof(File)).min(1),
})
const acceptExtensions = ['txt', 'pdf', 'doc', 'docx', 'png', 'jpg', 'jpeg']
const acceptMessage = `Please upload: ${acceptExtensions.join(', ')}`

export default function UploadButton({
  onUploadSuccess,
}: {
  onUploadSuccess: () => void
}) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const fileRef = React.useRef<HTMLInputElement>(null)
  const {
    control,
    handleSubmit,
    formState: { isValid },
    reset,
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      fileList: [],
    },
    mode: 'all',
  })

  async function onSubmit(values: z.infer<typeof schema>) {
    try {
      setIsLoading(true)

      await uploadFile(values.fileList)

      setIsOpen(false)
      onUploadSuccess()
      toast.success('Uploaded Successfully')
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
          if (fileRef.current) {
            fileRef.current.value = ''
          }
        }
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <Upload /> Upload
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Upload {UIText.KnowledgeBase}</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="py-4 grid gap-4">
            <div className="grid gap-3">
              <Controller
                control={control}
                name="fileList"
                render={({ field }) => (
                  <Input
                    ref={fileRef}
                    type="file"
                    onChange={(e) => {
                      if (e.target.files?.length) {
                        const file = e.target.files[0]
                        const extension =
                          mime.getExtension(mime.getType(file.name) || '') || ''

                        if (acceptExtensions.indexOf(extension) === -1) {
                          toast.warning(acceptMessage)
                          e.target.value = ''
                          field.onChange([])
                          return
                        }
                        field.onChange([file])
                      }
                    }}
                  />
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
