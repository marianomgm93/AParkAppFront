export type SpotStatus = 'FREE' | 'OCCUPIED';

export interface ParkingSpotModel {
  id: string;
  name: string;
  active: boolean;
  status: SpotStatus;
  number: number;
  parkingLotId?: string;
  parkingLotName?: string;
}

export interface ParkingSpotRequest {
  name: string;
  parkingLotId: string;
  active: boolean;
  number: number;
}