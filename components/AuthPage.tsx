
import React, { useState } from 'react';
import { authService } from '../services/authService';
import { User } from '../types';

interface AuthPageProps {
  onLoginSuccess: (user: User) => void;
}

interface MockAccount {
  email: string;
  name: string;
  img: string;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [oauthProvider, setOauthProvider] = useState<'google' | 'facebook' | 'github' | null>(null);
  const [oauthStep, setOauthStep] = useState<'IDLE' | 'PICKER' | 'LOADING'>('IDLE');
  const [error, setError] = useState('');

  const mockAccounts: MockAccount[] = [
    { email: 'emanabdulsemed4398@gmail.com', name: 'Eman Abdulsemed', img: 'EA' },
    { email: 'personal.user@gmail.com', name: 'Personal Account', img: 'PU' },
    { email: 'work.identity@enterprise.com', name: 'Work Identity', img: 'WI' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      let user: User;
      if (isLogin) {
        user = await authService.login(email, password);
      } else {
        user = await authService.signup(name, email, password);
      }
      onLoginSuccess(user);
    } catch (err: any) {
      setError(err.message || 'Authentication failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const startOAuth = (provider: 'google' | 'facebook' | 'github') => {
    setOauthProvider(provider);
    setOauthStep('PICKER');
  };

  const handleAccountSelect = async (account: MockAccount) => {
    setOauthStep('LOADING');
    setIsLoading(true);

    // Simulate Provider Handshake
    setTimeout(async () => {
      try {
        let user: User;
        try {
          // Attempt login first
          user = await authService.login(account.email, 'oauth_token_placeholder');
        } catch {
          // If not exists, sign up automatically
          user = await authService.signup(account.name, account.email, 'oauth_token_placeholder');
        }
        onLoginSuccess(user);
      } catch (err: any) {
        setError(`${oauthProvider} authentication failed.`);
        setOauthStep('IDLE');
      } finally {
        setIsLoading(false);
        setOauthProvider(null);
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50/50">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">K</div>
            <span className="text-2xl font-bold text-slate-900 tracking-tight">KnowledgeBot Pro</span>
          </div>
        </div>
        
        <div className="bg-white rounded-[2.5rem] shadow-2xl p-10 border border-slate-100 relative overflow-hidden min-h-[500px] flex flex-col">
          
          {/* STEP 2: ACCOUNT PICKER MODAL */}
          {oauthStep === 'PICKER' && (
            <div className="absolute inset-0 z-50 bg-white flex flex-col p-8 animate-in slide-in-from-bottom-4 duration-300">
              <button 
                onClick={() => setOauthStep('IDLE')}
                className="self-start mb-6 text-slate-400 hover:text-slate-900 flex items-center gap-2 text-xs font-bold uppercase tracking-widest"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
                Back
              </button>
              
              <div className="text-center mb-8">
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl flex items-center justify-center shadow-sm border border-slate-100">
                  {oauthProvider === 'google' && (
                    <svg className="w-6 h-6" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    </svg>
                  )}
                  {oauthProvider === 'facebook' && <svg className="w-6 h-6 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>}
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Choose an account</h3>
                <p className="text-slate-500 text-sm mt-1">to continue to <span className="font-bold text-indigo-600">KnowledgeBot</span></p>
              </div>

              <div className="space-y-2 overflow-y-auto pr-2">
                {mockAccounts.map((acc) => (
                  <button 
                    key={acc.email}
                    onClick={() => handleAccountSelect(acc)}
                    className="w-full flex items-center gap-4 p-4 rounded-2xl border border-slate-100 hover:border-indigo-600 hover:bg-slate-50 transition-all text-left group"
                  >
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-xs font-black text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600">
                      {acc.img}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-slate-900 truncate">{acc.name}</div>
                      <div className="text-[11px] text-slate-400 truncate">{acc.email}</div>
                    </div>
                  </button>
                ))}
                <button className="w-full flex items-center gap-4 p-4 rounded-2xl border border-dashed border-slate-200 hover:border-slate-400 transition-all text-left">
                  <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                  </div>
                  <div className="text-sm font-bold text-slate-500">Use another account</div>
                </button>
              </div>
              
              <div className="mt-auto pt-6 text-[10px] text-slate-400 leading-relaxed">
                To continue, {oauthProvider} will share your name, email address, and profile picture with KnowledgeBot Pro.
              </div>
            </div>
          )}

          {/* STEP 3: LOADING OVERLAY */}
          {oauthStep === 'LOADING' && (
            <div className="absolute inset-0 z-[60] bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-300">
              <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-6"></div>
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest">Verifying Identity</h3>
              <p className="text-slate-500 text-sm mt-2">Securely synchronizing with {oauthProvider} servers...</p>
            </div>
          )}

          {/* STEP 1: INITIAL AUTH FORM */}
          <div className="flex-1 flex flex-col">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className="text-slate-500 text-sm font-medium">
                {isLogin 
                  ? 'Sign in to access your intelligence dashboard.' 
                  : 'Get started with KnowledgeBot Pro today.'}
              </p>
            </div>

            {/* Social Auth Buttons */}
            <div className="grid grid-cols-1 gap-3 mb-8">
              <button 
                onClick={() => startOAuth('google')}
                disabled={isLoading}
                className="flex items-center justify-center gap-3 w-full py-3 px-4 bg-white border border-slate-200 rounded-2xl font-bold text-slate-700 hover:bg-slate-50 transition-all active:scale-[0.98] shadow-sm"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
              </button>
              <button 
                onClick={() => startOAuth('facebook')}
                disabled={isLoading}
                className="flex items-center justify-center gap-3 w-full py-3 px-4 bg-[#1877F2] rounded-2xl font-bold text-white hover:bg-[#166fe5] transition-all active:scale-[0.98] shadow-md shadow-blue-100"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                Continue with Facebook
              </button>
            </div>

            <div className="flex items-center gap-4 mb-8">
              <div className="flex-1 h-px bg-slate-100"></div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">OR</span>
              <div className="flex-1 h-px bg-slate-100"></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1 block">Full Name</label>
                  <input 
                    type="text" 
                    required={!isLogin}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all placeholder:text-slate-300 font-medium text-sm"
                  />
                </div>
              )}
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1 block">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all placeholder:text-slate-300 font-medium text-sm"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1 block">Password</label>
                <input 
                  type="password" 
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all placeholder:text-slate-300 font-medium text-sm"
                />
              </div>

              {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold border border-red-100 animate-in shake duration-300">
                  {error}
                </div>
              )}

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full py-4.5 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 disabled:opacity-50 active:scale-[0.98] mt-2"
              >
                {isLoading && oauthStep === 'IDLE' ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Initializing...
                  </span>
                ) : (isLogin ? 'Log In' : 'Create Account')}
              </button>
            </form>

            <div className="mt-auto pt-8 text-center text-sm">
              <span className="text-slate-400 font-medium">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
              </span>
              <button 
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                }}
                className="ml-2 text-indigo-600 font-bold hover:text-indigo-700 transition-colors"
              >
                {isLogin ? 'Register now' : 'Sign in here'}
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-8 flex items-center justify-center gap-2 text-slate-400">
           <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
           <p className="text-[10px] font-black uppercase tracking-widest">
            Identity Protection Enabled
           </p>
        </div>
      </div>
    </div>
  );
};
