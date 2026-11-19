export interface ReservationModel {
  id: string;
  startTime: string;
  endTime: string;
  parkingLotId: string;
  parkingSpotId: string;
  vehicleId: string;
  vehiclePlate?: string;
  offerId?: string;
  userId: string;
  userName?: string;
  stayType: string;
  status: 'RESERVED' | 'CHECKED_IN' | 'COMPLETED' | 'CANCELLED';
}