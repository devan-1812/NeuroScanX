import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { InputSection } from './components/InputSection';
import { ResultsSection } from './components/ResultsSection';
import { LandingPage } from './components/LandingPage';
import { Auth } from './components/Auth';
import { analyzeSymptoms } from './services/geminiService';
import { AnalysisResult } from './types';

type PageView = 'landing' | 'login' | 'signup' | 'dashboard' | 'results';

const App: React.FC = () => {
  const [view, setView] = useState<PageView>('landing');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(true);
  const [userEmail, setUserEmail] = useState<string | undefined>(undefined);

  // Theme Logic
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(prev => !prev);

  // Auth Logic
  const handleAuthSuccess = (email: string) => {
    setUserEmail(email);
    setView('dashboard');
  };

  const handleLogout = () => {
    setUserEmail(undefined);
    setResult(null);
    setView('landing');
  };

  // Analysis Logic
  const handleAnalysis = async (data: { symptoms: string; history: string; images: File[]; voiceTranscript: string }) => {
    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const analysisData = await analyzeSymptoms(data.symptoms, data.history, data.images, data.voiceTranscript);
      setResult(analysisData);
      setView('results');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setError("Unable to complete analysis. " + (err.message || ""));
    } finally {
      setIsAnalyzing(false);
    }
  };

  // --- RENDER VIEWS ---

  if (view === 'landing') {
    return (
      <LandingPage 
        onLogin={() => setView('login')} 
        onSignup={() => setView('signup')}
        toggleTheme={toggleTheme}
        isDark={isDark}
      />
    );
  }

  if (view === 'login' || view === 'signup') {
    return (
      <Auth 
        mode={view} 
        onAuthSuccess={handleAuthSuccess}
        onSwitchMode={(mode) => setView(mode)}
        onBack={() => setView('landing')}
      />
    );
  }

  // Dashboard View (Input & Results)
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300">
      {/* Background ambient glow for dashboard */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-50 dark:opacity-100 transition-opacity">
         <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-200 dark:bg-sky-900/20 rounded-full blur-[100px]" />
         <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-200 dark:bg-indigo-900/10 rounded-full blur-[100px]" />
      </div>

      <Header 
        isDark={isDark} 
        toggleTheme={toggleTheme} 
        onLogout={handleLogout}
        userEmail={userEmail}
      />

      <main className="flex-1 container mx-auto px-4 py-8 relative z-10">
        
        {error && (
          <div className="max-w-2xl mx-auto mb-6 bg-red-100 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 p-4 rounded-xl flex items-center gap-3 animate-fade-in shadow-sm">
            <div className="w-2 h-2 bg-red-500 rounded-full shadow-[0_0_10px_red]" />
            <p>{error}</p>
          </div>
        )}

        {view === 'dashboard' && (
          <div className="animate-fade-in-up">
            <div className="mb-8 text-center max-w-2xl mx-auto">
               <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Hello, {userEmail?.split('@')[0] || 'Patient'}</h2>
               <p className="text-slate-500 dark:text-slate-400">Ready for your AI health assessment? Describe your symptoms below.</p>
            </div>
            <InputSection onAnalyze={handleAnalysis} isAnalyzing={isAnalyzing} />
          </div>
        )}

        {view === 'results' && result && (
          <ResultsSection result={result} onBack={() => setView('dashboard')} />
        )}

      </main>

      <footer className="py-6 border-t border-slate-200 dark:border-slate-900 text-center relative z-10">
        <p className="text-[10px] text-slate-500 uppercase tracking-widest">
          NeuroScanX System • AI Support Tool • <span className="text-red-500 font-bold">Emergency? Call 911</span>
        </p>
      </footer>
    </div>
  );
};

export default App;