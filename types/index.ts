export enum UIText {
  AppName = 'Super AI',
  KnowledgeBase = 'Knowledge Base',
  AIChat = 'AI Chat',
}

export type KnowledgeBase = Partial<{
  id: number
  title: string
  name: string
  content: string
}>
