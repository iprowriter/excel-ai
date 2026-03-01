import XLSX from "xlsx";
import type { Request, Response } from "express";
import { ColumnSummary, ExcelAnalysisResponse, ExcelRow } from "../types";
import { llm } from "./artificialIntelligenceController";
import { createSession, addMessage } from "../domain/sessions";

export const uploadSheet = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const file = req.file as Express.Multer.File;
    const buffer = file.buffer;

    // Parse Excel
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet: ExcelRow[] = XLSX.utils.sheet_to_json(
      workbook.Sheets[sheetName]
    );

    if (sheet.length === 0) {
      return res.status(400).json({ error: "Excel sheet is empty" });
    }

    const columns = Object.keys(sheet[0]);
    const summary: Record<string, ColumnSummary> = {};

    columns.forEach((col) => {
      const values = sheet
        .map((row) => row[col])
        .filter((v) => typeof v === "number");

      if (values.length > 0) {
        const sum = values.reduce((a: number, b: number) => a + b, 0);
        const mean = sum / values.length;
        const min = Math.min(...values);
        const max = Math.max(...values);

        summary[col] = {
          type: "numeric",
          count: values.length,
          mean,
          min,
          max,
        };
      } else {
        summary[col] = {
          type: "text",
          sampleValues: sheet.slice(0, 5).map((r) => r[col]),
        };
      }
    });

    const structured: ExcelAnalysisResponse = {
      rows: sheet.length,
      columns,
      summary,
    };

    // Create session for chat memory
    const sessionId = createSession(structured);

    // AI Executive Report
    const prompt = `
      You are an expert data analyst. Convert the following structured Excel summary into a clear, concise executive report.

      Summary:
      ${JSON.stringify(structured, null, 2)}

      Write:
      - Key insights
      - Trends
      - Risks or anomalies
      - Recommendations
    `;

    const aiResponse = await llm.invoke(prompt);

    addMessage(sessionId, "assistant", aiResponse.content as string);

    return res.json({
      sessionId,
      structured,
      report: aiResponse.content,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};
