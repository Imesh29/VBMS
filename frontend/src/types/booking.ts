export type BookingStatus =
  | "PENDING"
  | "APPROVED"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELLED";

export interface Booking {
  id: string;

  booking_reference: string;

  purpose: string;

  destination: string;

  departure_date: string;

  return_date: string;

  passenger_count: number;

  remarks?: string | null;

  cancellation_reason?: string | null;

  status: BookingStatus;

  created_at: string;

  updated_at?: string;

  user_id?: string;

  full_name?: string;

  email?: string;

  department?: string | null;

  vehicle_id?: string;

  vehicle_number: string;

  vehicle_name: string;

  vehicle_type: string;

  capacity?: number;

  fuel_type?: string;

  driver_name?: string | null;

  vehicle_status?: string;
}

export interface BookingPagination {
  page: number;

  limit: number;

  totalItems: number;

  totalPages: number;
}

export interface BookingListResponse {
  items: Booking[];

  pagination: BookingPagination;
}

export interface CreateBookingPayload {
  vehicleId: string;

  purpose: string;

  destination: string;

  departureDate: string;

  returnDate: string;

  passengerCount: number;

  remarks?: string;
}
