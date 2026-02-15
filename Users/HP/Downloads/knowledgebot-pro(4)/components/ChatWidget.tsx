
import React, { useState, useRef, useEffect } from 'react';
import { geminiService } from '../services/geminiService';
import { backendServer } from '../services/server';
import { authService } from '../services/authService';
import { Message } from '../types';

interface ChatWidgetProps {
  forceOpen?: boolean;
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({ forceOpen }) => {
  const user = authService.getCurrentUser();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load history on mount
  useEffect(() => {
    if (user) {
      const history = backendServer.getChatHistory(user.id);
      if (history.length > 0) {
        setMessages(history);
      } else {
        setMessages([{ id: '1', role: 'assistant', content: "Hello! I'm your enterprise intelligence specialist. How can I help you today?", timestamp: Date.now() }]);
      }
    }
  }, [user?.id]);

  // Persist history on change
  useEffect(() => {
    if (user && messages.length > 0) {
      backendServer.saveChatHistory(user.id, messages);
    }
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (forceOpen) setIsOpen(true);
  }, [forceOpen]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    const history = messages.map(m => ({ role: m.role, content: m.content }));
    const responseText = await geminiService.sendMessage(input, history);

    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: responseText,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, botMessage]);
    setIsTyping(false);
  };

  return (
    <div className="absolute bottom-8 right-8 z-[100]">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center text-white shadow-[0_15px_35px_rgba(79,70,229,0.4)] hover:bg-indigo-700 hover:scale-105 transition-all active:scale-95 border-b-4 border-indigo-800 group"
        >
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 group-hover:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
      )}

      {/* Main Chat Window */}
      {isOpen && (
        <div className="w-[400px] h-[550px] bg-white rounded-[2.5rem] shadow-[0_25px_60px_-12px_rgba(0,0,0,0.4)] flex flex-col border border-slate-200 overflow-hidden animate-in slide-in-from-bottom-12 fade-in duration-300">
          <div className="bg-slate-900 p-5 flex items-center justify-between text-white shrink-0">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-xs shadow-inner">AI</div>
                <div>
                  <h3 className="text-sm font-bold leading-tight">Support Agent</h3>
                  <span className="text-[9px] font-black text-green-500 uppercase tracking-widest">Active Now</span>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/10 rounded-xl transition-all text-slate-400 hover:text-white"
              title="Minimize Chat"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4 chat-scroll bg-slate-50/30">
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  m.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-br-none' 
                  : 'bg-white border border-slate-100 text-slate-800 rounded-bl-none'
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-bl-none flex gap-1 shadow-sm animate-pulse">
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-75"></div>
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-white border-t border-slate-100">
            <div className="relative">
              <input
                type="text"
                placeholder="Type your question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="w-full pl-5 pr-12 py-4 bg-slate-100 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all outline-none font-medium"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="absolute right-2 top-2 bottom-2 px-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-all active:scale-95"
              >
                <svg className="h-5 w-5 rotate-90" viewBox="0 0 20 20" fill="currentColor"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
