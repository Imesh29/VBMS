import { REPORT } from "./constants.js";

export const addFooter = (doc, currentPage, totalPages) => {
  const margin = REPORT.PAGE_MARGIN;
  const oldBottom = doc.page.margins.bottom;
  doc.page.margins.bottom = 0;

  const lineY = doc.page.height - 30;
  const textY = doc.page.height - 22;

  doc.save();
  doc
    .moveTo(margin, lineY)
    .lineTo(doc.page.width - margin, lineY)
    .strokeColor(REPORT.BORDER_COLOR)
    .lineWidth(0.6)
    .stroke();

  doc
    .fillColor(REPORT.TEXT_MUTED)
    .font("Helvetica")
    .fontSize(7.5)
    .text(`${REPORT.SHORT_NAME} • Confidential internal report`, margin, textY, {
      width: 260,
      lineBreak: false,
    });

  doc.text(`Page ${currentPage} of ${totalPages}`, doc.page.width - margin - 100, textY, {
    width: 100,
    align: "right",
    lineBreak: false,
  });
  doc.restore();

  doc.page.margins.bottom = oldBottom;
};
