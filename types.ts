export enum TriageLevel {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
  Critical = 'Critical'
}

export interface SoapNote {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}

export interface HealthRadar {
  hydration: number;
  fatigue: number;
  stress: number;
  inflammation: number;
  severity: number;
}

export interface AnalysisResult {
  chiefComplaint: string;
  timelineAnalysis?: string; // New: Trend analysis
  voiceSummary?: string;     // New: Voice derived info
  visualObservations?: string;
  imageComparison?: string;  // New: Day 1 vs Day X
  medicineAnalysis?: string; // New: Safe medicine ID
  symptomAnalysis: string;
  healthRadar: HealthRadar;  // New: 5-dim score
  differentials: string[];
  triageLevel: TriageLevel;
  triageReasoning: string;
  redFlags: string[];
  homeCare: string[];
  soap: SoapNote;
}

export interface AnalysisRequest {
  symptoms: string;
  history?: string;
  images: File[];
  voiceTranscript?: string;
}