import * as reportService from "../services/reportService.js";
import * as reportRepository from "../repositories/reportRepository.js";
import { generatePdfReport } from "../utils/pdf/pdfGenerator.js";
import { successResponse } from "../utils/response.js";

const bookingFilters = (req) => ({
  from: req.query.from,
  to: req.query.to,
  status: req.query.status,
});

const vehicleFilters = (req) => ({ status: req.query.status });

// ------------------------------ JSON previews ------------------------------
export const getBookingReportPreview = async (req, res, next) => {
  try {
    const data = await reportRepository.getBookingReportData(bookingFilters(req));
    return successResponse(res, 200, "Booking report preview retrieved successfully.", data);
  } catch (error) {
    next(error);
  }
};

export const getVehicleReportPreview = async (req, res, next) => {
  try {
    const data = await reportRepository.getVehicleReportData(vehicleFilters(req));
    return successResponse(res, 200, "Fleet report preview retrieved successfully.", data);
  } catch (error) {
    next(error);
  }
};

export const getMonthlyActivityPreview = async (_req, res, next) => {
  try {
    const data = await reportRepository.getMonthlyActivityReportData();
    return successResponse(res, 200, "Monthly activity report preview retrieved successfully.", data);
  } catch (error) {
    next(error);
  }
};

export const getUserActivityPreview = async (_req, res, next) => {
  try {
    const data = await reportRepository.getUserActivityReportData();
    return successResponse(res, 200, "User activity report preview retrieved successfully.", data);
  } catch (error) {
    next(error);
  }
};

// ------------------------------- PDF reports -------------------------------
const sendPdf = async (res, report) => {
  await generatePdfReport({
    res,
    title: report.title,
    description: report.description,
    filename: report.filename,
    summary: report.summary,
    insights: report.insights,
    headers: report.headers,
    rows: report.rows,
    tableTitle: report.tableTitle,
  });
};

export const generateBookingReport = async (req, res, next) => {
  try {
    await sendPdf(res, await reportService.getBookingReport(bookingFilters(req)));
  } catch (error) {
    next(error);
  }
};

export const generateVehicleReport = async (req, res, next) => {
  try {
    await sendPdf(res, await reportService.getVehicleReport(vehicleFilters(req)));
  } catch (error) {
    next(error);
  }
};

export const generateMonthlyActivityReport = async (_req, res, next) => {
  try {
    await sendPdf(res, await reportService.getMonthlyActivityReport());
  } catch (error) {
    next(error);
  }
};

export const generateUserActivityReport = async (_req, res, next) => {
  try {
    await sendPdf(res, await reportService.getUserActivityReport());
  } catch (error) {
    next(error);
  }
};

export const generateDashboardReport = async (_req, res, next) => {
  try {
    await sendPdf(res, await reportService.getDashboardReport());
  } catch (error) {
    next(error);
  }
};
