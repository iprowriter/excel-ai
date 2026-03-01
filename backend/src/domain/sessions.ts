import { v4 as uuid } from "uuid";

interface SessionData {
  id: string;
  messages: { role: "user" | "assistant"; content: string }[];
  excelSummary?: any;
}

const sessions = new Map<string, SessionData>();

export function createSession(summary: any) {
  const id = uuid();
  sessions.set(id, {
    id,
    messages: [],
    excelSummary: summary,
  });
  return id;
}

export function getSession(id: string) {
  return sessions.get(id);
}

export function addMessage(id: string, role: "user" | "assistant", content: string) {
  const session = sessions.get(id);
  if (!session) return;
  session.messages.push({ role, content });
}
