export interface OfferModel {
  id: string;
  parkingLotId: string;
  parkingLotName?: string;
  parkingSpotId: string;
  stayType: 'Hour' | 'Day' | 'Month';
  startTime: string;
  endTime: string;
  active: boolean;
}
export interface AcquireOfferRequest {
  userId: string;
  vehicleId: string;
}
export interface VehicleOption {
  id: string;
  plate: string;
  model: string;
  brand: string;
}
export interface CreateOfferRequest {
  parkingLotId: string;
  parkingSpotId: string;
  stayType: 'Hour' | 'Day' | 'Week' | 'Month';
  startTime: string;
  endTime: string;
}
export interface ParkingSpotModel {
  id: string;
  name: string;
  active: boolean;
  status: string;
  number: number;
}