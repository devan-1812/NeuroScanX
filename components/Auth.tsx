import React, { useState } from 'react';
import { Activity, Mail, Lock, User, ArrowRight, ArrowLeft } from 'lucide-react';

interface AuthProps {
  mode: 'login' | 'signup';
  onAuthSuccess: (email: string) => void;
  onSwitchMode: (mode: 'login' | 'signup') => void;
  onBack: () => void;
}

export const Auth: React.FC<AuthProps> = ({ mode, onAuthSuccess, onSwitchMode, onBack }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate auth success
    if (email && password) {
       onAuthSuccess(email);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 transition-colors duration-300">
      
      <button 
        onClick={onBack}
        className="absolute top-8 left-8 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white flex items-center gap-2 text-sm font-medium"
      >
        <ArrowLeft size={16} /> Back to Home
      </button>

      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl dark:shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-slate-200 dark:border-slate-800 p-8 md:p-12 animate-fade-in-up">
        
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-gradient-to-br from-sky-500 to-indigo-600 rounded-2xl shadow-lg mb-6">
            <Activity size={32} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            {mode === 'login' 
              ? 'Enter your credentials to access your dashboard.' 
              : 'Join NeuroScanX for AI-powered health insights.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {mode === 'signup' && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-sky-500 text-slate-900 dark:text-white transition-all"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-sky-500 text-slate-900 dark:text-white transition-all"
                placeholder="name@example.com"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-sky-500 text-slate-900 dark:text-white transition-all"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full py-4 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-xl shadow-lg shadow-sky-500/20 transition-all flex items-center justify-center gap-2 mt-4"
          >
            {mode === 'login' ? 'Sign In' : 'Sign Up'} <ArrowRight size={18} />
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => onSwitchMode(mode === 'login' ? 'signup' : 'login')}
              className="text-sky-500 font-bold hover:underline"
            >
              {mode === 'login' ? 'Sign Up' : 'Log In'}
            </button>
          </p>
        </div>

      </div>
    </div>
  );
};