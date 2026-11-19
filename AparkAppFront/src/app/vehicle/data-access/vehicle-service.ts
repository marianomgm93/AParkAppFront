import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { VehicleModel, NewVehicleRequest } from './vehicle-model';

@Service()
export class VehicleService {

  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:8080/vehicles';

  getAllVehicles() {
    return this.http.get<VehicleModel[]>(this.baseUrl);
  }

  getVehicleById(id: string) {
    return this.http.get<VehicleModel>(`${this.baseUrl}/${id}`);
  }

  createVehicle(request: NewVehicleRequest) {
    return this.http.post<VehicleModel>(this.baseUrl, request);
  }

  updateVehicle(id: string, request: NewVehicleRequest) {
    return this.http.put<VehicleModel>(`${this.baseUrl}/${id}`, request);
  }

  deleteVehicle(id: string) {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
