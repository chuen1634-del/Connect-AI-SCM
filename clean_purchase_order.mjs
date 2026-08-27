import fs from "node:fs/promises";
import { Workbook, SpreadsheetFile } from "@oai/artifact-tool";

const inputPath = "C:/Users/fujifilm/Desktop/AI-SCM 3차 교육 자료/purchase_order.csv";
const outputDir = "C:/Users/fujifilm/Desktop/AI-SCM Project/outputs/purchase_order_cleaned";
const outputCsv = `${outputDir}/purchase_order_cleaned.csv`;
const outputXlsx = `${outputDir}/purchase_order_cleaned.xlsx`;
const previewPath = `${outputDir}/purchase_order_cleaned_preview.png`;

const headers = ["발주번호", "발주일", "공급업체", "품목코드", "발주수량", "단가", "납기예정일", "발주담당"];

function parseCsvLine(line) {
  const cells = [];
  let current = "";
  let quoted = false;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (ch === '"') {
      if (quoted && line[i + 1] === '"') { current += '"'; i += 1; }
      else quoted = !quoted;
    } else if (ch === "," && !quoted) { cells.push(current); current = ""; }
    else current += ch;
  }
  cells.push(current);
  return cells;
}

function parseDate(value) {
  const raw = String(value ?? "").trim();
  if (!raw) return null;
  let m = raw.match(/^(\d{4})[\/-](\d{1,2})[\/-](\d{1,2})$/);
  if (m) return new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])));
  m = raw.match(/^(\d{4})(\d{2})(\d{2})$/);
  if (m) return new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])));
  m = raw.match(/^(\d{1,2})-([A-Za-z]{3})-(\d{2})$/);
  if (m) {
    const months = { JAN: 0, FEB: 1, MAR: 2, APR: 3, MAY: 4, JUN: 5, JUL: 6, AUG: 7, SEP: 8, OCT: 9, NOV: 10, DEC: 11 };
    const month = months[m[2].toUpperCase()];
    if (month !== undefined) return new Date(Date.UTC(2000 + Number(m[3]), month, Number(m[1])));
  }
  throw new Error(`지원하지 않는 날짜 형식: ${raw}`);
}

function dateText(date) {
  if (!date) return "";
  return date.toISOString().slice(0, 10);
}

function cleanSupplier(value) {
  return String(value ?? "").replace(/\s+/g, "").replace(/\(주\)/g, "");
}

function cleanNumber(value) {
  const raw = String(value ?? "").replace(/,/g, "").trim();
  return raw === "" ? null : Number(raw);
}

function csvEscape(value) {
  const text = value === null || value === undefined ? "" : String(value);
  return /[",\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

const csvText = await fs.readFile(inputPath, "utf8");
const sourceLines = csvText.replace(/^\uFEFF/, "").trimEnd().split(/\r?\n/);
const sourceRows = sourceLines.slice(1).map(parseCsvLine);
const cleaned = sourceRows.map((row) => {
  const orderDate = parseDate(row[1]);
  const dueDate = parseDate(row[6]);
  return [
    String(row[0] ?? "").trim(),
    dateText(orderDate),
    cleanSupplier(row[2]),
    String(row[3] ?? "").trim().toUpperCase(),
    cleanNumber(row[4]),
    cleanNumber(row[5]),
    dateText(dueDate),
    String(row[7] ?? "").trim(),
  ];
}).sort((a, b) => b[0].localeCompare(a[0], "en"));

await fs.mkdir(outputDir, { recursive: true });
const cleanedCsv = [headers, ...cleaned].map((row) => row.map(csvEscape).join(",")).join("\r\n") + "\r\n";
await fs.writeFile(outputCsv, "\uFEFF" + cleanedCsv, "utf8");

const workbook = Workbook.create();
const sheet = workbook.worksheets.add("발주서");
sheet.getRange(`A1:H${cleaned.length + 1}`).values = [headers, ...cleaned.map((row) => {
  const copy = [...row];
  copy[1] = parseDate(row[1]);
  copy[6] = parseDate(row[6]);
  return copy;
})];
sheet.getRange("A1:H1").format = { fill: "#1F4E78", font: { bold: true, color: "#FFFFFF" }, horizontalAlignment: "center" };
sheet.getRange(`A1:H${cleaned.length + 1}`).format.borders = { insideHorizontal: { style: "thin", color: "#D9E2F3" }, bottom: { style: "thin", color: "#D9E2F3" } };
sheet.getRange(`B2:B${cleaned.length + 1}`).setNumberFormat("yyyy-mm-dd");
sheet.getRange(`G2:G${cleaned.length + 1}`).setNumberFormat("yyyy-mm-dd");
sheet.getRange(`E2:F${cleaned.length + 1}`).setNumberFormat("#,##0");
sheet.getRange(`A2:A${cleaned.length + 1}`).format.horizontalAlignment = "left";
sheet.getRange(`B2:G${cleaned.length + 1}`).format.horizontalAlignment = "right";
sheet.getRange(`H2:H${cleaned.length + 1}`).format.horizontalAlignment = "left";
sheet.getRange("A1:H1").format.rowHeight = 24;
sheet.getRange("A:H").format.autofitColumns();
sheet.getRange("A:A").format.columnWidth = 14;
sheet.getRange("B:B").format.columnWidth = 13;
sheet.getRange("C:C").format.columnWidth = 20;
sheet.getRange("D:D").format.columnWidth = 12;
sheet.getRange("E:F").format.columnWidth = 12;
sheet.getRange("G:G").format.columnWidth = 14;
sheet.getRange("H:H").format.columnWidth = 12;
sheet.freezePanes.freezeRows(1);
sheet.showGridLines = false;
const preview = await workbook.render({ sheetName: "발주서", range: `A1:H${Math.min(cleaned.length + 1, 25)}`, scale: 1, format: "png" });
await fs.writeFile(previewPath, new Uint8Array(await preview.arrayBuffer()));
const xlsx = await SpreadsheetFile.exportXlsx(workbook);
await xlsx.save(outputXlsx);

const check = await workbook.inspect({ kind: "table", range: `발주서!A1:H${Math.min(cleaned.length + 1, 8)}`, include: "values,formulas", tableMaxRows: 8, tableMaxCols: 8 });
const errors = await workbook.inspect({ kind: "match", searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A", options: { useRegex: true, maxResults: 50 }, summary: "final formula error scan" });
console.log(JSON.stringify({ rows: cleaned.length, outputCsv, outputXlsx, previewPath, check: check.ndjson, errors: errors.ndjson }));
