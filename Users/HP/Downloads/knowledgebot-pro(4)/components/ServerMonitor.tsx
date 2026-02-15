
import React, { useState, useEffect, useRef } from 'react';
import { api, LogEntry } from '../services/api';
import { backendServer } from '../services/server';

export const ServerMonitor: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [db, setDb] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'TRAFFIC' | 'LOGS' | 'DB'>('LOGS');
  const [metrics, setMetrics] = useState<any>(null);
  const [lastUpdate, setLastUpdate] = useState<number>(0);
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLogs(api.getLogs());
    setDb(backendServer.getRawDB());
    setMetrics(backendServer.getSystemMetrics());

    const unsubscribe = api.subscribe((log) => {
      setLogs(prev => [...prev, log]);
      setDb(backendServer.getRawDB());
      setLastUpdate(Date.now());
    });

    const interval = setInterval(() => setMetrics(backendServer.getSystemMetrics()), 1000);
    return () => { unsubscribe(); clearInterval(interval); };
  }, []);

  useEffect(() => {
    if (activeTab === 'LOGS') {
      logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, activeTab]);

  return (
    <div className="flex flex-col h-full text-slate-400 bg-slate-950 font-mono">
      {/* Header with System Health */}
      <div className="p-6 bg-slate-900/50 border-b border-white/5 space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_12px_rgba(99,102,241,0.8)]"></div>
            <span className="text-[11px] font-black uppercase tracking-[0.3em] text-indigo-400">Production Runtime</span>
          </div>
          <span className="text-[9px] font-bold text-slate-500 bg-white/5 px-2 py-1 rounded">NODE_ENV: production</span>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="p-3 bg-white/5 rounded-xl border border-white/5">
            <div className="text-[8px] uppercase tracking-widest text-slate-500 mb-1">CPU LOAD</div>
            <div className="text-xs font-black text-emerald-400">{(Math.random() * 5 + 1).toFixed(1)}%</div>
          </div>
          <div className="p-3 bg-white/5 rounded-xl border border-white/5">
            <div className="text-[8px] uppercase tracking-widest text-slate-500 mb-1">RAM USED</div>
            <div className="text-xs font-black text-indigo-400">242.1 MB</div>
          </div>
          <div className="p-3 bg-white/5 rounded-xl border border-white/5">
            <div className="text-[8px] uppercase tracking-widest text-slate-500 mb-1">REQ/SEC</div>
            <div className="text-xs font-black text-amber-400">{(logs.length / Math.max(1, metrics?.uptime || 1) * 10).toFixed(2)}</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex bg-slate-900/30 px-4 pt-4 gap-4 border-b border-white/5">
        <button onClick={() => setActiveTab('LOGS')} className={`pb-3 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 ${activeTab === 'LOGS' ? 'border-indigo-500 text-white' : 'border-transparent text-slate-600 hover:text-slate-400'}`}>Request Log</button>
        <button onClick={() => setActiveTab('DB')} className={`pb-3 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 ${activeTab === 'DB' ? 'border-indigo-500 text-white' : 'border-transparent text-slate-600 hover:text-slate-400'}`}>Database</button>
        <button onClick={() => setActiveTab('TRAFFIC')} className={`pb-3 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 ${activeTab === 'TRAFFIC' ? 'border-indigo-500 text-white' : 'border-transparent text-slate-600 hover:text-slate-400'}`}>Edge Traffic</button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden relative">
        {activeTab === 'LOGS' ? (
          <div className="h-full overflow-y-auto p-5 space-y-2 monitor-scroll bg-black/20">
            {logs.length === 0 && <div className="text-slate-800 italic mt-8 text-center text-xs">Waiting for incoming traffic...</div>}
            {logs.map((log, i) => (
              <div key={i} className="flex gap-4 group hover:bg-white/5 p-1 rounded transition-colors">
                <span className="text-slate-700 shrink-0">{log.timestamp.split(' ')[0]}</span>
                <span className={`font-black shrink-0 ${
                  log.method === 'POST' ? 'text-indigo-400' : 
                  log.method === 'PUT' ? 'text-amber-400' :
                  log.method === 'DELETE' ? 'text-red-400' : 'text-emerald-400'
                }`}>{log.method}</span>
                <span className="text-slate-300 truncate flex-1">{log.endpoint}</span>
                <span className={`font-bold ${log.status < 300 ? 'text-emerald-500' : 'text-red-500'}`}>{log.status}</span>
              </div>
            ))}
            <div ref={logsEndRef} />
          </div>
        ) : activeTab === 'DB' ? (
          <div className="h-full overflow-y-auto p-6 space-y-8 monitor-scroll">
             <div className="space-y-4">
               <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex justify-between items-center">
                 <span>TBL_USERS</span>
                 <span className="bg-slate-800 px-2 py-0.5 rounded text-indigo-400">{db?.users?.length || 0} ROWS</span>
               </h4>
               <div className="border border-white/5 rounded-xl overflow-hidden bg-white/5">
                 {db?.users?.map((u: any) => (
                   <div key={u.id} className="p-3 border-b border-white/5 flex justify-between items-center text-[10px]">
                     <span className="text-slate-300 font-bold">{u.name}</span>
                     <span className="text-slate-600">{u.email}</span>
                   </div>
                 ))}
               </div>
             </div>

             <div className="space-y-4">
               <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex justify-between items-center">
                 <span>TBL_KNOWLEDGE</span>
                 <span className="bg-slate-800 px-2 py-0.5 rounded text-indigo-400">{db?.documents?.length || 0} BLOCKS</span>
               </h4>
               <div className="border border-white/5 rounded-xl overflow-hidden bg-white/5">
                 {db?.documents?.map((d: any) => (
                   <div key={d.id} className="p-3 border-b border-white/5 flex justify-between items-center text-[10px]">
                     <span className="text-slate-300 font-bold truncate max-w-[200px]">{d.title}</span>
                     <span className="text-emerald-600 font-black">{d.content.length}B</span>
                   </div>
                 ))}
               </div>
             </div>
          </div>
        ) : (
          <div className="h-full p-8 flex flex-col items-center justify-center text-center">
            <div className="w-full max-w-[280px] space-y-6">
              <div className="aspect-square bg-slate-900 rounded-full border-2 border-indigo-500/20 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-indigo-500/5 animate-pulse"></div>
                <div className="relative text-indigo-400 font-black text-[10px] tracking-widest">MAP_ENGINE_V2</div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-600">US-EAST-1</span>
                  <span className="text-emerald-500 font-bold">OPTIMAL</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-600">EU-WEST-2</span>
                  <span className="text-emerald-500 font-bold">OPTIMAL</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-600">AP-SOUTH-1</span>
                  <span className="text-amber-500 font-bold">LATENCY+</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-indigo-600/10 border-t border-indigo-500/20 text-center">
        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em]">Encrypted Session In Progress</span>
      </div>
    </div>
  );
};
