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

    const numericValues: Record<string, number[]> = {};
    const textValues: Record<string, string[]> = {};


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
    const sorted = [...values].sort((a, b) => a - b);
    const sum = values.reduce((a, b) => a + b, 0);
    const mean = sum / values.length;

    const median = sorted[Math.floor(values.length / 2)];
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    const range = max - min;

    const variance =
      values.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) /
      values.length;

    const stdDev = Math.sqrt(variance);

    const q1 = sorted[Math.floor(values.length * 0.25)];
    const q3 = sorted[Math.floor(values.length * 0.75)];
    const iqr = q3 - q1;

    const outliers = values.filter(
      (v) => v < q1 - 1.5 * iqr || v > q3 + 1.5 * iqr
    ).length;

    summary[col] = {
      type: "numeric",
      count: values.length,
      mean,
      median,
      min,
      max,
      range,
      variance,
      stdDev,
      q1,
      q3,
      iqr,
      outliers,
    };
  } else {
    summary[col] = {
      type: "text",
      sampleValues: sheet.slice(0, 5).map((r) => r[col]),
      uniqueCount: new Set(sheet.map((r) => r[col])).size,
    };
  }

    if (values.length > 0) {
      numericValues[col] = values;
    } else {
      textValues[col] = sheet.map(r => r[col]);
    };

});


    const structured: ExcelAnalysisResponse = {
      rows: sheet.length,
      columns,
      summary,
      numericValues,
      textValues,
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
