import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Spot, SpotFormModel } from './spot-model';

@Injectable({
  providedIn: 'root'
})

export class SpotService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/spots';

  getAllspots(){
    return this.http.get<Spot[]>(this.apiUrl);
  }
  
  getSpotById(id:number){
    return this.http.get<Spot>(`${this.apiUrl}/${id}`);
  }
  addSpot(data: SpotFormModel) {
    return this.http.post<Spot>(this.apiUrl, data);
  }

  updateSpot(id: number, data: SpotFormModel) {
    return this.http.put<Spot>(`${this.apiUrl}/${id}`, data);
  }

  deleteSpot(id: number) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}