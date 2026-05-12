
import { KnowledgeDocument, User, Message } from '../types';
import { GoogleGenAI } from "@google/genai";

/**
 * THE BACKEND SERVER
 * Stable data persistence layer.
 * In this simulation, data is stored in LocalStorage.
 */

const DB_KEY = 'knowledge_bot_pro_stable_db';

interface Database {
  users: (User & { password: string })[];
  documents: KnowledgeDocument[];
  chatHistories: Record<string, Message[]>; // UserId -> Messages
  initialized: boolean;
}

const getDB = (): Database => {
  const data = localStorage.getItem(DB_KEY);
  if (!data) return { users: [], documents: [], chatHistories: {}, initialized: false };
  return JSON.parse(data);
};

const saveDB = (db: Database) => {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
};

// INITIALIZATION
const initializeDB = () => {
  const db = getDB();
  if (!db.initialized || db.documents.length === 0) {
    db.documents = [{
      id: 'sys_001',
      title: 'Welcome to Enterprise Intelligence 2026',
      content: 'KnowledgeBot Pro is a secure RAG platform. Your documents are indexed and stored in a private vault. You can edit or delete this message.',
      type: 'text',
      authorSignature: 'System Architect',
      createdAt: Date.now()
    }];
    db.initialized = true;
    saveDB(db);
  }
};
initializeDB();

export const backendServer = {
  getRawDB: () => getDB(),
  
  getSystemMetrics: () => ({
    uptime: Math.floor((Date.now() - (window as any).startTime) / 1000),
    storageUsed: (localStorage.getItem(DB_KEY)?.length || 0) + " B",
    platform: "NodeJS v20.11.0",
    status: "Active"
  }),

  aiChat: async (prompt: string, history: any[]) => {
    const db = getDB();
    const q = prompt.toLowerCase();
    
    const context = db.documents
      .filter(d => d.title.toLowerCase().includes(q) || d.content.toLowerCase().includes(q))
      .map(d => d.content).join('\n\n') || "General Knowledge Mode Active.";

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...history.map((h: any) => ({ 
          role: h.role === 'assistant' ? 'model' : 'user', 
          parts: [{ text: h.content }] 
        })),
        { parts: [{ text: prompt }] }
      ],
      config: {
        systemInstruction: `You are a support bot for KnowledgeBot Pro (2026 Edition). Use this context: ${context}. Keep answers professional and concise.`,
        temperature: 0.7,
      }
    });
    return response.text;
  },

  // Chat History Persistence
  saveChatHistory: (userId: string, messages: Message[]) => {
    const db = getDB();
    db.chatHistories[userId] = messages;
    saveDB(db);
  },

  getChatHistory: (userId: string): Message[] => {
    return getDB().chatHistories[userId] || [];
  },

  authenticate: (email: string, pass: string): User | null => {
    const db = getDB();
    const found = db.users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === pass);
    if (!found) return null;
    const { password: _, ...user } = found;
    return user;
  },

  register: (name: string, email: string, pass: string): User => {
    const db = getDB();
    if (db.users.find(u => u.email.toLowerCase() === email.toLowerCase())) throw new Error("User Exists");
    
    // STRICT ADMIN LOCKDOWN: Only one specific email can be admin
    const adminEmail = 'emanabdulsemed4398@gmail.com';
    const isPrimaryAdmin = email.toLowerCase() === adminEmail.toLowerCase();
    const role: 'admin' | 'user' = isPrimaryAdmin ? 'admin' : 'user';

    const newUser = {
      id: 'u_' + Math.random().toString(36).substr(2, 5),
      name: name || email.split('@')[0],
      email: email.toLowerCase(),
      password: pass,
      role,
      createdAt: Date.now()
    };
    db.users.push(newUser);
    saveDB(db);
    const { password: _, ...user } = newUser;
    return user;
  },

  fetchDocuments: (): KnowledgeDocument[] => getDB().documents,
  
  fetchAllUsers: (): User[] => {
    return getDB().users.map(({ password, ...u }) => u);
  },

  commitDocument: (doc: any): KnowledgeDocument => {
    const db = getDB();
    const newDoc = { ...doc, id: 'doc_' + Date.now(), createdAt: Date.now() };
    db.documents.push(newDoc);
    saveDB(db);
    return newDoc;
  },

  modifyDocument: (id: string, updates: any): KnowledgeDocument => {
    const db = getDB();
    const index = db.documents.findIndex(d => d.id === id);
    if (index === -1) throw new Error("Document Not Found");
    db.documents[index] = { ...db.documents[index], ...updates };
    saveDB(db);
    return db.documents[index];
  },

  purgeDocument: (id: string): boolean => {
    const db = getDB();
    db.documents = db.documents.filter(d => d.id !== id);
    saveDB(db);
    return true;
  }
};
(window as any).startTime = Date.now();
