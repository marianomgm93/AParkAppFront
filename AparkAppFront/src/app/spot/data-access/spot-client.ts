import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { ParkingSpotModel, ParkingSpotRequest } from '../data-access/spot-model';
@Service()
export class ParkingSpotService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:8080/parkingspots';

  getAllParkingSpots() {
    return this.http.get<ParkingSpotModel[]>(this.baseUrl);
  }

  getParkingSpotById(id: string) {
    return this.http.get<ParkingSpotModel>(`${this.baseUrl}/${id}`);
  }

  createParkingSpot(request: ParkingSpotRequest) {
    return this.http.post<ParkingSpotModel>(this.baseUrl, request);
  }

  updateParkingSpot(id: string, request: ParkingSpotRequest) {
    return this.http.put<ParkingSpotModel>(`${this.baseUrl}/${id}`, request);
  }

  deleteParkingSpot(id: string) {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  restoreParkingSpot(id: string) {
    return this.http.patch<void>(`${this.baseUrl}/${id}/restore`, {});
  }

  occupyParkingSpot(id: string) {
    return this.http.patch<void>(`${this.baseUrl}/${id}/occupy`, {});
  }

  releaseParkingSpot(id: string) {
    return this.http.patch<void>(`${this.baseUrl}/${id}/release`, {});
  }
  
  getAvailableSpots(parkingLotId: string, startTime: string, endTime: string) {
    return this.http.get<ParkingSpotModel[]>(`${this.baseUrl}/available`, {
      params: { parkingLotId, startTime, endTime },
    });
  }
}