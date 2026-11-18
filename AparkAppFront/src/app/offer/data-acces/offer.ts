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