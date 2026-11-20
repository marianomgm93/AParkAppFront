export type VehicleTypeEnum = 'Car' | 'MotorCycle' | 'Truck' | 'SUV' | 'Custom';

export interface VehicleModel {
  id: string;
  plate: string;
  model: string;
  color: string;
  note?: string;
  brand: string;
  userId: string;
  vehicleType: VehicleTypeEnum;
}

export interface NewVehicleRequest {
  plate: string;
  userId: string;
  model: string;
  color: string;
  note?: string;
  brand: string;
  vehicleType: VehicleTypeEnum;
}

export const VEHICLE_TYPES: VehicleTypeEnum[] = ['Car', 'MotorCycle', 'Truck', 'SUV', 'Custom'];