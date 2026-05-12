
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  createdAt?: number;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface KnowledgeDocument {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'file';
  authorSignature?: string;
  createdAt: number;
}

export interface AppState {
  currentUser: User | null;
  knowledgeBase: KnowledgeDocument[];
  chatHistory: Message[];
}
