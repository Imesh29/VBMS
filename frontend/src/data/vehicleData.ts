export interface Vehicle {
  id: number;
  name: string;
  type: string;
  seats: number;
  registration: string;
  fuel: string;
  driver: string;
}

export const vehicles: Vehicle[] = [
  {
    id: 1,
    name: "Toyota HiAce",
    type: "Minibus",
    seats: 12,
    registration: "WB-1234",
    fuel: "Diesel",
    driver: "Ahmad",
  },
  {
    id: 2,
    name: "Nissan Urvan",
    type: "Van",
    seats: 14,
    registration: "WB-9012",
    fuel: "Diesel",
    driver: "Karim",
  },
  {
    id: 3,
    name: "Toyota Alphard",
    type: "MPV",
    seats: 7,
    registration: "WB-7890",
    fuel: "Petrol",
    driver: "Zulkifli",
  },
  {
    id: 4,
    name: "Toyota Camry",
    type: "Sedan",
    seats: 4,
    registration: "WB-6789",
    fuel: "Hybrid",
    driver: "Norzali",
  },
];