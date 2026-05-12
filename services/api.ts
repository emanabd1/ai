
import { backendServer } from './server';

const LATENCY = 400;

export type LogEntry = {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'WS';
  endpoint: string;
  status: number;
  timestamp: string;
  payload?: any;
};

const listeners: ((log: LogEntry) => void)[] = [];
const logs: LogEntry[] = [];

const addLog = (log: LogEntry) => {
  logs.push(log);
  listeners.forEach(l => l(log));
};

export const api = {
  subscribe: (callback: (log: LogEntry) => void) => {
    listeners.push(callback);
    return () => {
      const idx = listeners.indexOf(callback);
      if (idx > -1) listeners.splice(idx, 1);
    };
  },
  getLogs: () => [...logs],

  post: async (endpoint: string, data: any) => {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          let res;
          if (endpoint === '/ai/chat') {
            res = await backendServer.aiChat(data.prompt, data.history);
            addLog({ method: 'POST', endpoint, status: 200, timestamp: new Date().toLocaleTimeString(), payload: data.prompt });
            resolve(res);
          } else if (endpoint === '/auth/login') {
            res = backendServer.authenticate(data.email, data.password);
            if (res) {
              addLog({ method: 'POST', endpoint, status: 200, timestamp: new Date().toLocaleTimeString(), payload: data.email });
              resolve(res);
            } else {
              addLog({ method: 'POST', endpoint, status: 401, timestamp: new Date().toLocaleTimeString() });
              reject(new Error("Unauthorized"));
            }
          } else if (endpoint === '/auth/signup') {
            res = backendServer.register(data.name, data.email, data.password);
            addLog({ method: 'POST', endpoint, status: 201, timestamp: new Date().toLocaleTimeString(), payload: { email: data.email } });
            resolve(res);
          } else if (endpoint === '/knowledge/create') {
            res = backendServer.commitDocument(data);
            addLog({ method: 'POST', endpoint, status: 201, timestamp: new Date().toLocaleTimeString(), payload: data.title });
            resolve(res);
          }
        } catch (e: any) {
          addLog({ method: 'POST', endpoint, status: 500, timestamp: new Date().toLocaleTimeString() });
          reject(e);
        }
      }, LATENCY);
    });
  },

  put: async (endpoint: string, data: any) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const id = endpoint.split('/').pop();
          if (endpoint.startsWith('/knowledge/update') && id) {
            const res = backendServer.modifyDocument(id, data);
            addLog({ method: 'PUT', endpoint, status: 200, timestamp: new Date().toLocaleTimeString(), payload: data.title || id });
            resolve(res);
          }
        } catch (e) {
          addLog({ method: 'PUT', endpoint, status: 500, timestamp: new Date().toLocaleTimeString() });
          reject(e);
        }
      }, LATENCY);
    });
  },

  get: async (endpoint: string) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (endpoint === '/knowledge/list') {
          resolve(backendServer.fetchDocuments());
          addLog({ method: 'GET', endpoint, status: 200, timestamp: new Date().toLocaleTimeString() });
        }
      }, LATENCY);
    });
  },

  delete: async (endpoint: string) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const id = endpoint.split('/').pop();
          if (id) {
            backendServer.purgeDocument(id);
            addLog({ method: 'DELETE', endpoint, status: 200, timestamp: new Date().toLocaleTimeString(), payload: { target_id: id } });
            resolve({ success: true });
          }
        } catch (e) {
          addLog({ method: 'DELETE', endpoint, status: 500, timestamp: new Date().toLocaleTimeString() });
          reject(e);
        }
      }, LATENCY);
    });
  }
};
