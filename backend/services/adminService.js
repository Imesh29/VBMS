import * as adminRepository from "../repositories/adminRepository.js";
import * as bookingRepository from "../repositories/bookingRepository.js";
import * as notificationService from "./notificationService.js";
import createError from "../utils/createError.js";

export const getApprovedBookings = async () => {
  return await adminRepository.getApprovedBookings();
};

export const getAllBookings = async (filters = {}) => {
  return await bookingRepository.findAllBookings(filters);
};

export const confirmBooking = async (bookingId) => {
  const booking = await adminRepository.findBookingById(bookingId);

  if (!booking) {
    throw createError("Booking not found.", 404);
  }

  if (booking.status !== "APPROVED") {
    throw createError(
      `Only approved bookings can be confirmed. Current status: ${booking.status}.`,
      409,
    );
  }

  const confirmedBooking = await adminRepository.confirmBooking(bookingId);

  try {
    await notificationService.createForUser({
      userId: booking.user_id,
      bookingId: booking.id,
      type: "BOOKING_CONFIRMED",
      title: "Booking confirmed by Admin",
      message: `Your booking ${booking.booking_reference} has been confirmed by Admin.`,
    });
  } catch (notificationError) {
    console.error("Confirmation notification delivery failed:", notificationError);
  }

  return confirmedBooking;
};

export const completeBooking = async (bookingId) => {
  const booking = await adminRepository.findBookingById(bookingId);

  if (!booking) {
    throw createError("Booking not found.", 404);
  }

  if (booking.status !== "CONFIRMED") {
    throw createError(
      `Only confirmed bookings can be completed. Current status: ${booking.status}.`,
      409,
    );
  }

  const completedBooking = await adminRepository.completeBooking(bookingId);

  try {
    await notificationService.createForUser({
      userId: booking.user_id,
      bookingId: booking.id,
      type: "BOOKING_COMPLETED",
      title: "Booking completed",
      message: `Your booking ${booking.booking_reference} has been marked as completed.`,
    });
  } catch (notificationError) {
    console.error("Completion notification delivery failed:", notificationError);
  }

  return completedBooking;
};

export const cancelBooking = async (bookingId, reason) => {
  const booking = await adminRepository.findBookingById(bookingId);

  if (!booking) {
    throw createError("Booking not found.", 404);
  }

  if (!reason || !reason.trim()) {
    throw createError("Cancellation reason is required.", 400);
  }

  if (!["APPROVED", "CONFIRMED"].includes(booking.status)) {
    throw createError(
      `Only approved or confirmed bookings can be cancelled by Admin. Current status: ${booking.status}.`,
      409,
    );
  }

  const cleanReason = reason.trim();
  const cancelledBooking = await adminRepository.cancelBooking(
    bookingId,
    cleanReason,
  );

  try {
    await notificationService.createForUser({
      userId: booking.user_id,
      bookingId: booking.id,
      type: "BOOKING_CANCELLED",
      title: "Booking cancelled by Admin",
      message: `Your booking ${booking.booking_reference} was cancelled. Reason: ${cleanReason}`,
    });
  } catch (notificationError) {
    console.error("Cancellation notification delivery failed:", notificationError);
  }

  return cancelledBooking;
};
