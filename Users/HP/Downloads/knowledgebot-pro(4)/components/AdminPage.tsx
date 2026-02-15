
import React, { useState, useEffect } from 'react';
import { knowledgeBaseService } from '../services/knowledgeBaseService';
import { backendServer } from '../services/server';
import { KnowledgeDocument, User } from '../types';

export const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'KNOWLEDGE' | 'USERS'>('KNOWLEDGE');
  const [docs, setDocs] = useState<KnowledgeDocument[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingDoc, setEditingDoc] = useState<KnowledgeDocument | null>(null);
  
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newSignature, setNewSignature] = useState('');
  
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setIsLoading(true);
    if (activeTab === 'KNOWLEDGE') {
      const data = await knowledgeBaseService.getDocuments();
      setDocs(data);
    } else {
      const data = backendServer.fetchAllUsers();
      setUsers(data);
    }
    setIsLoading(false);
  };

  const handleOpenEdit = (doc: KnowledgeDocument) => {
    setEditingDoc(doc);
    setNewTitle(doc.title);
    setNewContent(doc.content);
    setNewSignature(doc.authorSignature || '');
    setShowModal(true);
  };

  const handleOpenAdd = () => {
    setEditingDoc(null);
    setNewTitle('');
    setNewContent('');
    setNewSignature('');
    setShowModal(true);
  };

  const handleMockUpload = async () => {
    setIsProcessing(true);
    // Simulate picking a file and extraction latency
    setTimeout(async () => {
      const mockFileName = `Enterprise_Strategy_${Math.floor(Math.random()*100)}.pdf`;
      const mockExtractedText = "This document outlines the strategic objectives for KnowledgeBot Pro. Our primary mission is to democratize intelligence via RAG (Retrieval Augmented Generation) architecture. We aim for 100% uptime and sub-200ms response times.";
      
      await knowledgeBaseService.addDocument({
        title: mockFileName,
        content: mockExtractedText,
        type: 'file',
        authorSignature: 'OCR_AUTO_EXTRACT'
      });
      await loadData();
      setIsProcessing(false);
    }, 1500);
  };

  const handleSave = async () => {
    if (!newTitle || !newContent || isProcessing) return;
    
    setIsProcessing(true);
    try {
      if (editingDoc) {
        await knowledgeBaseService.updateDocument(editingDoc.id, {
          title: newTitle,
          content: newContent,
          authorSignature: newSignature
        });
      } else {
        await knowledgeBaseService.addDocument({
          title: newTitle,
          content: newContent,
          type: 'text',
          authorSignature: newSignature || 'SYSTEM'
        });
      }
      await loadData();
      setShowModal(false);
    } catch (err) {
      alert("System failed to commit changes to database.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Confirm permanent record deletion?')) {
      try {
        await knowledgeBaseService.removeDocument(id);
        setDocs(prev => prev.filter(d => d.id !== id));
      } catch (err) {
        alert("Failed to delete record.");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Accessing Vault...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">Intelligence Hub</h1>
          <p className="text-slate-500 font-medium italic">Secure Administrative Portal 2026</p>
        </div>
        
        <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl">
          <button 
            onClick={() => setActiveTab('KNOWLEDGE')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'KNOWLEDGE' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Knowledge Base
          </button>
          <button 
            onClick={() => setActiveTab('USERS')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'USERS' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Client Vault
          </button>
        </div>
      </div>

      {activeTab === 'KNOWLEDGE' ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-4">
             <h2 className="text-lg font-black text-slate-800 uppercase tracking-widest">Storage Blocks</h2>
             <div className="flex gap-3">
               <button 
                  onClick={handleMockUpload}
                  disabled={isProcessing}
                  className="bg-white text-slate-700 border border-slate-200 px-6 py-3 rounded-xl font-bold hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm active:scale-95 text-sm"
                >
                  <svg className="h-5 w-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                  {isProcessing ? 'Extracting...' : 'Upload PDF'}
                </button>
               <button 
                  onClick={handleOpenAdd}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg active:scale-95 text-sm"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                  New Block
                </button>
             </div>
          </div>
          
          {docs.length === 0 ? (
            <div className="text-center py-32 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 mb-2">No Records Found</h3>
              <p className="text-slate-500 max-w-sm mx-auto">Database is clean. Create your first intelligence block to begin RAG processing.</p>
            </div>
          ) : (
            docs.map(doc => (
              <div key={doc.id} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row items-start justify-between gap-6 group">
                <div className="flex gap-6 w-full">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                    doc.type === 'file' ? 'bg-amber-50 text-amber-600' : 'bg-indigo-50 text-indigo-600'
                  }`}>
                    <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20"><path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"/></svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">{doc.title}</h3>
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-400 text-[9px] font-black uppercase rounded tracking-widest">{doc.type}</span>
                    </div>
                    <div className="flex items-center gap-4 mb-4">
                      <p className="text-xs font-semibold text-slate-400">{new Date(doc.createdAt).toLocaleDateString()}</p>
                      {doc.authorSignature && (
                        <span className="text-xs font-bold text-indigo-500 italic">By: {doc.authorSignature}</span>
                      )}
                    </div>
                    <p className="text-slate-600 line-clamp-2 text-sm leading-relaxed max-w-3xl">{doc.content}</p>
                  </div>
                </div>
                
                <div className="flex gap-3 shrink-0">
                  <button onClick={() => handleOpenEdit(doc)} className="px-6 py-3 bg-slate-100 text-slate-600 hover:bg-indigo-600 hover:text-white rounded-xl transition-all font-bold text-sm">Edit</button>
                  <button onClick={() => handleDelete(doc.id)} className="p-3 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-xl transition-all font-bold text-sm">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="animate-in slide-in-from-bottom-4 duration-500">
           <div className="mb-6 flex justify-between items-center">
             <h2 className="text-lg font-black text-slate-800 uppercase tracking-widest">Client Records Folder</h2>
             <span className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest">{users.length} Active Users</span>
           </div>
           
           <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden">
             <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="bg-slate-50 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                   <th className="px-8 py-6">Identity</th>
                   <th className="px-8 py-6">Email Address</th>
                   <th className="px-8 py-6">Access Role</th>
                   <th className="px-8 py-6 text-right">Registered On</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                 {users.map(u => (
                   <tr key={u.id} className="hover:bg-slate-50/50 transition-colors group">
                     <td className="px-8 py-6">
                       <div className="flex items-center gap-4">
                         <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-xs font-black text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-all">
                           {u.name[0].toUpperCase()}
                         </div>
                         <div className="font-bold text-slate-900">{u.name}</div>
                       </div>
                     </td>
                     <td className="px-8 py-6">
                       <code className="text-xs bg-slate-50 px-2 py-1 rounded-md text-slate-500">{u.email}</code>
                     </td>
                     <td className="px-8 py-6">
                       <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                         u.role === 'admin' ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'
                       }`}>
                         {u.role}
                       </span>
                     </td>
                     <td className="px-8 py-6 text-right font-medium text-slate-400 text-xs">
                       {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'LEGACY RECORD'}
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </div>
      )}

      {showModal && (activeTab === 'KNOWLEDGE') && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                {editingDoc ? 'Update Record' : 'Add Intelligence'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white rounded-xl transition-all text-slate-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="p-8 space-y-6">
              <input 
                type="text" 
                placeholder="Official Document Title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full p-4.5 bg-slate-50 border border-slate-200 rounded-2xl focus:border-indigo-600 outline-none transition-all font-bold"
              />
              <textarea 
                rows={6}
                placeholder="Intelligence data content..."
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                className="w-full p-4.5 bg-slate-50 border border-slate-200 rounded-2xl focus:border-indigo-600 outline-none transition-all font-medium resize-none"
              ></textarea>
              <input 
                type="text" 
                placeholder="Author / Sign-off"
                value={newSignature}
                onChange={(e) => setNewSignature(e.target.value)}
                className="w-full p-4.5 bg-white border-2 border-slate-200 rounded-2xl focus:border-indigo-600 outline-none transition-all font-bold"
              />
            </div>

            <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end gap-4">
              <button onClick={() => setShowModal(false)} className="px-6 py-3 text-slate-500 font-bold">Cancel</button>
              <button 
                onClick={handleSave}
                disabled={isProcessing || !newTitle || !newContent}
                className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-xl active:scale-95"
              >
                {isProcessing ? 'Saving...' : (editingDoc ? 'Apply Changes' : 'Index Data')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
