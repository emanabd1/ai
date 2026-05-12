
import { User } from '../types';
import { api } from './api';

const SESSION_KEY = 'kb_pro_session';

export const authService = {
  login: async (email: string, password: string): Promise<User> => {
    const user = await api.post('/auth/login', { email, password }) as User;
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    return user;
  },

  signup: async (name: string, email: string, password: string): Promise<User> => {
    const user = await api.post('/auth/signup', { name, email, password }) as User;
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    return user;
  },

  logout: () => {
    localStorage.removeItem(SESSION_KEY);
  },

  getCurrentUser: (): User | null => {
    const stored = localStorage.getItem(SESSION_KEY);
    return stored ? JSON.parse(stored) : null;
  }
};
