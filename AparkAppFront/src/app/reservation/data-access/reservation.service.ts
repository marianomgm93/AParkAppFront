import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { ReservationModel } from './reservation.model';

@Service()
export class ReservationService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = 'http://localhost:8080/reservation';
  getAll() {
    return this.http.get<ReservationModel[]>(this.endpoint);
  }
  checkIn(id: string) {
    return this.http.patch<ReservationModel>(`${this.endpoint}/${id}/check-in`, {});
  }
  checkOut(id: string) {
    return this.http.patch<ReservationModel>(`${this.endpoint}/${id}/check-out`, {});
  }
    getMyReservations() {
    return this.http.get<ReservationModel[]>(`${this.endpoint}/me`);
  }
    cancel(id: string) {
    return this.http.patch<ReservationModel>(`${this.endpoint}/${id}/cancel`, {});
  }
    getById(id: string) {
    return this.http.get<ReservationModel>(`${this.endpoint}/${id}`);
  }
}
