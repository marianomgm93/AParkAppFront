// Modelo que refleja exactamente el ParkingLotResponse del back
export interface ParkingLotModel {
  id: string;
  name: string;
  ownerId: string;
  ownerUsername: string;
  addressId: string;
  capacity: number;
  active: boolean;
}

// Modelo que refleja exactamente el ParkingLotRequest del back
export interface ParkingLotRequest {
  name: string;
  addressId: string;
  capacity: number;
  ownerId: string;
}

