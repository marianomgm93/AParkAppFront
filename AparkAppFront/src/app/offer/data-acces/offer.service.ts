import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { AcquireOfferRequest, CreateOfferRequest, OfferModel, ParkingSpotModel, VehicleOption } from './offer';

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
    createOffer(request: CreateOfferRequest) {
    return this.http.post<OfferModel>(this.baseUrl, request);
  }
    getAvailableSpots(parkingLotId: string, startTime: string, endTime: string) {
    const start = startTime.length === 16 ? `${startTime}:00` : startTime;
    const end = endTime.length === 16 ? `${endTime}:00` : endTime;
    return this.http.get<ParkingSpotModel[]>('http://localhost:8080/parkingspots/available', {
      params: { parkingLotId, startTime: start, endTime: end },
    });
  }
    deleteOffer(id: string) {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
