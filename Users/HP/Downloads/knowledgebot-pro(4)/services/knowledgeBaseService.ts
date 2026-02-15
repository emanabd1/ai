
import { KnowledgeDocument } from '../types';
import { api } from './api';
import { backendServer } from './server';

export const knowledgeBaseService = {
  getDocuments: async (): Promise<KnowledgeDocument[]> => {
    return await api.get('/knowledge/list') as KnowledgeDocument[];
  },

  addDocument: async (doc: Omit<KnowledgeDocument, 'id' | 'createdAt'>): Promise<KnowledgeDocument> => {
    return await api.post('/knowledge/create', doc) as KnowledgeDocument;
  },

  updateDocument: async (id: string, updates: Partial<KnowledgeDocument>): Promise<KnowledgeDocument> => {
    return await api.put(`/knowledge/update/${id}`, updates) as KnowledgeDocument;
  },

  removeDocument: async (id: string): Promise<void> => {
    await api.delete(`/knowledge/delete/${id}`);
  },

  getRelevantContext: (query: string): string => {
    const docs = backendServer.fetchDocuments();
    const q = query.toLowerCase();
    
    const relevantDocs = docs.filter(doc => 
      doc.title.toLowerCase().includes(q) || 
      doc.content.toLowerCase().includes(q)
    );

    if (relevantDocs.length === 0 && docs.length > 0) {
       return docs.map(d => d.content).join('\n\n');
    }
    return relevantDocs.map(d => d.content).join('\n\n');
  }
};
