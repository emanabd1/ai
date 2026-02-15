
import React, { useState } from 'react';
import { User } from '../types';
import { ServerMonitor } from './ServerMonitor';
import { ChatWidget } from './ChatWidget';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  onLogout: () => void;
  onNavigate: (page: 'landing' | 'admin' | 'auth' | 'monitor') => void;
  currentPage: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, user, onLogout, onNavigate, currentPage }) => {
  const [showMonitor, setShowMonitor] = useState(false);
  const isAdmin = user?.role === 'admin';

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 font-sans">
      {/* FRONTEND APPLICATION PANE */}
      <div className={`flex-1 flex flex-col bg-slate-50 relative overflow-hidden transition-all duration-500 ease-in-out`}>
        <header className="sticky top-0 z-[60] glass border-b border-slate-200 shrink-0">
          <div className="max-w-7xl mx-auto px-6 h-18 flex justify-between items-center py-4">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => onNavigate('landing')}>
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black shadow-indigo-200 shadow-xl group-hover:scale-110 transition-transform">K</div>
              <div>
                <span className="text-xl font-extrabold text-slate-900 tracking-tight block">KnowledgeBot</span>
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-[0.2em] -mt-1 block">Enterprise Pro 2026</span>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-8">
              <button onClick={() => onNavigate('landing')} className={`text-sm font-bold transition-colors ${currentPage === 'landing' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}>Platform</button>
              
              {/* Only show Admin-specific navigation items to Admins */}
              {isAdmin && (
                <button onClick={() => onNavigate('admin')} className={`text-sm font-bold transition-colors ${currentPage === 'admin' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}>Intelligence Hub</button>
              )}
              
              <div className="h-6 w-px bg-slate-200"></div>

              {/* LIVE CONSOLE TOGGLE - ONLY VISIBLE TO OWNER (ADMIN) */}
              {isAdmin && (
                <button 
                  onClick={() => setShowMonitor(!showMonitor)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                    showMonitor ? 'bg-slate-900 text-white shadow-lg' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                  title="Admin Only: Monitoring Console"
                >
                  <div className={`w-1.5 h-1.5 rounded-full ${showMonitor ? 'bg-green-400' : 'bg-slate-400'}`}></div>
                  Live Console
                </button>
              )}

              {user ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center text-[10px] font-black text-indigo-600 uppercase">{user.name[0]}</div>
                    <span className="text-xs font-bold text-slate-700">{user.name.split(' ')[0]}</span>
                  </div>
                  <button onClick={onLogout} className="text-xs font-black text-red-500 hover:text-red-700 uppercase tracking-wider transition-colors">Logout</button>
                </div>
              ) : (
                <button onClick={() => onNavigate('auth')} className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-xl hover:bg-indigo-600 transition-all active:scale-95">Get Started</button>
              )}
            </nav>
          </div>
        </header>

        {/* Scrollable Main Content */}
        <div className="flex-1 overflow-y-auto relative bg-mesh">
          <main className="min-h-full">
            {children}
          </main>
          
          <footer className="p-12 text-center border-t border-slate-200 bg-white/50">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">&copy; 2026 KnowledgeBot Intelligence Systems</p>
              <div className="flex gap-6">
                <span className="text-[10px] font-bold text-slate-400 uppercase cursor-pointer hover:text-indigo-600">Privacy</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase cursor-pointer hover:text-indigo-600">Compliance</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase cursor-pointer hover:text-indigo-600">Status</span>
              </div>
            </div>
          </footer>

          <ChatWidget />
        </div>
      </div>

      {/* BACKEND SERVER PANE - This is only accessible if the user is admin AND toggled it on */}
      {isAdmin && (
        <div className={`transition-all duration-500 ease-in-out border-l border-slate-800 bg-slate-950 flex flex-col shadow-2xl overflow-hidden ${
          showMonitor ? 'w-[450px] opacity-100' : 'w-0 opacity-0'
        }`}>
          <div className="min-w-[450px] h-full">
            <ServerMonitor />
          </div>
        </div>
      )}
    </div>
  );
};
