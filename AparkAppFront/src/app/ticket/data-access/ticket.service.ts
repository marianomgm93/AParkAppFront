import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { PaidRequest, Ticket } from './ticket.model';

@Service()
export class TicketService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:8080/tickets';

  getAll() {
    return this.http.get<Ticket[]>(this.baseUrl);
  }

  getToday() {
    return this.http.get<Ticket[]>(`${this.baseUrl}/today`);
  }

  addPay(request: PaidRequest) {
    return this.http.post<Ticket>(`${this.baseUrl}/pay`, request);
  }

  cancel(id: string) {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
