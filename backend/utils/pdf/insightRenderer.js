import { REPORT } from "./constants.js";

export const drawInsights = (doc, insights = [], startY) => {
  if (!insights.length) return startY;

  const margin = REPORT.PAGE_MARGIN;
  const width = doc.page.width - margin * 2;
  const height = 45;

  doc.roundedRect(margin, startY, width, height, 6).fill("#FFF8F3");

  doc
    .fillColor(REPORT.PRIMARY_COLOR)
    .font("Helvetica-Bold")
    .fontSize(8)
    .text("REPORT HIGHLIGHTS", margin + 11, startY + 8, { lineBreak: false });

  const text = insights.map((item) => `• ${item}`).join("    ");
  doc
    .fillColor(REPORT.TEXT_DARK)
    .font("Helvetica")
    .fontSize(8.3)
    .text(text, margin + 11, startY + 22, {
      width: width - 22,
      height: 18,
      ellipsis: true,
      lineBreak: false,
    });

  return startY + height + 12;
};
