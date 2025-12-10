import React from 'react';
import { Activity, ShieldCheck, Sun, Moon, LogOut } from 'lucide-react';

interface HeaderProps {
  isDark: boolean;
  toggleTheme: () => void;
  onLogout: () => void;
  userEmail?: string;
}

export const Header: React.FC<HeaderProps> = ({ isDark, toggleTheme, onLogout, userEmail }) => {
  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-sky-900/50 transition-colors duration-300">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-sky-500 to-indigo-600 rounded-lg shadow-lg dark:shadow-[0_0_15px_rgba(14,165,233,0.5)]">
            <Activity size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-mono">
              NeuroScan<span className="text-sky-500 dark:text-sky-400">X</span>
            </h1>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium uppercase tracking-[0.2em]">Next-Gen Triage</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
           {/* User Info (Desktop) */}
           {userEmail && (
            <div className="hidden md:block text-xs text-slate-500 dark:text-slate-400 font-medium text-right mr-2">
              <div className="uppercase tracking-wider">Patient Portal</div>
              <div className="text-slate-900 dark:text-slate-200">{userEmail}</div>
            </div>
           )}

          <div className="hidden sm:flex items-center gap-2 text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-900/20 px-4 py-2 rounded-full text-xs font-semibold border border-sky-100 dark:border-sky-800/50 shadow-sm">
            <ShieldCheck size={14} />
            <span>HIPAA Compliant</span>
          </div>

          <button 
             onClick={toggleTheme}
             className="p-2 rounded-full text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
             title="Toggle Theme"
          >
             {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button
            onClick={onLogout}
            className="p-2 rounded-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            title="Sign Out"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};