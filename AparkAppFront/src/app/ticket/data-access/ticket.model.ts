export interface Ticket {
  id: string;
  reservationId: string;
  amount: number;
  paid: number;
  timeStamp: string;
  note: string | null;
}

export interface PaidRequest {
  id: string;
  pay: number;
}
