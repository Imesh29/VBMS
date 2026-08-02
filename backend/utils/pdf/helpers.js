import fs from "fs";
import path from "path";

/**
 * Format date
 */
export const formatDate = (date) => {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

/**
 * Format date and time
 */
export const formatDateTime = (date) => {
  if (!date) return "-";

  return new Date(date).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Draw horizontal line
 */
export const drawHorizontalLine = (doc, y) => {
  doc
    .moveTo(40, y)
    .lineTo(doc.page.width - 40, y)
    .stroke("#CCCCCC");
};

/**
 * Add vertical spacing
 */
export const addSpace = (doc, space = 10) => {
  doc.moveDown(space / 10);
};

/**
 * Resolve logo path
 */
export const getLogoPath = () => {
  return path.join(process.cwd(), "src", "assets", "logo.png");
};

/**
 * Check if logo exists
 */
export const logoExists = () => {
  return fs.existsSync(getLogoPath());
};
