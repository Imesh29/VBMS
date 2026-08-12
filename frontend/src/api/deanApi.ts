import api from "./axios";

/**
 * Get all pending bookings (Dean only).
 * GET /api/dean/bookings
 */
export const getPendingBookings = async () => {
  const response = await api.get("/dean/bookings");

  return response.data.data;
};

/**
 * Approve a booking (Dean only).
 * PATCH /api/dean/bookings/:id/approve
 */
export const approveBooking = async (id: string) => {
  const response = await api.patch(`/dean/bookings/${id}/approve`);

  return response.data.data;
};
