import PDFDocument from "pdfkit";
import { REPORT } from "./constants.js";
import { drawReportHeader } from "./reportLayout.js";
import { drawSummary } from "./summaryRenderer.js";
import { drawInsights } from "./insightRenderer.js";
import { drawTable } from "./tableRenderer.js";
import { addFooter } from "./pageManager.js";

export const generatePdfReport = async ({
  res,
  title,
  description,
  summary,
  insights = [],
  headers,
  rows,
  filename,
  tableTitle,
}) => {
  const doc = new PDFDocument({
    size: "A4",
    layout: "landscape",
    margins: {
      top: REPORT.PAGE_MARGIN,
      bottom: 45,
      left: REPORT.PAGE_MARGIN,
      right: REPORT.PAGE_MARGIN,
    },
    bufferPages: true,
    info: {
      Title: title,
      Author: REPORT.COMPANY_NAME,
      Subject: description || title,
      Creator: REPORT.SHORT_NAME,
    },
  });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  doc.pipe(res);

  let y = drawReportHeader(doc, { title, description });
  y = drawSummary(doc, summary, y);
  y = drawInsights(doc, insights, y);

  drawTable({
    doc,
    headers,
    rows,
    startY: y,
    title: tableTitle,
    onNewPage: (pdf) => drawReportHeader(pdf, { title, continuation: true }),
  });

  const range = doc.bufferedPageRange();
  const totalPages = range.count;

  for (let i = range.start; i < range.start + range.count; i += 1) {
    doc.switchToPage(i);
    addFooter(doc, i - range.start + 1, totalPages);
  }

  doc.end();
};
