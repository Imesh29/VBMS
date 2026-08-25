export type VehicleStatus = "AVAILABLE" | "IN_USE" | "MAINTENANCE";

/**
 * Row shape returned by the backend (GET /api/vehicles, /api/vehicles/:id, etc).
 */
export interface Vehicle {
  id: string;
  vehicle_number: string;
  vehicle_name: string;
  vehicle_type: string;
  capacity: number;
  fuel_type: string;
  driver_name: string;
  last_service_date: string;
  status: VehicleStatus;
  created_at?: string;
  updated_at?: string;
}

export interface VehiclePagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface VehicleListResponse {
  items: Vehicle[];
  pagination: VehiclePagination;
}

export interface VehicleStats {
  total: number;
  available: number;
  inUse: number;
  maintenance: number;
}

/**
 * Payload shape expected by POST /api/vehicles and PUT /api/vehicles/:id.
 */
export interface VehiclePayload {
  vehicleNumber: string;
  vehicleName: string;
  vehicleType: string;
  capacity: number;
  fuelType: string;
  driverName: string;
  lastServiceDate: string;
  status?: VehicleStatus;
}
