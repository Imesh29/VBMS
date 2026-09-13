import api from "./axios";

import type { Booking, BookingListResponse } from "../types/booking";

import type { GetBookingsParams } from "./bookingApi";

/**
 * Existing approved-only endpoint.
 */
export const getApprovedBookings = async (): Promise<Booking[]> => {
  const response = await api.get("/admin/bookings");

  return response.data.data;
};

/**
 * Get ALL bookings.
 *
 * GET /api/admin/bookings/all
 */
export const getAllBookings = async (
  params: GetBookingsParams = {},
): Promise<BookingListResponse> => {
  const response = await api.get("/admin/bookings/all", {
    params,
  });

  return response.data.data;
};

/**
 * Confirm booking.
 */
export const confirmBooking = async (id: string): Promise<Booking> => {
  const response = await api.patch(`/admin/bookings/${id}/confirm`);

  return response.data.data;
};

/**
 * Complete booking.
 */
export const completeBooking = async (id: string): Promise<Booking> => {
  const response = await api.patch(`/admin/bookings/${id}/complete`);

  return response.data.data;
};

/**
 * Cancel booking.
 */
export const cancelBooking = async (
  id: string,
  reason: string,
): Promise<Booking> => {
  const response = await api.patch(`/admin/bookings/${id}/cancel`, { reason });

  return response.data.data;
};
