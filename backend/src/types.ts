
export type ExcelRow = Record<string, any>;

// Summary for numeric columns
export interface NumericSummary {
  type: "numeric";
  count: number;
  mean: number;
  median: number;
  min: number;
  max: number;
  range: number;
  variance: number;
  stdDev: number;
  q1: number;
  q3: number;
  iqr: number;
  outliers: number;
}

// Summary for text columns
export interface TextSummary {
  type: "text";
  sampleValues: any[];
  uniqueCount: number;
}

// Union type for column summary
export type ColumnSummary = NumericSummary | TextSummary;

// Final response structure
export interface ExcelAnalysisResponse {
  rows: number;
  columns: string[];
  summary: Record<string, ColumnSummary>;
}