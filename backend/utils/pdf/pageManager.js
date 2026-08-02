import { REPORT } from "./constants.js";
import { drawHorizontalLine } from "./helpers.js";

export const PAGE_BOTTOM = 520;

/**
 * Add footer
 */
export const addFooter = (doc, pageNumber) => {
  const y = doc.page.height - 40;

  drawHorizontalLine(doc, y - 10);

  doc.fontSize(9).fillColor("#777777").text(REPORT.COMPANY_NAME, 40, y);

  doc.text(`Page ${pageNumber}`, 0, y, {
    align: "right",
  });
};

/**
 * Check page break
 */
export const checkPageBreak = (doc, currentY, callback) => {
  if (currentY >= PAGE_BOTTOM) {
    doc.addPage();

    callback();

    return 80;
  }

  return currentY;
};
