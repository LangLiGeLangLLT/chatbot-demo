import { http } from '@/hooks/use-http'
import { KnowledgeBase } from '@/types'
import { first } from 'lodash-es'

export async function loadKnowledgeBases() {
  return http.get<KnowledgeBase[]>(`/api/knowledge-base`)
}

export async function createKnowledgeBase({
  name,
  content,
}: {
  name: string
  content: string
}) {
  return http.post<unknown>(`/api/knowledge-base`, {
    name,
    content,
  })
}

export async function updateKnowledgeBase({
  id,
  name,
  content,
}: {
  id: number
  name: string
  content: string
}) {
  return http.post<unknown>(`/api/knowledge-base`, {
    id,
    name,
    content,
  })
}

export async function deleteKnowledgeBase({
  knowledgeBaseId,
}: {
  knowledgeBaseId: number
}) {
  return http.delete<unknown>(`/api/knowledge-base/${knowledgeBaseId}`)
}

export async function uploadFile(fileList: File[]) {
  const formData = new FormData()
  const file = first(fileList)

  if (file) {
    formData.append('file', file)
  }

  return http.post<unknown>(`/api/upload-file`, formData)
}
