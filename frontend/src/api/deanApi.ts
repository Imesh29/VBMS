import api from "./axios";

import type { Booking } from "../types/booking";

/**
 * Get pending bookings.
 */
export const getPendingBookings = async (): Promise<Booking[]> => {
  const response = await api.get("/dean/bookings");

  return response.data.data;
};

/**
 * Approve booking.
 */
export const approveBooking = async (id: string): Promise<Booking> => {
  const response = await api.patch(`/dean/bookings/${id}/approve`);

  return response.data.data;
};
