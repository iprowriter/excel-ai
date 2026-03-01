import { create } from "zustand";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface AnalysisResult {
  sessionId: string | null;
  structured: any | null;
  report: string | null;
}

interface AppState {
  // File
  fileName: string | null;

  // Analysis
  analysis: AnalysisResult | null;

  // Chat
  chat: ChatMessage[];

  // Actions
  setFile: (name: string) => void;
  setAnalysis: (data: AnalysisResult) => void;
  addChatMessage: (msg: ChatMessage) => void;
  resetChat: () => void;
}

export const useStore = create<AppState>((set) => ({
  fileName: null,
  analysis: null,
  chat: [],

  setFile: (name) => set({ fileName: name }),

  setAnalysis: (data) =>
    set({
      analysis: data,
      chat: data.report
        ? [{ role: "assistant", content: data.report }]
        : [],
    }),

  addChatMessage: (msg) =>
    set((state) => ({ chat: [...state.chat, msg] })),

  resetChat: () => set({ chat: [] }),
}));
