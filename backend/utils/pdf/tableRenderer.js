import { REPORT } from "./constants.js";
import { formatDate, formatDateTime } from "./helpers.js";

const prettify = (value) => String(value ?? "-").replaceAll("_", " ");

const formatCellValue = (row, header) => {
  const value = row?.[header.property];
  if (value === null || value === undefined || value === "") return "-";

  if (["departure_date", "return_date"].includes(header.property)) {
    return formatDateTime(value);
  }

  if (["last_service_date", "created_at"].includes(header.property)) {
    return formatDate(value);
  }

  if (header.property === "is_active") return value ? "Active" : "Inactive";
  if (header.property === "completion_rate") return `${value}%`;
  if (header.property === "capacity") return `${value} pax`;

  if (["status", "role"].includes(header.property)) return prettify(value);

  return String(value);
};

const getStatusColor = (value) => {
  const text = String(value || "").toUpperCase();
  if (["COMPLETED", "AVAILABLE", "ACTIVE"].includes(text)) return REPORT.ACCENT_GREEN;
  if (["CANCELLED", "MAINTENANCE", "INACTIVE"].includes(text)) return "#DC2626";
  if (["PENDING"].includes(text)) return REPORT.ACCENT_ORANGE;
  if (["APPROVED", "CONFIRMED", "IN USE", "IN_USE"].includes(text)) return REPORT.ACCENT_BLUE;
  return REPORT.TEXT_DARK;
};

const effectiveWidths = (doc, headers) => {
  const available = doc.page.width - REPORT.PAGE_MARGIN * 2;
  const total = headers.reduce((sum, header) => sum + Number(header.width || 80), 0);
  return headers.map((header) => (Number(header.width || 80) / total) * available);
};

const drawHeaderRow = (doc, headers, widths, y) => {
  const margin = REPORT.PAGE_MARGIN;
  const height = 24;
  let x = margin;

  doc.rect(margin, y, doc.page.width - margin * 2, height).fill(REPORT.PRIMARY_COLOR);

  headers.forEach((header, index) => {
    const width = widths[index];
    doc
      .fillColor("#FFFFFF")
      .font("Helvetica-Bold")
      .fontSize(7.2)
      .text(String(header.label).toUpperCase(), x + 5, y + 8, {
        width: width - 10,
        height: 10,
        ellipsis: true,
        lineBreak: false,
      });
    x += width;
  });

  return y + height;
};

const getRowHeight = (doc, headers, widths, row) => {
  let height = 22;
  headers.forEach((header, index) => {
    const text = formatCellValue(row, header);
    doc.font("Helvetica").fontSize(7.4);
    const measured = doc.heightOfString(text, {
      width: Math.max(20, widths[index] - 10),
      lineGap: 1,
    });
    height = Math.max(height, Math.min(34, measured + 10));
  });
  return height;
};

const drawDataRow = (doc, headers, widths, row, y, rowIndex) => {
  const margin = REPORT.PAGE_MARGIN;
  const rowHeight = getRowHeight(doc, headers, widths, row);
  let x = margin;

  if (rowIndex % 2 === 1) {
    doc.rect(margin, y, doc.page.width - margin * 2, rowHeight).fill("#FAFAFB");
  }

  doc
    .moveTo(margin, y + rowHeight)
    .lineTo(doc.page.width - margin, y + rowHeight)
    .strokeColor(REPORT.BORDER_COLOR)
    .lineWidth(0.35)
    .stroke();

  headers.forEach((header, index) => {
    const width = widths[index];
    const text = formatCellValue(row, header);
    const isStatus = ["status", "is_active"].includes(header.property);
    const isStrong = ["booking_reference", "vehicle_name", "full_name", "month_label"].includes(
      header.property,
    );

    doc
      .fillColor(isStatus ? getStatusColor(text) : REPORT.TEXT_DARK)
      .font(isStrong || isStatus ? "Helvetica-Bold" : "Helvetica")
      .fontSize(7.4)
      .text(text, x + 5, y + 7, {
        width: width - 10,
        height: rowHeight - 10,
        ellipsis: true,
        lineGap: 1,
      });

    x += width;
  });

  return y + rowHeight;
};

export const drawTable = ({ doc, headers, rows, startY, title, onNewPage }) => {
  const widths = effectiveWidths(doc, headers);
  const margin = REPORT.PAGE_MARGIN;
  const bottomLimit = doc.page.height - 45;
  let y = startY;

  doc
    .fillColor(REPORT.TEXT_DARK)
    .font("Helvetica-Bold")
    .fontSize(11)
    .text(title || "Detailed Records", margin, y, { lineBreak: false });

  doc
    .fillColor(REPORT.TEXT_MUTED)
    .font("Helvetica")
    .fontSize(8)
    .text(`${rows.length} record${rows.length === 1 ? "" : "s"}`, doc.page.width - margin - 100, y + 1, {
      width: 100,
      align: "right",
      lineBreak: false,
    });

  y += 19;
  y = drawHeaderRow(doc, headers, widths, y);

  if (!rows.length) {
    doc
      .fillColor(REPORT.TEXT_MUTED)
      .font("Helvetica-Oblique")
      .fontSize(9)
      .text("No records are available for the selected report criteria.", margin + 8, y + 14, {
        width: doc.page.width - margin * 2 - 16,
      });
    return;
  }

  rows.forEach((row, index) => {
    const rowHeight = getRowHeight(doc, headers, widths, row);

    if (y + rowHeight > bottomLimit) {
      doc.addPage();
      y = onNewPage ? onNewPage(doc) : 60;
      y = drawHeaderRow(doc, headers, widths, y);
    }

    y = drawDataRow(doc, headers, widths, row, y, index);
  });
};
