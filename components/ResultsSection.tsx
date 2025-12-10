import React, { useState } from 'react';
import { AnalysisResult, TriageLevel, HealthRadar } from '../types';
import { generatePDF } from '../utils/pdfGenerator';
import { 
  AlertTriangle, Download, Info, User, ClipboardList, CheckCircle, 
  TrendingUp, Pill, Layers, Mic, ArrowLeft, BarChart, Activity
} from 'lucide-react';

interface ResultsSectionProps {
  result: AnalysisResult;
  onBack: () => void;
}

// SVG Radar Chart Component
const RadarChart: React.FC<{ data: HealthRadar }> = ({ data }) => {
  const size = 220;
  const center = size / 2;
  const radius = 80;
  
  const keys = ['hydration', 'fatigue', 'stress', 'inflammation', 'severity'] as const;
  const labels = ['Hydration', 'Fatigue', 'Stress', 'Inflamm.', 'Severity'];
  
  const getCoordinates = (value: number, index: number, total: number) => {
    const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
    const r = (value / 100) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  const points = keys.map((key, i) => getCoordinates(data[key], i, 5)).map(p => `${p.x},${p.y}`).join(' ');

  return (
    <div className="flex flex-col items-center bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-lg dark:shadow-inner transition-colors duration-300">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="overflow-visible">
           {/* Background Grid */}
           {[25, 50, 75, 100].map(p => (
             <polygon 
               key={p}
               points={keys.map((_, i) => {
                 const c = getCoordinates(p, i, 5);
                 return `${c.x},${c.y}`;
               }).join(' ')}
               fill="none"
               className="stroke-slate-300 dark:stroke-slate-700"
               strokeWidth="1"
             />
           ))}
           {/* Axis Lines */}
           {keys.map((_, i) => {
             const c = getCoordinates(100, i, 5);
             return <line key={i} x1={center} y1={center} x2={c.x} y2={c.y} className="stroke-slate-300 dark:stroke-slate-700" strokeWidth="1" />;
           })}
           {/* Data Polygon */}
           <polygon points={points} fill="rgba(14, 165, 233, 0.4)" stroke="#38bdf8" strokeWidth="2" filter="url(#glow)" />
           {/* Dots */}
           {keys.map((key, i) => {
             const c = getCoordinates(data[key], i, 5);
             return <circle key={i} cx={c.x} cy={c.y} r="4" className="fill-sky-500 dark:fill-sky-400" />;
           })}
           {/* Labels */}
           {labels.map((label, i) => {
             const c = getCoordinates(125, i, 5);
             return (
               <text key={i} x={c.x} y={c.y} textAnchor="middle" className="text-[10px] fill-slate-500 dark:fill-slate-400 font-bold uppercase tracking-wider">
                 {label}
               </text>
             );
           })}
           <defs>
             <filter id="glow">
               <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
               <feMerge>
                 <feMergeNode in="coloredBlur"/>
                 <feMergeNode in="SourceGraphic"/>
               </feMerge>
             </filter>
           </defs>
        </svg>
      </div>
      <p className="text-xs text-sky-600 dark:text-sky-500 mt-2 font-mono tracking-widest uppercase flex items-center gap-2">
         <BarChart size={12} /> Biometric Radar
      </p>
    </div>
  );
};

const TriageBadge: React.FC<{ level: TriageLevel }> = ({ level }) => {
  const styles = {
    [TriageLevel.Low]: "bg-green-100 text-green-700 border-green-300 dark:bg-green-950 dark:text-green-400 dark:border-green-700",
    [TriageLevel.Medium]: "bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-950 dark:text-yellow-400 dark:border-yellow-700",
    [TriageLevel.High]: "bg-orange-100 text-orange-700 border-orange-300 dark:bg-orange-950 dark:text-orange-400 dark:border-orange-700",
    [TriageLevel.Critical]: "bg-red-100 text-red-700 border-red-300 dark:bg-red-950 dark:text-red-500 dark:border-red-600 animate-pulse"
  };

  return (
    <div className={`px-5 py-2 rounded-lg border-2 ${styles[level]} flex items-center gap-3 shadow-sm`}>
      <div className={`w-3 h-3 rounded-full bg-current shadow-sm`} />
      <span className="font-bold uppercase tracking-widest text-sm">{level} Priority</span>
    </div>
  );
};

export const ResultsSection: React.FC<ResultsSectionProps> = ({ result, onBack }) => {
  const [activeTab, setActiveTab] = useState<'patient' | 'doctor'>('patient');

  return (
    <div className="w-full max-w-5xl mx-auto animate-fade-in pb-12">
      
      <button 
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors text-sm font-medium"
      >
        <ArrowLeft size={16} /> Return to Input
      </button>

      {/* Header Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Main Status Card */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-xl dark:shadow-[0_0_20px_rgba(15,23,42,0.5)] relative overflow-hidden transition-colors duration-300">
           <div className="absolute top-0 right-0 p-3 opacity-5 dark:opacity-10 pointer-events-none">
              <Activity size={100} className="text-slate-900 dark:text-white" />
           </div>
           
           <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 z-10 relative">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight mb-1">Analysis Report</h2>
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-mono uppercase">
                  <span>ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
                  <span>•</span>
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
              </div>
              <div className="mt-4 md:mt-0 flex flex-col items-end gap-3">
                 <TriageBadge level={result.triageLevel} />
              </div>
           </div>

           {/* Reasoning Highlight */}
           <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
             <h3 className="text-xs font-bold text-sky-600 dark:text-sky-400 mb-2 flex items-center gap-2 uppercase tracking-wide">
               <Info size={14} /> AI Clinical Reasoning
             </h3>
             <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed font-normal dark:font-light">
               {result.triageReasoning}
             </p>
           </div>
        </div>

        {/* Radar Chart Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 shadow-xl flex flex-col items-center justify-center transition-colors duration-300">
            <RadarChart data={result.healthRadar} />
        </div>
      </div>

      {/* Critical Alerts (Red Flags) - Enhanced Visibility */}
      {result.redFlags.length > 0 && (
        <div className="bg-red-50 dark:bg-red-950/30 rounded-2xl p-6 border-l-4 border-red-500 border-y border-r border-red-100 dark:border-slate-800 mb-8 shadow-md">
          <h3 className="text-sm font-bold text-red-600 dark:text-red-400 mb-3 flex items-center gap-2 uppercase tracking-widest">
            <AlertTriangle size={18} />
            Critical Alerts Detected
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {result.redFlags.map((flag, idx) => (
              <div key={idx} className="flex items-start gap-3 bg-white dark:bg-red-900/20 p-3 rounded-lg border border-red-100 dark:border-red-900/50 shadow-sm">
                <span className="mt-1.5 w-2 h-2 rounded-full bg-red-500 shrink-0 shadow-sm" />
                <span className="text-red-800 dark:text-red-200 text-sm font-medium">{flag}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Feature Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Timeline */}
          {result.timelineAnalysis && (
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-teal-100 dark:border-teal-900/50 shadow-lg">
              <h3 className="text-xs font-bold text-teal-600 dark:text-teal-400 mb-3 flex items-center gap-2 uppercase tracking-wide">
                <TrendingUp size={16} /> Trend Analysis
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">{result.timelineAnalysis}</p>
            </div>
          )}

          {/* Comparison */}
          {result.imageComparison && (
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-indigo-100 dark:border-indigo-900/50 shadow-lg">
              <h3 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-3 flex items-center gap-2 uppercase tracking-wide">
                <Layers size={16} /> Visual Comparison
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">{result.imageComparison}</p>
            </div>
          )}

           {/* Medicine ID */}
           {result.medicineAnalysis && (
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-purple-100 dark:border-purple-900/50 shadow-lg md:col-span-2 lg:col-span-1">
              <h3 className="text-xs font-bold text-purple-600 dark:text-purple-400 mb-3 flex items-center gap-2 uppercase tracking-wide">
                <Pill size={16} /> Safe Medicine ID
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">{result.medicineAnalysis}</p>
              <div className="text-[10px] text-purple-600/70 dark:text-purple-300/70 border-t border-purple-100 dark:border-purple-900/50 pt-2 mt-2">
                *Tentative ID only. Verify with pharmacist.*
              </div>
            </div>
          )}
      </div>

      {/* Detailed Report Tabs */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl transition-colors duration-300">
        <div className="flex border-b border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setActiveTab('patient')}
            className={`flex-1 py-5 text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-3 transition-all
              ${activeTab === 'patient' 
                ? 'text-sky-600 dark:text-sky-400 bg-slate-50 dark:bg-slate-800/80 border-b-2 border-sky-500' 
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 bg-white dark:bg-slate-900'}
            `}
          >
            <User size={18} />
            Patient Summary
          </button>
          <button
            onClick={() => setActiveTab('doctor')}
            className={`flex-1 py-5 text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-3 transition-all
              ${activeTab === 'doctor' 
                 ? 'text-sky-600 dark:text-sky-400 bg-slate-50 dark:bg-slate-800/80 border-b-2 border-sky-500' 
                 : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 bg-white dark:bg-slate-900'}
            `}
          >
            <ClipboardList size={18} />
            Clinician SOAP Note
          </button>
        </div>

        <div className="p-8 min-h-[400px]">
          {activeTab === 'patient' ? (
            <div className="space-y-10 animate-fade-in">
              <div className="grid md:grid-cols-2 gap-10">
                <div className="space-y-8">
                   <Section title="Chief Complaint" content={result.chiefComplaint} />
                   {result.visualObservations && <Section title="Visual Findings" content={result.visualObservations} />}
                   <Section title="Symptom Breakdown" content={result.symptomAnalysis} />
                </div>
                
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-4 uppercase tracking-wider flex items-center gap-2">
                       Differential Considerations
                    </h3>
                    <div className="space-y-2">
                      {result.differentials.map((diff, idx) => (
                        <div key={idx} className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-sm shadow-sm flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-sky-500 shadow-[0_0_5px_#0ea5e9]" />
                          {diff}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-4 uppercase tracking-wider">Recommended Action</h3>
                    <ul className="space-y-3">
                      {result.homeCare.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-4 text-slate-700 dark:text-slate-300 text-sm bg-sky-50 dark:bg-sky-900/10 p-4 rounded-xl border border-sky-100 dark:border-sky-800/30">
                          <CheckCircle size={18} className="text-sky-500 shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8 font-mono text-sm animate-fade-in text-slate-700 dark:text-slate-300">
               {result.voiceSummary && (
                 <div className="p-4 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900 rounded-xl">
                    <h4 className="font-bold text-indigo-600 dark:text-indigo-400 text-xs flex items-center gap-2 mb-2 uppercase">
                       <Mic size={14} /> Voice Transcript Summary
                    </h4>
                    <p className="leading-relaxed">{result.voiceSummary}</p>
                 </div>
               )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-8">
                    <SoapSection title="S - Subjective" content={result.soap.subjective} />
                    <SoapSection title="O - Objective" content={result.soap.objective} />
                 </div>
                 <div className="space-y-8">
                    <SoapSection title="A - Assessment" content={result.soap.assessment} />
                    <SoapSection title="P - Plan" content={result.soap.plan} />
                 </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="p-6 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-200 dark:border-slate-800 flex justify-end">
           <button 
              onClick={() => generatePDF(result)}
              className="text-sm font-bold text-white bg-sky-500 hover:bg-sky-400 px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 transition-all"
           >
              <Download size={18} />
              Download Clinical PDF
           </button>
        </div>
      </div>
    </div>
  );
};

const Section: React.FC<{ title: string; content: string }> = ({ title, content }) => (
  <div>
    <h3 className="text-xs font-bold text-sky-600 dark:text-sky-500 mb-3 uppercase tracking-wider">{title}</h3>
    <p className="text-slate-700 dark:text-slate-300 text-sm leading-7">{content}</p>
  </div>
);

const SoapSection: React.FC<{ title: string; content: string }> = ({ title, content }) => (
  <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
    <h3 className="font-bold text-sky-600 dark:text-sky-400 mb-3 border-b border-slate-200 dark:border-slate-800 pb-2">{title}</h3>
    <p className="whitespace-pre-line leading-relaxed text-slate-600 dark:text-slate-400">{content}</p>
  </div>
);