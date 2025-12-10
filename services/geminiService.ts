import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult, TriageLevel } from "../types";

const SYSTEM_INSTRUCTION = `
You are **NeuroScanX**, an advanced multimodal medical triage system.
Your goal is to provide high-performance, structured, and safe health insights.

### CORE RESPONSIBILITIES:
1. **Multimodal Analysis**: Synthesize text, voice transcripts, and up to two images.
2. **Timeline Analysis**: If history is provided (e.g., "Day 1 vs Day 3"), identify progression trends (worsening/improving).
3. **Image Comparison**: If two images are provided, compare them for changes in swelling, color, or size.
4. **Medicine ID (Safe Mode)**: If a pill/bottle is shown, identify the **category only** (e.g., "Analgesic"). NEVER name specific prescription drugs or dosages.
5. **Health Radar**: Estimate a 0-100 score for: Hydration, Fatigue, Stress, Inflammation, Symptom Severity.
6. **Safety**: NEVER diagnose. Always use "Differential Considerations".

### OUTPUT STRUCTURE:
- **Chief Complaint**: Concise summary.
- **Visual Analysis**: Detailed findings. If 2 images, use 'imageComparison' field.
- **Triage Level**: Low/Medium/High/Critical.
- **SOAP Note**: Standard clinical format.
- **Health Radar**: Quantitative scores (0-100).

### JSON RULES:
- Return ONLY valid JSON matching the schema.
- If a field is not applicable (e.g., no medicine image), leave it empty string or null.
- Be extremely structured and professional (Clinician-grade).
`;

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    chiefComplaint: { type: Type.STRING },
    timelineAnalysis: { type: Type.STRING, description: "Trends based on history/timeline text." },
    voiceSummary: { type: Type.STRING, description: "Clinical summary derived specifically from voice transcript." },
    visualObservations: { type: Type.STRING, description: "Analysis of the primary image." },
    imageComparison: { type: Type.STRING, description: "Comparison between primary and secondary image if both exist." },
    medicineAnalysis: { type: Type.STRING, description: "Safe category identification of medication if present." },
    symptomAnalysis: { type: Type.STRING },
    healthRadar: {
      type: Type.OBJECT,
      properties: {
        hydration: { type: Type.NUMBER, description: "0-100 score (100 is best hydration)" },
        fatigue: { type: Type.NUMBER, description: "0-100 score (100 is max fatigue)" },
        stress: { type: Type.NUMBER, description: "0-100 score (100 is max stress)" },
        inflammation: { type: Type.NUMBER, description: "0-100 score (100 is max inflammation)" },
        severity: { type: Type.NUMBER, description: "0-100 score (100 is max severity)" }
      },
      required: ["hydration", "fatigue", "stress", "inflammation", "severity"]
    },
    differentials: { type: Type.ARRAY, items: { type: Type.STRING } },
    triageLevel: { 
      type: Type.STRING, 
      enum: [TriageLevel.Low, TriageLevel.Medium, TriageLevel.High, TriageLevel.Critical] 
    },
    triageReasoning: { type: Type.STRING },
    redFlags: { type: Type.ARRAY, items: { type: Type.STRING } },
    homeCare: { type: Type.ARRAY, items: { type: Type.STRING } },
    soap: {
      type: Type.OBJECT,
      properties: {
        subjective: { type: Type.STRING },
        objective: { type: Type.STRING },
        assessment: { type: Type.STRING },
        plan: { type: Type.STRING }
      },
      required: ["subjective", "objective", "assessment", "plan"]
    }
  },
  required: ["chiefComplaint", "symptomAnalysis", "differentials", "triageLevel", "triageReasoning", "redFlags", "homeCare", "soap", "healthRadar"]
};

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};

export const analyzeSymptoms = async (
  symptoms: string, 
  history: string, 
  images: File[], 
  voiceTranscript: string
): Promise<AnalysisResult> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const parts: any[] = [];

    // Add images
    for (const img of images) {
      const base64Data = await fileToBase64(img);
      parts.push({
        inlineData: {
          mimeType: img.type,
          data: base64Data
        }
      });
    }

    // Construct unified prompt
    let promptText = `Current Symptoms: "${symptoms}"\n`;
    if (history) promptText += `Symptom History/Timeline: "${history}"\n`;
    if (voiceTranscript) promptText += `Voice Note Transcript: "${voiceTranscript}"\n`;
    
    promptText += `\nAnalyze the data provided. If multiple images are present, treat the first as Current and the second as Previous/Comparison unless they appear to be different body parts. If an image looks like medication, categorize it safely.`;

    parts.push({ text: promptText });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // Using latest Flash model for speed/multimodality
      contents: { parts },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.3, 
      }
    });

    if (!response.text) {
      throw new Error("No response received from NeuroScanX.");
    }

    const result = JSON.parse(response.text) as AnalysisResult;
    return result;

  } catch (error) {
    console.error("NeuroScan Analysis Error:", error);
    throw error;
  }
};