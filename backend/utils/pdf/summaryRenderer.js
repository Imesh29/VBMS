/**
 * Draw summary cards
 */
export const drawSummary = (doc, summary) => {
  let x = 40;
  let y = 145;

  const cardWidth = 105;
  const cardHeight = 60;

  Object.entries(summary).forEach(([title, value]) => {
    doc
      .roundedRect(x, y, cardWidth, cardHeight, 5)
      .fillAndStroke("#F7F9FC", "#D8DCE3");

    doc
      .fillColor("#666666")
      .fontSize(9)
      .text(title, x, y + 10, {
        width: cardWidth,
        align: "center",
      });

    doc
      .fillColor("#0F4C81")
      .fontSize(20)
      .text(value, x, y + 28, {
        width: cardWidth,
        align: "center",
      });

    x += cardWidth + 12;

    if (x > doc.page.width - cardWidth) {
      x = 40;
      y += 75;
    }
  });

  return y + 80;
};
