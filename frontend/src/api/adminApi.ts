import api from "./axios";

/**
 * Get all approved bookings (Admin only).
 * GET /api/admin/bookings
 */
export const getApprovedBookings = async () => {
  const response = await api.get("/admin/bookings");

  return response.data.data;
};

/**
 * Get all vehicles (Admin only).
 * GET /api/admin/vehicles
 */
export const getAllVehicles = async () => {
  const response = await api.get("/admin/vehicles");

  return response.data.data;
};

/**
 * Confirm a booking (Admin only).
 * PATCH /api/admin/bookings/:id/confirm
 */
export const confirmBooking = async (id: string) => {
  const response = await api.patch(`/admin/bookings/${id}/confirm`);

  return response.data.data;
};

/**
 * Complete a booking (Admin only).
 * PATCH /api/admin/bookings/:id/complete
 */
export const completeBooking = async (id: string) => {
  const response = await api.patch(`/admin/bookings/${id}/complete`);

  return response.data.data;
};

/**
 * Cancel a booking (Admin only).
 * PATCH /api/admin/bookings/:id/cancel
 */
export const cancelBooking = async (id: string) => {
  const response = await api.patch(`/admin/bookings/${id}/cancel`);

  return response.data.data;
};
