export enum UIText {
  AppName = 'Super AI',
  KnowledgeBase = 'Knowledge Base',
}

export type KnowledgeBase = Partial<{
  id: number
  name: string
  content: string
}>
