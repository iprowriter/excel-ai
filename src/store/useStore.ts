import { create } from "zustand";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface AnalysisResult {
  sessionId: string | null;
  structured: any | null;
  report: string | null;
  fileName: string | null;
}

interface AppState {
  // File
  fileName: string | null;

  // Analysis
  analysis: AnalysisResult | null;

  // Chat
  chat: ChatMessage[];

  suggestions: string[]; 
  recentFiles: string[];
  

  // Actions
  setFile: (name: string) => void;
  setAnalysis: (data: AnalysisResult) => void;
  setSuggestions: (s: string[]) => void;
  addChatMessage: (msg: ChatMessage) => void;
  resetChat: () => void;
}

export const useStore = create<AppState>((set) => ({
  fileName: null,
  analysis: null,
  chat: [],
  recentFiles: JSON.parse(localStorage.getItem("recentFiles") || "[]"),

  suggestions: [], 
  setSuggestions: (s) => set({ suggestions: s }),

  // setFile: (name) => set({ fileName: name }),

  setFile: (name) => set((state) => {
    const updated = [name, ...state.recentFiles.filter(f => f !== name)]
    localStorage.setItem("recentFiles", JSON.stringify(updated));
    return { fileName: name, recentFiles: updated };
  }),

  // setAnalysis: (data) =>
  //   set({
  //     analysis: data,
  //     chat: data.report
  //       ? [{ role: "assistant", content: data.report }]
  //       : [],
  //   }),

  setAnalysis: (data) =>
  set({
    analysis: data,
    chat: data.fileName
      ? [
          {
            role: "assistant",
            content: `Your file **${data.fileName}** is ready. I can walk you through insights, trends, anomalies, or anything else you want to explore. Just ask!`,
          },
        ]
      : [],
  }),


  addChatMessage: (msg) =>
    set((state) => ({ chat: [...state.chat, msg] })),

  resetChat: () => set({ chat: [] }),
}));
