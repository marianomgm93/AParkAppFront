import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { AcquireOfferRequest, OfferModel, VehicleOption } from './offer';

@Service()
export class OfferService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:8080/offer';
  private readonly reservationUrl = 'http://localhost:8080/reservation';
  getActiveOffers() {
    return this.http.get<OfferModel[]>(this.baseUrl);
  }
  acquireOffer(offerId: string, request: AcquireOfferRequest) {
    return this.http.post(`${this.reservationUrl}/acquire-offer/${offerId}`, request);
  }
  getUserVehicles(userId: string) {
    return this.http.get<VehicleOption[]>(`http://localhost:8080/vehicles/user/${userId}`);
  }
}
