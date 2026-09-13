import { REPORT } from "./constants.js";

export const drawSummary = (doc, summary, startY) => {
  const entries = Object.entries(summary || {});
  if (!entries.length) return startY;

  const margin = REPORT.PAGE_MARGIN;
  const gap = 8;
  const usableWidth = doc.page.width - margin * 2;
  const count = entries.length;
  const cardWidth = (usableWidth - gap * (count - 1)) / count;
  const cardHeight = 49;

  entries.forEach(([label, value], index) => {
    const x = margin + index * (cardWidth + gap);

    doc
      .roundedRect(x, startY, cardWidth, cardHeight, 6)
      .fillAndStroke(REPORT.SURFACE, REPORT.BORDER_COLOR);

    doc
      .fillColor(REPORT.TEXT_MUTED)
      .font("Helvetica")
      .fontSize(7.8)
      .text(String(label).toUpperCase(), x + 9, startY + 9, {
        width: cardWidth - 18,
        lineBreak: false,
      });

    doc
      .fillColor(REPORT.PRIMARY_COLOR)
      .font("Helvetica-Bold")
      .fontSize(15)
      .text(String(value ?? 0), x + 9, startY + 25, {
        width: cardWidth - 18,
        lineBreak: false,
      });
  });

  return startY + cardHeight + 12;
};
