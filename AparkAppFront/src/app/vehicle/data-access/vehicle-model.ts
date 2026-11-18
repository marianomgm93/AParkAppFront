export type VehicleTypeEnum = 'Car' | 'MotorCycle' | 'Truck' | 'SUV' | 'Custom';

export interface VehicleDTO {
  id: string; // UUID generado por el backend
  plate: string;
  brand: string;
  model: string;
  color: string;
  note?: string;
  userId: string; // UUID del propietario
  vehicleType: VehicleTypeEnum;
}

export interface NewVehicleDTO {
  plate: string;
  userId: string; // UUID
  brand: string;
  model: string;
  color: string;
  note?: string;
  vehicleType: VehicleTypeEnum;
}