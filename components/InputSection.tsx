import React, { useRef, useState, useEffect } from 'react';
import { Camera, Mic, Upload, X, Activity, History, Image as ImageIcon, StopCircle } from 'lucide-react';

interface InputSectionProps {
  onAnalyze: (data: { symptoms: string; history: string; images: File[]; voiceTranscript: string }) => void;
  isAnalyzing: boolean;
}

export const InputSection: React.FC<InputSectionProps> = ({ onAnalyze, isAnalyzing }) => {
  const [symptoms, setSymptoms] = useState('');
  const [history, setHistory] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Initialize Web Speech API
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
           setVoiceTranscript(prev => prev + " " + finalTranscript);
           setSymptoms(prev => prev ? prev + " " + finalTranscript : finalTranscript);
        }
      };
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setImages(prev => [...prev, ...newFiles].slice(0, 2)); // Max 2 images
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim() && !voiceTranscript.trim() && images.length === 0) return;
    onAnalyze({ symptoms, history, images, voiceTranscript });
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl dark:shadow-[0_0_30px_rgba(0,0,0,0.5)] transition-colors duration-300">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-wide">
          Input <span className="text-sky-500">Parameters</span>
        </h2>
        <div className="flex gap-2">
           {isListening && <span className="animate-pulse text-red-500 text-xs font-bold flex items-center">● RECORDING</span>}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Voice & Symptoms */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 flex items-center justify-between">
            <span>Primary Symptoms</span>
            <button 
              type="button" 
              onClick={toggleListening}
              className={`p-2 rounded-full transition-all border ${isListening ? 'bg-red-500 text-white border-red-400 shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-sky-500 hover:text-sky-500'}`}
            >
              {isListening ? <StopCircle size={18} /> : <Mic size={18} />}
            </button>
          </label>
          <textarea
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder="Describe what you feel, or click mic to speak..."
            className="w-full h-32 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none resize-none text-slate-800 dark:text-slate-200 text-base transition-all placeholder-slate-400 dark:placeholder-slate-600"
          />
        </div>

        {/* Timeline */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 flex items-center gap-2">
             <History size={14} /> Timeline / History
          </label>
          <textarea
             value={history}
             onChange={(e) => setHistory(e.target.value)}
             placeholder="e.g., Day 1: Mild fever. Day 3: Rash appeared..."
             className="w-full h-24 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none resize-none text-slate-800 dark:text-slate-200 text-base transition-all placeholder-slate-400 dark:placeholder-slate-600"
          />
        </div>

        {/* Image Upload - Multi-slot */}
        <div className="space-y-3">
           <label className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 flex items-center gap-2">
             <ImageIcon size={14} /> Visual Data (Max 2)
           </label>
           
           <div className="grid grid-cols-2 gap-4">
              {images.map((img, idx) => (
                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-sky-500/50 shadow-md group">
                   <img src={URL.createObjectURL(img)} alt={`upload-${idx}`} className="w-full h-full object-cover" />
                   <div className="absolute inset-0 bg-sky-900/20 group-hover:bg-transparent transition-colors" />
                   <button 
                     type="button" 
                     onClick={() => removeImage(idx)}
                     className="absolute top-2 right-2 bg-black/70 p-1.5 rounded-full text-white hover:bg-red-500 transition-colors"
                   >
                     <X size={14} />
                   </button>
                   <div className="absolute bottom-0 w-full bg-black/70 text-white text-xs text-center py-1.5 font-mono uppercase tracking-wider">
                      {idx === 0 ? "Primary" : "Comparison"}
                   </div>
                </div>
              ))}
              
              {images.length < 2 && (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-sky-500 dark:hover:border-sky-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all group bg-slate-50 dark:bg-transparent"
                >
                   <div className="p-4 bg-white dark:bg-slate-800 rounded-full text-slate-400 dark:text-slate-500 group-hover:text-sky-500 group-hover:bg-sky-50 dark:group-hover:bg-sky-900/30 transition-colors mb-3 shadow-sm">
                     <Camera size={24} />
                   </div>
                   <span className="text-xs text-slate-500 dark:text-slate-500 font-medium group-hover:text-slate-700 dark:group-hover:text-slate-300">Add Image</span>
                </div>
              )}
           </div>
           <input 
             type="file" 
             ref={fileInputRef} 
             onChange={handleImageSelect} 
             accept="image/*" 
             multiple
             className="hidden" 
           />
           <p className="text-[11px] text-slate-500 italic mt-2">
             Upload 2 images to enable Comparison Mode. Upload pills for Safe ID.
           </p>
        </div>

        {/* Action Button */}
        <div className="pt-6">
          <button
            type="submit"
            disabled={(!symptoms && images.length === 0) || isAnalyzing}
            className={`w-full py-5 rounded-xl font-bold text-white text-lg tracking-widest shadow-lg flex items-center justify-center gap-3 transition-all transform active:scale-[0.99]
              ${(!symptoms && images.length === 0) || isAnalyzing 
                ? 'bg-slate-300 dark:bg-slate-800 cursor-not-allowed text-slate-500 dark:text-slate-600' 
                : 'bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 shadow-[0_4px_14px_0_rgba(0,118,255,0.39)]'
              }`}
          >
            {isAnalyzing ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>ANALYZING...</span>
              </>
            ) : (
              <>
                <Activity size={24} />
                <span>INITIATE ANALYSIS</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};