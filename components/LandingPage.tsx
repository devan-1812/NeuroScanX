import React from 'react';
import { Mail, Phone, Facebook, Twitter, Linkedin, ChevronRight, Activity, ArrowRight, Shield, Heart, Users, Calendar } from 'lucide-react';

interface LandingPageProps {
  onLogin: () => void;
  onSignup: () => void;
  toggleTheme: () => void;
  isDark: boolean;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLogin, onSignup, toggleTheme, isDark }) => {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      
      {/* Top Bar */}
      <div className="bg-slate-900 text-white py-2 px-4 text-xs font-medium tracking-wide">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2 hover:text-sky-400 cursor-pointer transition-colors">
              <Mail size={14} /> info@neuroscanx.ai
            </span>
            <span className="flex items-center gap-2 hover:text-sky-400 cursor-pointer transition-colors">
              <Phone size={14} /> +1 (800) 123-4567
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Facebook size={14} className="hover:text-sky-400 cursor-pointer" />
            <Twitter size={14} className="hover:text-sky-400 cursor-pointer" />
            <Linkedin size={14} className="hover:text-sky-400 cursor-pointer" />
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="sticky top-0 z-50 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-sky-500 to-indigo-600 rounded-lg shadow-md">
              <Activity size={24} className="text-white" />
            </div>
            <span className="text-2xl font-bold text-slate-900 dark:text-white font-mono tracking-tight">
              NeuroScan<span className="text-sky-500">X</span>
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-8 font-medium text-slate-600 dark:text-slate-300 text-sm">
            <a href="#" className="hover:text-sky-500 transition-colors">Home</a>
            <a href="#" className="hover:text-sky-500 transition-colors">About Us</a>
            <a href="#" className="hover:text-sky-500 transition-colors">Services</a>
            <a href="#" className="hover:text-sky-500 transition-colors">Departments</a>
            <a href="#" className="hover:text-sky-500 transition-colors">Contact</a>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={onLogin}
              className="text-slate-600 dark:text-slate-300 font-semibold text-sm hover:text-sky-500"
            >
              Log In
            </button>
            <button 
              onClick={onSignup}
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-sky-500 to-teal-400 text-white font-bold text-sm shadow-lg hover:shadow-sky-500/30 hover:scale-105 transition-all"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-28">
        {/* Background Decorative Shapes */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-b from-sky-50 to-teal-50 dark:from-sky-900/10 dark:to-teal-900/10 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/4" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-t from-indigo-50 to-purple-50 dark:from-indigo-900/10 dark:to-purple-900/10 rounded-full blur-3xl -z-10 -translate-x-1/4 translate-y-1/4" />

        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Text Content */}
          <div className="space-y-8 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 text-xs font-bold uppercase tracking-wider">
              <Shield size={14} /> Trusted by 500+ Clinics
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 dark:text-white leading-[1.1]">
              Get Better Care For Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-indigo-500">Health</span>
            </h1>
            
            <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-lg">
              Experience the future of medical triage with AI-powered insights. Instant analysis, multimodal support, and clinic-grade reporting at your fingertips.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={onSignup}
                className="px-8 py-4 rounded-full bg-sky-500 text-white font-bold text-lg shadow-xl shadow-sky-500/20 hover:bg-sky-400 hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
              >
                Start Assessment <ArrowRight size={20} />
              </button>
              <button className="px-8 py-4 rounded-full border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                Learn More
              </button>
            </div>

            <div className="flex items-center gap-8 pt-4">
              <div>
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white">98%</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Accuracy Rate</p>
              </div>
              <div className="w-px h-10 bg-slate-200 dark:bg-slate-800" />
              <div>
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white">24/7</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">AI Availability</p>
              </div>
            </div>
          </div>

          {/* Image Content */}
          <div className="relative lg:h-[600px] flex items-center justify-center animate-fade-in">
            {/* Abstract blobs */}
            <div className="absolute inset-0 bg-gradient-to-br from-sky-200 to-indigo-200 dark:from-sky-800/20 dark:to-indigo-800/20 rounded-[3rem] rotate-3 opacity-50" />
            
            <div className="relative z-10 w-full max-w-md aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800">
               {/* Placeholder for Doctor Image - Using a gradient placeholder with icon for now since I can't load external assets reliably without URL */}
               <div className="w-full h-full bg-slate-200 dark:bg-slate-800 flex flex-col items-center justify-center text-slate-400 dark:text-slate-600">
                  <Activity size={80} className="mb-4 text-sky-500 opacity-50" />
                  <p className="uppercase font-bold tracking-widest text-sm">Medical Team</p>
                  
                  {/* Floating cards */}
                  <div className="absolute bottom-8 left-8 right-8 bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-800 flex items-center gap-4">
                    <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full text-green-600 dark:text-green-400">
                      <Heart size={24} fill="currentColor" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase">Patient Satisfaction</p>
                      <p className="text-xl font-bold text-slate-900 dark:text-white">4.9/5.0</p>
                    </div>
                  </div>
               </div>
            </div>

            {/* Floating Dots */}
            <div className="absolute top-10 left-10 w-4 h-4 bg-sky-400 rounded-full animate-bounce" />
            <div className="absolute bottom-20 right-10 w-6 h-6 bg-teal-400 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-sm font-bold text-sky-500 uppercase tracking-widest mb-3">Our Services</h2>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white">Comprehensive AI Health Solutions</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <ServiceCard 
              icon={<Activity size={32} />} 
              title="Symptom Triage" 
              desc="Instant analysis of your symptoms with clinical-grade reasoning."
            />
            <ServiceCard 
              icon={<Shield size={32} />} 
              title="Safe Med Check" 
              desc="Upload images of medications to identify categories and safety warnings."
            />
            <ServiceCard 
              icon={<Calendar size={32} />} 
              title="Trend Analysis" 
              desc="Track health patterns over days or weeks to spot improvements."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="container mx-auto px-6 grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
               <Activity size={24} className="text-sky-500" />
               <span className="text-xl font-bold text-white font-mono">NeuroScan<span className="text-sky-500">X</span></span>
            </div>
            <p className="text-sm leading-relaxed">
              Empowering patients with next-generation AI health insights. Secure, private, and precise.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-wider">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-sky-400 cursor-pointer">About Us</li>
              <li className="hover:text-sky-400 cursor-pointer">Our Team</li>
              <li className="hover:text-sky-400 cursor-pointer">Technology</li>
            </ul>
          </div>

          <div>
             <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-wider">Legal</h4>
             <ul className="space-y-2 text-sm">
              <li className="hover:text-sky-400 cursor-pointer">Privacy Policy</li>
              <li className="hover:text-sky-400 cursor-pointer">Terms of Service</li>
              <li className="hover:text-sky-400 cursor-pointer">Disclaimer</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-wider">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>123 Innovation Drive, Tech City</li>
              <li>support@neuroscanx.ai</li>
              <li>+1 (800) 123-4567</li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-6 mt-12 pt-8 border-t border-slate-800 text-center text-xs">
           &copy; {new Date().getFullYear()} NeuroScanX AI. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

const ServiceCard: React.FC<{ icon: React.ReactNode, title: string, desc: string }> = ({ icon, title, desc }) => (
  <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-800 hover:-translate-y-2 transition-transform group">
    <div className="w-14 h-14 bg-sky-100 dark:bg-sky-900/30 rounded-2xl flex items-center justify-center text-sky-600 dark:text-sky-400 mb-6 group-hover:bg-sky-500 group-hover:text-white transition-colors">
      {icon}
    </div>
    <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{title}</h4>
    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{desc}</p>
  </div>
);