
import React from 'react';

interface LandingPageProps {
  onNavigate: (page: 'landing' | 'admin' | 'auth') => void;
  openChat: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, openChat }) => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-24 pb-40 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-black uppercase tracking-[0.2em] mb-8 animate-bounce">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-ping"></span>
              Gemini 3 Flash Engine Integrated
            </div>
            
            <h1 className="text-6xl md:text-7xl font-[900] text-slate-950 tracking-tight mb-8 leading-[1.05]">
              Intelligence that <span className="gradient-text">Understands</span> Your Business.
            </h1>
            
            <p className="text-xl text-slate-600 mb-12 leading-relaxed font-medium max-w-2xl">
              Transform your proprietary data into a high-performance RAG knowledge base. Deploy instant, accurate, and secure AI support in under 60 seconds.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-5 justify-center w-full max-w-lg">
              <button 
                onClick={() => onNavigate('admin')}
                className="flex-1 px-8 py-5 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-200 hover:scale-105 active:scale-95 flex items-center justify-center gap-3"
              >
                Launch Console
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </button>
              <button 
                onClick={openChat}
                className="flex-1 px-8 py-5 bg-white text-slate-900 border-2 border-slate-100 rounded-2xl font-bold text-lg hover:border-indigo-600 transition-all shadow-lg active:scale-95"
              >
                View Live Demo
              </button>
            </div>

            <div className="mt-20 flex items-center gap-8 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Trusted By</span>
              <div className="flex gap-10 items-center">
                <div className="font-black text-slate-800 text-xl tracking-tighter italic">AURORA</div>
                <div className="font-black text-slate-800 text-xl tracking-tighter">HEXA<span className="text-indigo-600">ON</span></div>
                <div className="font-black text-slate-800 text-xl tracking-tighter">VELO.</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Background blobs */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-200/20 rounded-full blur-[120px] -z-0"></div>
        <div className="absolute -bottom-40 left-0 w-96 h-96 bg-violet-200/20 rounded-full blur-[100px] -z-0"></div>
      </section>

      {/* Stats Section - High Contrast */}
      <section className="bg-slate-950 py-16 text-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { label: 'Network Requests', val: '8.4M+', color: 'text-indigo-400' },
              { label: 'Mean Latency', val: '142ms', color: 'text-emerald-400' },
              { label: 'Uptime SLA', val: '99.99%', color: 'text-amber-400' },
              { label: 'Data Ingested', val: '42 PB', color: 'text-indigo-400' },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center md:items-start">
                <div className={`text-4xl font-black mb-2 ${stat.color} tracking-tighter`}>{stat.val}</div>
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid - Modern Styling */}
      <section className="py-32 max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
          <div className="max-w-2xl">
            <h2 className="text-4xl font-black text-slate-950 mb-6 leading-tight">Engineered for <span className="text-indigo-600">Zero-Hallucination</span> Output.</h2>
            <p className="text-lg text-slate-600 font-medium">Unlike generic LLMs, KnowledgeBot Pro strictly adheres to your verified data sources, ensuring reliability for enterprise operations.</p>
          </div>
          <button className="px-6 py-3 bg-slate-100 text-slate-900 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all">Documentation &rarr;</button>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: 'Vector Indexing',
              desc: 'State-of-the-art semantic search indexing transforms raw text into multi-dimensional vectors for ultra-precise matching.',
              icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
            },
            {
              title: 'Privacy First',
              desc: 'Your data is encrypted at rest and in transit. We simulate air-gapped security protocols to protect your proprietary secrets.',
              icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z'
            },
            {
              title: 'Global Delivery',
              desc: 'Deploy your knowledge engine across multiple geographic regions with automatic failover and load balancing.',
              icon: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9'
            }
          ].map((feature, i) => (
            <div key={i} className="p-10 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-indigo-100 transition-all group hover:-translate-y-2 duration-300">
              <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} /></svg>
              </div>
              <h3 className="text-2xl font-black text-slate-950 mb-4">{feature.title}</h3>
              <p className="text-slate-500 leading-relaxed font-medium">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Professional CTA */}
      <section className="py-24 px-6 mb-20">
        <div className="max-w-6xl mx-auto bg-indigo-600 rounded-[3rem] p-16 text-center text-white relative overflow-hidden shadow-[0_40px_100px_-20px_rgba(79,70,229,0.5)]">
          <div className="relative z-10">
            <h2 className="text-5xl font-black mb-8 tracking-tighter">Scale Your Intelligence Today.</h2>
            <p className="text-indigo-100 text-xl mb-12 max-w-2xl mx-auto font-medium">
              Start with our pro tier and unlock unlimited documents, prioritized Gemini 3 processing, and 24/7 dedicated support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => onNavigate('auth')}
                className="bg-white text-indigo-600 px-12 py-5 rounded-2xl font-black text-lg hover:scale-105 transition-all shadow-2xl active:scale-95"
              >
                Create Enterprise Account
              </button>
              <button className="bg-indigo-700/50 backdrop-blur text-white border border-indigo-400/30 px-12 py-5 rounded-2xl font-black text-lg hover:bg-indigo-500 transition-all active:scale-95">
                Talk to Sales
              </button>
            </div>
          </div>
          
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl"></div>
        </div>
      </section>
    </div>
  );
};
