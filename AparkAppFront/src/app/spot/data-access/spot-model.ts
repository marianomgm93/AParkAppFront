export type SpotStatus = 'FREE' | 'OCCUPIED' ;

export interface Spot {
  id: number;
  spotNumber: number;
  status: SpotStatus;
}

export type SpotFormModel= Omit <Spot,'id'>

export const SPOT_STATUSES = ['FREE', 'OCCUPIED'];