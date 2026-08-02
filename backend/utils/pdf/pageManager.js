import { REPORT } from "./constants.js";
import { drawHorizontalLine } from "./helpers.js";

export const PAGE_BOTTOM = 520;

/**
 * Add footer
 */
export const addFooter = (doc, currentPage, totalPages) => {
  const y = doc.page.height - 35;

  drawHorizontalLine(doc, y - 10);

  doc.fontSize(9).fillColor("#777777").text(REPORT.COMPANY_NAME, 40, y);

  doc.text(`Page ${currentPage} of ${totalPages}`, 0, y, {
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
