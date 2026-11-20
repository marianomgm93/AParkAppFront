export interface ParkingLotModel {
  id: string;
  name: string;
  ownerId: string;
  ownerUsername: string;
  addressId: string;
  street?: string;
  number?: number;
  zipCode?: string;
  notes?: string;
  capacity: number;
  active: boolean;
}

export interface ParkingLotRequest {
  name: string;
  addressId: string;
  capacity: number;
  ownerId: string;
}
