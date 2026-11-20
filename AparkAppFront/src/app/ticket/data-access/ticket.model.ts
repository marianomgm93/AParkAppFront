export type TicketStatus = 'OPEN' | 'PARTIALLY_PAID' | 'PAID' | 'CANCELLED';

export interface Ticket {
  id: string;
  reservationId: string;
  amount: number;
  paid: number;
  timeStamp: string;
  note: string | null;
  parkingLotName?: string;
  status?: TicketStatus;
}

export interface PaidRequest {
  id: string;
  pay: number;
}
