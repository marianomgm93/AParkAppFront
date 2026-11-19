import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Spot, SpotFormModel } from './spot-model';

@Injectable({
  providedIn: 'root'
})
export class SpotService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:8080/parkingspots';

  getAllSpots() {
    return this.http.get<Spot[]>(this.apiUrl);
  }

  getSpotById(id: string) {
    return this.http.get<Spot>(`${this.apiUrl}/${id}`);
  }

  addSpot(data: SpotFormModel) {
    return this.http.post<Spot>(this.apiUrl, data);
  }

  updateSpot(id: string, data: SpotFormModel) {
    return this.http.put<Spot>(`${this.apiUrl}/${id}`, data);
  }

  deleteSpot(id: string) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  restoreSpot(id: string) {
    return this.http.patch<void>(`${this.apiUrl}/${id}/restore`, {});
  }

  occupySpot(id: string) {
    return this.http.patch<void>(`${this.apiUrl}/${id}/occupy`, {});
  }

  releaseSpot(id: string) {
    return this.http.patch<void>(`${this.apiUrl}/${id}/release`, {});
  }

  getAvailableSpots(parkingLotId: string, startTime: string, endTime: string) {
    const params = new HttpParams()
      .set('parkingLotId', parkingLotId)
      .set('startTime', startTime)
      .set('endTime', endTime);

    return this.http.get<Spot[]>(`${this.apiUrl}/available`, { params });
  }
}