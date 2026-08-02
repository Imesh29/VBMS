import * as reportService from "../services/reportService.js";

import { generatePdfReport } from "../utils/pdf/pdfGenerator.js";

/**
 * Generate Booking Report PDF
 * GET /api/reports/bookings/pdf
 */
export const generateBookingReport = async (req, res, next) => {
  try {
    const filters = {
      from: req.query.from,

      to: req.query.to,

      status: req.query.status,
    };

    const report = await reportService.getBookingReport(filters);

    await generatePdfReport({
      res,

      title: report.title,

      filename: report.filename,

      summary: report.summary,

      headers: report.headers,

      rows: report.rows,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Generate Vehicle Report PDF
 * GET /api/reports/vehicles/pdf
 */
export const generateVehicleReport = async (req, res, next) => {
  try {
    const filters = {
      status: req.query.status,
    };

    const report = await reportService.getVehicleReport(filters);

    await generatePdfReport({
      res,

      title: report.title,

      filename: report.filename,

      summary: report.summary,

      headers: report.headers,

      rows: report.rows,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Generate Dashboard Report PDF
 * GET /api/reports/dashboard/pdf
 */
export const generateDashboardReport = async (req, res, next) => {
  try {
    const report = await reportService.getDashboardReport();

    await generatePdfReport({
      res,

      title: report.title,

      filename: report.filename,

      summary: report.summary,

      headers: report.headers,

      rows: report.rows,
    });
  } catch (error) {
    next(error);
  }
};
