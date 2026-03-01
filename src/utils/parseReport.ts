export function parseAIReport(report: string) {
  const lines = report.split("\n").map(l => l.trim()).filter(Boolean);

  const sections: { title: string | null; content: string[] }[] = [];
  let current = { title: null as string | null, content: [] as string[] };

  lines.forEach(line => {
    const isHeader =
      line.startsWith("###") ||
      line.startsWith("##") ||
      line.startsWith("**") && line.endsWith("**");

    if (isHeader) {
      if (current.content.length > 0 || current.title) {
        sections.push(current);
      }
      current = { title: line.replace(/[#*]/g, "").trim(), content: [] };
    } else {
      current.content.push(line);
    }
  });

  if (current.content.length > 0 || current.title) {
    sections.push(current);
  }

  return sections;
}


export function extractOverview(report: string): string {
  if (!report) return "";

  const lines = report.split("\n");

  let inOverview = false;
  let collected: string[] = [];

  for (let line of lines) {
    const trimmed = line.trim();

    // Detect start of Overview
    if (trimmed.match(/^\*\*Overview\*\*/i)) {
      inOverview = true;
      continue;
    }

    // Stop when next section begins
    if (inOverview && (
      trimmed.startsWith("###") ||
      trimmed.startsWith("**") ||
      trimmed.startsWith("---")
    )) {
      break;
    }

    if (inOverview) {
      if (trimmed.length > 0) collected.push(trimmed);
    }
  }

  return collected.join(" ");
}
