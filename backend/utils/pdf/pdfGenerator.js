import PDFDocument from "pdfkit";

import { REPORT } from "./constants.js";

import { drawHeader } from "./reportLayout.js";

import { drawSummary } from "./summaryRenderer.js";

import { drawTable } from "./tableRenderer.js";

import { addFooter } from "./pageManager.js";

/**
 * Generic PDF Generator
 */
export const generatePdfReport = async ({
  res,
  title,
  summary,
  headers,
  rows,
  filename,
}) => {
  const doc = new PDFDocument({
    size: "A4",

    layout: "landscape",

    margins: {
      top: REPORT.PAGE_MARGIN,
      bottom: REPORT.PAGE_MARGIN,
      left: REPORT.PAGE_MARGIN,
      right: REPORT.PAGE_MARGIN,
    },

    bufferPages: true,
  });

  /*
   * Download response
   */
  res.setHeader("Content-Type", "application/pdf");

  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

  doc.pipe(res);

  /*
   * Header
   */
  drawHeader(doc, title);

  /*
   * Summary
   */
  drawSummary(doc, summary);

  doc.moveDown(2);

  /*
   * Table
   */
  await drawTable(doc, headers, rows);

  /*
   * Footer for every page
   */
  const range = doc.bufferedPageRange();

  for (let i = range.start; i < range.start + range.count; i++) {
    doc.switchToPage(i);

    addFooter(doc, i + 1, range.count);
  }

  doc.end();
};
