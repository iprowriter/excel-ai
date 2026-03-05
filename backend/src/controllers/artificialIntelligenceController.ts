import type { Request, Response } from "express";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { addMessage, createSession, getSession } from "../domain/sessions";
import "dotenv/config";

export const llm = new ChatGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY!,
  model:  "gemini-flash-latest",
  temperature: 0.3,
  maxOutputTokens: 2048,
});


export const generateReport = async (req: Request, res: Response) => {
  try {
    const { summary } = req.body;

    if (!summary) {
      return res.status(400).json({ error: "Missing summary" });
    }

    const sessionId = createSession(summary);

    const prompt = `
        You are an expert data analyst. Convert the following structured Excel summary into a clear, concise executive report.

        Summary:
        ${JSON.stringify(summary, null, 2)}

        Write:
        - Summary (1 - 2 sentence)
        - Key insights
        - Trends
        - Risks or anomalies
        - Recommendations
            `;

    const response = await llm.invoke(prompt);

    addMessage(sessionId, "assistant", response.content as string);

    const result = res.json({
      sessionId,
      report: response.content,
    });

    return result;
  } catch (err: any) {
    console.log("Error in AI report generation:", err);
    return res.status(500).json({ error: err.message });
  }
};

export const continueChat = async (req: Request, res: Response) => {
  try {
    const { sessionId, message } = req.body;

    const session = getSession(sessionId);
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    addMessage(sessionId, "user", message);

    const history = session.messages
      .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
      .join("\n");

    const prompt = `
    You are continuing a conversation about an Excel dataset.

    Excel Summary:
    ${JSON.stringify(session.excelSummary, null, 2)}

    Conversation so far:
    ${history}

    User message: ${message}
    `;

    // STREAMING RESPONSE
    const stream = await llm.stream(prompt);

    let full = "";
    for await (const chunk of stream) {
      const text = chunk?.content ?? "";
      full += text;
    }

    addMessage(sessionId, "assistant", full);

    // FOLLOW-UP SUGGESTIONS
    const suggestionPrompt = `
      Based on the conversation and the dataset, generate 3 short follow-up questions the user is likely to ask next.
      Return ONLY a JSON array of strings. No explanation.
    `;

    const suggestionResponse = await llm.invoke(suggestionPrompt);

    function normalizeContent(content: any): string {
      if (typeof content === "string") return content;
      if (Array.isArray(content)) {
        return content
          .map((c) => (typeof c === "string" ? c : c.text ?? ""))
          .join(" ");
      }
      return "";
    }

    const suggestionText = normalizeContent(suggestionResponse.content);

    let suggestions: string[] = [];
    try {
      suggestions = JSON.parse(suggestionText);
    } catch (err) {
      console.log("Failed to parse suggestions:", suggestionText);
      suggestions = [];
    }

    return res.json({
      reply: full,
      suggestions,
    });
  } catch (err: any) {
    console.log("Error in continueChat:", err);
    return res.status(500).json({ error: err.message });
  }
};




function normalizeContent(content: any): string {
  if (typeof content === "string") return content;

  if (Array.isArray(content)) {
    return content
      .map((c) => (typeof c === "string" ? c : c.text ?? ""))
      .join(" ");
  }

  return "";
}
