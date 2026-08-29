export type BookingStatus =
  | "Pending"
  | "Approved"
  | "Confirmed"
  | "Completed"
  | "Cancelled";

export interface Booking {
  id: string;
  requestDate: string;
  vehicle: string;
  vehicleNumber: string;
  destination: string;
  purpose: string;
  departureDate: string;
  departureTime: string;
  pax: number;
  status: BookingStatus;
}

export const bookings: Booking[] = [
  {
    id: "BK-2024-001",
    requestDate: "2024-06-01",
    vehicle: "Toyota HiAce",
    vehicleNumber: "WB-1234",
    destination: "KLCC Conference Centre",
    purpose: "Annual ICT Conference",
    departureDate: "2024-06-10",
    departureTime: "08:00",
    pax: 10,
    status: "Completed",
  },
  {
    id: "BK-2024-002",
    requestDate: "2024-06-05",
    vehicle: "Toyota Camry",
    vehicleNumber: "WB-5678",
    destination: "Colombo",
    purpose: "Official Meeting",
    departureDate: "2024-06-15",
    departureTime: "09:00",
    pax: 4,
    status: "Approved",
  },
  {
    id: "BK-2024-003",
    requestDate: "2024-06-08",
    vehicle: "Toyota Fortuner",
    vehicleNumber: "WB-9012",
    destination: "Galle",
    purpose: "University Event",
    departureDate: "2024-06-20",
    departureTime: "07:30",
    pax: 6,
    status: "Pending",
  },
  {
    id: "BK-2024-004",
    requestDate: "2024-06-10",
    vehicle: "Nissan Urvan",
    vehicleNumber: "WB-3456",
    destination: "Matara",
    purpose: "Student Field Visit",
    departureDate: "2024-06-25",
    departureTime: "06:30",
    pax: 12,
    status: "Confirmed",
  },
];