export type SpotStatus = 'FREE' | 'OCCUPIED';

export const SPOT_STATUSES: SpotStatus[] = ['FREE', 'OCCUPIED'];


export interface Spot {
  id: string;              // UUID
  parkingLotId: string;    // UUID de la cochera asociada
  name: string;
  active: boolean;
  status: SpotStatus;
  number: number;
}


export interface SpotFormModel {
  name: string;
  parkingLotId: string;    // UUID de la cochera asociada
  active: boolean;
  number: number;
}